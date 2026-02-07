"use client";

import { useEffect, useState } from "react";

export default function DiagnosticPage() {
    const [status, setStatus] = useState<any>({
        url: "checking...",
        key: "checking...",
        keyLength: 0,
    });

    useEffect(() => {
        setStatus({
            url: process.env.NEXT_PUBLIC_SUPABASE_URL || "NOT FOUND",
            key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "FOUND (hidden for security)" : "NOT FOUND",
            keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
        });
    }, []);

    return (
        <div style={{ padding: '20px', color: 'white', background: '#000' }}>
            <h1>Supabase Diagnostic</h1>
            <pre>{JSON.stringify(status, null, 2)}</pre>
        </div>
    );
}
