import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const faqs = [
  { q: 'How do I publish a post?', a: 'Register, go to your dashboard and click Create Post.' },
  { q: 'How do I edit my post?', a: 'Open the post from your dashboard and click Edit.' },
  { q: 'How do I report abuse?', a: 'Use the contact form or email support@example.com.' },
];

function Support() {
  const [open, setOpen] = useState(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!message) { setStatus('Please provide details of your issue.'); return; }
    setStatus('Sending request...');
    setTimeout(()=>{ setStatus('Support request sent — we will respond shortly.'); setMessage(''); }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden py-16">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900 animate-gradient-bg"></div>
      <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{backgroundImage: "url(/src/assets/blogsify-bg.avif)"}} />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-gray-100">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold mb-2">Support</h1>
          <p className="text-gray-300">Find quick answers or send us a support request.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Frequently asked</h2>
            <div className="space-y-3">
              {faqs.map((f, i) => (
                <div key={i} className="bg-white/5 p-4 rounded-lg border border-gray-700/40">
                  <button onClick={()=> setOpen(open===i?null:i)} className="w-full text-left flex justify-between items-center">
                    <span className="font-medium text-gray-100">{f.q}</span>
                    <span className="text-gray-300">{open===i? '−' : '+'}</span>
                  </button>
                  {open===i && <div className="mt-3 text-gray-300">{f.a}</div>}
                </div>
              ))}
            </div>
            <p className="mt-6 text-gray-400">Still need help? <Link to="/contact" className="text-purple-300">Contact us</Link></p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Send a request</h2>
            <form onSubmit={submit} className="bg-white/5 p-6 rounded-lg border border-gray-700/40">
              <textarea value={message} onChange={(e)=> setMessage(e.target.value)} rows={6} placeholder="Describe your issue" className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white" />
              <div className="mt-3 flex items-center justify-between">
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 rounded-full">Submit</button>
                {status && <span className="text-sm text-gray-300">{status}</span>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Support;
