"use client";

import {
  CirclePlus,
  CircleMinus,
  CopyPlus,
  Trash2,
  Loader2Icon,
} from "lucide-react";
import { createRecipe, uploadImg } from "@/api/recipe";
import { useRouter, redirect } from "next/navigation";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import Image from "next/image";

const RecipeForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    prepTime: "",
    cookTime: "",
    servings: "",
    yield: "",
    ingredientGroups: [{ label: "", ingredients: [[]] }],
    stepGroups: [{ label: "", steps: [[]] }],
    calories: "",
    carbs: "",
    sugars: "",
    fat: "",
    categoryIds: [],
    imageUrl: "",
  });

  const [isCreating, setIsCreating] = useState(false);
  const [imgFile, setImgFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  const { user, loading, categories } = useAuth();
  if (loading) return <Loader2Icon className="animate-spin m-auto" />;
  if (!user) {
    redirect("/");
  }

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
    const url = window.URL.createObjectURL(e.target.files[0]);
    setImageSrc(url);
  };

  const addGroup = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [
        ...prev[field],
        field === "ingredientGroups"
          ? { label: "", ingredients: [[]] }
          : { label: "", steps: [[]] },
      ],
    }));
  };

  const handleGroupChange = (e, groupIndex, field, subIndex = null) => {
    const value = e.target.value;
    setFormData((prev) => {
      const updatedGroups = [...prev[field]];
      if (subIndex === null) {
        updatedGroups[groupIndex] = {
          ...updatedGroups[groupIndex],
          [e.target.name]: value,
        };
      } else {
        if (field === "stepGroups") {
          updatedGroups[groupIndex].steps[subIndex] = value;
        } else {
          updatedGroups[groupIndex].ingredients[subIndex] = value;
        }
      }
      return { ...prev, [field]: updatedGroups };
    });
  };

  const addSubField = (groupIndex, field) => {
    setFormData((prev) => {
      const updatedGroups = [...prev[field]];
      if (field === "ingredientGroups") {
        updatedGroups[groupIndex] = {
          ...updatedGroups[groupIndex],
          ingredients: [...updatedGroups[groupIndex].ingredients, ""],
        };
      } else {
        updatedGroups[groupIndex] = {
          ...updatedGroups[groupIndex],
          steps: [...updatedGroups[groupIndex].steps, ""],
        };
      }
      return { ...prev, [field]: updatedGroups };
    });
  };

  const removeGroup = (groupIndex, field) => {
    setFormData((prev) => {
      const updatedGroups = [...prev[field]];
      updatedGroups.splice(groupIndex, 1);
      return { ...prev, [field]: updatedGroups };
    });
  };

  const removeSubField = (groupIndex, subIndex, field) => {
    setFormData((prev) => {
      const updatedGroups = [...prev[field]];
      if (field === "ingredientGroups") {
        updatedGroups[groupIndex].ingredients.splice(subIndex, 1);
      } else {
        updatedGroups[groupIndex].steps.splice(subIndex, 1);
      }
      return { ...prev, [field]: updatedGroups };
    });
  };

  const handleSubmit = async (e) => {
    setIsCreating(true);
    e.preventDefault();
    console.log(formData);

    const newFormData = {
      title: formData.title,
      summary: formData.summary,
      prepTime: formData.prepTime,
      prepTimeUnitCd: 100,
      cookTime: formData.cookTime,
      cookTimeUnitCd: 100,
      servings: formData.servings,
      yield: formData.yield,
      calories: formData.calories,
      carbsG: formData.carbs,
      sugarsG: formData.sugars,
      fatG: formData.fat,
      categoryIds: formData.categoryIds || [1],
      imageUrl: "x",
      ingredientGroups: formData.ingredientGroups.map((group, idx) => {
        return {
          label: group.label,
          ingredientGroupOrder: idx + 1,
          ingredients: group.ingredients.map((ingredient, subIdx) => {
            return {
              label: ingredient,
              ingredientOrder: subIdx + 1,
            };
          }),
        };
      }),
      stepGroups: formData.stepGroups.map((group, idx) => {
        return {
          label: group.label,
          stepGroupOrder: idx + 1,
          steps: group.steps.map((step, subIdx) => {
            return {
              label: step,
              stepOrder: subIdx + 1,
            };
          }),
        };
      }),
    };
    if (newFormData.ingredientGroups?.length < 1) {
      toast("Please add at least one ingredient group.");
      setIsCreating(false);
      return;
    }
    if (newFormData.stepGroups?.length < 1) {
      toast("Please add at least one step group.");
      setIsCreating(false);
      return;
    }
    newFormData.ingredientGroups?.map((group) => {
      if (group.ingredients.length < 1) {
        toast("Please add at least one ingredient.");
        setIsCreating(false);
        return;
      }
    });
    newFormData.stepGroups?.map((group) => {
      if (group.steps.length < 1) {
        toast("Please add at least one step.");
        setIsCreating(false);
        return;
      }
    });

    try {
      const imgRes = await uploadImg({ file: imgFile });
      console.log(imgRes);
      if (imgRes.status === 200) {
        newFormData.imageUrl = imgRes.data;
        newFormData.thumbnailUrl = imgRes.data;
      }
      const res = await createRecipe(newFormData);
      console.log(res);
      if (res?.status === 200 || 201) {
        toast("Recipe created successfully!");
        setTimeout(() => {
          router.replace(`/recipe/${res.data.result.id}`);
        }, 1500);
      }

      // console.log(newFormData);
    } catch (error) {
      toast("Error creating recipe. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      {/* not letting user touch while creating overlay */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <LoaderIcon size={50} className="animate-spin m-auto" />
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg max-w-[800px] mx-auto z-0"
      >
        <h2 className="text-2xl font-bold text-gray-800 my-6 text-center">
          Create Recipe
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
        <div className="mb-6">
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
                    !formData.categoryIds?.includes(cat.id) &&
                      setFormData((prev) => ({
                        ...prev,
                        categoryIds: [...prev.categoryIds, cat.id],
                      }));
                  }}
                >
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.categoryIds?.map((catId) => {
              const category = categories?.data.find((cat) => cat.id === catId);
              if (!category) return null;
              return (
                <div
                  key={catId}
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
        {/* Image Upload */}
        <div className="mb-6">
          {imageSrc && (
            <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-8">
              <Image
                src={imageSrc}
                alt={formData?.title || "image"}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          )}
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Recipe Image
          </label>
          <input
            type="file"
            accept="image/*"
            className="w-full p-2 border rounded-lg"
            onChange={handleFileChange}
            required
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
                required
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
                required
              />
            </div>
          ))}
        </div>
        {/* Ingredient Groups */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Ingredient Groups</h3>
          {formData.ingredientGroups.map((group, groupIndex) => (
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
              {group.ingredients.map((ingredient, subIndex) => (
                <div key={subIndex} className="flex items-center mb-2">
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    placeholder={`Ingredient ${subIndex + 1}`}
                    value={ingredient}
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
                  <button
                    type="button"
                    className="ml-2 px-2 text-gray-500 py-1 rounded"
                    onClick={() =>
                      removeSubField(groupIndex, subIndex, "ingredientGroups")
                    }
                  >
                    <CircleMinus size={20} />
                  </button>
                </div>
              ))}
              <div className="flex justify-between">
                {" "}
                <button
                  type="button"
                  className=" text-gray-600 px-4 py-2 rounded flex border-2 hover:shadow-sm"
                  onClick={() => addSubField(groupIndex, "ingredientGroups")}
                >
                  <CirclePlus size={20} />
                  <span className="px-2 font-semibold text-gray-600">
                    Add Ingredient
                  </span>
                </button>
                <button
                  type="button"
                  className="ml-4 text-gray-600 px-4 py-2 rounded flex border-2 hover:shadow-sm"
                  onClick={() => removeGroup(groupIndex, "ingredientGroups")}
                >
                  <Trash2 size={20} />
                  <span className="px-2 font-semibold text-gray-600">
                    Delete Group
                  </span>
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className=" text-green-700 hover:text-green-500 font-semibold p-2 rounded border-2 flex"
            onClick={() => addGroup("ingredientGroups")}
          >
            <CopyPlus size={20} />
            <span className="px-2">Add Ingredient Group</span>
          </button>
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
                <div key={subIndex} className="flex items-center mb-2">
                  <textarea
                    className="w-full p-2 border rounded-lg"
                    placeholder={`Step ${subIndex + 1}`}
                    value={step}
                    onChange={(e) =>
                      handleGroupChange(e, groupIndex, "stepGroups", subIndex)
                    }
                    required
                  />
                  <button
                    type="button"
                    className="ml-2 text-gray-500 px-2 py-1 rounded"
                    onClick={() =>
                      removeSubField(groupIndex, subIndex, "stepGroups")
                    }
                  >
                    <CircleMinus size={20} />
                  </button>
                </div>
              ))}
              <div className="flex justify-between">
                <button
                  type="button"
                  className=" text-gray-600 px-4 py-2 rounded flex border-2 hover:shadow-sm"
                  onClick={() => addSubField(groupIndex, "stepGroups")}
                >
                  <CirclePlus size={20} />
                  <span className="px-2 font-semibold text-gray-600">
                    Add Step
                  </span>
                </button>
                <button
                  type="button"
                  className="ml-4 text-gray-600 px-4 py-2 rounded flex border-2 hover:shadow-sm"
                  onClick={() => removeGroup(groupIndex, "stepGroups")}
                >
                  <Trash2 size={20} />
                  <span className="px-2 font-semibold text-gray-600">
                    Delete Group
                  </span>
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className=" text-green-700 hover:text-green-500 border-2 font-semibold p-2 rounded flex"
            onClick={() => addGroup("stepGroups")}
          >
            <CopyPlus size={20} />
            <span className="px-2">Add Step Group</span>
          </button>
        </div>
        <button
          type="submit"
          className="w-1/2 bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
        >
          Create Recipe
        </button>
      </form>
    </>
  );
};

export default RecipeForm;
