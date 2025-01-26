import { headers } from "next/headers";
import blogs from "../../../../config/blogs.json";
import "../blog.css";

export default async function BlogPost({ params }) {
  const { slug } = params;

  // Hent headers for å finne site-config
  const headersList = headers();
  const siteConfig = headersList.get("x-site-config");

  // Bestem språk basert på domenet
  //const language = siteConfig === "vestelektro" ? "nn" : "nb";
  const language = siteConfig === "vestelektro" ? "nb" : "nb";

  // Finn riktig blogg basert på slug
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    return <div className="py-24 min-h-screen px-4">Blogg ikke funnet</div>;
  }

  // Hent innhold for riktig språk
  const content = blog[language];

  if (!content || !content.html) {
    return (
      <div className="py-24 min-h-screen px-4">
        Ingen innhold funnet for valgt språk
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white justify-center flex pb-12">
      <div className="max-w-6xl w-full">
        {blog.image ? (
          <div className="relative overflow-hidden">
            <img
              className="w-full aspect-video object-cover"
              src={blog.image}
              alt={content.title || "Blogg bilde"}
            />
            <div className="blackFade2"></div>
            <div className="blackFade3"></div>
            <div className="blackFade4"></div>
          </div>
        ) : (
          <div className="py-8"></div>
        )}
        <div className="px-12 mt-12">
          <h1 className="text-center text-3xl mb-6">
            {content.title || "Ingen tittel"}
          </h1>
          {/* Sett inn HTML-innhold dynamisk */}
          <div
            className="blogContent"
            dangerouslySetInnerHTML={{ __html: content.html }}
          ></div>
        </div>
      </div>
    </div>
  );
}
