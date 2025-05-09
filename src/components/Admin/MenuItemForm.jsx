import React, { useState } from 'react';
import { ChefHat } from 'lucide-react';

const MenuItemForm = ({ initialItem = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialItem.name || '',
    calories: initialItem.calories || '',
    quantity: initialItem.quantity || '',  // Change from servingSize to quantity
    category: initialItem.category || 'Veg',
    price: initialItem.price || '',  // Add price field
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Pass the form data to the onSubmit function
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-lg font-bold text-gray-700 flex items-center gap-2">
        <ChefHat className="text-yellow-600" /> {initialItem.name ? 'Edit Menu Item' : 'Add New Item'}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Item Name</label>
        <input
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-yellow-300"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Calories (kcal)</label>
          <input
            name="calories"
            type="number"
            value={formData.calories}
            onChange={handleChange}
            required
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity (people)</label>
          <input
            name="quantity"  // Change from servingSize to quantity
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm"
        >
          <option value="Veg">Veg</option>
          <option value="Non-Veg">Non-Veg</option>
          <option value="Protein-rich">Protein-rich</option>
          <option value="Carb-rich">Carb-rich</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          name="price"  // Add price field here
          type="number"
          value={formData.price}
          onChange={handleChange}
          required
          className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700"
        >
          {initialItem.name ? '✅ Update Item' : '➕ Add Item'}
        </button>
      </div>
    </form>
  );
};

export default MenuItemForm;
