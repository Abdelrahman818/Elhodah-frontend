"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      toast.success("شكراً! سنتواصل معك قريباً 🎉");
      setFormData({ fullName: "", email: "", message: "" });
      setIsLoading(false);
    }, 800);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gray-900 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-3">تواصل معنا</h1>
        <p className="text-gray-300">
          نحن هنا لمساعدتك في أي وقت
        </p>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Contact Info */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            معلومات التواصل
          </h2>

          <div className="space-y-4 text-gray-600">
            <div className="flex items-center gap-3">
              <Phone className="text-emerald-700" />
              <span>+20 1XX XXX XXXX</span>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="text-emerald-700" />
              <span>support@elhoda.com</span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="text-emerald-700" />
              <span>القاهرة، مصر</span>
            </div>
          </div>

          <p className="mt-8 text-gray-500">
            يمكنك التواصل معنا بخصوص الطلبات، الشحن، الاستبدال،
            أو أي استفسار آخر.
          </p>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">
            أرسل لنا رسالة
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input 
              label="الاسم بالكامل" 
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
            <Input 
              label="البريد الإلكتروني" 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <Textarea 
              label="رسالتك"
              name="message"
              value={formData.message}
              onChange={handleChange}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-700 text-white py-3 rounded-lg hover:bg-emerald-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "جاري الإرسال..." : "إرسال الرسالة"}
            </button>
          </form>
        </div>

      </section>
    </main>
  );
}

function Input({ label, type = "text", name, value, onChange }) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600"
        required
      />
    </div>
  );
}

function Textarea({ label, name, value, onChange }) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        rows="4"
        name={name}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600"
        required
      ></textarea>
    </div>
  );
}
