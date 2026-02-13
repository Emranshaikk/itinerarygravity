"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "@/components/Icons";

export default function HeroSearch() {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/explore?search=${encodeURIComponent(query)}`);
        } else {
            router.push('/explore');
        }
    };

    return (
        <form
            onSubmit={handleSearch}
            className="glass"
            style={{
                maxWidth: '600px',
                margin: '0 auto 48px auto',
                padding: '8px',
                borderRadius: '16px',
                display: 'flex',
                gap: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
            }}
        >
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                <MapPin size={20} style={{ position: 'absolute', left: '16px', color: 'var(--primary)' }} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Where do you want to go?"
                    style={{
                        width: '100%',
                        padding: '16px 16px 16px 48px',
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        fontSize: '1.1rem',
                        outline: 'none'
                    }}
                />
            </div>
            <button
                type="submit"
                className="btn btn-primary"
                style={{
                    padding: '0 32px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                <Search size={20} />
                <span className="hidden-mobile">Search</span>
            </button>
        </form>
    );
}
