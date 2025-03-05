"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setIsDropdownOpen(false);
  };

  const toggleMenu = () => {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
      menu.classList.toggle('hidden');
      requestAnimationFrame(() => {
        menu.classList.toggle('menu-open');
      });
    }
  };

  const closeMenu = () => {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
      menu.classList.remove('menu-open');
      setTimeout(() => {
        menu.classList.add('hidden');
      }, 300);
    }
  };

  useEffect(() => {
    closeMenu();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="flex h-16 max-w-7xl mx-auto px-4 items-center justify-between">
        <Link href="/" onClick={closeMenu} className="flex items-center gap-2 text-lg font-bold text-gray-900 hover:text-primary transition-colors duration-200">
          <span>Suyi Zhang</span>
        </Link>
        {/* 桌面端导航 */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-end md:gap-8">
          <Link href="/portfolio" onClick={closeMenu} className="relative text-base font-medium text-gray-700 hover:text-primary transition-colors duration-200 after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-200 hover:after:w-full">作品集</Link>
          <Link href="/blog" onClick={closeMenu} className="relative text-base font-medium text-gray-700 hover:text-primary transition-colors duration-200 after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-200 hover:after:w-full">博客</Link>
          <Link href="/about" onClick={closeMenu} className="relative text-base font-medium text-gray-700 hover:text-primary transition-colors duration-200 after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-200 hover:after:w-full">关于</Link>
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 text-base font-medium text-gray-700 hover:text-primary transition-colors duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                  {user?.name?.[0] || user?.email?.[0] || '?'}
                </div>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                      <p className="font-medium">{user?.name || '用户'}</p>
                      <p className="text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors duration-200"
                    >
                      退出登录
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark transition-colors duration-200"
            >
              登录
            </Link>
          )}
        </div>
        {/* 移动端菜单按钮 */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center p-2.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 active:bg-gray-200/80 transition-all duration-200"
          onClick={toggleMenu}
        >
          <span className="sr-only">打开菜单</span>
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>
      {/* 移动端导航菜单 */}
      <div id="mobile-menu" className="hidden fixed top-16 left-0 right-0 md:hidden border-t border-gray-200/80 bg-white/98 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 shadow-lg transform transition-all duration-300 ease-in-out opacity-0 translate-y-[-10px] scale-95 [&.menu-open]:opacity-100 [&.menu-open]:translate-y-0 [&.menu-open]:scale-100">
        <div className="space-y-0.5 px-4 py-3">
          <Link
            href="/portfolio"
            onClick={closeMenu}
            className="block px-4 py-2.5 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-100/80 hover:text-primary active:bg-gray-200/80 transition-all duration-200"
          >
            作品集
          </Link>
          <Link
            href="/blog"
            onClick={closeMenu}
            className="block px-4 py-2.5 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-100/80 hover:text-primary active:bg-gray-200/80 transition-all duration-200"
          >
            博客
          </Link>
          <Link
            href="/about"
            onClick={closeMenu}
            className="block px-4 py-2.5 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-100/80 hover:text-primary active:bg-gray-200/80 transition-all duration-200"
          >
            关于
          </Link>
          {isLoggedIn ? (
            <div className="border-t border-gray-200 mt-2 pt-2">
              <div className="px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-lg">
                    {user?.name?.[0] || user?.email?.[0] || '?'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user?.name || '用户'}</p>
                    <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="mt-2 w-full text-left px-4 py-2.5 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-100/80 hover:text-primary active:bg-gray-200/80 transition-all duration-200"
                >
                  退出登录
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/auth/login"
              onClick={closeMenu}
              className="block px-4 py-2.5 text-base font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-all duration-200"
            >
              登录
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}