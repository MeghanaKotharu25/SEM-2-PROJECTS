// src/components/Admin/MenuItemPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MenuItemForm from "./MenuItemForm";

const mockMenu = [
  {
    id: "1",
    name: "Paneer Butter Masala",
    calories: 300,
    servingSize: 2,
    category: "Veg",
  },
  {
    id: "2",
    name: "Chicken Biryani",
    calories: 550,
    servingSize: 3,
    category: "Non-Veg",
  },
];

const MenuItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState(mockMenu);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    const foundItem = menuItems.find((item) => item.id === id);
    if (foundItem) {
      setCurrentItem(foundItem);
    } else {
      alert("Item not found");
      navigate("/menu");
    }
  }, [id, menuItems, navigate]);

  const handleUpdate = (updatedItem) => {
    const updatedList = menuItems.map((item) =>
      item.id === id ? { ...item, ...updatedItem } : item
    );
    setMenuItems(updatedList);
    alert("✅ Item updated successfully!");
    navigate("/menu");
  };

  const handleCancel = () => {
    navigate("/menu");
  };

  return (
    <div className="p-6">
      {currentItem ? (
        <MenuItemForm
          initialItem={currentItem}
          onSubmit={handleUpdate}
          onCancel={handleCancel}
        />
      ) : (
        <p>Loading item...</p>
      )}
    </div>
  );
};

export default MenuItemPage;
