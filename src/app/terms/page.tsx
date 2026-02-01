import Link from "next/link";

export default function TermsOfService() {
    return (
        <div className="container" style={{ maxWidth: '900px', padding: '60px 20px' }}>
            <header style={{ marginBottom: '48px', textAlign: 'center' }}>
                <h1 className="text-gradient" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '16px' }}>
                    Terms of Service
                </h1>
                <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>
                    Last Updated: February 1, 2026
                </p>
            </header>

            <div className="glass card" style={{ padding: 'clamp(24px, 5vw, 48px)' }}>
                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '16px', color: 'var(--foreground)' }}>
                        1. Acceptance of Terms
                    </h2>
                    <p style={{ color: 'var(--gray-400)', lineHeight: '1.8', marginBottom: '16px' }}>
                        By accessing and using ItineraryGravity ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                    </p>
                </section>

                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '16px', color: 'var(--foreground)' }}>
                        2. Use License
                    </h2>
                    <p style={{ color: 'var(--gray-400)', lineHeight: '1.8', marginBottom: '16px' }}>
                        Permission is granted to temporarily download one copy of the materials (itineraries, guides, or information) on ItineraryGravity for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                    </p>
                    <ul style={{ color: 'var(--gray-400)', lineHeight: '1.8', marginLeft: '24px', marginBottom: '16px' }}>
                        <li>Modify or copy the materials</li>
                        <li>Use the materials for any commercial purpose or for any public display</li>
                        <li>Attempt to reverse engineer any software contained on ItineraryGravity</li>
                        <li>Remove any copyright or other proprietary notations from the materials</li>
                        <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '16px', color: 'var(--foreground)' }}>
                        3. Creator Responsibilities
                    </h2>
                    <p style={{ color: 'var(--gray-400)', lineHeight: '1.8', marginBottom: '16px' }}>
                        As a creator on ItineraryGravity, you agree to:
                    </p>
                    <ul style={{ color: 'var(--gray-400)', lineHeight: '1.8', marginLeft: '24px', marginBottom: '16px' }}>
                        <li>Provide accurate, truthful, and verified information in your itineraries</li>
                        <li>Own or have the rights to all content you upload</li>
                        <li>Not engage in fraudulent or misleading practices</li>
                        <li>Maintain the quality and accuracy of your published itineraries</li>
                        <li>Comply with all applicable laws and regulations</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '16px', color: 'var(--foreground)' }}>
                        4. Payment and Refunds
                    </h2>
                    <p style={{ color: 'var(--gray-400)', lineHeight: '1.8', marginBottom: '16px' }}>
                        <strong>Platform Commission:</strong> ItineraryGravity retains a 30% commission on all itinerary sales. Creators receive 70% of the sale price.
                    </p>
                    <p style={{ color: 'var(--gray-400)', lineHeight: '1.8', marginBottom: '16px' }}>
                        <strong>Verification Fee:</strong> The monthly verification fee of $9.99 is non-refundable and grants access to selling features and the verified badge.
                    </p>
                    <p style={{ color: 'var(--gray-400)', lineHeight: '1.8', marginBottom: '16px' }}>
                        <strong>Refund Policy:</strong> Digital itinerary purchases are generally non-refundable. Refunds may be issued at our discretion in cases of technical issues, duplicate purchases, or if the content significantly differs from its description.
                    </p>
                </section>

                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '16px', color: 'var(--foreground)' }}>
                        5. Intellectual Property
                    </h2>
                    <p style={{ color: 'var(--gray-400)', lineHeight: '1.8', marginBottom: '16px' }}>
                        All content published on ItineraryGravity, including but not limited to text, graphics, logos, images, and software, is the property of ItineraryGravity or its content creators and is protected by international copyright laws.
                    </p>
                    <p style={{ color: 'var(--gray-400)', lineHeight: '1.8', marginBottom: '16px' }}>
                        By uploading content, creators grant ItineraryGravity a worldwide, non-exclusive, royalty-free license to use, reproduce, and display the content for the purpose of operating and promoting the platform.
                    </p>
                </section>

                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '16px', color: 'var(--foreground)' }}>
                        6. User Conduct
                    </h2>
                    <p style={{ color: 'var(--gray-400)', lineHeight: '1.8', marginBottom: '16px' }}>
                        You agree not to:
                    </p>
                    <ul style={{ color: 'var(--gray-400)', lineHeight: '1.8', marginLeft: '24px', marginBottom: '16px' }}>
                        <li>Violate any laws or regulations</li>
                        <li>Infringe on the rights of others</li>
                        <li>Distribute spam, viruses, or malicious code</li>
                        <li>Attempt to gain unauthorized access to the platform</li>
                        <li>Harass, abuse, or harm other users</li>
                        <li>Impersonate any person or entity</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '16px', color: 'var(--foreground)' }}>
                        7. Disclaimer
                    </h2>
                    <p style={{ color: 'var(--gray-400)', lineHeight: '1.8', marginBottom: '16px' }}>
                        The materials on ItineraryGravity are provided on an 'as is' basis. ItineraryGravity makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                    </p>
                    <p style={{ color: 'var(--gray-400)', lineHeight: '1.8', marginBottom: '16px' }}>
                        ItineraryGravity does not guarantee the accuracy, completeness, or usefulness of any itinerary information. Travel is undertaken at your own risk.
                    </p>
                </section>

                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '16px', color: 'var(--foreground)' }}>
                        8. Limitations
                    </h2>
                    <p style={{ color: 'var(--gray-400)', lineHeight: '1.8', marginBottom: '16px' }}>
                        In no event shall ItineraryGravity or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on ItineraryGravity, even if ItineraryGravity or an authorized representative has been notified orally or in writing of the possibility of such damage.
                    </p>
                </section>

                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '16px', color: 'var(--foreground)' }}>
                        9. Account Termination
                    </h2>
                    <p style={{ color: 'var(--gray-400)', lineHeight: '1.8', marginBottom: '16px' }}>
                        We reserve the right to terminate or suspend your account and access to the platform immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms of Service.
                    </p>
                </section>

                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '16px', color: 'var(--foreground)' }}>
                        10. Changes to Terms
                    </h2>
                    <p style={{ color: 'var(--gray-400)', lineHeight: '1.8', marginBottom: '16px' }}>
                        ItineraryGravity reserves the right to revise these terms of service at any time without notice. By using this platform, you are agreeing to be bound by the then-current version of these terms of service.
                    </p>
                </section>

                <section style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '16px', color: 'var(--foreground)' }}>
                        11. Governing Law
                    </h2>
                    <p style={{ color: 'var(--gray-400)', lineHeight: '1.8', marginBottom: '16px' }}>
                        These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                    </p>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '16px', color: 'var(--foreground)' }}>
                        12. Contact Information
                    </h2>
                    <p style={{ color: 'var(--gray-400)', lineHeight: '1.8', marginBottom: '16px' }}>
                        If you have any questions about these Terms of Service, please contact us at{' '}
                        <Link href="/contact" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                            our contact page
                        </Link>.
                    </p>
                </section>
            </div>

            <div style={{ marginTop: '48px', textAlign: 'center' }}>
                <Link href="/" className="btn btn-outline">
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
