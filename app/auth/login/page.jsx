"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { endPoints } from "@/config";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { fetchDemoUsers, isDemoMode, loginDemoUser } from "@/lib/demoMode";
import { useUser } from "@/context/UserContext";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useUser();
  const [form, setForm] = useState({
    email: "",
    password: "",
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

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("يرجى ملء جميع الحقول ❌");
      return;
    }

    setLoading(true);
    try {
      if (isDemoMode) {
        const users = await fetchDemoUsers();
        const demoUser = users.find((user) => user.email === form.email);

        if (!demoUser || demoUser.password !== form.password) {
          throw new Error("Invalid demo credentials");
        }

        loginDemoUser(demoUser);
        await refreshUser();
        toast.success("Demo login successful");
        router.push("/");
        router.refresh();
        return;
      }

      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      const token = await userCredential.user.getIdToken();
      await syncWithBackend(token);

      toast.success("تم تسجيل الدخول بنجاح! 🎉");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      if (isDemoMode) {
        const users = await fetchDemoUsers();
        const demoUser = users[0];
        loginDemoUser(demoUser);
        await refreshUser();
        toast.success("Demo login successful");
        router.push("/");
        router.refresh();
        return;
      }

      const provider = new GoogleAuthProvider();
        
      const userCredential = await signInWithPopup(auth, provider);
      const token = await userCredential.user.getIdToken();
      await syncWithBackend(token);

      toast.success("تم تسجيل الدخول بنجاح! 🎉");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(`Google login error:`, error);
      toast.error(`فشل تسجيل الدخول بواسطة Google`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">

        <h1 className="text-3xl font-bold text-center mb-2">
          تسجيل الدخول
        </h1>
        <p className="text-center text-gray-500 mb-8">
          مرحبًا بعودتك إلى الهدى
        </p>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <Input
            label="البريد الإلكتروني"
            type="email"
            name="email"
            value={form.email}
            placeholder={isDemoMode ? "demo@elhoda.test" : ""}
            onChange={handleChange}
          />

          <Input
            label="كلمة المرور"
            type="password"
            name="password"
            value={form.password}
            placeholder={isDemoMode ? "demo" : ""}
            onChange={handleChange}
          />

          <div className="flex justify-between items-center text-sm">
            <Link
              href="/forgot-password"
              className="text-emerald-700 hover:underline"
            >
              نسيت كلمة المرور؟
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-emerald-700 text-white py-3 rounded-lg hover:bg-emerald-800 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? "جاري التحقق..." : "تسجيل الدخول"}
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
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Google
            </button>
          </div>
        </div>

        <p className="text-center text-gray-600 mt-6">
          ليس لديك حساب؟{" "}
          <Link
            href="/auth/signup"
            className="text-emerald-700 hover:underline font-medium"
          >
            إنشاء حساب
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
