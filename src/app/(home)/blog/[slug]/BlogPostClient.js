// app/blog/[slug]/BlogPostClient.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import "../blog.css";

import FormModal from "../../../../components/FormModal";
import { EstimateButton } from "../../../../components/EstimateButton";

export default function BlogPostClient({ blog, content }) {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white justify-center flex pb-12">
      <div className="max-w-6xl w-full">
        {blog.image ? (
          <div className="relative overflow-hidden">
            <div className="w-full aspect-video">
              <Image
                fill
                className="object-cover"
                src={blog.image}
                alt={content.title || "Blogg bilde"}
              />
            </div>
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

          <div
            className="blogContent text-lg flex flex-col gap-4"
            dangerouslySetInnerHTML={{ __html: content.html }}
          />

          <EstimateButton setModalOpen={setModalOpen} />
        </div>
      </div>

      <FormModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
