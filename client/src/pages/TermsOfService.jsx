import GlassCard from "../components/ui/GlassCard";

const TermsOfService = () => {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6 relative overflow-hidden bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
      <div className="relative z-10 mx-auto max-w-4xl">
        <GlassCard className="p-8 md:p-12">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-zinc-950 dark:text-white tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <div className="prose prose-zinc dark:prose-invert prose-lg max-w-none text-zinc-700 dark:text-zinc-300">
            <h3 className="text-xl font-bold font-serif text-zinc-950 dark:text-white mt-8 mb-3">1. Agreement to Terms</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              By accessing our website, you agree to be bound by these Terms of
              Service and to comply with all applicable laws and regulations. If
              you do not agree with these terms, you are prohibited from using
              or accessing this site.
            </p>

            <h3 className="text-xl font-bold font-serif text-zinc-950 dark:text-white mt-8 mb-3">2. User Accounts</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              When you create an account with us, you must provide us
              information that is accurate, complete, and current at all times.
              Failure to do so constitutes a breach of the Terms, which may
              result in immediate termination of your account on our Service.
            </p>

            <h3 className="text-xl font-bold font-serif text-zinc-950 dark:text-white mt-8 mb-3">3. Content</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              Our Service allows you to post, link, store, share and otherwise
              make available certain information, text, graphics, videos, or
              other material (&quot;Content&quot;). You are responsible for the
              Content that you post to the Service, including its legality,
              reliability, and appropriateness.
            </p>

            <h3 className="text-xl font-bold font-serif text-zinc-950 dark:text-white mt-8 mb-3">4. Termination</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              We may terminate or suspend your account immediately, without
              prior notice or liability, for any reason whatsoever, including
              without limitation if you breach the Terms.
            </p>

            <h3 className="text-xl font-bold font-serif text-zinc-950 dark:text-white mt-8 mb-3">5. Changes</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. What constitutes a material change will
              be determined at our sole discretion.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default TermsOfService;
