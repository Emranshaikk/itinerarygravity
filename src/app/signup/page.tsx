import AuthForm from "@/components/auth/AuthForm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function SignupPage() {
    const session = await getServerSession(authOptions);

    if (session?.user) {
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
