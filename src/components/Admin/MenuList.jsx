// src/components/Admin/MenuList.jsx
import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./MenuList.css";

const MenuList = ({ menuItems, setMenuItems }) => {
  const navigate = useNavigate();

  const handleEdit = (itemId) => {
    navigate(`/menuitem/${itemId}`);
  };

  const handleDelete = async (itemId) => {
    const confirmed = window.confirm("Delete this item?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/api/menu/${itemId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMenuItems((prev) => prev.filter((item) => item._id !== itemId));
      } else {
        console.error("❌ Failed to delete item");
      }
    } catch (err) {
      console.error("❌ Error deleting:", err);
    }
  };

  return (
    <div className="menu-list-container">
      <h1 className="text-2xl font-bold mb-6">🍛 All Menu Items</h1>

      <table className="menu-table">
        <thead>
          <tr>
            <th className="table-header">Item Name</th>
            <th className="table-header">Category</th>
            <th className="table-header">Calories</th>
            <th className="table-header">Serving Size</th>
            <th className="table-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map((item) => (
            <tr key={item._id} className="table-row">
              <td className="table-cell">{item.name}</td>
              <td className="table-cell">{item.category}</td>
              <td className="table-cell">{item.calories} kcal</td>
              <td className="table-cell">{item.quantity} people</td> {/* Update field name to 'quantity' */}
              <td className="table-cell actions">
                <button
                  onClick={() => handleEdit(item._id)}
                  className="action-btn edit-btn"
                >
                  <Pencil size={18} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="action-btn delete-btn"
                >
                  <Trash2 size={18} /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MenuList;
