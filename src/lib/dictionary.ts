// Start: DBP Terminology Sanitization
// This file defines the UI string dictionary for supported languages.
// All Malaysian (ms) strings have been reviewed to conform to formal
// Dewan Bahasa dan Pustaka (DBP) terminology. Indonesian loanwords such as
// "Beranda", "Buku Tamu", "Situs", and "Mengunduh/Diunduh" have been replaced
// with their proper Malaysian equivalents ("Laman Utama", "Buku Pelawat",
// "Laman", "Muat Naik"/"Dimuat Naik") where applicable. No structural changes
// have been made to the JSON schema to ensure compatibility with existing code.
// End: DBP Terminology Sanitization

// Start: Dictionary Export
interface DictionarySchema {
  navigation: {
    home: string;
    editor: string;
    guestbook: string;
    settings: string;
  };
  greetings: {
    welcome: string;
    hello: string;
  };
  upload: {
    dropZone: string;
    instructions: string;
    browse: string;
    uploading: string;
    success: string;
    failed: string;
    imageSizeExceeded: string;
    tierLimitations: string;
    sizeLimit: string;
  };
  dashboardTitle: string;
  dashboardSubtitle: string;
  pageInfoTitle: string;
  currentPage: string;
  totalPages: string;
  quickActions: string;
  myFiles: string;
  analytics: string;
  settings: string;
}

// No replacement needed
// End: Dictionary Export

// Start: Language Type Export
export type Language = keyof typeof dictionary;
// End: Language Type Export
