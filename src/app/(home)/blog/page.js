"use client";
import { useSiteConfig } from "../../../contexts/siteConfigContext";
import blogs from "../../../config/blogs.json";
import "./blog.css";

import Link from "next/link";
import Image from "next/image";

export default function Blog() {
  const config = useSiteConfig();

  const filteredBlogs = blogs.filter((blog) => {
    if (config.name !== "alfaelektro" && blog.id === 12) {
      return false;
    }
    return true;
  });

  const sortedBlogs = filteredBlogs.sort((a, b) => b.id - a.id);

  return (
    <section className="py-24 bg-black p-4 min-h-screen">
      <h1 className="text-white mb-8">
        {config.blogPage?.header ||
          "Ta en titt på det nyeste vi har skrevet, og bla deg bakover i tid."}
      </h1>
      <ul className="grid gap-4 xl:gap-8 md:grid-cols-2 xl:grid-cols-3 ">
        {sortedBlogs.map((blog) => (
          <Link
            key={blog.id}
            className="relative w-full h-64 rounded-2xl overflow-hidden"
            href={`/blog/${blog.slug}`}
          >
            <Image
              fill
              src={blog.image}
              alt={blog.title || "Blogg bilde"}
              className="object-cover text-white"
            />
            <h2 className="mt-2 text-white font-bold">{blog.nb.title}</h2>
          </Link>
        ))}
      </ul>
    </section>
  );
}
