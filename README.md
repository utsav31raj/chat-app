# Fake News Detection System

A full-stack AI-powered application that detects fake news using machine learning. Built with React, Node.js/Express, Python/Flask, and Supabase.

## Key Features

- **AI-Powered Detection**: Uses TF-IDF vectorization + Logistic Regression for accurate fake news detection
- **Real-time Analysis**: Get instant predictions with confidence scores
- **Detection History**: View all past analyses stored in Supabase database
- **Sample Articles**: Try with pre-loaded fake and real news examples
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Production-Ready**: Fully deployable on Vercel, Render, and Supabase

## How It Works

### Machine Learning Model

The system uses a **TF-IDF + Logistic Regression** pipeline:

1. **TF-IDF Vectorization**: Converts text into numerical features based on word importance
   - Captures unigrams and bigrams (single words and word pairs)
   - Removes common English stopwords
   - Uses top 1000 most important words

2. **Logistic Regression Classifier**: Binary classifier trained to distinguish:
   - **FAKE**: Misinformation, sensationalism, conspiracy theories
   - **REAL**: Authentic journalism, factual reporting

3. **Confidence Scoring**: Returns probability scores (0-1) indicating model confidence

### Architecture

```
┌─────────────────┐
│   React App     │ (Frontend)
│  - Input Form   │
│  - Results UI   │
│  - History View │
└────────┬────────┘
         │ HTTP API
         │
    ┌────▼──────────────┐
    │ Express Backend   │ (Node.js)
    │ - API Routes      │
    │ - Supabase        │
    └────┬────┬─────────┘
         │    │
         │    └─────┬──────────────────┐
         │          │                  │
    ┌────▼──────┐   │           ┌──────▼─────────┐
    │ Supabase  │   │           │ Flask ML API   │
    │ Database  │   │           │ (Python)       │
    │ (History) │   │           │ - Predictions  │
    └───────────┘   │           └────────────────┘
                    │
            ┌───────▼─────────┐
            │   Deployment    │
            │ Vercel|Render   │
            └─────────────────┘
```

## Tech Stack

### Frontend
- **React 18**: Modern UI framework with hooks
- **TypeScript**: Type-safe component development
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Beautiful icons

### Backend
- **Node.js + Express**: HTTP API server
- **Supabase**: PostgreSQL database for history
- **Fetch API**: Calls ML model

### ML Model API
- **Python 3.8+**: Machine learning environment
- **Flask**: REST API server
- **scikit-learn**: TF-IDF + Logistic Regression
- **NumPy/Pandas**: Data processing

### Database
- **Supabase**: PostgreSQL with RLS policies
- Table: `detections` (id, text, prediction, confidence, created_at)

## Project Structure

```
project/
├── src/
│   ├── components/
│   │   ├── DetectionInput.tsx    # Input form with samples
│   │   ├── ResultCard.tsx         # Result display card
│   │   └── History.tsx            # Detection history list
│   ├── App.tsx                    # Main component
│   └── main.tsx                   # Entry point
│
├── ml_model/
│   ├── app.py                     # Flask API server
│   ├── train_model.py             # Model training script
│   ├── requirements.txt           # Python dependencies
│   └── models/
│       └── fake_news_model.pkl    # Trained model (generated)
│
├── server.js                      # Express backend API
├── package.json                   # Node dependencies
├── .env                           # Environment variables
├── vite.config.ts                 # Vite configuration
└── tailwind.config.js             # Tailwind configuration
```

## Local Development

### Prerequisites

- Node.js 18+
- Python 3.8+
- Git

### 1. Clone Repository

```bash
git clone <repository-url>
cd project
```

### 2. Setup Frontend

```bash
# Install Node dependencies
npm install
```

### 3. Setup Python ML Model

```bash
# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r ml_model/requirements.txt

# Train the model (generates fake_news_model.pkl)
python ml_model/train_model.py
```

### 4. Configure Environment

Create `.env` file in root:

```bash
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# Local Development
VITE_API_URL=http://localhost:3001
ML_API_URL=http://localhost:5000
```

### 5. Run Development Servers

In separate terminal windows:

**Terminal 1 - ML API Server (Python)**
```bash
cd ml_model
python app.py
```
Server runs on: http://localhost:5000

**Terminal 2 - Backend API Server (Express)**
```bash
npm run server
```
Server runs on: http://localhost:3001

**Terminal 3 - Frontend Dev Server (Vite)**
```bash
npm run dev
```
Frontend runs on: http://localhost:5173

## API Endpoints

### Express Backend (`/api/*`)

#### POST `/api/detect`
Analyze news text for authenticity.

**Request:**
```json
{
  "text": "news article text here"
}
```

**Response:**
```json
{
  "prediction": "fake",
  "confidence": 0.95,
  "id": "uuid-string",
  "success": true
}
```

