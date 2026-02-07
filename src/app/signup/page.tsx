import AuthForm from "@/components/auth/AuthForm";

export default function SignupPage() {
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
