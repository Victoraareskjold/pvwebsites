// app/blog/[slug]/page.tsx
import { headers } from "next/headers";
import blogs from "../../../../config/blogs.json";
import BlogPostClient from "./BlogPostClient";

export default async function BlogPost({ params }) {
  const { slug } = await params;

  const headersList = await headers();
  const siteConfig = headersList.get("x-site-config");

  const language = siteConfig === "vestelektrosol" ? "nb" : "nb";

  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    return <div className="py-24 min-h-screen px-4">Blogg ikke funnet</div>;
  }

  const content = blog[language];

  if (!content || !content.html) {
    return (
      <div className="py-24 min-h-screen px-4">
        Ingen innhold funnet for valgt språk
      </div>
    );
  }

  return <BlogPostClient blog={blog} content={content} />;
}
