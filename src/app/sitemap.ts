import { MetadataRoute } from "next";

const BASE = "https://blogoai.thissidemayur.me";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    
  ];
}
