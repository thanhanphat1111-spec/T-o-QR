export interface ParsedLocation {
  url: string;
  originalInput: string;
  isAIProcessed: boolean;
}

export interface QRState {
  value: string;
  loading: boolean;
  error: string | null;
}

export enum GeminiModel {
  FLASH = 'gemini-2.5-flash'
}
