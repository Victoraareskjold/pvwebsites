"use client";

/**
 * Bloggoversikten.
 *
 * Artikler, nettadresser og datakilde er uendret (src/config/blogs.json);
 * bare visningen er ny. Nyeste artikkel vises som et bredt kort øverst,
 * resten som kort i rutenett (3 / 2 / 1 kolonner).
 */

import Link from "next/link";
import { useSiteConfig } from "../../../contexts/siteConfigContext";
import blogs from "../../../config/blogs.json";
import { ArrowRight, Sun } from "../../../components/design/icons";

function excerpt(text, length) {
  if (!text) return "";
  const clean = text.trim();
  if (clean.length <= length) return clean;
  return `${clean.slice(0, clean.lastIndexOf(" ", length) || length).trim()} …`;
}

export default function Blog() {
  const config = useSiteConfig();
  if (!config) return null;

  const language = config.language || "nb";

  const posts = blogs
    // Artikkel 12 er skrevet for Alfa Elektro og vises bare der (som før).
    .filter((blog) => (blog.id === 12 ? config.site === "alfaelektrosol" : true))
    .sort((a, b) => b.id - a.id)
    .map((blog) => ({
      ...blog,
      title: blog[language]?.title || blog.nb?.title || "",
    }));

  const [featured, ...rest] = posts;

  return (
    <main id="main" className="ds blog-page">
      <section className="section">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                <Sun size={16} />
                KUNNSKAP OG INSPIRASJON
              </span>
              <h2>{config.blogPage?.header2 || "Artikler om solenergi"}</h2>
            </div>
            <p>
              {config.blogPage?.header ||
                "Ta en titt på det nyeste vi har skrevet, og bla deg bakover i tid."}
            </p>
          </div>

          {featured && (
            <Link className="blog-feature" href={`/blog/${featured.slug}`}>
              <div className="blog-media">
                {featured.image ? (
                  <img src={featured.image} alt="" loading="lazy" />
                ) : (
                  <span className="blog-media-empty">
                    <Sun size={34} />
                  </span>
                )}
              </div>
              <div className="blog-feature-copy">
                <span className="blog-tag">NYESTE ARTIKKEL</span>
                <h3>{featured.title}</h3>
                <p>{excerpt(featured.description, 260)}</p>
                <span className="blog-more">
                  Les mer
                  <ArrowRight size={17} />
                </span>
              </div>
            </Link>
          )}

          <div className="blog-grid">
            {rest.map((blog) => (
              <Link className="blog-card" key={blog.id} href={`/blog/${blog.slug}`}>
                <div className="blog-media">
                  {blog.image ? (
                    <img src={blog.image} alt="" loading="lazy" />
                  ) : (
                    <span className="blog-media-empty">
                      <Sun size={28} />
                    </span>
                  )}
                </div>
                <h3>{blog.title}</h3>
                <p>{excerpt(blog.description, 140)}</p>
                <span className="blog-more">
                  Les mer
                  <ArrowRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
