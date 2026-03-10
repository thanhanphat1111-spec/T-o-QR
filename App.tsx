import React, { useState } from 'react';
import { InputCard } from './components/InputCard';
import { QRResult } from './components/QRResult';
import { parseLocationWithGemini } from './services/geminiService';
import { Map } from 'lucide-react';

const App: React.FC = () => {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [qrNote, setQrNote] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (input: string, note: string) => {
    setLoading(true);
    setError(null);
    setQrUrl(null);
    setQrNote(note);

    try {
      // Basic validation: if it looks like a URL already, use it directly
      // to save time and API calls.
      const isUrl = /^(http|https):\/\/[^ "]+$/.test(input);
      const isGoogleMaps = input.includes('maps.app.goo.gl') || input.includes('google.com/maps');

      if (isUrl && isGoogleMaps) {
        setQrUrl(input);
      } else {
        // If it's coordinates, text, or non-standard format, ask Gemini to normalize it
        const parsedUrl = await parseLocationWithGemini(input);
        setQrUrl(parsedUrl);
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi xử lý dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQrUrl(null);
    setQrNote('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="bg-white p-3 rounded-2xl shadow-md">
             <Map className="h-10 w-10 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-2">
          GeoQR Generator
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Chuyển đổi liên kết Google Maps hoặc tọa độ bất kỳ thành mã QR ngay lập tức.
        </p>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {qrUrl ? (
          <QRResult url={qrUrl} note={qrNote} onReset={handleReset} />
        ) : (
          <InputCard onGenerate={handleGenerate} isLoading={loading} />
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-gray-400">
        <p>Được hỗ trợ bởi Google Gemini AI để xử lý tọa độ thông minh.</p>
      </div>
    </div>
  );
};

export default App;