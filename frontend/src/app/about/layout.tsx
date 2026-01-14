import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us | Pato Hornets Football Academy',
    description: 'Learn about Pato Hornets Football Academy - our mission, vision, coaching staff, facilities, and commitment to developing young football talent.',
    openGraph: {
        title: 'About Pato Hornets Football Academy',
        description: 'Discover our world-class football training program and meet our expert coaching staff.',
    },
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
