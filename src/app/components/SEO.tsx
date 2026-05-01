import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export function SEO({ 
  title = "Digital Prokashoni | ডিজিটাল প্রকাশনী - আপনার লেখনীর ডিজিটাল সাথী",
  description = "বাংলাদেশের আধুনিক ডিজিটাল প্রকাশনী প্ল্যাটফর্ম। সরাসরি বই প্রকাশ করুন এবং পাঠকদের কাছে পৌঁছে দিন।",
  keywords = "ডিজিটাল প্রকাশনী, ডিজিটাল বই, বই প্রকাশ, ইবুক, রয়্যালটি, লেখক, পাঠক, বাংলা বই",
  image = "https://your-domain.com/og-image.png",
  url = "https://your-domain.com",
  type = "website"
}: SEOProps) {
  useEffect(() => {
    // Update Title
    const baseTitle = "Digital Prokashoni";
    document.title = title.includes(baseTitle) ? title : `${title} | ${baseTitle}`;

    // Helper to update/create meta tags
    const updateMeta = (name: string, content: string, attr: "name" | "property" = "name") => {
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    updateMeta("description", description);
    updateMeta("keywords", keywords);

    // Open Graph
    updateMeta("og:title", title, "property");
    updateMeta("og:description", description, "property");
    updateMeta("og:image", image, "property");
    updateMeta("og:url", url, "property");
    updateMeta("og:type", type, "property");

    // Twitter
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", title);
    updateMeta("twitter:description", description);
    updateMeta("twitter:image", image);

  }, [title, description, keywords, image, url, type]);

  return null;
}
