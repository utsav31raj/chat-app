import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { DetectionInput } from './components/DetectionInput';
import { ResultCard } from './components/ResultCard';
import { History } from './components/History';

interface DetectionResult {
  prediction: 'fake' | 'real';
  confidence: number;
  id?: string;
}

interface Detection {
  id: string;
  text: string;
  prediction: 'fake' | 'real';
  confidence: number;
  created_at: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [result, setResult] = useState<(DetectionResult & { text: string }) | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [samples, setSamples] = useState<{ fake: string[]; real: string[] } | null>(null);
  const [history, setHistory] = useState<Detection[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load samples on mount
    loadSamples();
    loadHistory();
  }, []);

  const loadSamples = async () => {
    try {
      const res = await fetch(`${API_URL}/api/samples`);
      const data = await res.json();
      if (data.success) {
        setSamples(data);
      }
    } catch (err) {
      console.error('Failed to load samples:', err);
    }
  };

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/history?limit=20`);
      const data = await res.json();
      if (data.success) {
        setHistory(data.data || []);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleDetect = async (text: string) => {
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/detect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (data.success) {
        setResult({
          prediction: data.prediction,
          confidence: data.confidence,
          text,
          id: data.id,
        });

        // Refresh history
        loadHistory();
      } else {
        setError(data.error || 'Detection failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleClick = (text: string) => {
    handleDetect(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Fake News Detector</h1>
          </div>
          <p className="text-slate-600">
            Analyze articles to detect misinformation using AI
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <DetectionInput
                onDetect={handleDetect}
                isLoading={isLoading}
                onSampleClick={handleSampleClick}
                samples={samples}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {result && (
              <ResultCard result={result} onClose={() => setResult(null)} />
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <History
                detections={history}
                isLoading={historyLoading}
                onRefresh={loadHistory}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-slate-600 text-sm">
          <p>
            This tool uses machine learning (TF-IDF + Logistic Regression) to detect
            misinformation.
          </p>
          <p className="mt-2">
            Always cross-verify with reliable news sources for accuracy.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
