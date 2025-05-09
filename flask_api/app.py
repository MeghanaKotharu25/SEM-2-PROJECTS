from flask import Flask, request, jsonify
from google.cloud import language_v1
import os
from recommend import get_recommendations_from_ai  # 🧠 Your custom logic here

app = Flask(__name__)

# 🔐 Set path to your Google NLP credentials
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = r"C:\Users\aadih\OneDrive\Desktop\Desktop\DSA-JAVA\wide-hold-457309-s0-c91f57f6eb7c.json"

# 🧠 Google NLP client setup
client = language_v1.LanguageServiceClient()

# 📊 Analyze general entities + sentiment
@app.route('/analyze', methods=['POST'])
def analyze_text():
    data = request.json
    user_text = data.get('text', '')

    if not user_text:
        return jsonify({"error": "No text provided"}), 400

    document = language_v1.Document(content=user_text, type_=language_v1.Document.Type.PLAIN_TEXT)

    # Extract entities + sentiment
    entities_response = client.analyze_entities(document=document)
    sentiment = client.analyze_sentiment(document=document).document_sentiment

    extracted = []
    for entity in entities_response.entities:
        extracted.append({
            "name": entity.name,
            "type": language_v1.Entity.Type(entity.type_).name,
            "salience": entity.salience
        })

    return jsonify({
        "entities": extracted,
        "sentiment_score": sentiment.score,
        "sentiment_magnitude": sentiment.magnitude
    })

# 🍱 Recommend food based on input sentence
@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    user_text = data.get('text', '')

    if not user_text:
        return jsonify({"error": "No input text provided"}), 400

    # Analyze with Google NLP
    document = language_v1.Document(content=user_text, type_=language_v1.Document.Type.PLAIN_TEXT)
    entity_response = client.analyze_entities(document=document)

    # 🧾 Defaults
    budget = 100
    preference = "any"  # fallback if preference not found

    for entity in entity_response.entities:
        entity_type = language_v1.Entity.Type(entity.type_).name
        entity_name = entity.name.lower()

        # Extract budget
        if entity_type == "NUMBER":
            try:
                value = int(float(entity_name))
                if value < 500:  # Basic sanity check for budget values
                    budget = value
            except:
                pass

        # Extract food preference (e.g., high-protein, veg, etc.)
        elif entity_type in ["OTHER", "CONSUMER_GOOD"]:
            if any(keyword in entity_name for keyword in ["protein", "veg", "non-veg", "carb", "diet", "snack", "breakfast", "lunch", "dinner"]):
                preference = entity_name

    # 🍔 Get smart recommendations
    recos = get_recommendations_from_ai(budget, preference)

    return jsonify({
        "recommendations": recos,
        "used_budget": budget,
        "used_preference": preference
    })

if __name__ == '__main__':
    app.run(port=5001, debug=True)
