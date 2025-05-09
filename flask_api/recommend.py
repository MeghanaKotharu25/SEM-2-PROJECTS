# 🧠 This file contains the food recommendation logic

def get_recommendations_from_ai(budget, preference):
    # 📦 Sample food database (mock dataset, can later plug into MongoDB if needed)
    food_items = [
        {
            "name": "Paneer Salad",
            "tags": ["veg", "high-protein", "salad"],
            "price": 80,
            "macros": {"protein": "20g", "carbs": "5g", "fat": "10g"},
            "calories": 250
        },
        {
            "name": "Chickpea Bowl",
            "tags": ["veg", "high-protein", "lunch"],
            "price": 90,
            "macros": {"protein": "18g", "carbs": "10g", "fat": "8g"},
            "calories": 270
        },
        {
            "name": "Grilled Egg Sandwich",
            "tags": ["non-veg", "breakfast", "snack", "high-protein"],
            "price": 70,
            "macros": {"protein": "15g", "carbs": "30g", "fat": "7g"},
            "calories": 300
        },
        {
            "name": "Veggie Poha",
            "tags": ["veg", "carb-rich", "breakfast"],
            "price": 40,
            "macros": {"protein": "4g", "carbs": "40g", "fat": "5g"},
            "calories": 280
        },
        {
            "name": "Protein Shake",
            "tags": ["high-protein", "drink", "snack"],
            "price": 50,
            "macros": {"protein": "25g", "carbs": "2g", "fat": "1g"},
            "calories": 180
        },
        {
            "name": "Egg White Omelette",
            "tags": ["non-veg", "high-protein", "breakfast"],
            "price": 60,
            "macros": {"protein": "22g", "carbs": "3g", "fat": "2g"},
            "calories": 200
        },
    ]

    # 🧠 Normalize the preference string
    pref = preference.lower().strip()

    # 🔍 Filter based on budget and match tags
    filtered_recos = [
        item for item in food_items
        if item["price"] <= budget and (
            pref in item["name"].lower() or
            any(pref in tag for tag in item["tags"])
        )
    ]

    # 🔄 If no strong match, just return anything affordable
    if not filtered_recos:
        filtered_recos = [item for item in food_items if item["price"] <= budget]

    return filtered_recos
