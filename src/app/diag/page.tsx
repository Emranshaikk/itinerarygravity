"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DiagnosticPage() {
    const [status, setStatus] = useState<any>({
        url: "checking...",
        keyStatus: "checking...",
        testResult: "not started...",
    });

    const supabase = createClient();

    useEffect(() => {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "NOT FOUND";
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "NOT FOUND";

        setStatus((prev: any) => ({
            ...prev,
            url: url,
            keyStatus: key === "NOT FOUND" ? "NOT FOUND" : `FOUND (${key.length} chars)`,
        }));

        async function testSupabase() {
            try {
                // Try a simple health check or fetch session
                const { data, error } = await supabase.auth.getSession();
                if (error) {
                    setStatus((prev: any) => ({ ...prev, testResult: `Auth Error: ${error.message} (Code: ${error.code})` }));
                } else {
                    setStatus((prev: any) => ({ ...prev, testResult: "Auth Check Passed: Connection established." }));
                }

                // Try to fetch from a presumably public table
                const { error: dbError } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
                if (dbError) {
                    console.log("DB Test Error:", dbError);
                    setStatus((prev: any) => ({ ...prev, dbTestResult: `DB Error: ${dbError.message} (Is RLS blocking?)` }));
                } else {
                    setStatus((prev: any) => ({ ...prev, dbTestResult: "DB Check Passed: API Key is valid for database access." }));
                }
            } catch (err: any) {
                setStatus((prev: any) => ({ ...prev, testResult: `Fatal Error: ${err.message}` }));
            }
        }

        testSupabase();
    }, []);

    return (
        <div style={{ padding: '40px', color: 'white', background: '#111', minHeight: '100vh', fontFamily: 'monospace' }}>
            <h1 style={{ color: '#00ff00' }}>Supabase Advanced Diagnostic</h1>
            <div style={{ background: '#222', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
                <p><strong>Supabase URL:</strong> {status.url}</p>
                <p><strong>Anon Key Status:</strong> {status.keyStatus}</p>
                <hr style={{ borderColor: '#444' }} />
                <p><strong>Auth Test Result:</strong> <span style={{ color: status.testResult.includes('Passed') ? '#00ff00' : '#ff4444' }}>{status.testResult}</span></p>
                <p><strong>DB Test Result:</strong> <span style={{ color: status.dbTestResult?.includes('Passed') ? '#00ff00' : '#ffaa44' }}>{status.dbTestResult}</span></p>
            </div>

            <div style={{ marginTop: '20px', color: '#888' }}>
                <p>If Auth Check says "Invalid API key", the key in your .env.local does not match this project URL.</p>
                <p>If Auth Check passes but DB fails, your key is valid but the table might be locked by RLS.</p>
            </div>
        </div>
    );
}
