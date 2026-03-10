import React, { useState } from 'react';
import { MapPin, ArrowRight, Loader2, Link as LinkIcon, FileText } from 'lucide-react';

interface InputCardProps {
  onGenerate: (input: string, note: string) => void;
  isLoading: boolean;
}

export const InputCard: React.FC<InputCardProps> = ({ onGenerate, isLoading }) => {
  const [inputText, setInputText] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onGenerate(inputText.trim(), note.trim());
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-lg mx-auto transform transition-all hover:shadow-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-full">
          <MapPin className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Tạo QR Địa Điểm</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Liên kết Maps hoặc Tọa độ
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
              <LinkIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="location"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="VD: 12,67238° B, 108,03217° Đ hoặc link maps..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
            Ghi chú (Tùy chọn)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              id="note"
              rows={3}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder="VD: Tên chủ hộ: Nguyễn Văn A&#10;SĐT: 0912 345 678&#10;Địa chỉ: Số 10, Ngõ 5..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Thông tin này sẽ được tích hợp vào mã QR khi quét.
          </p>
        </div>

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white transition-all duration-200
            ${!inputText.trim() || isLoading 
              ? 'bg-blue-300 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-95'
            }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
              Đang xử lý...
            </>
          ) : (
            <>
              Tạo Mã QR
              <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};