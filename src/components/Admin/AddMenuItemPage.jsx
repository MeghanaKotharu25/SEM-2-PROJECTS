import React from 'react';
import MenuItemForm from './MenuItemForm';
import { useNavigate } from 'react-router-dom';

const AddMenuItemPage = ({ setMenuItems }) => {
  const navigate = useNavigate();

  const handleAddItem = async (newItem) => {
    try {
      // Log the item being sent to the backend
      console.log("Sending new item:", newItem);

      // Send the data to the backend
      const res = await fetch("http://localhost:5000/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });

      // Check if the response was successful
      if (!res.ok) {
        console.error("Failed to add menu item, status:", res.status);
        throw new Error("Failed to add menu item");
      }

      // Parse the saved item from the backend
      const savedItem = await res.json();

      // Update the menu items in the state
      setMenuItems((prev) => [...prev, savedItem]);

      // Log success
      console.log("✅ New Menu Item Saved:", savedItem);

      // Navigate to the menu page after saving
      navigate('/menu');
    } catch (err) {
      console.error("❌ Error adding item:", err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <MenuItemForm
        initialItem={{}} // Empty object as we are adding a new item
        onSubmit={handleAddItem} // Pass the handleAddItem function to handle form submission
        onCancel={() => navigate('/admin')} // Redirect to admin page on cancel
      />
    </div>
  );
};

export default AddMenuItemPage;
