import { AlertTriangle, CheckCircle, X } from 'lucide-react';

interface DetectionResult {
  prediction: 'fake' | 'real';
  confidence: number;
  text?: string;
}

interface ResultCardProps {
  result: DetectionResult;
  onClose: () => void;
}

export function ResultCard({ result, onClose }: ResultCardProps) {
  const isFake = result.prediction === 'fake';
  const confidencePercent = Math.round(result.confidence * 100);

  return (
    <div className="bg-white rounded-lg shadow-lg border-l-4 border-l-blue-500 overflow-hidden">
      <div className="flex items-start justify-between p-6">
        <div className="flex items-start gap-4 flex-1">
          {isFake ? (
            <div className="flex-shrink-0">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          ) : (
            <div className="flex-shrink-0">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          )}

          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  isFake
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {isFake ? 'FAKE NEWS DETECTED' : 'LIKELY AUTHENTIC'}
              </span>
            </h3>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-600 mb-2">Confidence Score</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isFake ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${confidencePercent}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-slate-700 w-12">
                    {confidencePercent}%
                  </span>
                </div>
              </div>

              {result.text && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Analyzed Text:</p>
                  <p className="text-sm text-slate-600 line-clamp-2 italic">
                    "{result.text}"
                  </p>
                </div>
              )}

              <div
                className={`mt-4 p-3 rounded text-sm ${
                  isFake
                    ? 'bg-red-50 text-red-700'
                    : 'bg-green-50 text-green-700'
                }`}
              >
                {isFake
                  ? 'This content shows characteristics common to misinformation. Verify with reliable sources.'
                  : 'This content appears consistent with authentic journalism. Always cross-check with multiple sources.'}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
