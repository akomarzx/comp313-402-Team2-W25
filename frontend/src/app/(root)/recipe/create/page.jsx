"use client";
import { useState } from "react";

export default function RecipeForm() {
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    prepTime: "",
    cookTime: "",
    servings: "",
    yield: "",
    ingredients: [],
    instructions: [],
    calories: "",
    carbs: "",
    sugars: "",
    fat: "",
    image: null,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleDynamicChange = (e, index, field) => {
    const value = e.target.value;
    setFormData((prev) => {
      const updatedField = [...prev[field]];
      updatedField[index] = value;
      return { ...prev, [field]: updatedField };
    });
  };

  const addDynamicField = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeDynamicField = (index, field) => {
    setFormData((prev) => {
      const updatedField = [...prev[field]];
      updatedField.splice(index, 1);
      return { ...prev, [field]: updatedField };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    try {
      console.log(formData);
      // const response = await fetch("/api/recipes", {
      //   method: "POST",
      //   body: formDataToSend,
      // });

      // if (response.ok) {
      //   console.log("Recipe created successfully!");
      //   setFormData({
      //     title: "",
      //     summary: "",
      //     prepTime: "",
      //     cookTime: "",
      //     servings: "",
      //     yield: "",
      //     ingredients: "",
      //     instructions: "",
      //     calories: "",
      //     carbs: "",
      //     sugars: "",
      //     fat: "",
      //     image: null,
      //   });
      // } else {
      //   console.error("Failed to create recipe");
      // }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md "
    >
      <h2 className="text-2xl font-bold text-gray-800 my-6 text-center">
        Create Recipe
      </h2>
      {/* Basic Info */}
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
            />
          </div>
        ))}
      </div>

      {/* Ingredients */}
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Ingredients
        </label>
        {formData.ingredients.map((ingredient, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              className="w-full p-2 border rounded-lg"
              placeholder={`Ingredient ${index + 1}`}
              value={ingredient}
              onChange={(e) => handleDynamicChange(e, index, "ingredients")}
            />
            <button
              type="button"
              className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => removeDynamicField(index, "ingredients")}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => addDynamicField("ingredients")}
        >
          Add Ingredient
        </button>
      </div>

      {/* Instructions */}
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Instructions
        </label>
        {formData.instructions.map((instruction, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              className="w-full p-2 border rounded-lg"
              placeholder={`Step ${index + 1}`}
              value={instruction}
              onChange={(e) => handleDynamicChange(e, index, "instructions")}
            />
            <button
              type="button"
              className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => removeDynamicField(index, "instructions")}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => addDynamicField("instructions")}
        >
          Add Step
        </button>
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

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Create Recipe
      </button>
    </form>
  );
}
