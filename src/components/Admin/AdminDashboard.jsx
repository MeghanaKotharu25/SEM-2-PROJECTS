import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { BarChart4, Users, Utensils, DollarSign } from "lucide-react";
import axios from "axios";
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleAddItem = () => {
    navigate("/admin/add-item");
  };

  const handleViewMenu = () => {
    navigate("/admin/menu");
  };

  // 👉 AI Dish Classifier states
  const [dishName, setDishName] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [finalSubmit, setFinalSubmit] = useState(false);

  const handleClassify = async () => {
    setLoading(true);
    setCategory("");
    try {
      const response = await axios.post("/api/classify", { dishName });
      setCategory(response.data.category);
    } catch (error) {
      console.error("Error classifying dish:", error);
      setCategory("Error 😢");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    console.log("Saving:", { dishName, category });
    setFinalSubmit(true);
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Admin Dashboard 🍽️</h1>
        <Input
          placeholder="Search here..."
          className="dashboard-input"
        />
      </header>

      {/* Main content */}
      <main className="dashboard-main">

        {/* Summary cards */}
        <section className="dashboard-cards">
          <Card className="dashboard-card">
            <CardContent className="dashboard-card-content">
              <Users className="icon blue" />
              <div>
                <h2>Users</h2>
                <p>👤👤👤</p>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardContent className="dashboard-card-content">
              <Utensils className="icon green" />
              <div>
                <h2>Menu Items</h2>
                <p>🍛🍜🍲</p>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardContent className="dashboard-card-content">
              <DollarSign className="icon yellow" />
              <div>
                <h2>₹8,430</h2>
                <p>Today's Revenue</p>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardContent className="dashboard-card-content">
              <BarChart4 className="icon purple" />
              <div>
                <h2>88%</h2>
                <p>Order Rate</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Action buttons */}
        <div className="dashboard-buttons">
          <Button className="dashboard-btn blue-btn" onClick={handleAddItem}>
            ➕ Add New Item
          </Button>
          <Button className="dashboard-btn green-btn" onClick={handleViewMenu}>
            📋 View Menu
          </Button>
          <Button className="dashboard-btn yellow-btn">
            💰 Manage Payments
          </Button>
        </div>

        {/* 🔥 Smart Dish Classifier */}
        <section className="dashboard-classifier mt-8 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-3">🧠 Smart Dish Classifier</h2>

          <Input
            placeholder="Enter Dish Name (e.g. Chole Bhature)"
            value={dishName}
            onChange={(e) => {
              setDishName(e.target.value);
              setFinalSubmit(false);
            }}
            className="mb-2"
          />

          <Button
            onClick={handleClassify}
            disabled={!dishName || loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {loading ? "Classifying..." : "Classify"}
          </Button>

          {category && (
            <div className="mt-4">
              <label className="block font-medium mb-1">Detected Category:</label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mb-2 border border-green-400"
              />
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Save Dish
              </Button>
              {finalSubmit && (
                <p className="text-green-700 mt-2">✅ Dish saved successfully!</p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
