# Quick Start Guide

Get the Fake News Detection System running locally in 5 minutes.

## 1. Clone & Setup (1 min)

```bash
# Clone repository
git clone <your-repo-url>
cd project

# Install Node dependencies
npm install

# Install Python dependencies
pip install -r ml_model/requirements.txt
```

## 2. Train ML Model (1 min)

```bash
# One-time: Train and save the model
python ml_model/train_model.py
```

Output:
```
Training fake news detection model...
Training Accuracy: 0.9333
Model saved to ml_model/models/fake_news_model.pkl
```

## 3. Start All Servers (2 min)

**Open 3 terminal windows:**

### Terminal 1 - ML API (Python)
```bash
cd ml_model
python app.py
```

Expected output:
```
Model loaded successfully!
 * Running on http://0.0.0.0:5000
```

### Terminal 2 - Backend API (Node.js)
```bash
npm run server
```

Expected output:
```
Backend API running on port 3001
```

### Terminal 3 - Frontend (Vite)
```bash
npm run dev
```

Expected output:
```
VITE v5.4.8 building for production...
  ➜  Local:   http://localhost:5173/
```

## 4. Open in Browser (1 min)

Open [http://localhost:5173](http://localhost:5173)

You should see:
- Header: "Fake News Detector"
- Input box for news text
- Sample articles (Fake and Real)
- Recent Detections section (empty initially)

## 5. Test It Out

### Test with Samples

1. **Try a FAKE sample:**
   - Click red button under "Fake Examples"
   - See result: "FAKE NEWS DETECTED" with confidence

2. **Try a REAL sample:**
   - Click green button under "Real Examples"
   - See result: "LIKELY AUTHENTIC" with confidence

3. **Check History:**
   - Scroll right sidebar
   - See your analyses listed

### Test with Custom Text

1. Paste any news article in the input box
2. Click "Analyze Article"
3. Get prediction + confidence score

## Troubleshooting

### "Cannot connect to server"

✓ Check all 3 servers are running
```bash
# Terminal 1: ML server on 5000
curl http://localhost:5000/health

# Terminal 2: Backend on 3001
curl http://localhost:3001/api/health

# Terminal 3: Frontend on 5173
curl http://localhost:5173
```

### "Failed to load samples"

✓ Backend can't reach frontend
- Check `VITE_API_URL=http://localhost:3001` in `.env`
- Restart backend server

### "Prediction failed"

✓ Backend can't reach ML API
- Check `ML_API_URL=http://localhost:5000` in `.env`
- Verify ML server is running
- Check ML server logs for Python errors

### Flask won't start

✓ Python dependencies missing
```bash
pip install -r ml_model/requirements.txt
python -c "import sklearn; print(sklearn.__version__)"
```

## Project Structure

```
project/
├── src/                    # Frontend (React)
│   ├── components/
│   │   ├── DetectionInput.tsx    # Input form
│   │   ├── ResultCard.tsx         # Results display
│   │   └── History.tsx            # Detection history
│   └── App.tsx
│
├── ml_model/              # ML API (Python/Flask)
│   ├── app.py             # Flask server
│   ├── train_model.py     # Model training
│   ├── models/
│   │   └── fake_news_model.pkl
│   └── requirements.txt
│
├── server.js              # Backend API (Express)
└── package.json
```

## Architecture

```
Browser (React App)
    ↓
Backend (Express + Node.js)
    ├→ Supabase (Database)
    └→ ML API (Flask + Python)
```

## What Each Server Does

| Server | Port | Purpose |
|--------|------|---------|
| Frontend (Vite) | 5173 | React UI |
| Backend (Express) | 3001 | API + Database |
| ML (Flask) | 5000 | Predictions |

## API Requests Flow

1. User analyzes article in browser
2. Frontend sends text to `http://localhost:3001/api/detect`
3. Backend receives request
4. Backend forwards to `http://localhost:5000/predict`
5. ML returns prediction + confidence
6. Backend saves to Supabase
7. Backend returns to frontend
8. Frontend displays result

## Next Steps

- [ ] Understand the code
- [ ] Modify sample articles in `server.js`
- [ ] Retrain model with custom data
- [ ] Deploy to Vercel + Render (see DEPLOYMENT.md)
- [ ] Add to your portfolio

## Common Tasks

### Add More Sample Articles

Edit `server.js`:

```javascript
const sampleNews = {
  fake: [
    "Your fake news here...",
    "Another fake news...",
  ],
  real: [
    "Your real news here...",
    "Another real news...",
  ],
};
```

Restart backend: `npm run server`

### Improve Model Accuracy

Edit `ml_model/train_model.py`:

1. Get larger dataset from Kaggle
2. Update `fake_news_samples` and `real_news_samples` lists
3. Run: `python ml_model/train_model.py`
4. Restart ML server: `python ml_model/app.py`

### Change Colors/Styling

Edit component files in `src/components/`:
- `ResultCard.tsx` - Result styling
- `DetectionInput.tsx` - Input form styling
- `History.tsx` - History list styling

Uses Tailwind CSS - modify `className` attributes.

### Check Model Performance

```bash
python ml_model/train_model.py
# Shows: Training Accuracy: 0.9333 (93.33%)
```

## Useful Commands

```bash
# Install dependencies
npm install
pip install -r ml_model/requirements.txt

# Train model
python ml_model/train_model.py

# Start backend
npm run server

# Start frontend dev
npm run dev

# Build frontend for production
npm run build

# Check services health
curl http://localhost:5000/health
curl http://localhost:3001/api/health

# View Supabase data (if CLI installed)
supabase db pull
```

## Before Deploying

1. Test all 3 servers locally
2. Verify detection works (fake & real samples)
3. Check history is saving to database
4. Run `npm run build` (should complete without errors)

## Deployment

When ready to deploy:

1. Follow DEPLOYMENT.md
2. Deploy ML API to Render
3. Deploy Backend to Render
4. Deploy Frontend to Vercel
5. Update environment variables
6. Test in production

## Key Files to Know

| File | Purpose |
|------|---------|
| `server.js` | Express API backend |
| `ml_model/app.py` | Flask ML API |
| `src/App.tsx` | Main React component |
| `.env` | Environment variables |
| `package.json` | Node dependencies |

## Learning Resources

- React Hooks: https://react.dev/reference/react
- Express.js: https://expressjs.com/
- Flask: https://flask.palletsprojects.com/
- scikit-learn: https://scikit-learn.org/

## Still Stuck?

1. Check error messages in terminal
2. View browser console (F12 → Console)
3. Check service logs
4. Read README.md for detailed info
5. Check GitHub issues

---

**Ready?** Start with the 3 servers and open http://localhost:5173

Enjoy! 🚀
