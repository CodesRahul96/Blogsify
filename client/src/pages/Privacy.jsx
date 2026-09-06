import GlassCard from "../components/ui/GlassCard";

const Privacy = () => {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6 relative overflow-hidden bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
      <div className="relative z-10 mx-auto max-w-4xl">
        <GlassCard className="p-8 md:p-12">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-zinc-950 dark:text-white tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <div className="prose prose-zinc dark:prose-invert prose-lg max-w-none text-zinc-700 dark:text-zinc-300">
            <h3 className="text-xl font-bold font-serif text-zinc-950 dark:text-white mt-8 mb-3">1. Introduction</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              Welcome to Blogsify. We respect your privacy and are committed to
              protecting your personal data. This privacy policy will inform you
              as to how we look after your personal data when you visit our
              website and tell you about your privacy rights.
            </p>

            <h3 className="text-xl font-bold font-serif text-zinc-950 dark:text-white mt-8 mb-3">2. Data We Collect</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-3">
              We may collect, use, store and transfer different kinds of
              personal data about you which we have grouped together follows:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400 mb-6">
              <li>
                <strong className="text-zinc-900 dark:text-zinc-100">Identity Data</strong> includes username or similar
                identifier.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-zinc-100">Contact Data</strong> includes email address.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-zinc-100">Technical Data</strong> includes internet protocol (IP)
                address, browser type and version, time zone setting and
                location, browser plug-in types and versions, operating system
                and platform.
              </li>
            </ul>

            <h3 className="text-xl font-bold font-serif text-zinc-950 dark:text-white mt-8 mb-3">3. How We Use Your Data</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-3">
              We will only use your personal data when the law allows us to.
              Most commonly, we will use your personal data in the following
              circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400 mb-6">
              <li>
                Where we need to perform the contract we are about to enter into
                or have entered into with you.
              </li>
              <li>
                Where it is necessary for our legitimate interests (or those of
                a third party) and your interests and fundamental rights do not
                override those interests.
              </li>
            </ul>

            <h3 className="text-xl font-bold font-serif text-zinc-950 dark:text-white mt-8 mb-3">4. Data Security</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We have put in place appropriate security measures to prevent your
              personal data from being accidentally lost, used or accessed in an
              unauthorized way, altered or disclosed.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Privacy;
