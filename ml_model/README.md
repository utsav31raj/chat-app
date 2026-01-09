# Fake News Detection ML Model

Flask-based API serving a TF-IDF + Logistic Regression machine learning model for fake news detection.

## Architecture

### Model Pipeline

```
Text Input
    ↓
TF-IDF Vectorizer
├─ Tokenization
├─ Stopword removal
├─ Unigrams & Bigrams
└─ 1000 features
    ↓
Logistic Regression Classifier
├─ Trained on fake/real news samples
└─ Binary classification (0=real, 1=fake)
    ↓
Output (Prediction + Confidence Score)
```

## How It Works

### 1. TF-IDF Vectorization

Converts text into numerical features:
- **TF (Term Frequency)**: How often a word appears
- **IDF (Inverse Document Frequency)**: How unique a word is
- **TF-IDF Score**: TF × IDF (captures word importance)

Example:
```
Text: "Breaking news: scientists discover cure for cancer"

TF-IDF Output:
[0.23, 0.45, 0.12, ..., 0.87]  # 1000 numerical features
```

### 2. Logistic Regression

Binary classification model:
- Learns patterns in fake vs real news
- Outputs probability 0-1
- 0.0-0.5 = Real, 0.5-1.0 = Fake

Example:
```
Input features → Logistic Regression → 0.92
                                      (92% confidence it's FAKE)
```

## Local Setup

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

**Dependencies:**
- `flask` - Web framework
- `flask-cors` - Cross-origin requests
- `scikit-learn` - ML algorithms
- `numpy` - Numerical computing
- `pandas` - Data processing
- `gunicorn` - Production server

### 2. Train the Model

First time only - generates `models/fake_news_model.pkl`:

```bash
python train_model.py
```

Output:
```
Training fake news detection model...
Training Accuracy: 0.9333
Model saved to ml_model/models/fake_news_model.pkl
Model training complete!
```

The model is saved as a pickle file for fast loading in Flask app.

### 3. Start the API Server

```bash
python app.py
```

Server runs on: `http://localhost:5000`

Output:
```
Model loaded successfully!
 * Running on http://0.0.0.0:5000
```

## API Endpoints

### GET `/health`

Health check endpoint.

**Request:**
```bash
curl http://localhost:5000/health
```

**Response (200):**
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

### POST `/predict`

Analyze text for fake/real prediction.

**Request:**
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "Breaking news: Scientists discover new cure"}'
```

**Request Body:**
```json
{
  "text": "Your news article text here (minimum 10 characters)"
}
```

**Response (200 - Success):**
```json
{
  "prediction": "real",
  "confidence": 0.87,
  "success": true
}
```

**Response (400 - Error):**
```json
{
  "error": "Text must be at least 10 characters",
  "success": false
}
```

### Response Meanings

| Prediction | Confidence | Meaning |
|-----------|-----------|---------|
| fake | 0.92 | 92% confidence it's fake |
| real | 0.78 | 78% confidence it's real |
| fake | 0.51 | Borderline - slightly leans fake |
| real | 0.49 | Borderline - slightly leans real |

## Model Improvement Guide

### Current Performance

Trained on sample data:
- **Accuracy**: ~93%
- **Training samples**: 30 (15 fake, 15 real)
- **Features**: 1000 TF-IDF terms

### Improve Accuracy

#### 1. Collect Larger Dataset

Use public datasets:

**Kaggle Datasets:**
- [Fake and Real News](https://www.kaggle.com/clmentbisaillon/fake-and-real-news-dataset)
- [LIAR Dataset](https://www.kaggle.com/mrudula/liar)

**Data format (CSV):**
```csv
text,label
"Article text here...",0
"Another article...",1
```

#### 2. Update Training Script

Modify `train_model.py`:

```python
import pandas as pd

# Load real data
df = pd.read_csv('fake_and_real_news.csv')
X_train = df['text'].values
y_train = df['label'].values  # 0=real, 1=fake

# Train pipeline (same as before)
pipeline.fit(X_train, y_train)
```

#### 3. Evaluate Model

```python
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train
pipeline.fit(X_train, y_train)

# Evaluate
y_pred = pipeline.predict(X_test)
print(f"Accuracy:  {accuracy_score(y_test, y_pred):.4f}")
print(f"Precision: {precision_score(y_test, y_pred):.4f}")
print(f"Recall:    {recall_score(y_test, y_pred):.4f}")
print(f"F1 Score:  {f1_score(y_test, y_pred):.4f}")
```

#### 4. Tune Hyperparameters

```python
from sklearn.model_selection import GridSearchCV

param_grid = {
    'tfidf__max_features': [500, 1000, 2000],
    'tfidf__ngram_range': [(1, 1), (1, 2), (1, 3)],
    'classifier__C': [0.1, 1, 10],
}

grid_search = GridSearchCV(pipeline, param_grid, cv=5)
grid_search.fit(X_train, y_train)

print(f"Best params: {grid_search.best_params_}")
print(f"Best score: {grid_search.best_score_:.4f}")
```

#### 5. Advanced Techniques

Try different models:

```python
# Support Vector Machine (SVM)
from sklearn.svm import SVC
model = SVC(kernel='linear', probability=True)

# Random Forest
from sklearn.ensemble import RandomForestClassifier
model = RandomForestClassifier(n_estimators=100)

# Naive Bayes
from sklearn.naive_bayes import MultinomialNB
model = MultinomialNB()
```

## Advanced ML Improvements

### 1. Feature Engineering

Add custom features:

```python
import re

def extract_features(text):
    caps_ratio = sum(1 for c in text if c.isupper()) / len(text)
    punctuation_count = sum(1 for c in text if c in '!?')
    word_count = len(text.split())

    return {
        'capitalization': caps_ratio,
        'punctuation': punctuation_count,
        'word_count': word_count,
        'avg_word_length': sum(len(w) for w in text.split()) / word_count
    }
