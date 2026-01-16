"use client";

import { useSiteConfig } from "../../../contexts/siteConfigContext";
import blogs from "../../../config/blogs.json";
import "./blog.css";

import Link from "next/link";
import Image from "next/image";

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
      <h1 className=" mb-8">
        {config.blogPage?.header ||
          "Ta en titt på det nyeste vi har skrevet, og bla deg bakover i tid."}
      </h1>

      <ul className="grid gap-4 xl:gap-8 md:grid-cols-2 xl:grid-cols-3">
        {sortedBlogs.map((blog) => (
          <li key={blog.id}>
            <Link href={`/blog/${blog.slug}`}>
              <h2
                className={`mt-4 font-bold text-lg ${
                  isMinel ? "text-[#1C0E52]" : "text-white"
                }`}
              >
                {blog.nb.title}
              </h2>
              <div className="relative w-full h-64 rounded-2xl overflow-hidden">
                <Image
                  fill
                  src={blog.image}
                  alt={blog.nb.title}
                  className="object-cover"
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
