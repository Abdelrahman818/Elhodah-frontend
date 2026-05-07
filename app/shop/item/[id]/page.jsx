"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ShoppingCart, Heart, Loader2 } from "lucide-react";
import { useMain } from "@/context/MainContext";
import { useUser } from "@/context/UserContext";
import { endPoints, BASE_API_URL } from "@/config";
import { toast } from "react-hot-toast";

export default function ItemPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorCode, setErrorCode] = useState(null);

  const { favs, isFav, addToFav, removeFromFav, getUserFavs, addToCart } = useMain();
  const { isLoggedIn } = useUser();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  // Get product ID (handle both id and _id for API compatibility)
  const productId = product?._id;

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast.error("يرجى تسجيل الدخول أولاً");
      router.push("/auth/login");
      return;
    }

    if (product.colors?.length > 0 && !selectedColor) {
      toast.error("يرجى اختيار اللون");
      return;
    }

    if (product.size?.length > 0 && !selectedSize) {
      toast.error("يرجى اختيار المقاس");
      return;
    }

    setIsCartLoading(true);
    try {
      const res = await addToCart(productId, 1, selectedColor, selectedSize);
      if (res.successful) {
        toast.success("تمت الإضافة إلى السلة بنجاح ✅");
      } else {
        toast.error(res.msg || "فشلت عملية الإضافة");
      }
    } catch (err) {
      toast.error("حدث خطأ ما");
    } finally {
      setIsCartLoading(false);
    }
  };

  const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);

  const handleBuyNow = async () => {
    if (!isLoggedIn) {
      toast.error("يرجى تسجيل الدخول أولاً");
      router.push("/auth/login");
      return;
    }

    if (product.colors?.length > 0 && !selectedColor) {
      toast.error("يرجى اختيار اللون");
      return;
    }

    if (product.size?.length > 0 && !selectedSize) {
      toast.error("يرجى اختيار المقاس");
      return;
    }

    setIsBuyNowLoading(true);
    try {
      const res = await addToCart(productId, 1, selectedColor, selectedSize);
      if (res.successful) {
        toast.success("تمت الإضافة، جاري التحويل لإتمام الطلب...");
        router.push("/checkout/confirm");
      } else {
        toast.error(res.msg || "فشلت عملية الإضافة");
      }
    } catch (err) {
      toast.error("حدث خطأ ما");
    } finally {
      setIsBuyNowLoading(false);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await fetch(endPoints.getProduct(id));
      const json = await res.json();

      if (json.successful) {
        setProduct(json.data);
      } else {
        setErrorCode(404);
      }
    } catch (err) {
      console.error("Fetch product error:", err);
      setErrorCode(500);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    if (isLoggedIn && productId) {
      getUserFavs();
    }
  }, [isLoggedIn, productId, getUserFavs]);

  useEffect(() => {
    if (productId) {
      setIsFavorited(isFav(productId));
    }
  }, [productId, favs, isFav]);

  const handleToggleFav = async () => {
    if (!isLoggedIn) {
      toast.error("يرجى تسجيل الدخول أولاً للمتابعة");
      router.push("/auth/login");
      return;
    }

    if (!productId) return;

    setIsActionLoading(true);
    try {
      if (isFavorited) {
        await removeFromFav(productId);
      } else {
        await addToFav(productId);
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 gap-4">
        <Loader2 className="animate-spin text-emerald-700" size={40} />
        <span>جاري تحميل المنتج...</span>
      </div>
    );
  }

  if (errorCode || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        {errorCode === 404 ? "المنتج غير موجود" : "عذراً، حدث خطأ أثناء تحميل المنتج"}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 mb-6">
        <nav className="text-sm flex items-center gap-2 text-gray-500">
          <button onClick={() => router.push("/")} className="hover:text-emerald-700 transition">الرئيسية</button>
          <span>/</span>
          <button onClick={() => router.push("/shop")} className="hover:text-emerald-700 transition">المتجر</button>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.title}</span>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Image */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden flex items-center justify-center min-h-[400px]">
          <img
            src={product.images && product.images.length > 0 ? `${BASE_API_URL}${product.images[0]}` : "https://placehold.co/600x600?text=" + product.title}
            alt={product.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = "https://placehold.co/600x600?text=" + product.title }}
          />
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 mb-2">
            {product.category}
          </span>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {product.title}
          </h1>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {product.desc}
          </p>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">اختر اللون:</h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border transition ${selectedColor === color
                      ? "border-emerald-700 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-600"
                      }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.size && product.size.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">اختر المقاس:</h3>
              <div className="flex flex-wrap gap-3">
                {product.size.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[50px] h-10 flex items-center justify-center rounded-lg border transition ${selectedSize === size
                      ? "border-emerald-700 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-600"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="text-2xl font-bold text-emerald-700 mb-6">
            {product.price} جنيه
          </div>

          {/* Actions */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={isCartLoading || isBuyNowLoading}
              className="flex-1 flex items-center justify-center gap-2 border-2 border-emerald-700 text-emerald-700 font-semibold py-3 rounded-lg hover:bg-emerald-50 transition disabled:opacity-50"
              title={(!selectedColor && product.colors?.length > 0) || (!selectedSize && product.size?.length > 0) ? "يرجى اختيار المقاس واللون" : ""}
            >
              {isCartLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <ShoppingCart size={20} />
                  أضف إلى السلة
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isCartLoading || isBuyNowLoading}
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-700 text-white font-semibold py-3 rounded-lg hover:bg-emerald-800 transition disabled:opacity-50"
              title={(!selectedColor && product.colors?.length > 0) || (!selectedSize && product.size?.length > 0) ? "يرجى اختيار المقاس واللون" : ""}
            >
              {isBuyNowLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  اشتري الآن
                </>
              )}
            </button>

            <button
              onClick={handleToggleFav}
              disabled={!isLoggedIn || isActionLoading}
              className={`p-3 border rounded-lg transition ${isFavorited
                ? "border-red-300 bg-red-50 hover:bg-red-100"
                : "border-gray-300 hover:bg-gray-100"
                } ${!isLoggedIn ? "opacity-50 cursor-not-allowed" : ""}`}
              title={isLoggedIn ? (isFavorited ? "إزالة من المفضلة" : "إضافة إلى المفضلة") : "يجب تسجيل الدخول"}
            >
              <Heart
                size={22}
                fill={isFavorited ? "#ef4444" : "none"}
                stroke={isFavorited ? "#ef4444" : "currentColor"}
                className={isFavorited ? "text-red-500" : ""}
              />
            </button>
          </div>

          {/* Extra Info */}
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✔️ خامة عالية الجودة</li>
            <li>✔️ متاح فحص المنتج عند الاستلام</li>
            <li>✔️ استبدال خلال 14 يوم</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
