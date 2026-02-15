"use client";

import { useEffect, useState } from "react";

export default function EnvTestPage() {
    const [envInfo, setEnvInfo] = useState<any>(null);

    useEffect(() => {
        const info = {
            supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
            supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'EXISTS' : 'MISSING',
            allEnvKeys: Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC'))
        };
        setEnvInfo(info);
        console.log('Environment Variables Check:', info);
    }, []);

    return (
        <div style={{ padding: '40px', fontFamily: 'monospace' }}>
            <h1>Environment Variables Test</h1>
            <pre style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
                {JSON.stringify(envInfo, null, 2)}
            </pre>
            <p>Check the browser console for more details.</p>
        </div>
    );
}
