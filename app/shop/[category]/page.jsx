"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { endPoints, BASE_API_URL } from "@/config";
import { Loader2 } from "lucide-react";

export default function ShopPage() {
  const { category: urlCategory } = useParams();
  const [categories, setCategories] = useState(["All"]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(decodeURIComponent(urlCategory || "All"));
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch all categories for the filter
      const catRes = await fetch(endPoints.categories());
      const catJson = await catRes.json();
      if (catJson.successful) {
        setCategories(["All", ...catJson.data.map(c => c.name)]);
      }

      // Fetch products based on activeCategory
      let prodUrl = endPoints.products;
      if (activeCategory !== "All") {
        prodUrl = endPoints.categories(`/${encodeURIComponent(activeCategory)}`);
        // Note: The config says products by category is endPoints.products + /category
        // Let's check config.js again
      }

      const prodRes = await fetch(activeCategory === "All" ? endPoints.products : `${endPoints.products}/${encodeURIComponent(activeCategory)}`);
      const prodJson = await prodRes.json();

      if (prodJson.successful) {
        setProducts(prodJson.data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Fetch shop data error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeCategory]);

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Breadcrumb */}
      <div className="w-screen mx-auto px-4 pt-6 pb-6 bg-gray-900">
        <nav className="text-sm flex items-center gap-2 text-gray-500">
          <button onClick={() => router.push("/")} className="hover:text-emerald-700 transition">الرئيسية</button>
          <span>/</span>
          <span className="text-white font-medium">المتجر</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="bg-gray-900 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-2">المتجر</h1>
        <p className="text-gray-300">
          {activeCategory === "All" ? "اختر ستايلك من أحدث المنتجات" : `تصفح منتجات قسم ${activeCategory}`}
        </p>
      </section>

      {/* Categories Filter */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                router.push(`/shop/${encodeURIComponent(cat)}`);
              }}
              className={`px-5 py-2 rounded-full border transition
                ${activeCategory === cat
                  ? "bg-emerald-700 text-white border-emerald-700"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-4">
            <Loader2 className="animate-spin text-emerald-700" size={40} />
            <span>جاري تحميل المنتجات...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                onClick={() =>
                  router.push(`/shop/item/${product._id}`)
                }
                className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer group hover:shadow-lg transition"
              >
                <img
                  src={product.images && product.images.length > 0 ? `${BASE_API_URL}${product.images[0]}` : "https://placehold.co/400x300?text=" + product.title}
                  alt={product.title}
                  className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.target.src = "https://placehold.co/400x300?text=" + product.title }}
                />

                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {product.title}
                  </h3>
                  <p className="text-emerald-700 font-bold">
                    {product.price} جنيه
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <p className="text-center text-gray-500 mt-12">
            لا توجد منتجات في هذا القسم
          </p>
        )}
      </section>
    </main>
  );
}
