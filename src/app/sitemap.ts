import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const updatedAt = new Date();

  return ["/", "/projects", "/freelancers", "/login", "/register"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: updatedAt,
    changeFrequency: path === "/" ? "weekly" : "daily",
    priority: path === "/" ? 1 : 0.7
  }));
}
