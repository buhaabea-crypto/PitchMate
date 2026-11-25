declare const translations: Record<string, Record<string, string>>;
declare const languageSelect: HTMLSelectElement;
declare let currentLanguage: "en" | "ru" | "kk";
declare function t(key: string): string;
declare function applyTranslations(): void;
declare function playInstrument(instrument: "piano" | "guitar", events: EarAudioEvent[], status: HTMLElement, channel?: string): Promise<number | null>;
declare function stopInstrumentChannel(channel: string): void;
interface Window { trackEvent(name: string, params?: Record<string, string | number>): void; }

interface EarElements {
  earSection: HTMLElement;
  earMode: HTMLSelectElement;
  earDifficulty: HTMLSelectElement;
  earInstrument: HTMLSelectElement;
  earRange: HTMLSelectElement;
  earSpeed: HTMLSelectElement;
  earDirection: HTMLSelectElement;
  earAuto: HTMLInputElement;
  earCents: HTMLInputElement;
  earStart: HTMLButtonElement;
  earReplay: HTMLButtonElement;
  earHintButton: HTMLButtonElement;
  earCheck: HTMLButtonElement;
  earUndo: HTMLButtonElement;
  earClear: HTMLButtonElement;
  earSubmit: HTMLButtonElement;
  earMinus: HTMLButtonElement;
  earPlus: HTMLButtonElement;
  earTarget: HTMLButtonElement;
  earYourNote: HTMLButtonElement;
  earStats: HTMLElement;
  earStorageStatus: HTMLElement;
  earAudioStatus: HTMLElement;
  earDirectionControl: HTMLElement;
  earPitchControls: HTMLElement;
  earDictationControls: HTMLElement;
  earHintText: HTMLElement;
  earQuestion: HTMLElement;
  earAnswers: HTMLElement;
  earFeedback: HTMLElement;
  earCentsValue: HTMLElement;
  earEntered: HTMLElement;
  earKeyboard: HTMLElement;
  earProgressText: HTMLElement;
  earProgress: HTMLElement;
  earProgressBar: HTMLElement;
  earSummary: HTMLElement;
}

interface EarSettings {
  mode: EarMode;
  difficulty: EarDifficulty;
  instrument: "piano" | "guitar";
  range: string;
  speed: string;
  direction: EarDirection;
  auto: boolean;
}
interface EarScore { attempts: number; correct: number; streak: number; best: number; }
