"use client";
import {
  CirclePlus,
  CircleMinus,
  CopyPlus,
  Trash2,
  Loader2Icon,
  LoaderIcon,
} from "lucide-react";
import {
  updateRecipe,
  getRecipeById,
  uploadImg,
  updateIngredientGroup,
  updateStepGroup,
} from "@/api/recipe";
import { useRouter, useParams, redirect } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, use } from "react";

const UpdateRecipe = () => {
  const router = useRouter();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [imgFile, setImgFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    prepTime: "",
    cookTime: "",
    servings: "",
    yield: "",
    calories: "",
    carbs: "",
    sugars: "",
    fat: "",
    imageUrl: "",
    ingredientGroups: [
      {
        id: null,
        label: "",
        ingredients: [
          {
            label: "",
            id: null,
          },
        ],
      },
    ],
    stepGroups: [
      {
        id: null,
        label: "",
        steps: [
          {
            label: "",
            id: null,
          },
        ],
      },
    ],
  });

  const { user, loading, fetchSession } = useAuth();

  useEffect(() => {
    fetchSession();
  }, []);

  useEffect(() => {
    if (user && id && !hasFetched) {
      fetchRecipe();
      setHasFetched(true);
    }
  }, [user, id]);

  const fetchRecipe = async () => {
    try {
      const recipe = await getRecipeById(id);

      if (recipe?.createdBy !== user?.email) {
        toast.error("You are not authorized to update this recipe");
        setTimeout(() => router.replace(`/recipe/${id}`), 1500);
        return;
      }

      setFormData({
        ...recipe,
        carbs: recipe.carbsG,
        sugars: recipe.sugarsG,
        fat: recipe.fatG,
        ingredientGroups: recipe.ingredientGroups
          .sort((a, b) => a.ingredientGroupOrder - b.ingredientGroupOrder)
          .map((group) => ({
            ...group,
            ingredients: group.ingredients
              .sort((a, b) => a.ingredientOrder - b.ingredientOrder)
              .map((ingredient) => ({
                id: ingredient.id,
                label: ingredient.label,
              })),
          })),
        stepGroups: recipe.stepGroups
          .sort((a, b) => a.stepGroupOrder - b.stepGroupOrder)
          .map((group) => ({
            ...group,
            steps: group.steps
              .sort((a, b) => a.stepOrder - b.stepOrder)
              .map((step) => ({
                id: step.id,
                label: step.label,
              })),
          })),
      });
    } catch (error) {
      toast.error("Error fetching recipe");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleFileChange = (e) => {
    console.log(e.target.files[0]);
    setImgFile(() => e.target.files[0]);
  };

  const handleGroupChange = (e, groupIndex, field, subIndex = null) => {
    const value = e.target.value;

    if (field === "ingredientGroups") {
      if (subIndex !== null) {
        const updatedGroups = [...formData[field]];
        updatedGroups[groupIndex].ingredients[subIndex].label = value;
        setFormData((prev) => ({
          ...prev,
          [field]: updatedGroups,
        }));
      } else {
        const updatedGroups = [...formData[field]];
        updatedGroups[groupIndex].label = value;
        setFormData((prev) => ({
          ...prev,
          [field]: updatedGroups,
        }));
      }
    } else {
      if (subIndex !== null) {
        const updatedGroups = [...formData[field]];
        updatedGroups[groupIndex].steps[subIndex].label = value;
        setFormData((prev) => ({
          ...prev,
          [field]: updatedGroups,
        }));
      } else {
        const updatedGroups = [...formData[field]];
        updatedGroups[groupIndex].label = value;
        setFormData((prev) => ({
          ...prev,
          [field]: updatedGroups,
        }));
      }
    }
  };

  // Similar handlers for removing groups and items...

  const handleSubmit = async (e) => {
    setIsUpdating(true);
    e.preventDefault();

    const updatedFormData = {
      ...formData,
      carbsG: formData.carbs,
      sugarsG: formData.sugars,
      fatG: formData.fat,
      prepTimeUnitCd: 100,
      cookTimeUnitCd: 100,
      categoryIds: [1],
      ingredientGroups: formData.ingredientGroups.map((group) => ({
        ...group,
        ingredients: group.ingredients.map((ingredient, index) => ({
          label: ingredient.label,
          id: ingredient.id,
          ingredientOrder: index + 1,
        })),
      })),
      stepGroups: formData.stepGroups.map((group) => ({
        ...group,
        steps: group.steps.map((step, index) => ({
          label: step.label,
          id: step.id,
          stepOrder: index + 1,
        })),
      })),
    };

    console.log(updatedFormData);
    try {
      if (imgFile) {
        const imgRes = await uploadImg({ file: imgFile });
        console.log(imgRes);
        if (imgRes.status === 200) {
          updatedFormData.imageUrl = imgRes.data;
          updatedFormData.thumbnailUrl = imgRes.data;
        }
      }

      const res = await updateRecipe(id, updatedFormData);
      if (res.status === 200) {
        toast.success("Recipe updated successfully!");
        setTimeout(() => router.replace(`/recipe/${id}`), 750);
      }
    } catch (error) {
      toast.error("Error updating recipe");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading || isLoading) {
    return <Loader2Icon className="animate-spin m-auto" />;
  }

  if (!loading && !user) {
    router.replace("/");
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg max-w-[800px] mx-auto z-0"
      >
        <h2 className="text-2xl font-bold text-gray-800 my-6 text-center">
          Update Recipe
        </h2>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="title"
          >
            Recipe Title
          </label>
          <input
            type="text"
            id="title"
            className="w-full p-2 border rounded-lg"
            placeholder="Enter recipe title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="summary"
          >
            Summary
          </label>
          <textarea
            id="summary"
            className="w-full p-2 border rounded-lg"
            placeholder="Brief description of the recipe"
            rows="3"
            value={formData.summary}
            onChange={handleChange}
            required
          />
        </div>
        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Recipe Image
          </label>
          <input
            type="file"
            accept="image/*"
            className="w-full p-2 border rounded-lg"
            onChange={handleFileChange}
          />
        </div>
        {/* Times and Servings */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {["prepTime", "cookTime", "servings", "yield"].map((field, idx) => (
            <div key={idx}>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {field === "prepTime"
                  ? "Prep Time (mins)"
                  : field === "cookTime"
                  ? "Cook Time (mins)"
                  : field === "servings"
                  ? "Servings"
                  : "Yield"}
              </label>
              <input
                type={field === "yield" ? "text" : "number"}
                id={field}
                className="w-full p-2 border rounded-lg"
                placeholder={field === "yield" ? "4 portions" : ""}
                value={formData[field]}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>
        {/* Nutrition Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {["calories", "carbs", "sugars", "fat"].map((field, idx) => (
            <div key={idx}>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {field.charAt(0).toUpperCase() + field.slice(1)}{" "}
                {field === "calories" ? "" : "(g)"}
              </label>
              <input
                type="number"
                id={field}
                className="w-full p-2 border rounded-lg"
                placeholder={field === "calories" ? "650" : ""}
                value={formData[field]}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>
        {/* Ingredient Groups */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Ingredient Groups</h3>
          {formData.ingredientGroups
            .sort((a, b) => a.ingredientGroupOrder - b.ingredientGroupOrder)
            .map((group, groupIndex) => (
              <div key={groupIndex} className="mb-4 p-4 border rounded">
                <input
                  type="text"
                  name="label"
                  className="w-full p-2 mb-2 border font-semibold rounded-lg"
                  placeholder={`Group ${groupIndex + 1} Label`}
                  value={group.label}
                  onChange={(e) =>
                    handleGroupChange(e, groupIndex, "ingredientGroups")
                  }
                  required
                />
                {group.ingredients
                  .sort((a, b) => a.ingredientOrder - b.ingredientOrder)
                  .map((ingredient, subIndex) => (
                    <div key={subIndex} className="flex items-center mb-2 mr-8">
                      <input
                        type="text"
                        className="w-full p-2 border rounded-lg"
                        placeholder={`Ingredient ${subIndex + 1}`}
                        value={ingredient.label}
                        onChange={(e) =>
                          handleGroupChange(
                            e,
                            groupIndex,
                            "ingredientGroups",
                            subIndex
                          )
                        }
                        required
                      />
                    </div>
                  ))}
              </div>
            ))}
        </div>
        {/* Step Groups */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Step Groups</h3>
          {formData.stepGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-4 p-4 border rounded">
              <input
                type="text"
                name="label"
                className="w-full p-2 mb-2 border font-semibold rounded-lg"
                placeholder={`Group ${groupIndex + 1} Label`}
                value={group.label}
                onChange={(e) => handleGroupChange(e, groupIndex, "stepGroups")}
                required
              />
              {group.steps.map((step, subIndex) => (
                <div key={subIndex} className="flex items-center mb-2 mr-8">
                  <textarea
                    className="w-full p-2 border rounded-lg"
                    placeholder={`Step ${subIndex + 1}`}
                    value={step.label}
                    onChange={(e) =>
                      handleGroupChange(e, groupIndex, "stepGroups", subIndex)
                    }
                    required
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="w-1/2 bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
        >
          Update Steps
        </button>
      </form>
    </div>
  );
};

export default UpdateRecipe;
