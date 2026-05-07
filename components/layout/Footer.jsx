"use client";

import { useState, useEffect } from "react";
import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { endPoints } from "@/config";

export default function Footer() {
  const [isAdmin, setIsAdmin] = useState(false);
  const { isLoggedIn, loading: userLoading } = useUser();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isLoggedIn || userLoading) {
        setIsAdmin(false);
        return;
      }

      try {
        const res = await fetch(endPoints.getRole, {
          credentials: 'include',
        });

        if (res.ok) {
          const json = await res.json();
          if (json.successful && json.isAdmin) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [isLoggedIn, userLoading]);

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* قسم الروابط */}
        <div>
          <h3 className="text-xl font-semibold mb-4">روابط سريعة</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-emerald-600 transition">الرئيسية</Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-emerald-600 transition">المتجر</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-emerald-600 transition">من نحن</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-emerald-600 transition">تواصل معنا</Link>
            </li>
            {isAdmin && (
              <li>
                <Link href="/admin" className="hover:text-emerald-600 transition">لوحة التحكم</Link>
              </li>
            )}
          </ul>
        </div>

        {/* قسم التواصل الاجتماعي */}
        <div className="text-center md:text-left">
          <h3 className="text-xl font-semibold mb-4">تابعنا</h3>
          <div className="flex justify-center md:justify-start space-x-4">
            <Link href="https://www.facebook.com/share/1FAUmrVNJh/?mibextid=wwXIfr" className="hover:text-emerald-600 transition"><Facebook className="w-6 h-6" /></Link>
            <Link href="https://www.instagram.com/el.hoda.eg?igsh=MXZ4dHc0aXVnZXl5bw%3D%3D&utm_source=qr" className="hover:text-emerald-600 transition"><Instagram className="w-6 h-6" /></Link>
          </div>
        </div>

        {/* حقوق النشر */}
        <div className="text-center md:text-right">
          <h3 className="text-xl font-semibold mb-4">الهدى</h3>
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} جميع الحقوق محفوظة
          </p>
        </div>

      </div>
    </footer>
  );
}
