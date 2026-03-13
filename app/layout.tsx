import type {Metadata} from 'next';
import { DM_Sans, Syne, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'CSE Career Compass | Professional Tech Roadmaps for Students',
  description: 'Navigate your Computer Science career with expert-curated roadmaps, skill guides, and industry insights. Master Web Dev, AI, Cloud, and more.',
  keywords: ['Computer Science', 'Career Roadmap', 'Tech Career', 'Software Engineering', 'AI Roadmap', 'Web Development', 'Cloud Computing', 'Cybersecurity'],
  authors: [{ name: 'CSE Career Compass Team' }],
  openGraph: {
    title: 'CSE Career Compass | Professional Tech Roadmaps',
    description: 'Expert-curated roadmaps and career guidance for Computer Science students.',
    type: 'website',
    url: 'https://csecareercompass.com',
    siteName: 'CSE Career Compass',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CSE Career Compass | Professional Tech Roadmaps',
    description: 'Expert-curated roadmaps and career guidance for Computer Science students.',
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${syne.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning className="font-sans bg-[#0a1628] text-white antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
