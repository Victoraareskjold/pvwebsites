import { TwoButtonComponent } from "@/components/TwoButtonComponent";
import blogs from "../../../config/blogs.json";
import "../blog.css";

// Gjør komponenten asynkron
export default async function BlogPost({ params }) {
  // Vent på params
  const { slug } = await params;

  // Finn bloggen basert på slug
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    return <div className="py-24 min-h-screen px-4">Blogg ikke funnet</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white justify-center flex">
      <div className="max-w-6xl w-full">
        {blog.image ? (
          <div className="relative">
            <img className="w-full" src={blog.image} alt={blog.title} />
            <div className="blackFade2"></div>
            <div className="blackFade3"></div>
            <div className="blackFade4"></div>
          </div>
        ) : (
          <div className="py-8"></div>
        )}
        <div className="px-12 mt-4">
          {blog.title ? <h3 className="text-center">{blog.title}</h3> : null}
          {blog.description ? <h2>{blog.description}</h2> : null}

          {blog.subtitle1 ? <p>{blog.subtitle1}</p> : null}
          {blog.paragraph1 ? <p>{blog.paragraph1}</p> : null}

          {blog.subtitle2 ? <p>{blog.subtitle2}</p> : null}
          {blog.paragraph2 ? <p>{blog.paragraph2}</p> : null}

          {blog.subtitle3 ? <p>{blog.subtitle3}</p> : null}
          {blog.paragraph3 ? <p>{blog.paragraph3}</p> : null}

          {blog.subtitle4 ? <p>{blog.subtitle4}</p> : null}
          {blog.paragraph4 ? <p>{blog.paragraph4}</p> : null}

          {blog.subtitle5 ? <p>{blog.subtitle5}</p> : null}
          {blog.paragraph5 ? <p>{blog.paragraph5}</p> : null}

          <TwoButtonComponent />
        </div>
      </div>
    </div>
  );
}
