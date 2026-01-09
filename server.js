/**
 * Fake News Detection Backend API
 *
 * This server handles:
 * 1. Forwarding detection requests to Python ML API
 * 2. Storing detection results in Supabase
 * 3. Retrieving detection history
 *
 * Endpoints:
 * POST /api/detect - Analyze news text
 * GET /api/history - Get recent detections
 * GET /api/samples - Get sample news for testing
 */

import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Python ML API URL
const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5000';

// Sample news data for testing
const sampleNews = {
  fake: [
    "SHOCKING: Government secretly replacing citizens with robots using 5G towers",
    "Doctors HATE this one weird trick that cures all diseases naturally",
    "Celebrity reveals she's been an alien spy all along in shocking confession",
    "Scientists discover that the moon is actually made of cheese",
    "Billionaire admits to controlling world economy through secret meetings",
  ],
  real: [
    "New study published in Nature shows breakthrough in renewable energy technology",
    "Global markets show stability as economic indicators improve quarter over quarter",
    "University researchers announce discovery of new antibiotic effective against resistant bacteria",
    "Tech company releases annual report showing 15% growth in user engagement",
    "Environmental agency reports significant improvement in air quality metrics",
  ],
};

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'fake-news-detection-api' });
});

/**
 * POST /api/detect
 * Analyze news text for authenticity
 *
 * Request body:
 * {
 *   "text": "news article text here"
 * }
 *
 * Returns:
 * {
 *   "prediction": "fake" or "real",
 *   "confidence": 0.95,
 *   "id": "uuid"
 * }
 */
app.post('/api/detect', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length < 10) {
      return res.status(400).json({
        error: 'Please provide at least 10 characters of text',
        success: false,
      });
    }

    // Call Python ML API for prediction
    const mlResponse = await fetch(`${ML_API_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.trim() }),
    });

    if (!mlResponse.ok) {
      throw new Error(`ML API error: ${mlResponse.statusText}`);
    }

    const mlResult = await mlResponse.json();

    if (!mlResult.success) {
      return res.status(400).json({
        error: mlResult.error || 'Prediction failed',
        success: false,
      });
    }

    // Store result in Supabase
    const { data, error: dbError } = await supabase
      .from('detections')
      .insert([
        {
          text: text.trim(),
          prediction: mlResult.prediction,
          confidence: mlResult.confidence,
        },
      ])
      .select('id')
      .maybeSingle();

    if (dbError) {
      console.error('Database error:', dbError);
      // Still return prediction even if storage fails
      return res.json({
        prediction: mlResult.prediction,
        confidence: mlResult.confidence,
        success: true,
        storageError: true,
      });
    }

    res.json({
      prediction: mlResult.prediction,
      confidence: mlResult.confidence,
      id: data?.id,
      success: true,
    });
  } catch (error) {
    console.error('Detection error:', error);
    res.status(500).json({
      error: error.message || 'Detection failed',
      success: false,
    });
  }
});

/**
 * GET /api/history
 * Retrieve recent detection results
 *
 * Query params:
 * ?limit=20 - Number of recent detections to fetch
 *
 * Returns array of detections with id, text, prediction, confidence, timestamp
 */
app.get('/api/history', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    const { data, error } = await supabase
      .from('detections')
      .select('id, text, prediction, confidence, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    res.json({
      data: data || [],
      success: true,
    });
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch history',
      success: false,
    });
  }
});

/**
 * GET /api/samples
 * Get sample news articles for testing
 *
 * Returns object with 'fake' and 'real' arrays of sample texts
 */
app.get('/api/samples', (req, res) => {
  res.json({
    fake: sampleNews.fake,
    real: sampleNews.real,
    success: true,
  });
});

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    success: false,
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend API running on port ${PORT}`);
  console.log(`ML API endpoint: ${ML_API_URL}`);
  console.log(`Supabase: ${supabaseUrl}`);
});
