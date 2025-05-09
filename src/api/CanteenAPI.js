// src/api/canteenAPI.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Fetch menu items
export const fetchMenu = async () => {
  try {
    const response = await fetch(`${API_URL}/menu`);
    if (!response.ok) {
      throw new Error('Failed to fetch menu');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching menu:', error);
    return [];
  }
};

// Add menu item
export const addMenuItem = async (item) => {
  try {
    const response = await fetch(`${API_URL}/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add item');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding menu item:', error);
    throw error;
  }
};

// Update menu item
export const updateMenuItem = async (item) => {
  try {
    const response = await fetch(`${API_URL}/menu/${item.name}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update item');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
};

// Delete menu item
export const deleteMenuItem = async (name) => {
  try {
    const response = await fetch(`${API_URL}/menu/${name}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete item');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
};

// Get AI recommendations
export const getRecommendations = async (preferences) => {
  try {
    const response = await fetch(`${API_URL}/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get recommendations');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw error;
  }
};