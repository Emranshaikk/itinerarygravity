export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ paddingTop: '20px' }}>
            {children}
        </div>
    );
}
