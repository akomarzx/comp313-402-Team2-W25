/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "", // Set the base path to /recipe
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.themealdb.com",
        port: "",
        pathname: "**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "fakeimg.pl",
        port: "",
        pathname: "**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "ronaldjro.dev",
        port: "",
        pathname: "**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "kitchen-companion-team-2.s3.amazonaws.com",
        port: "",
        pathname: "**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
