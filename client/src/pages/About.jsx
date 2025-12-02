import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden py-16">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900 animate-gradient-bg"></div>
      <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: "url(/src/assets/blogsify-bg.avif)"}} />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-gray-100">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">About Blogsify</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">We provide a platform for writers and readers to connect through meaningful articles. Our mission is to make publishing simple, beautiful, and community-driven.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/5 p-6 rounded-2xl border border-gray-700/40">
            <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
            <p className="text-gray-300">To cultivate thoughtful conversations and empower independent creators with elegant publishing tools.</p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-gray-700/40">
            <h3 className="text-xl font-semibold mb-2">What We Offer</h3>
            <ul className="text-gray-300 list-disc list-inside space-y-1">
              <li>Easy-to-use editor</li>
              <li>Responsive reading experience</li>
              <li>Community-driven discovery</li>
            </ul>s
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-gray-700/40">
            <h3 className="text-xl font-semibold mb-2">Join Us</h3>
            <p className="text-gray-300 mb-4">Start writing and reach readers across the world.</p>
            <Link to="/register" className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full">Get Started</Link>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { name: 'Rahul', role: 'Founder & Developer' },
              { name: 'Pranit', role: 'Product' },
              { name: 'Sandeep', role: 'Design' },
            ].map((m) => (
              <div key={m.name} className="bg-white/5 p-4 rounded-lg border border-gray-700/40 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-semibold">{m.name.charAt(0)}</div>
                <div>
                  <div className="font-medium text-gray-100">{m.name}</div>
                  <div className="text-sm text-gray-400">{m.role}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center">
          <p className="text-gray-300 mb-4">Have questions or want to collaborate?</p>
          <Link to="/contact" className="bg-white/5 hover:bg-white/10 px-6 py-3 rounded-full border border-gray-700/40">Contact the team</Link>
        </section>
      </div>
    </div>
  );
}

export default About;
