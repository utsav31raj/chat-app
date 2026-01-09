# Documentation Index

Quick reference guide to all project documentation.

## Getting Started

Start here if you're new to the project:

1. **[QUICKSTART.md](./QUICKSTART.md)** - Get running locally in 5 minutes
2. **[README.md](./README.md)** - Comprehensive project guide
3. **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - High-level overview

## Development

Setup, customization, and local development:

- **[QUICKSTART.md](./QUICKSTART.md)** - Local development setup
- **[README.md](./README.md#local-development)** - Detailed setup instructions
- **[ml_model/README.md](./ml_model/README.md)** - ML model details
- **[.env.example](./.env.example)** - Environment variables template

## Deployment

Deploy to production on Vercel, Render, and Supabase:

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Step-by-step deployment guide
- **[render.yaml](./render.yaml)** - Render service configuration
- **[README.md](./README.md#deployment)** - Deployment overview

## API Reference

Frontend and backend API documentation:

- **[README.md](./README.md#api-endpoints)** - Complete API endpoints
  - POST `/api/detect` - Analyze news
  - GET `/api/history` - Detection history
  - GET `/api/samples` - Sample articles
  - POST `/predict` - ML prediction

## Code Structure

Understanding the codebase:

```
project/
├── src/                      # Frontend (React)
│   ├── components/
│   │   ├── DetectionInput.tsx    # Input form + samples
│   │   ├── ResultCard.tsx         # Results display
│   │   └── History.tsx            # Recent detections
│   ├── App.tsx               # Main component
│   └── main.tsx              # Entry point
│
├── ml_model/                 # ML Model (Python)
│   ├── app.py                # Flask API server
│   ├── train_model.py        # Model training
│   └── models/
│       └── fake_news_model.pkl
│
├── server.js                 # Backend API (Express)
├── package.json              # Node dependencies
└── .env                      # Environment variables
```

**Frontend Components:**
- `DetectionInput.tsx` - Input form with sample articles
- `ResultCard.tsx` - Result display with confidence score
- `History.tsx` - Detection history sidebar

**Backend Files:**
- `server.js` - Express API server with 4 endpoints
- `ml_model/app.py` - Flask REST API for predictions
- `ml_model/train_model.py` - Model training script

## Common Tasks

### Setup & First Run
See: **[QUICKSTART.md](./QUICKSTART.md)**

### Deploy to Production
See: **[DEPLOYMENT.md](./DEPLOYMENT.md)**

### Improve Model Accuracy
See: **[ml_model/README.md](./ml_model/README.md#improve-accuracy)**

### Customize Sample Articles
See: **[README.md](./README.md#project-structure)**
Edit: `server.js` line 35-51

### Add Custom Features
See: **[QUICKSTART.md](./QUICKSTART.md#common-tasks)**

### Troubleshoot Issues
See: **[QUICKSTART.md](./QUICKSTART.md#troubleshooting)** or **[README.md](./README.md#troubleshooting)**

## Architecture

### System Design
```
React App (Frontend)
    ↓
Express API (Backend)
    ├→ Supabase (Database)
    └→ Flask (ML Model)
```

See: **[README.md](./README.md#architecture)** or **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md#architecture-diagram)**

### Data Flow
1. User inputs news article in React app
2. Frontend sends to Express backend
3. Backend validates and forwards to Flask ML API
4. Flask returns prediction + confidence
5. Backend saves to Supabase
6. Frontend displays result

### File Organization
```
Frontend:   src/components/ + App.tsx
Backend:    server.js
ML Model:   ml_model/app.py + train_model.py
Database:   Supabase (PostgreSQL)
```

## Technology Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Vite for bundling

### Backend
- Node.js + Express
- Supabase JS client
- CORS for cross-origin requests

### ML
- Python 3.8+
- Flask web framework
- scikit-learn (TF-IDF + Logistic Regression)
- Gunicorn for production

### Database
- Supabase (PostgreSQL)
- Row Level Security (RLS)

See: **[README.md](./README.md#tech-stack)** or **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md#technology-stack)**

## Environment Variables

### Local Development
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:3001
ML_API_URL=http://localhost:5000
```

### Production
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=https://fake-news-backend-xxx.onrender.com
ML_API_URL=https://fake-news-ml-xxx.onrender.com
```

See: **[.env.example](./.env.example)**

## Endpoints Reference

### Express Backend (Node.js)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health` | Health check |
| POST | `/api/detect` | Analyze news |
| GET | `/api/history?limit=20` | Get detections |
| GET | `/api/samples` | Get samples |

### Flask ML API (Python)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | Health check |
| POST | `/predict` | Get prediction |

See: **[README.md](./README.md#api-endpoints)**

## Learning Resources

### Understanding the System
1. Read [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
2. Follow [QUICKSTART.md](./QUICKSTART.md)
3. Review [ml_model/README.md](./ml_model/README.md)

### Machine Learning
- TF-IDF: [scikit-learn docs](https://scikit-learn.org/stable/modules/feature_extraction.html#tfidf-term-weighting)
- Logistic Regression: [scikit-learn docs](https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression)
- Model training: [ml_model/README.md](./ml_model/README.md#how-it-works)

### Backend Development
- Express.js: [expressjs.com](https://expressjs.com/)
- Flask: [flask.palletsprojects.com](https://flask.palletsprojects.com/)
- Supabase: [supabase.com/docs](https://supabase.com/docs)

### Frontend Development
- React: [react.dev](https://react.dev/)
- TypeScript: [typescriptlang.org](https://www.typescriptlang.org/)
- Tailwind CSS: [tailwindcss.com](https://tailwindcss.com/)

## Interview Preparation

### Key Points to Discuss
- Full-stack development (React, Node.js, Python)
- Machine learning pipeline (TF-IDF + Logistic Regression)
- Microservices architecture
- Database design with RLS policies
- Deployment on serverless platforms
- Performance optimization
- Error handling and validation

See: **[README.md](./README.md#interview-talking-points)** or **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md#interview-talking-points)**

### Demo Script
1. Show frontend (QUICKSTART.md)
2. Analyze a fake sample → shows "FAKE NEWS DETECTED"
3. Analyze a real sample → shows "LIKELY AUTHENTIC"
4. Show history updates
5. Explain architecture (3 services)
6. Talk about ML model (TF-IDF + Logistic Regression)

## Troubleshooting Guide

### Can't Start Servers
- Check all servers running on correct ports
- See: **[QUICKSTART.md](./QUICKSTART.md#troubleshooting)**

### Model/Prediction Errors
- Check ML model trained
- See: **[ml_model/README.md](./ml_model/README.md#troubleshooting)**

### Database Connection Issues
- Verify environment variables
- See: **[README.md](./README.md#troubleshooting)**

### Deployment Problems
- See: **[DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting)**

## File Reference

### Documentation Files
| File | Purpose |
|------|---------|
| [README.md](./README.md) | Comprehensive guide (main doc) |
| [QUICKSTART.md](./QUICKSTART.md) | Get running in 5 minutes |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Production deployment steps |
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | High-level overview |
| [DOCS_INDEX.md](./DOCS_INDEX.md) | This file |
| [.env.example](./.env.example) | Environment variables template |
| [ml_model/README.md](./ml_model/README.md) | ML model documentation |

### Configuration Files
| File | Purpose |
|------|---------|
| [package.json](./package.json) | Node.js dependencies |
| [.env](./.env) | Environment variables (not in git) |
| [vite.config.ts](./vite.config.ts) | Vite configuration |
| [tailwind.config.js](./tailwind.config.js) | Tailwind CSS config |
| [tsconfig.json](./tsconfig.json) | TypeScript configuration |
| [render.yaml](./render.yaml) | Render deployment config |

### Source Code
| Location | Purpose |
|----------|---------|
| [src/](./src/) | Frontend React app |
| [src/components/](./src/components/) | React components |
| [ml_model/](./ml_model/) | Python ML model |
| [server.js](./server.js) | Express backend |

## Quick Commands

```bash
# Setup
npm install
pip install -r ml_model/requirements.txt
python ml_model/train_model.py

# Development
npm run server              # Start backend
cd ml_model && python app.py # Start ML API
npm run dev                 # Start frontend

# Production
npm run build               # Build frontend
# Deploy to Vercel, Render, Supabase (see DEPLOYMENT.md)

# Testing
curl http://localhost:5000/health    # ML health
curl http://localhost:3001/api/health # Backend health
curl http://localhost:5173           # Frontend
```

## Next Steps

1. **Read QUICKSTART.md** - Get running locally
2. **Understand the architecture** - See PROJECT_SUMMARY.md
3. **Deploy to production** - Follow DEPLOYMENT.md
4. **Improve the model** - See ml_model/README.md
5. **Add to portfolio** - Use PROJECT_SUMMARY.md talking points

## Support

- **Questions?** Check the README.md
- **Can't setup?** See QUICKSTART.md troubleshooting
- **Deploy issues?** See DEPLOYMENT.md
- **ML questions?** See ml_model/README.md
- **Code issues?** Check GitHub issues

---

**Happy building!** 🚀

Start with [QUICKSTART.md](./QUICKSTART.md) to get running in 5 minutes.
