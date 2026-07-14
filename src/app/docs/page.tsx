// Start: Bento Marketing Docs Hub (Phase 1 - about/tutorials/supporter/donate/cli/press/terms/contact)
import BentoGrid, { BentoCard } from "@/components/ui/BentoGrid";
import NeonButton from "@/components/ui/NeonButton";

const DOCS_LINKS = [
  { title: "Tentang", href: "/about", icon: "📖", desc: "Misi, nilai, dan sejarah Kampung Siber Retro.", accent: "cyan" as const },
  { title: "Tutorial", href: "/tutorials", icon: "🎓", desc: "Modul latihan membina laman web retro.", accent: "volt" as const },
  { title: "Penyokong", href: "/supporter", icon: "🏆", desc: "Papan pemuka dan dewan kemasyhuran penyumbang.", accent: "magenta" as const },
  { title: "Derma", href: "/donate", icon: "💝", desc: "Sokong pelayan melalui pakej sumbangan.", accent: "cyan" as const },
  { title: "CLI", href: "/cli", icon: "⌨️", desc: "Alat baris arahan untuk penempatan laman.", accent: "volt" as const },
  { title: "Akhbar", href: "/press", icon: "📰", desc: "Siaran media dan bahan jenama.", accent: "magenta" as const },
  { title: "Terma", href: "/terms", icon: "📜", desc: "Syarat perkhidmatan platform.", accent: "cyan" as const },
  { title: "Hubungi", href: "/contact", icon: "📧", desc: "Sokongan dan saluran komuniti.", accent: "volt" as const },
  { title: "Privasi", href: "/privacy", icon: "🔒", desc: "Dasar perlindungan data warga.", accent: "magenta" as const },
  { title: "Status", href: "/status", icon: "📡", desc: "Pemantauan kesihatan sistem masa nyata.", accent: "cyan" as const },
  { title: "Peta Laman", href: "/sitemap", icon: "🗺️", desc: "Peta navigasi penuh platform.", accent: "volt" as const },
  { title: "Tema", href: "/themes", icon: "🎨", desc: "Terokai gaya visual neon sedia ada.", accent: "magenta" as const },
];

export default function DocsHubPage() {
  return (
    <main className="min-h-screen bg-[#060814] text-gray-100 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-pixel text-cyan-300 tracking-wide">Dokumentasi & Pusat Maklumat</h1>
          <p className="text-sm text-gray-400 mt-1">Semua halaman panduan, dasar, dan sumber komuniti dalam satu susun atur bento premium.</p>
        </header>

        <BentoGrid>
          {DOCS_LINKS.map((link) => (
            <BentoCard
              key={link.href}
              title={link.title}
              description={link.desc}
              icon={link.icon}
              href={link.href}
              accent={link.accent}
            />
          ))}
          <div className="md:col-span-2 rounded-xl border border-cyan-500/30 bg-[#0e1330]/80 p-5 flex flex-col gap-3 justify-center">
            <h3 className="font-pixel text-cyan-200">Mulakan Penciptaan Anda</h3>
            <p className="text-sm text-gray-400">Terus ke papan pemuka atau terokai hab komuniti untuk berinteraksi dengan warga lain.</p>
            <div className="flex flex-wrap gap-2">
              <a href="/dashboard"><NeonButton size="sm" variant="primary">🏠 Papan Pemuka</NeonButton></a>
              <a href="/hub"><NeonButton size="sm" variant="secondary">🌐 Hab Komuniti</NeonButton></a>
            </div>
          </div>
        </BentoGrid>
      </div>
    </main>
  );
}
// End: Bento Marketing Docs Hub