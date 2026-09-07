import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import LabelPicker from "../ui/LabelPicker";
import ThemeToggle from "../ui/ThemeToggle";
import { toast } from "react-toastify";
import {
  FiArrowLeft,
  FiSend,
  FiClock,
  FiChevronDown,
  FiEye,
  FiEdit3,
  FiColumns,
  FiBold,
  FiItalic,
  FiCode,
  FiLink,
  FiImage,
  FiList,
  FiHelpCircle,
  FiCheck,
  FiMaximize2,
  FiMinimize2,
  FiRotateCcw,
  FiFileText,
  FiVideo,
  FiSliders,
  FiX,
} from "react-icons/fi";

const isValidUrl = (s) => !s || /^https?:\/\//i.test(s);
const wordCount = (text) => (text || "").trim().split(/\s+/).filter(Boolean).length;
const readTime = (text) => `${Math.max(1, Math.round(wordCount(text) / 200))} min read`;

const CATEGORIES = [
  "General",
  "Technology",
  "Artificial Intelligence",
  "Cybersecurity",
  "Design",
  "Startups",
  "Engineering",
  "Culture",
];

const TEMPLATES = [
  {
    name: "Tech Breakdown",
    content: `## Architecture Overview\n\nExplain the high-level system architecture and problem statement here.\n\n### Key Components\n\n- **Service A:** Handles real-time traffic.\n- **Service B:** Processes background worker jobs.\n\n\`\`\`javascript\n// Sample implementation\nasync function handleWorkflow() {\n  const result = await processTask();\n  return result;\n}\n\`\`\`\n\n> "Simplicity is a prerequisite for reliability." — Edsger W. Dijkstra\n\n### Key Takeaways\n\n1. Measure before optimizing\n2. Design for failure modes\n`,
  },
  {
    name: "Thought Editorial",
    content: `> An exploration of how modern technology and human culture intersect.\n\n## The Premise\n\nStart with an engaging observation that challenges conventional wisdom. Why does this matter today?\n\n### The Shift\n\nDescribe the change that has occurred over recent years. What factors contributed to this new reality?\n\n### Looking Forward\n\nWhat should builders and thinkers anticipate in the next decade?\n`,
  },
  {
    name: "Tutorial Guide",
    content: `## Prerequisites\n\nBefore you begin, ensure you have:\n- Node.js installed (v18+)\n- Basic knowledge of REST APIs\n\n---\n\n### Step 1: Initialization\n\nInstall the required dependencies:\n\n\`\`\`bash\nnpm install express dotenv\n\`\`\`\n\n### Step 2: Implementation\n\nWrite your core logic here with concise explanations.\n\n### Conclusion\n\nSummarize what was achieved and link to further resources.\n`,
  },
];

