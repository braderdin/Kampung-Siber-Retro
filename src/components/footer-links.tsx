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

  // Start: Sectioned Footer Link Configuration (label matches href)
  const sections: FooterSection[] = [
    {
      title: t.dashboardTitle,
      links: [
        { name: t.dashboardTitle, href: '/dashboard' },
        { name: 'Directory', href: '/directory' },
        { name: t.guestbookTitle, href: '/guestbook' },
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
        { name: 'About', href: '/about' },
        { name: 'Donate', href: '/donate' },
        { name: 'CLI', href: '/cli' },
        { name: 'Press', href: '/press' },
        { name: 'Status', href: '/status' },
        { name: 'Terms', href: '/terms' },
        { name: 'Contact', href: '/contact' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Themes', href: '/themes' },
        { name: 'Sitemap', href: '/sitemap' },
      ],
    },
  ];
  // End: Sectioned Footer Link Configuration

  return sections;
}
// End: FooterLinks Data Provider