#### GET `/api/history?limit=20`
Get recent detections from database.

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "text": "article text",
      "prediction": "fake",
      "confidence": 0.92,
      "created_at": "2024-01-09T10:30:00Z"
    }
  ],
  "success": true
}
```

#### GET `/api/samples`
Get sample fake and real news articles for testing.

**Response:**
```json
{
  "fake": ["sample 1", "sample 2", ...],
  "real": ["sample 1", "sample 2", ...],
  "success": true
}
```

### Flask ML API (`/`)

#### POST `/predict`
Get ML model prediction on news text.

**Request:**
```json
{
  "text": "news article text here"
}
```

**Response:**
```json
{
  "prediction": "fake",
  "confidence": 0.95,
  "success": true
}
```

#### GET `/health`
Health check endpoint.

## Deployment

### Frontend - Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Set environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` = backend URL (e.g., https://fake-news-backend.onrender.com)
5. Deploy

### Backend - Render

1. Create `render.yaml` or manual setup
2. Create Web Service on Render
3. Connect GitHub repository
4. Set build command: `npm install`
5. Set start command: `node server.js`
6. Set environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `ML_API_URL` = Python API URL (e.g., https://fake-news-ml.onrender.com)
7. Deploy

### ML API - Render or PythonAnywhere

**Option A: Render (Recommended)**
1. Create Web Service
2. Connect GitHub repository
3. Set build command: `pip install -r ml_model/requirements.txt`
4. Set start command: `cd ml_model && gunicorn -b 0.0.0.0 app:app`
5. Deploy

**Option B: PythonAnywhere**
1. Upload project to PythonAnywhere
2. Create virtual environment
3. Set up WSGI configuration
4. Configure web app to use Flask

## Model Training & Improvement

### Current Model

The current model uses sample data for demonstration. To improve accuracy:

1. **Collect Real Data**:
   - Use Kaggle datasets (Fake and Real News)
   - Use LIAR dataset for political fact-checking
   - Scrape news from verified sources

2. **Enhance Training** (`ml_model/train_model.py`):
```python
# Collect labeled data
X_train = [articles...]  # News text
y_train = [1, 0, 1, ...]  # 1=fake, 0=real

# Train with more data
pipeline.fit(X_train, y_train)
```

3. **Evaluate Model**:
```python
from sklearn.metrics import accuracy_score, precision_score, recall_score

y_pred = pipeline.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred)}")
print(f"Precision: {precision_score(y_test, y_pred)}")
print(f"Recall: {recall_score(y_test, y_pred)}")
```

4. **Deploy Updated Model**:
   - Retrain locally: `python ml_model/train_model.py`
   - Commit `ml_model/models/fake_news_model.pkl`
   - Push to GitHub
   - Render auto-deploys

## Interview Talking Points

### Problem Statement
- **Challenge**: Millions of fake news articles spread daily
- **Impact**: Misinformation affects elections, public health, economies
- **Solution**: AI-powered detection system for rapid identification

### Technical Implementation
- **ML Model**: TF-IDF captures semantic patterns; Logistic Regression efficient + interpretable
- **Architecture**: Microservices design separates concerns (frontend, API, ML)
- **Database**: Supabase RLS ensures data security
- **Scalability**: Stateless APIs allow horizontal scaling

### Key Decisions
- **Why TF-IDF over transformers?**: Simpler, faster inference, no GPU needed for demo
- **Why Logistic Regression over deep learning?**: Faster training, explainable predictions, lower resource cost
- **Why separate ML API?**: Python excels at ML; keeps backend language-agnostic
- **Why Supabase?**: Real-time capabilities, RLS policies, built-in auth

### Challenges & Solutions
- **Challenge**: Model accuracy on diverse news types
  - **Solution**: Ensemble multiple models, transfer learning with pre-trained embeddings

- **Challenge**: Real-time processing at scale
  - **Solution**: Cache predictions, async processing, rate limiting

- **Challenge**: Cold start on serverless
  - **Solution**: Keep services warm, optimize dependencies

## Security Considerations

- **Input Validation**: 10-char minimum prevents spam
- **RLS Policies**: Supabase policies allow all users to read, authenticated users to write
- **API Limits**: Rate limiting on Render/Vercel prevents abuse
- **Error Handling**: Generic errors prevent information leakage
- **CORS**: Configured for frontend domain only

## Future Enhancements

1. **Multi-language Support**: Detect fake news in multiple languages
2. **Claim Verification**: Integration with fact-checking APIs
3. **Real-time Trends**: Analyze trending topics for misinformation
4. **User Feedback**: Improve model with user corrections
5. **Advanced ML**: Transformer models (BERT) for better accuracy
6. **Browser Extension**: Inline detection while browsing
7. **API for Publishers**: White-label solution for news platforms

## Troubleshooting

### Flask App Won't Start
```bash
# Check Python version
python --version  # Should be 3.8+

# Verify dependencies
pip list | grep scikit

# Test imports
python -c "import sklearn; print(sklearn.__version__)"
```

### Backend Can't Call ML API
```bash
# Verify both servers running
curl http://localhost:5000/health
curl http://localhost:3001/api/health

# Check ML_API_URL in .env
echo $ML_API_URL
```

### Supabase Connection Failed
```bash
# Verify environment variables
echo $VITE_SUPABASE_URL

# Test connection in backend logs
npm run server  # Check console output
```

## Performance Optimization

- **Frontend**: Code-splitting, lazy loading components
- **Backend**: Connection pooling, response caching
- **ML**: Model quantization, batch prediction
- **Database**: Indexing on `created_at`, RLS optimization

## Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## License

MIT License - see LICENSE file for details

---

**Note**: This model is for demonstration. For production use, train on larger labeled datasets and implement human review processes. Always encourage users to verify with reliable news sources.
