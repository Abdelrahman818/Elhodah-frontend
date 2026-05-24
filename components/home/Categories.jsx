"use client";

import { endPoints, BASE_API_URL } from "@/config";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchDemoCategories, getDemoImageSrc, isDemoMode } from "@/lib/demoMode";

export default function Categories() {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      if (isDemoMode) {
        const demoCategories = await fetchDemoCategories();
        setCategories(demoCategories);
        return;
      }

      const res = await fetch(endPoints.categories());
      const json = await res.json();
      setCategories(json.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        اكتشف الأقسام
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {categories.length > 0 && categories?.map((cat) => (
          <Link
            key={cat._id}
            href={`/shop/${encodeURIComponent(cat.name)}`}
            className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer"
          >
            <img
              src={isDemoMode ? getDemoImageSrc(cat.imgUrl) : `${BASE_API_URL}${cat.imgUrl}`}
              alt={cat.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => { e.target.src = "https://placehold.co/400x300?text=" + cat.name }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-white text-lg font-semibold">
                {cat.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
