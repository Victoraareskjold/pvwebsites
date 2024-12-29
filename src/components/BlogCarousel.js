"use client";
import { useSiteConfig } from "@/contexts/siteConfigContext";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import Link from "next/link";
import blogs from "../config/blogs.json";

export default function BlogCarousel() {
  const config = useSiteConfig();

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 2,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 767, min: 464 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  return (
    <div className="w-full">
      <Carousel
        responsive={responsive}
        autoPlay={true}
        autoPlaySpeed={5000}
        infinite={true}
        showDots={true}
        swipeable={true}
        draggable={true}
        dotListClass="custom-dot-list-style"
        containerClass="carousel-container pb-12"
        itemClass="carousel-item"
        arrows={false}
      >
        {blogs.map((blog, index) => (
          <div key={index} className="p-4">
            <Link
              href={`/blog/${blog.slug}`}
              className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden max-w-2xl"
            >
              <img
                className="h-48 w-full object-cover"
                src={blog.image}
                alt={blog.title}
              />
              <div
                className="p-4 h-48 bg-regularOrange text-black"
                style={{ background: config.primary || "white" }}
              >
                <h3 className="line-clamp-2 mb-2">{blog.title}</h3>
                <h4 className="opacity-70 line-clamp-4">{blog.description}</h4>
              </div>
            </Link>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
