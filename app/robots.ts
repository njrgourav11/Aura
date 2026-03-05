import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/dashboard", "/api/", "/(auth)/", "/portal/"],
            },
        ],
        sitemap: "https://www.freelanceos.app/sitemap.xml",
        host: "https://www.freelanceos.app",
    };
}
