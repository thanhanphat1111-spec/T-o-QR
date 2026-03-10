export const parseLocationWithGemini = async (input: string): Promise<string> => {
  try {
    const response = await fetch('/api/parse-location', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Lỗi kết nối đến máy chủ');
    }

    return data.url;
    
  } catch (error) {
    console.error("API Error:", error);
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(input)}`;
  }
};
