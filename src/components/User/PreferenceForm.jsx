import React, { useState } from 'react';

function PreferenceForm({ onSubmit }) {
  const [budget, setBudget] = useState(100);
  const [dietaryPreference, setDietaryPreference] = useState('Any');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ budget, dietaryPreference });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto mt-6">
      <h3 className="text-xl font-semibold mb-6 text-center text-gray-700">🍽️ Set Your Meal Preferences</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-600 mb-1">
            Your Budget (₹):
          </label>
          <input
            id="budget"
            type="number"
            min="10"
            step="10"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div>
          <label htmlFor="preference" className="block text-sm font-medium text-gray-600 mb-1">
            Dietary Preference:
          </label>
          <select
            id="preference"
            value={dietaryPreference}
            onChange={(e) => setDietaryPreference(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400"
          >
            <option value="Any">Any</option>
            <option value="Veg">Vegetarian</option>
            <option value="Non-Veg">Non-Vegetarian</option>
            <option value="Protein-rich">Protein-rich</option>
            <option value="Carb-rich">Carb-rich</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
        >
          Get AI Recommendations
        </button>
      </form>
    </div>
  );
}

export default PreferenceForm;
