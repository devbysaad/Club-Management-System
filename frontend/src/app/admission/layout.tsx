import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admissions | Join Pato Hornets Academy',
    description: 'Apply to join Pato Hornets Football Academy. Submit your application for professional youth football training and development programs.',
    openGraph: {
        title: 'Join Pato Hornets Football Academy',
        description: 'Start your football journey with us. Apply now for our elite training programs.',
    },
};

export default function AdmissionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
