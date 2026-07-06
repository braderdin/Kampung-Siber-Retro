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
  },
};

export type Language = keyof typeof dictionary;
