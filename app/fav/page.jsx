"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Heart } from "lucide-react";
import { useMain } from "@/context/MainContext";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { getDemoImageSrc, isDemoMode } from "@/lib/demoMode";

export default function FavPage() {
  const router = useRouter();
  const { favs, favLoading, getUserFavs, removeFromFav } = useMain();
  const { isLoggedIn } = useUser();

  useEffect(() => {
    if (isLoggedIn) {
      getUserFavs();
    }
  }, [isLoggedIn, getUserFavs]);

  const handleRemoveFav = async (productId) => {
    const result = await removeFromFav(productId);
    if (result.successful) {
      // getUserFavs is already called in removeFromFav
    }
  };

  // Redirect to login if not logged in
  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-gray-50 py-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">يجب تسجيل الدخول</h1>
          <Link
            href="/auth/login"
            className="text-emerald-700 hover:underline"
          >
            تسجيل الدخول
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-10 text-center">
          المفضلة
        </h1>

        {favLoading ? (
          <div className="text-center text-gray-500 py-20">
            جاري التحميل...
          </div>
        ) : favs.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            <Heart size={64} className="mx-auto mb-4 text-gray-300" />
            <p className="text-xl mb-4">لا توجد منتجات في المفضلة</p>
            <Link
              href="/shop"
              className="text-emerald-700 hover:underline"
            >
              ابدأ التسوق
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favs.map((fav) => {
              const product = fav.productId;
              if (!product) return null;

              return (
                <div
                  key={fav._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition"
                >
                  <div
                    onClick={() => router.push(`/shop/item/${product._id}`)}
                    className="cursor-pointer"
                  >
                    <img
                      src={
                        product.images && product.images[0]
                          ? (isDemoMode ? getDemoImageSrc(product.images) : `http://localhost:8080/${product.images[0]}`)
                          : "/logo.png"
                      }
                      alt={product.title || "Product"}
                      className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {product.title || "Product"}
                      </h3>
                      <p className="text-emerald-700 font-bold">
                        {product.salePrice || product.price || 0} جنيه
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex justify-end">
                    <button
                      onClick={() => handleRemoveFav(product._id)}
                      className="text-red-500 hover:text-red-600 transition"
                      title="إزالة من المفضلة"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

