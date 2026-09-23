"use client";

/**
 * Artikkelvisning. Innholdet er uendret – bare innrammingen følger
 * designmalen, slik at artikkelen ser ut som resten av nettsiden.
 */

import Link from "next/link";
import "../blog.css";
import { OfferButton } from "../../../../components/design/Shell";
import { ContactSection } from "../../../../components/design/Sections";
import { ArrowLeft } from "../../../../components/design/icons";

export default function BlogPostClient({ blog, content }) {
  return (
    <main id="main" className="ds article-page">
      <article className="section">
        <div className="wrap article-wrap">
          <Link className="breadcrumb" href="/blog">
            <ArrowLeft size={15} />
            Alle artikler
          </Link>

          <h1>{content.title || "Ingen tittel"}</h1>

          {blog.image && (
            <div className="article-media">
              <img src={blog.image} alt="" />
            </div>
          )}

          <div
            className="blogContent"
            dangerouslySetInnerHTML={{ __html: content.html }}
          />

          <div className="article-cta">
            <OfferButton />
          </div>
        </div>
      </article>

      <ContactSection />
    </main>
  );
}
