"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ShoppingBag, Menu, User, LogOut, Heart } from "lucide-react";
import { useMain } from "@/context/MainContext";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function Header({ bg = "" }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { favs, getUserFavs, cart, getUserCart } = useMain();
  const { user, isLoggedIn, logout } = useUser();

  useEffect(() => {
    if (isLoggedIn) {
      getUserFavs();
      getUserCart();
    }
  }, [isLoggedIn, getUserFavs, getUserCart]);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
  };

  return (
    <header className={`header ${bg}`}>
      <div className="header-container">

        {/* Logo */}
        <Link href="/" className="logo">
          <Image
            src="/elhoda_logo.png"
            alt="El-Hodah"
            width={120}
            height={60}
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="nav">
          <Link href="/">الرئيسية</Link>
          <Link href="/shop">المتجر</Link>
          <Link href="/about">من نحن</Link>
          <Link href="/contact">تواصل معنا</Link>
        </nav>

        {/* Actions */}
        <div className="actions">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-[#f4e6d0] hidden md:inline">
                أهلاً، {user?.name}
              </span>
              <button onClick={handleLogout} className="icon-btn text-red-500" title="تسجيل الخروج">
                <LogOut size={22} />
              </button>
            </div>
          ) : (
            <Link href="/auth/login" className="icon-btn">
              <User size={22} />
            </Link>
          )}

          <Link
            href="/checkout/cart"
            className="icon-btn relative"
            onClick={(e) => {
              if (!isLoggedIn) {
                e.preventDefault();
                toast.error("يرجى تسجيل الدخول أولاً للمتابعة إلى سلة المشتريات");
                router.push("/auth/login");
              }
            }}
          >
            <ShoppingBag size={22} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-700 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>

          {isLoggedIn && (
            <Link
              href="/fav"
              className="icon-btn relative"
              title="المفضلة"
            >
              <Heart
                size={22}
                fill={favs.length > 0 ? "#ef4444" : "none"}
                className={favs.length > 0 ? "text-red-500" : ""}
                stroke={favs.length > 0 ? "#ef4444" : "currentColor"}
              />
              {favs.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favs.length}
                </span>
              )}
            </Link>
          )}

          <button className="menu-btn" onClick={() => setOpen(!open)}>
            <Menu size={26} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="mobile-menu">
          <Link href="/" onClick={() => setOpen(false)}>الرئيسية</Link>
          <Link href="/shop" onClick={() => setOpen(false)}>المتجر</Link>
          <Link href="/about" onClick={() => setOpen(false)}>من نحن</Link>
          <Link href="/contact" onClick={() => setOpen(false)}>تواصل معنا</Link>
          {isLoggedIn ? (
            <>
              <div className="px-6 py-2 text-gray-800 font-bold border-t border-gray-100">
                أهلاً، {user?.name}
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-right px-6 py-4 text-red-500 hover:bg-red-50"
              >
                تسجيل الخروج
              </button>
            </>
          ) : (
            <Link href="/auth/login" onClick={() => setOpen(false)}>تسجيل الدخول</Link>
          )}
        </div>
      )}
    </header>
  );
}
