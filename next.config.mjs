/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "useful-marmot-47.convex.cloud",
            }
        ]
    }
};

export default nextConfig;
