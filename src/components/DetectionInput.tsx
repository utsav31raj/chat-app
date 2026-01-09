import { useState } from 'react';
import { Send, Loader, AlertCircle } from 'lucide-react';

interface DetectionInputProps {
  onDetect: (text: string) => void;
  isLoading: boolean;
  onSampleClick: (text: string) => void;
  samples: { fake: string[]; real: string[] } | null;
}

export function DetectionInput({
  onDetect,
  isLoading,
  onSampleClick,
  samples,
}: DetectionInputProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    if (text.trim().length < 10) {
      setError('Text must be at least 10 characters');
      return;
    }

    onDetect(text.trim());
  };

  const handleSampleClick = (sample: string) => {
    setText(sample);
    setError('');
    onSampleClick(sample);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="news-text" className="block text-sm font-semibold text-slate-700 mb-3">
            Enter News Text to Analyze
          </label>
          <textarea
            id="news-text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setError('');
            }}
            placeholder="Paste the news article here or try a sample below..."
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            rows={4}
            disabled={isLoading}
          />
          {error && (
            <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-400 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Analyze Article
            </>
          )}
        </button>
      </form>

      {samples && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-600">Try Sample Articles:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <p className="text-xs font-medium text-red-600 uppercase tracking-wide">
                Fake Examples
              </p>
              {samples.fake.map((sample, index) => (
                <button
                  key={`fake-${index}`}
                  onClick={() => handleSampleClick(sample)}
                  disabled={isLoading}
                  className="w-full text-left px-3 py-2 bg-red-50 hover:bg-red-100 disabled:opacity-50 border border-red-200 rounded text-xs text-red-700 transition line-clamp-2"
                  title={sample}
                >
                  {sample}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-green-600 uppercase tracking-wide">
                Real Examples
              </p>
              {samples.real.map((sample, index) => (
                <button
                  key={`real-${index}`}
                  onClick={() => handleSampleClick(sample)}
                  disabled={isLoading}
                  className="w-full text-left px-3 py-2 bg-green-50 hover:bg-green-100 disabled:opacity-50 border border-green-200 rounded text-xs text-green-700 transition line-clamp-2"
                  title={sample}
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
