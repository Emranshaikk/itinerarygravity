import Link from 'next/link';
import { ChevronRight, Home } from '@/components/Icons';

interface Props {
    items: {
        label: string;
        href?: string;
    }[];
}

export default function Breadcrumbs({ items }: Props) {
    return (
        <nav aria-label="Breadcrumb" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--gray-400)' }}>
            <Link href="/" style={{ color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Home size={14} />
                <span>Home</span>
            </Link>

            {items.map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ChevronRight size={14} />
                    {item.href ? (
                        <Link href={item.href} style={{ color: 'var(--gray-400)' }}>
                            {item.label}
                        </Link>
                    ) : (
                        <span style={{ color: 'var(--foreground)', fontWeight: 600 }}>{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
