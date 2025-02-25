'use client'
import { useState } from 'react';
import Link from 'next/link';

export default function Menu({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar for large screens */}
      <aside className="hidden lg:flex flex-col w-52 bg-dark-surface">

        <div className="p-4 text-2xl text-custom-white font-bold border-b font-Outfit">
          Data in the USA
        </div>

        <nav className="flex-1">
          <ul className="flex flex-col">
            
            <li>
              <Link
                href="/"
                className="flex items-center space-x-2 p-4 hover:bg-light-surface"
              >
                <svg
                  className="w-5 h-5 text-custom-blue"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 20"
                >
                  <path d="M16 14V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v15a3 3 0 0 0 3 3h12a1 1 0 0 0 0-2h-1v-2a2 2 0 0 0 2-2ZM4 2h2v12H4V2Zm8 16H3a1 1 0 0 1 0-2h9v2Z" />
                </svg>
                <span className='font-Outfit text-custom-white'>Documentation</span>
              </Link>
            </li>

            <li>
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 p-4 hover:bg-light-surface"
              >
                <svg 
                  className="w-5 h-5 text-custom-blue"
                  aria-hidden="true" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="currentColor" 
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/>
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
                </svg>
                <span className='font-Outfit text-custom-white'>Dashboard</span>
              </Link>
            </li>

            <li>
              <Link
                href="/view-data"
                className="flex items-center space-x-2 p-4 hover:bg-light-surface"
              >
                <svg
                  className="w-5 h-5 text-custom-blue"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 18"
                >
                  <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"/>
                </svg>
                <span className='font-Outfit text-custom-white'>View Data</span>
              </Link>
            </li>

          </ul>
        </nav>
      </aside>
      
      {/* Main content area */}

      <div className="flex flex-col flex-1">
        {/* Mobile Header */}
        <header className="lg:hidden relative bg-dark-surface p-4">
          {/* Top bar with title and hamburger */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-custom-white">Data in the USA</h1>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              <svg
                className="w-6 h-6 text-custom-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Absolute-positioned nav for dropdown */}
          <nav
            className={`absolute left-0 right-0 overflow-hidden transition-all duration-500 transform origin-top z-50 bg-dark-surface ${
              mobileMenuOpen
                ? "scale-y-100 opacity-100 pointer-events-auto"
                : "scale-y-0 opacity-0 pointer-events-none"
            }`}
          >
            <ul>
              <li>
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 p-4 hover:bg-light-surface"
                >
                  <svg
                    className="w-5 h-5 text-custom-blue"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 20"
                  >
                    <path d="M16 14V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v15a3 3 0 0 0 3 3h12a1 1 0 0 0 0-2h-1v-2a2 2 0 0 0 2-2ZM4 2h2v12H4V2Zm8 16H3a1 1 0 0 1 0-2h9v2Z" />
                  </svg>
                  <span className='font-Outfit text-custom-white'>Documentation</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 p-4 hover:bg-light-surface"
                >
                  <svg
                    className="w-5 h-5 text-custom-blue"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 21"
                  >
                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                  </svg>
                  <span className='font-Outfit text-custom-white'>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/view-data"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 p-4 hover:bg-light-surface"
                >
                  <svg
                    className="w-5 h-5 text-custom-blue"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 18"
                  >
                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                  </svg>
                  <span className='font-Outfit text-custom-white'>View Data</span>
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        {/* Page Content starts right below the header */}
        <main className="flex-1 p-4 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}