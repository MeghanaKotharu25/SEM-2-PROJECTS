import os
from google.cloud import language_v1

# Set the path to your service account key file
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = r"C:\Users\aadih\OneDrive\Desktop\Desktop\DSA-JAVA\wide-hold-457309-s0-c91f57f6eb7c.json"

# Initialize the client
client = language_v1.LanguageServiceClient()

# Your input text to analyze
text = "I love working on cool AI projects, especially with Python and Google Cloud!"

# Set up the document with your text
document = language_v1.Document(
    content=text,
    type_=language_v1.Document.Type.PLAIN_TEXT
)

# Call the API
response = client.analyze_sentiment(request={'document': document})

# Output the result
print("Sentiment analysis result:")
print(f"Score: {response.document_sentiment.score}")
print(f"Magnitude: {response.document_sentiment.magnitude}")
