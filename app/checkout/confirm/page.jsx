"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { endPoints } from "@/config";
import { useMain } from "@/context/MainContext";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const { cart, clearCart } = useMain();
  const { user, isLoggedIn, loading } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    notes: "",
  });

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.salePrice || item.price) * item.quantity,
    0
  );

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      toast.error("يرجى تسجيل الدخول أولاً");
      router.push("/auth/login");
    } else if (cart.length === 0) {
      router.push("/shop");
    }
  }, [cart, isLoggedIn, loading, router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error("سلة التسوق فارغة");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        name: form.name,
        email: user?.email || "",
        phone: form.phone,
        address: `${form.address}, ${form.city}`,
        products: cart.map(item => ({
          product: item.productId,
          quantity: item.quantity,
          color: item.color,
          size: item.size
        })),
        totalPrice: subtotal,
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'unpaid',
        orderStatus: 'pending',
      };

      const res = await fetch(endPoints.orders, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      const json = await res.json();
      if (json.successful) {
        toast.success("تم إرسال الطلب بنجاح ✅");
        await clearCart();
        router.push("/");
      } else {
        toast.error(json.msg || "فشلت عملية إرسال الطلب");
      }
    } catch (err) {
      console.error("Submit order error:", err);
      toast.error("حدث خطأ ما أثناء إرسال الطلب");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4">

        <h1 className="text-4xl font-bold mb-10 text-center">
          إتمام الطلب
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Shipping Info */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">
              بيانات الشحن
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="الاسم بالكامل"
                name="name"
                value={form.name}
                onChange={handleChange}
              />

              <Input
                label="رقم الموبايل"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />

              <div className="sm:col-span-2">
                <Input
                  label="العنوان بالتفصيل"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                />
              </div>

              <Input
                label="المدينة"
                name="city"
                value={form.city}
                onChange={handleChange}
              />

              <div className="sm:col-span-2">
                <Input
                  label="ملاحظات إضافية (اختياري)"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-md p-6 h-fit">
            <h2 className="text-xl font-bold mb-6">
              ملخص الطلب
            </h2>

            <div className="flex justify-between mb-3 text-gray-600">
              <span>الإجمالي</span>
              <span>{subtotal} جنيه</span>
            </div>

            <div className="flex justify-between mb-3 text-gray-600">
              <span>الشحن</span>
              <span>يحسب عند التوصيل</span>
            </div>

            <div className="flex justify-between font-bold text-lg mb-6">
              <span>المجموع</span>
              <span>{subtotal} جنيه</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className="w-full bg-emerald-700 text-white py-3 rounded-lg hover:bg-emerald-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "تأكيد الطلب (الدفع عند الاستلام)"
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        {...props}
        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600"
        required={label !== "ملاحظات إضافية (اختياري)"}
      />
    </div>
  );
}
