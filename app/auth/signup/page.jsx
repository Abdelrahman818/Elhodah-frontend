"use client";

import Link from "next/link";
import { endPoints } from "@/config";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../../firebaseConfig";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const syncWithBackend = async (token) => {
    try {
      const res = await fetch(endPoints.sync, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!data.successful) throw new Error(data.msg);
    } catch (err) {
      console.error("Backend sync error:", err);
    }
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("كلمتا المرور غير متطابقتين ❌");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(userCredential.user, { displayName: form.name });
      
      const token = await userCredential.user.getIdToken();
      await syncWithBackend(token);

      toast.success("تم إنشاء الحساب وتسجيل الدخول بنجاح! 🎉");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.message || "حدث خطأ ما أثناء إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
        
      const userCredential = await signInWithPopup(auth, provider);
      const token = await userCredential.user.getIdToken();
      await syncWithBackend(token);

      toast.success("تم تسجيل الدخول بنجاح! 🎉");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(`Google signup error:`, error);
      toast.error(`فشل التسجيل بواسطة Google`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          إنشاء حساب جديد
        </h1>
        <p className="text-center text-gray-500 mb-8">
          انضم إلى الهدى الآن
        </p>

        <form onSubmit={handleEmailSignup} className="space-y-4">
          <Input
            label="الاسم بالكامل"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <Input
            label="البريد الإلكتروني"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <Input
            label="كلمة المرور"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />

          <Input
            label="تأكيد كلمة المرور"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-emerald-700 text-white py-3 rounded-lg hover:bg-emerald-800 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? "جاري المعالجة..." : "إنشاء الحساب"}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">أو المتابعة عبر</span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleGoogleSignup}
              disabled={loading}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Google
            </button>
          </div>
        </div>

        <p className="text-center text-gray-600 mt-6">
          لديك حساب بالفعل؟{" "}
          <Link
            href="/auth/login"
            className="text-emerald-700 hover:underline font-medium"
          >
            تسجيل الدخول
          </Link>
        </p>
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
        required
        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600"
      />
    </div>
  );
}
