export const dictionary = {
  en: {
    navigation: {
      home: 'Home',
      editor: 'Editor',
      guestbook: 'Guestbook',
      settings: 'Settings',
    },
    greetings: {
      welcome: 'Welcome',
      hello: 'Hello',
    },
    upload: {
      dropZone: 'Drop your asset here',
      instructions: 'Or click to browse files (Max 25MB per file)',
      browse: 'Browse Files',
      uploading: 'Uploading',
      success: 'has been uploaded successfully',
      failed: 'Failed to upload file. Please try again.',
      imageSizeExceeded: 'Image size exceeds 2MB limit',
      tierLimitations: 'Profile Tier Limitations',
      sizeLimit: 'Individual file uploads are limited to 25MB. For larger assets, consider compression or splitting files.',
    },
  },
  ms: {
    navigation: {
      home: 'Beranda',
      editor: 'Penyunting',
      guestbook: 'Buku Tamu',
      settings: 'Penyetelan',
    },
    greetings: {
      welcome: 'Selamat datang',
      hello: 'Hai',
    },
    upload: {
      dropZone: 'Letakkan aset anda di sini',
      instructions: 'Atau klik untuk semak fail (Max 25MB untuk setiap fail)',
      browse: 'Semak Fail',
      uploading: 'Mengunduh',
      success: 'telah diunduh berjaya',
      failed: 'Gagal mengunduh fail. Sila cuba semula.',
      imageSizeExceeded: 'Saiz fail imej melebihi had 2MB',
      tierLimitations: 'Had Penyenaraian',
      sizeLimit: 'Pengunduhan fail individu dibatasi sehingga 25MB. Untuk aset yang lebih besar, pertimbangkan pemampatan atau memecah fail.',
    },
  },
};

export type Language = keyof typeof dictionary;
