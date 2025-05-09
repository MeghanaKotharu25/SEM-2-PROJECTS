import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";

const AdminMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the backend
    fetch("http://localhost:5000/api/menu")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch menu items");
        }
        return res.json();
      })
      .then((data) => {
        setMenuItems(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">📋 Admin Menu</h2>

      {loading && <div className="text-lg text-gray-500 text-center">Loading...</div>}

      {error && (
        <div className="text-lg text-red-500 text-center">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-blue-100 text-blue-800">
              <th className="px-6 py-3 text-left font-semibold border-b">Name</th>
              <th className="px-6 py-3 text-left font-semibold border-b">Price</th>
              <th className="px-6 py-3 text-left font-semibold border-b">Calories</th>
              <th className="px-6 py-3 text-left font-semibold border-b">Quantity</th>
              <th className="px-6 py-3 text-left font-semibold border-b">Category</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.length > 0 ? (
              menuItems.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition duration-300">
                  <td className="px-6 py-4 border-b text-gray-700">{item.name}</td>
                  <td className="px-6 py-4 border-b text-gray-700">₹{item.price}</td>
                  <td className="px-6 py-4 border-b text-gray-700">{item.calories} kcal</td>
                  <td className="px-6 py-4 border-b text-gray-700">{item.quantity}</td>
                  <td className="px-6 py-4 border-b text-gray-700">{item.category}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 border-b text-center text-gray-500">
                  No menu items available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMenu;
