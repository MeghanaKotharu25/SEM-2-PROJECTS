from flask import Flask, request, jsonify
import requests
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for React integration

# In-memory storage for the canteen menu
canteen_menu = []

# Initialize with some items
canteen_menu = [
    {
        "name": "Veggie Salad",
        "price": 60,
        "macros": "Veg",
        "calories": 180,
        "description": "Fresh garden vegetables with vinaigrette"
    },
    {
        "name": "Chicken Sandwich",
        "price": 90,
        "macros": "Non-Veg",
        "calories": 420,
        "description": "Grilled chicken with lettuce and mayo"
    },
    {
        "name": "Protein Shake",
        "price": 70,
        "macros": "Protein-rich",
        "calories": 250,
        "description": "Whey protein with milk and banana"
    }
]

# LLM configuration
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "your_groq_api_key")
AI_MODEL = "llama3-8b-8192"

@app.route('/')
def home():
    return jsonify({"message": "Canteen API is Running!"}), 200

# CRUD Operations for Menu Items
@app.route('/api/menu', methods=['GET'])
def get_menu():
    return jsonify(canteen_menu), 200

@app.route('/api/menu', methods=['POST'])
def add_menu_item():
    try:
        data = request.json
        name = data.get("name")
        price = data.get("price")
        macros = data.get("macros")
        
        # Optional fields
        calories = data.get("calories")
        description = data.get("description", "")

        if not all([name, price, macros]):
            return jsonify({"error": "Name, price and category are required"}), 400

        # Check for duplicate
        for item in canteen_menu:
            if item["name"] == name:
                return jsonify({"error": "Item already exists"}), 400

        # Add the new item
        canteen_menu.append({
            "name": name,
            "price": price,
            "macros": macros,
            "calories": calories,
            "description": description
        })
        
        return jsonify({"message": f"Item '{name}' added successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/menu/<name>', methods=['PUT'])
def update_menu_item(name):
    try:
        data = request.json
        
        # Find item
        for i, item in enumerate(canteen_menu):
            if item["name"] == name:
                # Update item
                canteen_menu[i] = {
                    "name": data.get("name", item["name"]),
                    "price": data.get("price", item["price"]),
                    "macros": data.get("macros", item["macros"]),
                    "calories": data.get("calories", item.get("calories")),
                    "description": data.get("description", item.get("description", ""))
                }
                return jsonify({"message": f"Item '{name}' updated successfully"}), 200
        
        return jsonify({"error": "Item not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/menu/<name>', methods=['DELETE'])
def delete_menu_item(name):
    try:
        global canteen_menu
        original_length = len(canteen_menu)
        canteen_menu = [item for item in canteen_menu if item["name"] != name]
        
        if len(canteen_menu) < original_length:
            return jsonify({"message": f"Item '{name}' deleted successfully"}), 200
        else:
            return jsonify({"error": "Item not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# AI Recommendation Endpoint
@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    try:
        data = request.json
        budget = data.get("budget", 100)
        preference = data.get("dietaryPreference", "Any")
        menu = data.get("menu", canteen_menu)
        
        # Filter menu based on budget and preference
        filtered_menu = [
            item for item in menu 
            if item["price"] <= budget and 
               (preference == "Any" or item["macros"] == preference)
        ]
        
        if not filtered_menu:
            return jsonify({
                "recommendedItems": [],
                "explanation": "No items match your criteria. Try increasing your budget or changing your dietary preference."
            }), 200
        
        # For simpler requests, return without calling LLM
        if len(filtered_menu) <= 3:
            return jsonify({
                "recommendedItems": filtered_menu,
                "explanation": f"These are the available {preference} options within your budget of ₹{budget}."
            }), 200
            
        # For more complex recommendations, use LLM
        try:
            menu_text = "\n".join([
                f"{item['name']} - ₹{item['price']} - {item['macros']} - "
                f"{item.get('calories', 'N/A')} calories - {item.get('description', '')}"
                for item in filtered_menu
            ])
            
            query = f"""
            Help recommend the best meals for a student with:
            - Budget: ₹{budget}
            - Dietary Preference: {preference}
            
            Available options:
            {menu_text}
            
            Provide a brief explanation of why these choices are recommended.
            Format your response as JSON with the following structure:
            {{
                "recommendedItems": [item1, item2],
                "explanation": "explanation text"
            }}
            """
            
            # Make API call to Groq
            headers = {
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            }
            
            response = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                json={
                    "model": AI_MODEL,
                    "messages": [
                        {"role": "system", "content": "You are a nutrition expert recommending meals."},
                        {"role": "user", "content": query}
                    ],
                    "max_tokens": 500
                },
                headers=headers
            )
            
            ai_response = response.json()
            ai_content = ai_response["choices"][0]["message"]["content"]
            
            # Fallback in case LLM doesn't return proper JSON
            try:
                import json
                ai_recommendations = json.loads(ai_content)
            except:
                # Simple fallback recommendation
                ai_recommendations = {
                    "recommendedItems": sorted(filtered_menu, key=lambda x: x["price"])[:3],
                    "explanation": "These items match your dietary preference and budget constraints."
                }
            
            return jsonify(ai_recommendations), 200
            
        except Exception as e:
            # Fallback if AI recommendation fails
            return jsonify({
                "recommendedItems": sorted(filtered_menu, key=lambda x: x["price"])[:3],
                "explanation": f"Here are some {preference} options within your budget of ₹{budget}."
            }), 200
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)