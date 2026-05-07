'use client'

import Lottie from "lottie-react";
import aboutLottie from "@/animations/about.json";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            من نحن
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            <span className="text-emerald-700">الهدى</span> ليست مجرد متجر، بل تجربة تجمع بين الأناقة، الجودة، والراحة
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Text */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              قصة <span className="text-emerald-700">الهدى</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              <span className="text-emerald-700">الهدى</span> هو متجر إلكتروني متخصص في الملابس والإكسسوارات العصرية،
              تم إنشاؤه لتقديم منتجات عالية الجودة بتصميمات تناسب كل الأذواق.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              نؤمن بأن الأناقة لا يجب أن تكون معقدة أو باهظة الثمن، لذلك نحرص
              على تقديم أفضل الخامات بأسعار عادلة وتجربة تسوق سهلة وسريعة.
            </p>
            <p className="text-gray-600 leading-relaxed">
              هدفنا هو أن يشعر كل عميل بالثقة والرضا مع كل طلب.
            </p>
          </div>

          {/* Image */}
          <div className="w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-lg">
            <Lottie animationData={aboutLottie} loop={true} />
          </div>

        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            قيمنا
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                title: "الجودة",
                desc: "نختار أفضل الخامات لضمان منتج يدوم",
              },
              {
                title: "الشفافية",
                desc: "أسعار واضحة بدون أي تكاليف خفية",
              },
              {
                title: "السرعة",
                desc: "تجهيز وشحن الطلبات بأسرع وقت",
              },
              {
                title: "رضا العملاء",
                desc: "تجربتك معنا هي أولويتنا الأولى",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-emerald-700 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          مستعد تبدأ رحلتك مع <span>الهدى</span>؟
        </h2>
        <p className="mb-8 text-emerald-200">
          اكتشف أحدث المنتجات واختر ستايلك الآن
        </p>
        <a
          href="/shop"
          className="inline-block bg-white text-emerald-700 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition"
        >
          تسوق الآن
        </a>
      </section>
    </main>
  );
}
