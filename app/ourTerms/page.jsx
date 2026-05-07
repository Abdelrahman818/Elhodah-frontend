export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gray-900 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-3">الشروط والأحكام</h1>
        <p className="text-gray-300">
          يرجى قراءة الشروط بعناية قبل استخدام الموقع
        </p>
      </section>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="bg-white rounded-xl shadow-md p-8 space-y-8">

          <div>
            <h2 className="text-2xl font-bold mb-3">1. مقدمة</h2>
            <p className="text-gray-600 leading-relaxed">
              باستخدامك لموقع الهدى أو أي من خدماته، فإنك توافق على الالتزام
              بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء منها، يرجى عدم
              استخدام الموقع.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">2. المنتجات</h2>
            <p className="text-gray-600 leading-relaxed">
              جميع المنتجات المعروضة على الموقع هي ملابس وإكسسوارات يتم وصفها
              بدقة قدر الإمكان. قد تختلف الألوان قليلًا بسبب إعدادات الشاشات.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">3. الطلبات والدفع</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>جميع الطلبات تخضع للتأكيد قبل الشحن.</li>
              <li>الدفع متاح بنظام الدفع عند الاستلام (COD).</li>
              <li>يحق لـ الهدى إلغاء أي طلب في حالة وجود خطأ في السعر أو البيانات.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">4. الشحن والتوصيل</h2>
            <p className="text-gray-600 leading-relaxed">
              يتم توصيل الطلبات داخل المناطق المتاحة خلال المدة المحددة لكل طلب.
              قد تختلف مدة التوصيل حسب الموقع الجغرافي.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">5. الاستبدال والاسترجاع</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>الاستبدال أو الاسترجاع خلال 14 يوم من تاريخ الاستلام.</li>
              <li>يجب أن يكون المنتج في حالته الأصلية وغير مستخدم.</li>
              <li>لا يتم استرجاع المنتجات المخفضة إلا في حالة وجود عيب.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">6. الخصوصية</h2>
            <p className="text-gray-600 leading-relaxed">
              نلتزم بحماية بياناتك الشخصية وعدم مشاركتها مع أي طرف ثالث إلا
              لأغراض تنفيذ الطلب.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">7. التعديلات</h2>
            <p className="text-gray-600 leading-relaxed">
              يحق لـ الهدى تعديل هذه الشروط في أي وقت دون إشعار مسبق، ويعتبر
              استمرارك في استخدام الموقع موافقة على التعديلات.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">8. التواصل</h2>
            <p className="text-gray-600 leading-relaxed">
              في حال وجود أي استفسار بخصوص الشروط والأحكام، يرجى التواصل معنا
              عبر صفحة <span className="font-medium">تواصل معنا</span>.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