```

### 2. Pre-trained Embeddings

Use Word2Vec or GloVe:

```python
from gensim.models import Word2Vec

# Train on corpus
model = Word2Vec(sentences, size=300, window=5, workers=4)

# Get vector for text
text_vector = sum(model.wv[word] for word in text.split()) / len(text.split())
```

### 3. Deep Learning

Use transformer models:

```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

model = AutoModelForSequenceClassification.from_pretrained('distilbert-base-uncased')
tokenizer = AutoTokenizer.from_pretrained('distilbert-base-uncased')

inputs = tokenizer(text, return_tensors='pt')
outputs = model(**inputs)
prediction = torch.softmax(outputs.logits, dim=1)
```

## Performance Optimization

### Model Size

Current model size: ~2 MB (pickle file)

Reduce size with quantization:

```python
# Only use top 100 features instead of 1000
tfidf = TfidfVectorizer(max_features=100)

# Use binary classification (reduces weights)
classifier = LogisticRegression(penalty='l1', solver='liblinear')
```

### Inference Speed

Benchmark model speed:

```python
import time

start = time.time()
for _ in range(100):
    model.predict([text])
elapsed = time.time() - start

print(f"Average inference time: {elapsed/100*1000:.2f}ms")
```

### Batch Prediction

Process multiple texts at once:

```python
texts = [
    "Article 1...",
    "Article 2...",
    "Article 3...",
]

predictions = model.predict(texts)
confidences = model.predict_proba(texts)
```

## Model Interpretability

### Feature Importance

See which words matter most:

```python
# Get feature names
feature_names = pipeline.named_steps['tfidf'].get_feature_names_out()

# Get classifier weights
coefficients = pipeline.named_steps['classifier'].coef_[0]

# Top words indicating FAKE
top_fake_indices = coefficients.argsort()[-10:]
top_fake_words = [feature_names[i] for i in top_fake_indices]
print(f"Top FAKE indicators: {top_fake_words}")

# Top words indicating REAL
top_real_indices = coefficients.argsort()[:10]
top_real_words = [feature_names[i] for i in top_real_indices]
print(f"Top REAL indicators: {top_real_words}")
```

### LIME Explanations

Explain individual predictions:

```bash
pip install lime
```

```python
from lime.lime_text import LimeTextExplainer

explainer = LimeTextExplainer(class_names=['real', 'fake'])
explanation = explainer.explain_instance(
    text,
    lambda x: model.predict_proba(x),
    num_features=10
)
explanation.show_in_notebook()
```

## Testing

### Unit Tests

```python
# test_model.py
import pytest
from app import predict

def test_fake_news():
    result = predict({'text': 'Lizards secretly control government'})
    assert result['prediction'] == 'fake'
    assert result['confidence'] > 0.8

def test_real_news():
    result = predict({'text': 'Scientists discover new species in rainforest'})
    assert result['prediction'] == 'real'
    assert result['confidence'] > 0.7

def test_minimum_length():
    result = predict({'text': 'Short'})
    assert result['success'] == False
    assert 'at least 10 characters' in result['error']
```

Run tests:
```bash
pip install pytest
pytest test_model.py
```

## Troubleshooting

### Model Won't Load

```
FileNotFoundError: No such file or directory: 'ml_model/models/fake_news_model.pkl'
```

**Solution:**
```bash
python ml_model/train_model.py
```

### Slow Inference

**Problem:** Predictions take >1 second

**Solutions:**
1. Reduce max_features in TF-IDF (1000 → 500)
2. Use binary features instead of float
3. Deploy on GPU
4. Implement caching

### Low Accuracy

**Problem:** Predictions don't match reality

**Solutions:**
1. Train on larger dataset
2. Try different ML algorithms
3. Add more features
4. Implement cross-validation
5. Use ensemble methods

## Production Checklist

Before deploying to production:

- [ ] Model trained on large real-world dataset
- [ ] Cross-validation performed (min 5-fold)
- [ ] Test set accuracy > 85%
- [ ] Inference time < 500ms
- [ ] Input validation working
- [ ] Error handling in place
- [ ] Model versioning implemented
- [ ] A/B testing infrastructure ready

## Monitoring in Production

### Track Model Performance

```python
# Log every prediction
import logging

logging.info({
    'text': text[:50],
    'prediction': prediction,
    'confidence': confidence,
    'timestamp': datetime.now()
})
```

### Detect Model Drift

If accuracy drops:
1. Check if text distribution changed
2. Retrain on recent data
3. A/B test new model
4. Gradually roll out

## File Structure

```
ml_model/
├── app.py                      # Flask API server
├── train_model.py              # Training script
├── requirements.txt            # Python dependencies
├── .gitignore                  # Ignore models/cache
├── models/
│   └── fake_news_model.pkl     # Trained model
└── README.md                   # This file
```

## Resources

### Learning Materials
- [TF-IDF Explained](https://scikit-learn.org/stable/modules/feature_extraction.html#tfidf-term-weighting)
- [Logistic Regression](https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression)
- [scikit-learn Documentation](https://scikit-learn.org/)

### Datasets
- [Kaggle - Fake News](https://www.kaggle.com/c/fake-news/data)
- [LIAR Dataset](https://www.cs.ucsb.edu/~william/data/liar_dataset.zip)

### Tools
- [Jupyter Notebook](https://jupyter.org/) - Interactive development
- [MLflow](https://mlflow.org/) - Experiment tracking
- [DVC](https://dvc.org/) - Model versioning

---

Questions? Check the main README.md or GitHub issues.
