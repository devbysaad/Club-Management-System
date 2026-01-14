import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Shop | Official Pato Hornets Merchandise',
    description: 'Shop official Pato Hornets Football Academy jerseys, training gear, and merchandise. Custom sizing available for all players.',
    openGraph: {
        title: 'Pato Hornets Online Shop',
        description: 'Get your official academy gear - jerseys, training kits, and more.',
    },
};

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
