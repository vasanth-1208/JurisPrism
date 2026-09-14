"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Scale,
  FileText,
  GitCompare,
  Compass,
  UploadCloud,
  LogOut,
  User as UserIcon,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [aiInfo, setAiInfo] = useState<{ providerName: string; isOfflineMode: boolean } | null>(null);
  const [loadingDemo, setLoadingDemo] = useState(false);

  useEffect(() => {
    // Check auth session
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : { authenticated: false }))
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});

    // Check AI engine health
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        if (data.ai) {
          setAiInfo(data.ai);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const handle1ClickDemo = async () => {
    try {
      setLoadingDemo(true);
      const res = await fetch("/api/auth/demo", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Demo login error:", err);
    } finally {
      setLoadingDemo(false);
    }
  };

  const navLinks = [
    { label: "Dashboard", href: "/dashboard", icon: FileText },
    { label: "Upload & Ingest", href: "/documents/upload", icon: UploadCloud },
    { label: "Compare Contracts", href: "/compare", icon: GitCompare },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-900 via-brand-800 to-indigo-900 text-amber-400 flex items-center justify-center shadow-md shadow-brand-900/10 group-hover:scale-105 transition-transform">
                <Scale className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg text-slate-900 tracking-tight leading-none">
                  Juris<span className="text-brand-600">Prism</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase leading-tight mt-0.5">
                  Legal Intelligence
                </span>
              </div>
            </Link>

            {/* AI Engine Status Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs border border-slate-200">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span className="font-medium text-[11px]">
                {aiInfo?.isOfflineMode
                  ? "Local Deterministic NLP"
                  : "Google Gemini GenAI"}
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-50 text-brand-900 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Profile / Auth Action */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-sm text-slate-700 hover:text-brand-900 font-medium py-1 px-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-xs">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handle1ClickDemo}
                  disabled={loadingDemo}
                  className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium text-xs px-3.5 py-2 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {loadingDemo ? "Loading Demo..." : "1-Click Demo Access"}
                </button>
                <Link
                  href="/login"
                  className="text-xs font-semibold text-slate-700 hover:text-brand-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
