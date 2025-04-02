"use client";

/* Imports */
import { Loader2Icon, LoaderIcon } from "lucide-react";
import { updateRecipe, getRecipeById, uploadImg } from "@/api/recipe";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import Image from "next/image";

/* Component for updating an existing recipe */
const UpdateRecipe = () => {
  /* Hooks and states */
  const router = useRouter();
  const { id } = useParams();
  const { user, loading, fetchSession, categories } = useAuth();
  const [hasFetched, setHasFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [imgFile, setImgFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  /* Form data state */
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
    categoryIds: [],
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

  /* Fetch session on mount */
  useEffect(() => {
    fetchSession();
  }, []);

  /* Fetch the recipe data if user and id exist */
  useEffect(() => {
    if (user && id && !hasFetched) {
      fetchRecipe();
      setHasFetched(true);
    }
  }, [user, id, hasFetched]);

  /* Fetch the recipe from the server */
  const fetchRecipe = async () => {
    console.log("run");
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
        categoryIds: recipe.categories.map((cat) => cat.id),
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

  /* Handle basic input changes */
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  /* Handle file input changes */
  const handleFileChange = (e) => {
    if (!e.target.files[0]) return;
    setImgFile(e.target.files[0]);
    setImageSrc(window.URL.createObjectURL(e.target.files[0]));
  };

  /* Handle changes in ingredient or step groups */
  const handleGroupChange = (e, groupIndex, field, subIndex = null) => {
    const value = e.target.value;
    const updatedGroups = [...formData[field]];

    if (field === "ingredientGroups") {
      if (subIndex !== null) {
        updatedGroups[groupIndex].ingredients[subIndex].label = value;
      } else {
        updatedGroups[groupIndex].label = value;
      }
    } else {
      if (subIndex !== null) {
        updatedGroups[groupIndex].steps[subIndex].label = value;
      } else {
        updatedGroups[groupIndex].label = value;
      }
    }
    setFormData((prev) => ({ ...prev, [field]: updatedGroups }));
  };

  /* Handle form submission and update */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    const updatedFormData = {
      ...formData,
      carbsG: formData.carbs,
      sugarsG: formData.sugars,
      fatG: formData.fat,
      prepTimeUnitCd: 100,
      cookTimeUnitCd: 100,
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

    try {
      if (imgFile) {
        const imgRes = await uploadImg({ file: imgFile });
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

  /* Loading state */
  if (loading || isLoading) {
    return <Loader2Icon className="animate-spin m-auto" />;
  }

  /* Redirect if not authenticated */
  if (!loading && !user) {
    router.replace("/");
    return null;
  }

  /* Render form for updating the recipe */
  return (
    <div className="max-w-4xl mx-auto p-6">
      {isUpdating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <LoaderIcon size={50} className="animate-spin m-auto" />
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg max-w-[800px] mx-auto z-0"
      >
        <h2 className="text-2xl font-bold text-gray-800 my-6 text-center">
          Update Recipe
        </h2>

        {/* Title */}
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

        {/* Summary */}
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

        {/* Image */}
        <div className="mb-6">
          <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-8">
            <Image
              src={
                imageSrc ||
                (formData?.imageUrl !== "x" && formData?.imageUrl) ||
                "https://www.themealdb.com/images/media/meals/58oia61564916529.jpg"
              }
              alt={formData?.title || "image"}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
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

        {/* Categories */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Categories
          </label>
          <select
            multiple
            value={formData.categoryIds}
            onChange={(e) => {
              e.preventDefault();
            }}
            className="w-full p-2 border rounded-lg"
          >
            {categories?.data.map((cat) => (
              <option
                key={cat.id}
                value={cat.id}
                onClick={() => {
                  if (!formData.categoryIds.includes(cat.id)) {
                    setFormData((prev) => ({
                      ...prev,
                      categoryIds: [...prev.categoryIds, cat.id],
                    }));
                  }
                }}
              >
                {cat.label}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.categoryIds?.map((catId, index) => {
              const category = categories?.data.find((cat) => cat.id === catId);
              if (!category) return null;
              return (
                <div
                  key={index}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full cursor-pointer"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      categoryIds: prev.categoryIds.filter(
                        (id) => id !== catId
                      ),
                    }))
                  }
                >
                  <span>{category.label}</span>
                  <span>&times;</span>
                </div>
              );
            })}
          </div>
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
                  required={formData.ingredientGroups.length > 1}
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
                required={formData.stepGroups.length > 1}
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

        {/* Submit Button */}
        <button
          type="submit"
          className="w-1/2 bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
        >
          Update Recipe
        </button>
      </form>
    </div>
  );
};

export default UpdateRecipe;
