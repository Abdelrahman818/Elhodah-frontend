"use client";

import { Trash2, Plus, Minus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useMain } from "@/context/MainContext";
import { BASE_API_URL } from "@/config";

export default function CartPage() {
  const { cart, updateCartQty, removeFromCart, cartLoading } = useMain();

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.salePrice || item.price) * item.quantity,
    0
  );

  if (cartLoading && cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-700" size={40} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">

        <h1 className="text-4xl font-bold mb-10 text-center">
          سلة المشتريات
        </h1>

        {cart.length === 0 ? (
          <div className="text-center text-gray-500 py-12 bg-white rounded-xl shadow-md">
            <p className="text-xl mb-4">سلة المشتريات فارغة</p>
            <Link
              href="/shop"
              className="bg-emerald-700 text-white px-8 py-3 rounded-lg hover:bg-emerald-800 transition inline-block"
            >
              ابدأ التسوق
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Items */}
            <div className="md:col-span-2 space-y-4">
              <div className="bg-white rounded-xl shadow-md p-6">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b last:border-b-0 py-4"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-24 h-24 shrink-0 bg-gray-100 rounded-lg overflow-hidden border">
                        <img
                          src={item.image ? `${BASE_API_URL}${item.image}` : "https://placehold.co/100x100?text=No+Img"}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = "https://placehold.co/100x100?text=Error" }}
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 leading-tight">
                          {item.title}
                        </h3>
                        <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-2">
                          {item.color && (
                            <span className="bg-gray-100 px-2 py-0.5 rounded">اللون: {item.color}</span>
                          )}
                          {item.size && (
                            <span className="bg-gray-100 px-2 py-0.5 rounded">المقاس: {item.size}</span>
                          )}
                        </div>
                        <p className="text-emerald-700 font-bold mt-2">
                          {item.salePrice || item.price} جنيه
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                      {/* Quantity */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCartQty(item._id, item.quantity - 1)}
                          className="p-1.5 border rounded-lg hover:bg-gray-100 transition disabled:opacity-30"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(item._id, item.quantity + 1)}
                          className="p-1.5 border rounded-lg hover:bg-gray-100 transition"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-400 hover:text-red-600 p-2 transition"
                        title="حذف"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl shadow-md p-6 h-fit sticky top-24">
              <h2 className="text-xl font-bold mb-6 border-b pb-4">
                ملخص الطلب
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>الإجمالي</span>
                  <span>{subtotal} جنيه</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>عدد القطع</span>
                  <span>{cart.reduce((sum, item) => sum + item.quantity, 0)} قطعة</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>الشحن</span>
                  <span className="text-green-600 font-medium text-sm">يحسب عند التوصيل</span>
                </div>
              </div>

              <div className="border-t pt-4 flex justify-between font-bold text-xl mb-8">
                <span>المجموع النهائي</span>
                <span className="text-emerald-700">{subtotal} جنيه</span>
              </div>

              <Link
                href="/checkout/confirm"
                className="block text-center bg-emerald-700 text-white py-4 rounded-xl font-bold hover:bg-emerald-800 transition shadow-lg shadow-emerald-200"
              >
                إتمام الطلب
              </Link>

              <p className="text-center text-xs text-gray-400 mt-4">
                بمتابعة الطلب فأنت توافق على سياسة الاستبدال والاكسير
              </p>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}
