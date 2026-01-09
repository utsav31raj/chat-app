"""
Fake News Detection Flask API

REST API for serving ML model predictions.
Endpoint: POST /predict
- Input: JSON with 'text' field
- Output: JSON with 'prediction' (fake/real) and 'confidence' score

CORS enabled for frontend requests
"""

import pickle
import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import warnings

warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)

# Global variable to store the loaded model
model = None

def load_model():
    """Load the trained ML model from disk"""
    global model

    model_path = 'ml_model/models/fake_news_model.pkl'

    # Handle case where model doesn't exist - train it first
    if not os.path.exists(model_path):
        print("Model not found. Training new model...")
        import subprocess
        subprocess.run(['python', 'ml_model/train_model.py'], check=True)

    # Load the model
    with open(model_path, 'rb') as f:
        model = pickle.load(f)

    print("Model loaded successfully!")
    return model

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    """
    Make prediction on news text

    Request JSON:
    {
        "text": "news article text here"
    }

    Response JSON:
    {
        "prediction": "fake" or "real",
        "confidence": 0.95,
        "success": true
    }
    """

    # Handle CORS preflight
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'})

    try:
        # Get JSON data from request
        data = request.get_json()

        if not data or 'text' not in data:
            return jsonify({
                'error': 'Missing text field',
                'success': False
            }), 400

        text = data['text'].strip()

        if not text or len(text) < 10:
            return jsonify({
                'error': 'Text must be at least 10 characters',
                'success': False
            }), 400

        if model is None:
            return jsonify({
                'error': 'Model not loaded',
                'success': False
            }), 500

        # Get prediction and confidence score
        # predict() returns class (0 or 1)
        prediction = model.predict([text])[0]

        # predict_proba() returns probability for each class
        probabilities = model.predict_proba([text])[0]

        # Confidence is the probability of predicted class
        confidence = float(probabilities[prediction])

        # Convert prediction to readable format
        prediction_label = "fake" if prediction == 1 else "real"

        return jsonify({
            'prediction': prediction_label,
            'confidence': round(confidence, 4),
            'success': True
        })

    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return jsonify({
            'error': f'Prediction failed: {str(e)}',
            'success': False
        }), 500

@app.before_request
def startup():
    """Initialize model on first request"""
    global model
    if model is None:
        load_model()

if __name__ == '__main__':
    # Load model at startup
    load_model()

    # Run Flask app
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
