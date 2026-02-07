"use client";

import { useEffect, useState } from "react";

export default function DiagnosticPage() {
    const [status, setStatus] = useState<any>({
        url: "checking...",
        urlLength: 0,
        key: "checking...",
        keyLength: 0,
        keyStart: "",
        keyEnd: "",
    });

    useEffect(() => {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "NOT FOUND";
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "NOT FOUND";

        setStatus({
            url: url,
            urlLength: url.length,
            key: key === "NOT FOUND" ? "NOT FOUND" : "FOUND",
            keyLength: key.length,
            keyStart: key.substring(0, 5),
            keyEnd: key.substring(key.length - 5),
        });
    }, []);

    return (
        <div style={{ padding: '40px', color: 'white', background: '#111', minHeight: '100vh', fontFamily: 'monospace' }}>
            <h1 style={{ color: '#00ff00' }}>Supabase Diagnostic Tool</h1>
            <div style={{ background: '#222', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
                <p><strong>Supabase URL:</strong> {status.url}</p>
                <p><strong>URL Length:</strong> {status.urlLength}</p>
                <hr style={{ borderColor: '#444' }} />
                <p><strong>Anon Key Status:</strong> {status.key}</p>
                <p><strong>Key Length:</strong> {status.keyLength}</p>
                <p><strong>Key Starts With:</strong> {status.keyStart}</p>
                <p><strong>Key Ends With:</strong> {status.keyEnd}</p>
            </div>

            <div style={{ marginTop: '20px', color: '#888' }}>
                <p>Note: If you see "NOT FOUND" or unexpected lengths, it means the environment variables are not being correctly loaded into the browser client.</p>
                <p>Current Workspace Root Issue detected in logs? <strong>Yes</strong></p>
            </div>
        </div>
    );
}
