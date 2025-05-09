// src/components/user/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { fetchMenu } from '../../api/CanteenAPI';
import PreferenceForm from './PreferenceForm';
import Recommendations from './Recommendations';
import './UserDashboard.css';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Match backend port

function UserDashboard() {
  const [menu, setMenu] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMenu();

    // 🔁 Listen for real-time menu updates
    socket.on('menuUpdated', (newMenu) => {
      console.log('📡 Menu updated via socket:', newMenu);
      setMenu(newMenu);
    });

    return () => {
      socket.off('menuUpdated');
    };
  }, []);

  const loadMenu = async () => {
    const data = await fetchMenu();
    setMenu(data);
  };

  const handlePreferencesSubmit = async (userPreferences) => {
    setPreferences(userPreferences);
    setLoading(true);

    try {
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget: userPreferences.budget,
          dietaryPreference: userPreferences.dietaryPreference,
          menu: menu,
        }),
      });

      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('🧠 Fallback: Using client-side recommendation');
      const filteredItems = clientSideRecommender(menu, userPreferences);
      setRecommendations({
        recommendedItems: filteredItems,
        explanation: "These items fit your budget and dietary preferences.",
      });
    } finally {
      setLoading(false);
    }
  };

  const clientSideRecommender = (menu, preferences) => {
    return menu
      .filter((item) => {
        const matchesBudget = item.price <= preferences.budget;
        const matchesPreference =
          preferences.dietaryPreference === 'Any' ||
          item.macros.includes(preferences.dietaryPreference);
        return matchesBudget && matchesPreference;
      })
      .sort((a, b) => a.price - b.price);
  };

  return (
    <div className="user-dashboard">
      <h2 className="dashboard-title">🍽️ Canteen Meal Recommendations</h2>

      {!preferences ? (
        <PreferenceForm onSubmit={handlePreferencesSubmit} />
      ) : (
        <div className="recommendations-container">
          <div className="preferences-summary">
            <h3>Your Preferences</h3>
            <p><strong>Budget:</strong> ₹{preferences.budget}</p>
            <p><strong>Dietary Preference:</strong> {preferences.dietaryPreference}</p>
            <button onClick={() => setPreferences(null)} className="change-btn">
              Change Preferences
            </button>
          </div>

          {loading ? (
            <div className="loading">Loading recommendations...</div>
          ) : (
            <Recommendations 
              recommendations={recommendations} 
              onOrder={(item) => console.log("🛒 Order placed for", item)}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
