import React, { useRef, useMemo } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, ExternalLink, RefreshCw, Info } from 'lucide-react';

interface QRResultProps {
  url: string;
  note?: string;
  onReset: () => void;
}

export const QRResult: React.FC<QRResultProps> = ({ url, note, onReset }) => {
  const qrRef = useRef<HTMLDivElement>(null);

  const qrValue = useMemo(() => {
    if (!note?.trim()) return url;

    // Thay vì nối thẳng vào tọa độ làm hỏng link Maps,
    // ta thêm nó vào dưới dạng tham số phụ (?note=...).
    // Google Maps sẽ chỉ đọc tọa độ và bỏ qua tham số này,
    // nhưng người dùng vẫn sẽ thấy ghi chú trên màn hình quét QR.
    const cleanNote = note.trim().replace(/\s+/g, '-');
    const separator = url.includes('?') ? '&' : '?';
    
    return `${url}${separator}note=${cleanNote}`;
  }, [url, note]);

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `geo-qr-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-lg mx-auto text-center animate-fade-in-up">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-1">Mã QR của bạn đã sẵn sàng!</h3>
        <a 
          href={qrValue} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-blue-500 hover:text-blue-700 flex items-center justify-center gap-1 truncate max-w-xs mx-auto"
        >
          <span className="truncate">{url}</span> <ExternalLink className="w-3 h-3 flex-shrink-0" />
        </a>
      </div>

      <div className="flex flex-col items-center mb-8 space-y-4">
        <div className="p-4 bg-white border-2 border-gray-100 rounded-xl shadow-sm" ref={qrRef}>
          <QRCodeCanvas
            value={qrValue}
            size={256}
            level={"H"}
            includeMargin={true}
            imageSettings={{
              src: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Google_Maps_icon_2020.svg",
              x: undefined,
              y: undefined,
              height: 40,
              width: 40,
              excavate: true,
            }}
          />
        </div>
        
        {note && (
          <div className="w-full bg-blue-50 border border-blue-100 rounded-lg p-4 text-left">
             <div className="flex items-start">
               <div className="flex-shrink-0 mt-0.5">
                  <Info className="w-5 h-5 text-blue-600" />
               </div>
               <div className="ml-3 w-full">
                  <h4 className="text-sm font-semibold text-blue-800 uppercase tracking-wide mb-1">
                    Ghi chú đã tích hợp
                  </h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {note}
                  </p>
                  <div className="mt-2 text-xs text-blue-600 bg-blue-100 p-2 rounded">
                    <strong>Lưu ý:</strong> Khi quét QR, nội dung ghi chú sẽ hiển thị ở phần cuối của đường link để bạn kiểm tra trước khi bấm mở bản đồ.
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={onReset}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Tạo mới
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-white bg-green-600 hover:bg-green-700 font-medium shadow-md transition-all hover:shadow-lg"
        >
          <Download className="w-4 h-4 mr-2" />
          Tải xuống
        </button>
      </div>
    </div>
  );
};
