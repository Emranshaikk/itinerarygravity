import { withAuth } from "next-auth/middleware";

export default withAuth(
    function middleware(req) {
        // Allows request to proceed
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/checkout/:path*",
        "/api/checkout/:path*",
    ]
};
