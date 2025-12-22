import GlassCard from "../components/ui/GlassCard";

const WritingGuidelines = () => {
  return (
    <div className="min-h-screen pt-32 pb-12 px-6 relative overflow-hidden">
      <div className="relative z-10 mx-auto max-w-4xl">
        <GlassCard className="p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Writing Guidelines
          </h1>
          <div className="prose prose-invert prose-lg max-w-none text-white/80">
            <p className="lead">
              At Blogsify, we believe in the power of words to inspire, educate,
              and connect. To maintain a high-quality community, we ask all
              contributors to adhere to the following guidelines.
            </p>

            <h3>1. Originality</h3>
            <p>
              We value unique perspectives. Please ensure that all content you
              publish is your own original work. Plagiarism is strictly
              prohibited and may result in account suspension.
            </p>

            <h3>2. Respectful Discourse</h3>
            <p>
              Our community is diverse. We encourage healthy debate and
              discussion, but hate speech, harassment, and personal attacks will
              not be tolerated in posts or comments.
            </p>

            <h3>3. Formatting</h3>
            <p>To ensure your post is easy to read:</p>
            <ul>
              <li>Use clear, descriptive titles.</li>
              <li>Break up long text with headings and paragraphs.</li>
              <li>Use Markdown features provided in the editor.</li>
              <li>Include high-quality cover images.</li>
            </ul>

            <h3>4. Prohibited Content</h3>
            <p>
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
