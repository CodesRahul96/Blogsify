import GlassCard from "../components/ui/GlassCard";

const WritingGuidelines = () => {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6 relative overflow-hidden bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
      <div className="relative z-10 mx-auto max-w-4xl">
        <GlassCard className="p-8 md:p-12">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-zinc-950 dark:text-white tracking-tight mb-8">
            Writing Guidelines
          </h1>
          <div className="prose prose-zinc dark:prose-invert prose-lg max-w-none text-zinc-700 dark:text-zinc-300">
            <p className="lead text-lg font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed mb-6">
              At Blogsify, we believe in the power of words to inspire, educate,
              and connect. To maintain a high-quality community, we ask all
              contributors to adhere to the following guidelines.
            </p>

            <h3 className="text-xl font-bold font-serif text-zinc-950 dark:text-white mt-8 mb-3">1. Originality</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              We value unique perspectives. Please ensure that all content you
              publish is your own original work. Plagiarism is strictly
              prohibited and may result in account suspension.
            </p>

            <h3 className="text-xl font-bold font-serif text-zinc-950 dark:text-white mt-8 mb-3">2. Respectful Discourse</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              Our community is diverse. We encourage healthy debate and
              discussion, but hate speech, harassment, and personal attacks will
              not be tolerated in posts or comments.
            </p>

            <h3 className="text-xl font-bold font-serif text-zinc-950 dark:text-white mt-8 mb-3">3. Formatting</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-3">To ensure your post is easy to read:</p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400 mb-6">
              <li>Use clear, descriptive titles.</li>
              <li>Break up long text with headings and paragraphs.</li>
              <li>Use Markdown features provided in the editor.</li>
              <li>Include high-quality cover images.</li>
            </ul>

            <h3 className="text-xl font-bold font-serif text-zinc-950 dark:text-white mt-8 mb-3">4. Prohibited Content</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Do not post content that is illegal, explicit, or designed to
              spam/scam users. We reserve the right to remove any content that
              violates our policies.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default WritingGuidelines;
