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
        <div style={{ position: 'relative', overflow: 'hidden', minHeight: 'calc(100vh - 80px)' }}>
            {/* Animated Mesh Gradient Background (Matches Explore Page) */}
            <div className="mesh-gradient-animate" style={{
                position: 'absolute',
                top: '-10%',
                left: '-10',
                width: '120%',
                height: '500px',
                zIndex: -1,
                opacity: 0.3,
                filter: 'blur(100px)',
                background: `
                    radial-gradient(at 0% 0%, rgba(255, 133, 162, 0.4) 0px, transparent 50%),
                    radial-gradient(at 50% 0%, rgba(139, 92, 246, 0.4) 0px, transparent 50%),
                    radial-gradient(at 100% 0%, rgba(59, 130, 246, 0.4) 0px, transparent 50%)
                `
            }}></div>

            <div className="container" style={{
                minHeight: 'calc(100vh - 80px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingBottom: '80px',
                position: 'relative'
            }}>
                <AuthForm mode="signup" />
            </div>
        </div>
    );
}
