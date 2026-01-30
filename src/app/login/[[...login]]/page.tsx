import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function LoginPage() {
    return (
        <div className="container" style={{
            minHeight: 'calc(100vh - 80px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: '80px',
            background: 'radial-gradient(circle at center, rgba(255,0,122,0.05) 0%, transparent 70%)'
        }}>
            <SignIn
                routing="path"
                path="/login"
                signUpUrl="/signup"
                appearance={{
                    baseTheme: dark,
                    elements: {
                        card: "glass",
                        headerTitle: "text-gradient",
                        formButtonPrimary: "btn btn-primary",
                        footerActionLink: "text-primary",
                        identityPreviewText: "text-white",
                    },
                    variables: {
                        colorPrimary: '#ff00e5',
                    }
                }}
            />
        </div>
    );
}
