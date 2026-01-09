import { AlertTriangle, CheckCircle, Loader, RefreshCw } from 'lucide-react';

interface Detection {
  id: string;
  text: string;
  prediction: 'fake' | 'real';
  confidence: number;
  created_at: string;
}

interface HistoryProps {
  detections: Detection[];
  isLoading: boolean;
  onRefresh: () => void;
}

export function History({ detections, isLoading, onRefresh }: HistoryProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Recent Detections</h2>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-100 disabled:opacity-50 rounded transition"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="text-sm">Refresh</span>
        </button>
      </div>

      {isLoading && detections.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
            <p className="text-slate-600">Loading history...</p>
          </div>
        </div>
      ) : detections.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
          <p className="text-slate-500">
            No detections yet. Analyze an article to see it appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {detections.map((detection) => (
            <div
              key={detection.id}
              className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex items-start gap-3">
                {detection.prediction === 'fake' ? (
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        detection.prediction === 'fake'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {detection.prediction === 'fake' ? 'FAKE' : 'REAL'}
                    </span>
                    <span className="text-xs text-slate-500">
                      {Math.round(detection.confidence * 100)}% confidence
                    </span>
                    <span className="text-xs text-slate-400 ml-auto">
                      {formatTime(detection.created_at)}
                    </span>
                  </div>

                  <p className="text-sm text-slate-700 line-clamp-2">
                    {detection.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
