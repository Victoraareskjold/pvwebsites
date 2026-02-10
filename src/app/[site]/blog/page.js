"use client";

import { useSiteConfig } from "../../../contexts/siteConfigContext";
import blogs from "../../../config/blogs.json";
import "./blog.css";

import Link from "next/link";

export default function Blog() {
  const config = useSiteConfig();

  if (!config) return <p>Laster...</p>;

  const filteredBlogs = blogs.filter((blog) => {
    if (blog.id === 12) {
      return config.site === "alfaelektrosol";
    }
    return true;
  });

  const sortedBlogs = [...filteredBlogs].sort((a, b) => b.id - a.id);

  const isMinel = config.site === "MinelSol";

  return (
    <section
      className={`py-24 px-4 ${
        isMinel ? "bg-white text-[#1C0E52]" : "bg-black text-white"
      }p-4 min-h-screen`}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className=" mb-8">
          {config.blogPage?.header ||
            "Ta en titt på det nyeste vi har skrevet, og bla deg bakover i tid."}
        </h1>

        <ul className="flex flex-col gap-2 ">
          {sortedBlogs.map((blog) => (
            <li key={blog.id} className="border-b border-slate-200 pb-6">
              <Link href={`/blog/${blog.slug}`}>
                <h2
                  className={`mt-4 h-14 font-bold text-lg ${
                    isMinel ? "text-[#1C0E52]" : "text-white"
                  }`}
                >
                  {blog.nb.title}
                </h2>
                <p
                  className={`line-clamp-2 ${
                    isMinel ? "text-[#1C0E52]" : "text-white"
                  }`}
                >
                  {blog.description.slice(0, 200)}...
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
