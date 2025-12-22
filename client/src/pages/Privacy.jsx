import GlassCard from "../components/ui/GlassCard";

const Privacy = () => {
  return (
    <div className="min-h-screen pt-32 pb-12 px-6 relative overflow-hidden">
      <div className="relative z-10 mx-auto max-w-4xl">
        <GlassCard className="p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Privacy Policy
          </h1>
          <div className="prose prose-invert prose-lg max-w-none text-white/80">
            <p>Last updated: {new Date().toLocaleDateString()}</p>

            <h3>1. Introduction</h3>
            <p>
              Welcome to Blogsify. We respect your privacy and are committed to
              protecting your personal data. This privacy policy will inform you
              as to how we look after your personal data when you visit our
              website and tell you about your privacy rights.
            </p>

            <h3>2. Data We Collect</h3>
            <p>
              We may collect, use, store and transfer different kinds of
              personal data about you which we have grouped together follows:
            </p>
            <ul>
              <li>
                <strong>Identity Data</strong> includes username or similar
                identifier.
              </li>
              <li>
                <strong>Contact Data</strong> includes email address.
              </li>
              <li>
                <strong>Technical Data</strong> includes internet protocol (IP)
                address, browser type and version, time zone setting and
                location, browser plug-in types and versions, operating system
                and platform.
              </li>
            </ul>

            <h3>3. How We Use Your Data</h3>
            <p>
              We will only use your personal data when the law allows us to.
              Most commonly, we will use your personal data in the following
              circumstances:
            </p>
            <ul>
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

            <h3>4. Data Security</h3>
            <p>
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
