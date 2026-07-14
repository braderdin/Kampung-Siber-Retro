// Start: Footer Link Registry with Correct Label/Href Mapping
"use client";

import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';

export interface FooterLink {
  name: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

// Start: FooterLinks Data Provider
export default function FooterLinks(): FooterSection[] {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;

  // Start: Sectioned Footer Link Configuration (consolidated hubs)
  const sections: FooterSection[] = [
    {
      title: t.dashboardTitle,
      links: [
        { name: t.dashboardTitle, href: '/dashboard' },
        { name: 'Hab Komuniti', href: '/hub' },
        { name: 'Dokumentasi', href: '/docs' },
      ],
    },
    {
      title: t.settings,
      links: [
        { name: t.settings, href: '/settings' },
        { name: t.myFiles, href: '/site_files' },
        { name: t.fileEditor, href: '/site_files/text_editor' },
      ],
    },
    {
      title: 'Community',
      links: [
        { name: 'Tentang', href: '/about' },
        { name: 'Penyokong', href: '/supporter' },
        { name: 'Derma', href: '/donate' },
        { name: 'Tutorial', href: '/tutorials' },
        { name: 'CLI', href: '/cli' },
        { name: 'Akhbar', href: '/press' },
        { name: 'Status', href: '/status' },
        { name: 'Terma', href: '/terms' },
        { name: 'Hubungi', href: '/contact' },
        { name: 'Privasi', href: '/privacy' },
        { name: 'Tema', href: '/themes' },
        { name: 'Peta Laman', href: '/sitemap' },
      ],
    },
  ];
  // End: Sectioned Footer Link Configuration

  return sections;
}
// End: FooterLinks Data Provider