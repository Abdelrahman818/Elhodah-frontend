"use client";

import { Truck, Shield, Tag, Smile } from "lucide-react";

const benefitsData = [
  {
    id: 1,
    icon: <Truck className="w-12 h-12 text-emerald-700" />,
    title: "توصيل سريع",
    description: "نوصل طلبك في أسرع وقت ممكن، مباشرة لحد باب بيتك.",
  },
  {
    id: 2,
    icon: <Shield className="w-12 h-12 text-emerald-700" />,
    title: "مدفوعات آمنة",
    description: "نظام دفع آمن يحمي بياناتك وعملياتك المالية.",
  },
  {
    id: 3,
    icon: <Tag className="w-12 h-12 text-emerald-700" />,
    title: "أفضل الأسعار",
    description: "منتجات عالية الجودة بأسعار منافسة تناسب الجميع.",
  },
  {
    id: 4,
    icon: <Smile className="w-12 h-12 text-emerald-700" />,
    title: "رضا العملاء",
    description: "رضاكم هدفنا، ونسعى لتجربة تسوق ممتعة وسلسة.",
  },
];

export default function Benefits() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-10 text-center">
        لماذا تختارنا؟
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {benefitsData.map((benefit) => (
          <div
            key={benefit.id}
            className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            {/* الأيقونة */}
            <div className="mb-4">{benefit.icon}</div>

            {/* العنوان */}
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {benefit.title}
            </h3>

            {/* الوصف */}
            <p className="text-gray-600 text-sm sm:text-base">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
