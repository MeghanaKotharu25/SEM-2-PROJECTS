// src/App.js
import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

// Component Imports
import LoginPage from './components/Login/LoginPage';
import AdminDashboard from "./components/Admin/AdminDashboard";
import UserDashboard from "./components/User/UserDashboard";
import MenuItemForm from "./components/Admin/MenuItemForm";
import MenuList from './components/Admin/MenuList';
import MenuItemPage from './components/Admin/MenuItemPage';
import AddMenuItemPage from "./components/Admin/AddMenuItemPage";
import AdminMenu from "./components/Admin/AdminMenu"; 


function App() {
  const [menuItems, setMenuItems] = useState([]);

  // fetch once on mount
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/menu");
        const data = await res.json();
        setMenuItems(data);
      } catch (err) {
        console.error("Failed to fetch menu:", err);
      }
    };
    fetchMenu();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/user" element={<UserDashboard />} />
      <Route path="/menuitem" element={<MenuItemForm />} />
      <Route path="/menu" element={<MenuList menuItems={menuItems} setMenuItems={setMenuItems} />} />
      <Route path="/menuitem/:id" element={<MenuItemPage />} />
      <Route path="/admin/add-item" element={<AddMenuItemPage setMenuItems={setMenuItems} />} />
      <Route path="/admin/menu" element={<AdminMenu />} />

    </Routes>
  );
}

export default App;
