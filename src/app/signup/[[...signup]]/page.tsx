import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SignupPage() {
    return (
        <div className="container" style={{
            minHeight: 'calc(100vh - 80px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: '80px',
            paddingTop: '40px',
            background: 'radial-gradient(circle at center, rgba(112,0,255,0.05) 0%, transparent 70%)'
        }}>
            <SignUp
                routing="path"
                path="/signup"
                signInUrl="/login"
                appearance={{
                    baseTheme: dark,
                    elements: {
                        card: "glass",
                        headerTitle: "text-gradient",
                        formButtonPrimary: "btn btn-primary",
                        footerActionLink: "text-primary",
                    },
                    variables: {
                        colorPrimary: '#ff00e5',
                    }
                }}
            />
        </div>
    );
}
