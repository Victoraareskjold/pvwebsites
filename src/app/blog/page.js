"use client";
import { useSiteConfig } from "@/contexts/siteConfigContext";
import blogs from "../../config/blogs.json";
import "./blog.css";

import Link from "next/link";

export default function Blog() {
  const config = useSiteConfig();

  return (
    <section className="py-24 bg-black p-4 min-h-screen">
      <h1 className="text-white mb-8">
        {config.blogPage?.header ||
          "Ta en titt på det nyeste vi har skrevet, og bla deg bakover i tid."}
      </h1>
      <ul className="grid gap-4 xl:gap-8 md:grid-cols-2 xl:grid-cols-3 ">
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            className="relative w-full h-64 rounded-2xl overflow-hidden"
            href={`/blog/${blog.slug}`}
          >
            <div className="absolute bg-black bg-opacity-50 h-full w-full"></div>
            <img src={blog.image} className="h-full w-full object-cover" />
            <h2 className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold">
              {blog.nb.title}
            </h2>
          </Link>
        ))}
      </ul>
    </section>
  );
}
