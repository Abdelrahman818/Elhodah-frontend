"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { endPoints, BASE_API_URL } from "@/config";
import { fetchDemoFeaturedProducts, getDemoImageSrc, isDemoMode } from "@/lib/demoMode";


export default function Featured() {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  const getFeaturedProducts = async () => {
    try {
      if (isDemoMode) {
        const demoProducts = await fetchDemoFeaturedProducts();
        setProducts(demoProducts);
        return;
      }

      const res = await fetch(endPoints.getFeatured);
      const json = await res.json();
      setProducts(json.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getFeaturedProducts();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* عنوان القسم */}
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">
        المنتجات المميزة
      </h2>

      {/* Grid المنتجات */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {products.length > 0 && products?.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer group"
            onClick={() => router.push(`/shop/item/${product._id}`)}
          >
            {/* صورة المنتج */}
            <div className="relative">
              <img
                src={product.images && product.images.length > 0 ? (isDemoMode ? getDemoImageSrc(product.images) : `${BASE_API_URL}${product.images[0]}`) : "https://placehold.co/400x300?text=" + product.title}
                alt={product.title}
                className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { e.target.src = "https://placehold.co/400x300?text=" + product.title }}
              />
            </div>

            {/* تفاصيل المنتج */}
            <div className="p-4 flex flex-col gap-2">
              <h3 className="text-gray-800 font-semibold text-lg sm:text-xl">
                {product.title}
              </h3>
              <p className="text-emerald-700 font-bold text-md sm:text-lg">
                {product.price} جنيه
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
