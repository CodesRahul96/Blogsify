import React from 'react';
import { Link } from 'react-router-dom';

function Sitemap() {
  const links = [
    { to: '/', label: 'Home' },
    { to: '/blogs', label: 'Blogs' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    { to: '/support', label: 'Support' },
    { to: '/login', label: 'Login' },
    { to: '/register', label: 'Register' },
    { to: '/dashboard', label: 'Dashboard' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden py-16">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900 animate-gradient-bg"></div>
      <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{backgroundImage: "url(/src/assets/blogsify-bg.avif)"}} />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-gray-100">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold mb-2">Sitemap</h1>
          <p className="text-gray-300">Quick links for easy navigation.</p>
        </header>

        <div className="bg-white/5 p-6 rounded-lg border border-gray-700/40">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-gray-200 hover:text-purple-300">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sitemap;
