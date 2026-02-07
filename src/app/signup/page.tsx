import AuthForm from "@/components/auth/AuthForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function SignupPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        redirect("/dashboard");
    }

    return (
        <div className="container" style={{
            minHeight: 'calc(100vh - 80px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: '80px',
            background: 'radial-gradient(circle at center, rgba(255,0,122,0.05) 0%, transparent 70%)'
        }}>
            <AuthForm mode="signup" />
        </div>
    );
}