export default function WriteScreen({ editPost, onSave, onCancel, token }) {
  const [title, setTitle] = useState(editPost?.title || "");
  const [subtitle, setSubtitle] = useState(editPost?.subtitle || "");
  const [content, setContent] = useState(editPost?.content || "");
  const [category, setCategory] = useState(editPost?.category || "General");
  const [tags, setTags] = useState(editPost?.tags || []);
  const [imageUrl, setImageUrl] = useState(editPost?.imageUrl || "");
  const [videoUrl, setVideoUrl] = useState(editPost?.videoUrl || "");
  const [saving, setSaving] = useState(false);

  // View modes: "write" | "split" | "preview"
  const [viewMode, setViewMode] = useState("split");
  const [fontFamily, setFontFamily] = useState("sans"); // "sans" | "serif" | "mono"
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCheatsheet, setShowCheatsheet] = useState(false);
  const [showDetails, setShowDetails] = useState(true); // default open so user sees cover image/video/category/tags immediately
  const [lastSavedTime, setLastSavedTime] = useState(null);

  const textareaRef = useRef(null);
  const containerRef = useRef(null);

  const isEditing = Boolean(editPost);
  const draftKey = `blogsify_draft_${editPost?._id || "new"}`;

  // Load draft if available on initial mount (for new posts)
  useEffect(() => {
    if (!isEditing) {
      try {
        const savedDraft = localStorage.getItem(draftKey);
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          if (parsed.title || parsed.content) {
            setTitle(parsed.title || "");
            setSubtitle(parsed.subtitle || "");
            setContent(parsed.content || "");
            setCategory(parsed.category || "General");
            setTags(parsed.tags || []);
            setImageUrl(parsed.imageUrl || "");
            setVideoUrl(parsed.videoUrl || "");
            setLastSavedTime(parsed.savedAt ? new Date(parsed.savedAt) : null);
          }
        }
      } catch {
        // Ignore JSON parse errors
      }
    }
  }, [draftKey, isEditing]);

  // Auto-save draft every 15 seconds if content changed
  useEffect(() => {
    if (isEditing) return;

    const timer = setInterval(() => {
      if (title.trim() || content.trim()) {
        const payload = {
          title,
          subtitle,
          content,
          category,
          tags,
          imageUrl,
          videoUrl,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem(draftKey, JSON.stringify(payload));
        setLastSavedTime(new Date());
      }
    }, 15000);

    return () => clearInterval(timer);
  }, [title, subtitle, content, category, tags, imageUrl, videoUrl, draftKey, isEditing]);

  const clearDraft = () => {
    if (window.confirm("Clear current draft and start fresh?")) {
      setTitle("");
      setSubtitle("");
      setContent("");
      setImageUrl("");
      setVideoUrl("");
      setTags([]);
      localStorage.removeItem(draftKey);
      setLastSavedTime(null);
      toast.info("Draft reset");
    }
  };

  const applyTemplate = (template) => {
    if (content.trim() && !window.confirm("Replace current content with template?")) {
      return;
    }
    setContent(template.content);
    toast.success(`Applied ${template.name} template`);
  };

  const insertFormatting = (prefix, suffix = "", defaultText = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || defaultText;
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newContent =
      content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 0);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.warn("Please provide an article headline");
      return;
    }
    if (!content.trim()) {
      toast.warn("Please write some article content");
      return;
    }
    if (imageUrl && !isValidUrl(imageUrl)) {
      toast.warn("Cover image must be a valid URL starting with http:// or https://");
      return;
    }
    if (videoUrl && !isValidUrl(videoUrl)) {
      toast.warn("Video must be a valid URL (YouTube, Vimeo, MP4)");
      return;
    }

    setSaving(true);
    const payload = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      category,
      tags,
      content: content.trim(),
      imageUrl: imageUrl.trim() || "",
      videoUrl: videoUrl.trim() || "",
    };

    try {
      const BASE = import.meta.env.VITE_BASE_URL;
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const res = isEditing
        ? await axios.put(`${BASE}/api/posts/${editPost._id}`, payload, { headers })
        : await axios.post(`${BASE}/api/posts`, payload, { headers });

      if (!isEditing) {
        localStorage.removeItem(draftKey);
      }

      toast.success(isEditing ? "Story updated successfully!" : "Story published to Blogsify! 🎉");
      onSave(res.data, isEditing);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save story");
    } finally {
      setSaving(false);
    }
  };

  const wc = wordCount(content);
  const rt = readTime(content);

  const fontClass =
    fontFamily === "serif"
      ? "font-serif"
      : fontFamily === "mono"
      ? "font-mono"
      : "font-sans";

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 flex flex-col transition-colors duration-200"
    >
      {/* ── Top Floating Navigation & Action Bar ── */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/80 px-4 sm:px-8 py-2.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <FiArrowLeft size={15} />
              <span>Back</span>
            </button>
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 hidden sm:inline-flex items-center gap-1.5">
              <FiEdit3 className="text-blue-600 dark:text-blue-400" size={13} />
              <span>{isEditing ? "Editing Story" : "Drafting Story"}</span>
            </span>
            {lastSavedTime && (
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 hidden md:inline-flex items-center gap-1">
                <FiCheck size={11} /> Saved {lastSavedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </div>

          {/* Center: View Switcher (Desktop) */}
          <div className="hidden md:flex items-center p-0.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode("write")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === "write"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
              }`}
            >
              <FiEdit3 size={12} />
              <span>Write</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("split")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === "split"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
              }`}
            >
              <FiColumns size={12} />
              <span>Split View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === "preview"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
              }`}
            >
              <FiEye size={12} />
              <span>Preview</span>
            </button>
          </div>

          {/* Right actions: Theme, Details Toggle, Publish Button */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                showDetails
                  ? "bg-blue-50 dark:bg-blue-500/15 border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              }`}
              title="Toggle Cover Image, Video, Category & Tags section"
            >
              <FiSliders size={13} />
              <span className="hidden sm:inline">Details</span>
              <FiChevronDown size={12} className={`transition-transform duration-200 ${showDetails ? "rotate-180" : ""}`} />
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving || !title.trim() || !content.trim()}
              className="flex items-center gap-2 px-4 sm:px-5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <FiSend size={13} />
                  <span>{isEditing ? "Update Story" : "Publish Story"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Secondary Formatting Toolbar & Stats Ribbon ── */}
      <div className="sticky top-[53px] z-30 bg-zinc-50/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/80 px-4 sm:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
            <button
              type="button"
              onClick={() => insertFormatting("**", "**", "bold text")}
              className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition-colors"
              title="Bold (**text**)"
            >
              <FiBold size={14} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("*", "*", "italic text")}
              className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition-colors"
              title="Italic (*text*)"
            >
              <FiItalic size={14} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("### ", "", "Section Heading")}
              className="px-2 py-1 rounded-lg text-xs font-serif font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition-colors"
              title="Heading 3"
            >
              H3
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("> ", "", "Quote text here")}
              className="px-2 py-1 rounded-lg text-xs font-serif italic text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition-colors"
              title="Blockquote"
            >
              “ Quote
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("- ", "", "List item")}
              className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition-colors"
              title="Bullet list"
            >
              <FiList size={14} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("`", "`", "code")}
              className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition-colors font-mono"
              title="Inline Code (`code`)"
            >
              <FiCode size={14} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("```javascript\n", "\n```", "// code here")}
              className="px-2 py-1 rounded-lg text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition-colors"
              title="Code Block"
            >
              {"{ }"} Code
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("[", "](https://example.com)", "link title")}
              className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition-colors"
              title="Add Link"
            >
              <FiLink size={14} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("![Alt text](", ")", "https://images.unsplash.com/photo-...")}
              className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition-colors"
              title="Embed Image"
            >
              <FiImage size={14} />
            </button>

            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />

            {/* Template Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                <FiFileText size={12} />
                <span>Templates</span>
                <FiChevronDown size={11} />
              </button>
              <div className="absolute left-0 top-full mt-1 hidden group-hover:block w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl py-1 z-50">
                {TEMPLATES.map((tmpl) => (
                  <button
                    type="button"
                    key={tmpl.name}
                    onClick={() => applyTemplate(tmpl)}
                    className="w-full text-left px-3.5 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs transition-colors"
                  >
                    {tmpl.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Markdown Cheatsheet toggle */}
            <button
              type="button"
              onClick={() => setShowCheatsheet(!showCheatsheet)}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              title="Markdown Help"
            >
              <FiHelpCircle size={14} />
            </button>

            {/* Clear Draft */}
            {!isEditing && (title.trim() || content.trim()) && (
              <button
                type="button"
                onClick={clearDraft}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 transition-colors"
                title="Reset Draft"
              >
                <FiRotateCcw size={13} />
              </button>
            )}
          </div>

          {/* Right: Font Selector & Live Metrics */}
          <div className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400 text-xs">
            <div className="flex items-center gap-1 bg-zinc-200/60 dark:bg-zinc-900 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setFontFamily("sans")}
                className={`px-2 py-0.5 rounded font-sans text-[11px] font-medium transition-colors ${
                  fontFamily === "sans"
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                Sans
              </button>
              <button
                type="button"
                onClick={() => setFontFamily("serif")}
                className={`px-2 py-0.5 rounded font-serif text-[11px] font-medium transition-colors ${
                  fontFamily === "serif"
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                Serif
              </button>
              <button
                type="button"
                onClick={() => setFontFamily("mono")}
                className={`px-2 py-0.5 rounded font-mono text-[11px] font-medium transition-colors ${
                  fontFamily === "mono"
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                Mono
              </button>
            </div>

            <span className="font-mono">{wc} words</span>
            <span className="flex items-center gap-1 font-mono">
              <FiClock size={11} /> {rt}
            </span>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
            >
              {isFullscreen ? <FiMinimize2 size={13} /> : <FiMaximize2 size={13} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Markdown Cheatsheet Modal ── */}
      {showCheatsheet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-serif font-bold text-base text-zinc-950 dark:text-white flex items-center gap-2">
                <FiHelpCircle className="text-blue-600 dark:text-blue-400" /> Markdown Cheatsheet
              </h3>
              <button
                type="button"
                onClick={() => setShowCheatsheet(false)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300 font-mono">
              <div className="flex justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950">
                <span># Heading 1</span>
                <span className="text-zinc-400">Large title</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950">
                <span>### Section Heading</span>
                <span className="text-zinc-400">Sub-heading</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950">
                <span>**Bold Text**</span>
                <span className="text-zinc-400">Emphasis</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950">
                <span>*Italic Text*</span>
                <span className="text-zinc-400">Mild emphasis</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950">
                <span>&gt; Blockquote</span>
                <span className="text-zinc-400">Editorial quote</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950">
                <span>- Bullet item</span>
                <span className="text-zinc-400">Unordered list</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950">
                <span>\`code\`</span>
                <span className="text-zinc-400">Inline snippet</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950">
                <span>[Title](https://...)</span>
                <span className="text-zinc-400">Hyperlink</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowCheatsheet(false)}
              className="w-full py-2 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold rounded-xl text-xs"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* ── Main Editor Work Area ── */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6">
        {/* Mobile View Toggle */}
        <div className="md:hidden flex items-center justify-center mb-4">
          <div className="inline-flex p-1 rounded-xl bg-zinc-200/80 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode("write")}
              className={`px-4 py-1.5 rounded-lg transition-colors ${
                viewMode === "write"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                  : "text-zinc-500"
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`px-4 py-1.5 rounded-lg transition-colors ${
                viewMode === "preview"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                  : "text-zinc-500"
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Editor Column */}
          {(viewMode === "write" || viewMode === "split") && (
            <div
              className={`${
                viewMode === "split" ? "md:col-span-6" : "md:col-span-10 md:col-start-2"
              } space-y-6`}
            >
              {/* ── DIRECT STORY MEDIA & METADATA SECTION ── */}
              {showDetails && (
                <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/80 shadow-xs space-y-4 transition-colors">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                      <FiSliders className="text-blue-600 dark:text-blue-400" /> Story Media, Category & Tags
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowDetails(false)}
                      className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                    >
                      Hide Details
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Cover Image URL Input */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Cover Image URL
                      </label>
                      <div className="relative">
                        <FiImage className="absolute left-3.5 top-3 text-zinc-400" size={14} />
                        <input
                          type="url"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/photo-..."
                          className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950 border transition-colors ${
                            imageUrl && !isValidUrl(imageUrl)
                              ? "border-rose-400 dark:border-rose-500"
                              : "border-zinc-200 dark:border-zinc-800"
                          } text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-blue-500`}
                        />
                      </div>
                      {imageUrl && isValidUrl(imageUrl) && (
                        <div className="mt-2 relative rounded-xl overflow-hidden h-24 border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950">
                          <img
                            src={imageUrl}
                            alt="Cover Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => (e.target.style.display = "none")}
                          />
                          <button
                            type="button"
                            onClick={() => setImageUrl("")}
                            className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/60 text-white hover:bg-black"
                            title="Remove cover image"
                          >
                            <FiX size={12} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Video URL Input */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Video URL <span className="font-normal text-zinc-400">(YouTube, Vimeo, MP4)</span>
                      </label>
                      <div className="relative">
                        <FiVideo className="absolute left-3.5 top-3 text-zinc-400" size={14} />
                        <input
                          type="url"
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          placeholder="https://youtube.com/watch?v=..."
                          className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950 border transition-colors ${
                            videoUrl && !isValidUrl(videoUrl)
                              ? "border-rose-400 dark:border-rose-500"
                              : "border-zinc-200 dark:border-zinc-800"
                          } text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-blue-500`}
                        />
                      </div>
                      {videoUrl && isValidUrl(videoUrl) && (
                        <p className="mt-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                          <FiCheck size={11} /> Video link active
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* Category Select */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Story Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500 transition-colors"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quick Stats Banner */}
                    <div className="flex flex-col justify-end">
                      <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
                        <span className="text-zinc-500 dark:text-zinc-400">Word Count: <strong className="text-zinc-900 dark:text-white font-mono">{wc}</strong></span>
                        <span className="text-zinc-500 dark:text-zinc-400">Read Time: <strong className="text-zinc-900 dark:text-white font-mono">{rt}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Tags Picker */}
                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <LabelPicker selectedLabels={tags} onChange={setTags} />
                  </div>
                </div>
              )}

              {/* ── Headline, Subtitle, and Content Editor ── */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/80 shadow-xs space-y-4 transition-colors">
                {/* Headline input */}
                <textarea
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Your story headline..."
                  maxLength={200}
                  rows={2}
                  className="w-full text-2xl sm:text-4xl font-bold font-serif text-zinc-950 dark:text-white bg-transparent border-none outline-none resize-none placeholder-zinc-300 dark:placeholder-zinc-700 leading-tight focus:ring-0"
                />

                {/* Subtitle / Excerpt input */}
                <textarea
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Lead paragraph / Subtitle (optional summary for feed cards)..."
                  maxLength={500}
                  rows={2}
                  className="w-full text-sm sm:text-base text-zinc-600 dark:text-zinc-400 bg-transparent border-none outline-none resize-none placeholder-zinc-300 dark:placeholder-zinc-700 leading-relaxed focus:ring-0"
                />

                <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

                {/* Main Content Markdown Textarea */}
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={"Begin your story here...\n\nMarkdown is fully supported. Use headings, blockquotes, code fences, lists, and images to bring your ideas to life."}
                  rows={22}
                  className={`w-full text-sm sm:text-base ${fontClass} text-zinc-900 dark:text-zinc-100 bg-transparent border-none outline-none resize-y placeholder-zinc-400 dark:placeholder-zinc-600 leading-relaxed focus:ring-0 selection:bg-blue-500/20`}
                />
              </div>
            </div>
          )}

          {/* Right Live Preview Column */}
          {(viewMode === "preview" || viewMode === "split") && (
            <div
              className={`${
                viewMode === "split" ? "md:col-span-6" : "md:col-span-10 md:col-start-2"
              }`}
            >
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800/80 shadow-xs min-h-[500px] transition-colors">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Live Editorial Preview
                  </span>
                  <div className="flex items-center gap-2">
                    {category && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {category}
                      </span>
                    )}
                    <span className="text-xs text-zinc-400">•</span>
                    <span className="text-xs text-zinc-400">{rt}</span>
                  </div>
                </div>

                {/* Hero preview media */}
                {imageUrl && isValidUrl(imageUrl) && (
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800">
                    <img
                      src={imageUrl}
                      alt="Story preview"
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  </div>
                )}

                {/* Article Header in Preview */}
                <h1 className="text-2xl sm:text-3xl font-bold font-serif text-zinc-950 dark:text-white leading-tight mb-3">
                  {title || <span className="text-zinc-300 dark:text-zinc-700">Untitled Story</span>}
                </h1>

                {subtitle && (
                  <p className="text-base text-zinc-600 dark:text-zinc-400 font-light leading-relaxed mb-6 italic border-l-2 border-blue-500 pl-3">
                    {subtitle}
                  </p>
                )}

                {/* Rendered Prose Content */}
                <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-300 leading-relaxed font-sans font-light prose-headings:font-serif prose-headings:font-bold prose-headings:text-zinc-950 dark:prose-headings:text-white prose-blockquote:border-l-2 prose-blockquote:border-blue-600 dark:prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-code:text-blue-700 dark:prose-code:text-sky-300 prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-zinc-900 dark:prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-img:rounded-2xl">
                  {content ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({ href, children, ...props }) => {
                          const safeHref =
                            typeof href === "string" && /^(https?:\/\/|\/|#)/i.test(href)
                              ? href
                              : "#";
                          return (
                            <a
                              href={safeHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 underline underline-offset-4 hover:text-blue-700"
                              {...props}
                            >
                              {children} ↗
                            </a>
                          );
                        },
                      }}
                    >
                      {content}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-zinc-400 dark:text-zinc-600 italic">
                      Start typing on the left to see the live rendered layout here...
                    </p>
                  )}
                </div>

                {/* Tags in preview */}
                {tags.length > 0 && (
                  <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap gap-1.5">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
