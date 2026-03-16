"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useState } from "react";
import {
  MdFormatBold, MdFormatItalic, MdFormatUnderlined,
  MdFormatQuote, MdLink, MdLinkOff,
  MdFormatListBulleted,
} from "react-icons/md";

interface TiptapEditorProps {
  content: object | null;
  onChange: (json: object) => void;
}

function ToolbarButton({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={[
        "inline-flex items-center justify-center w-8 h-8 rounded text-sm transition-all duration-100",
        active
          ? "bg-[#ae894a] text-white"
          : "text-[#1b2a47]/60 hover:text-[#1b2a47] hover:bg-[#1b2a47]/8",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        blockquote: {},
        bulletList: {},
        bold: {},
        italic: {},
        code: false,
        codeBlock: false,
        strike: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-[#ae894a] underline underline-offset-2" },
      }),
      Placeholder.configure({
        placeholder: "Rédigez votre article ici…",
      }),
    ],
    content: content || undefined,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[240px] px-4 py-3 text-[#1b2a47] focus:outline-none [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-5 [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-1.5 [&_blockquote]:border-l-4 [&_blockquote]:border-[#ae894a] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#1b2a47]/70 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1",
      },
    },
  });

  // Sync external content changes (e.g. when editing existing article)
  useEffect(() => {
    if (editor && content && JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
      editor.commands.setContent(content);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addLink() {
    if (!editor) return;
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    }
    setLinkUrl("");
    setShowLinkInput(false);
  }

  if (!editor) return null;

  return (
    <div className="rounded-lg border border-[#1b2a47]/15 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#ae894a]/40 focus-within:border-[#ae894a] transition">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-[#1b2a47]/10 bg-[#f9f5ec]/60">
        {/* Headings */}
        <ToolbarButton
          title="Titre H2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <span className="text-xs font-bold">H2</span>
        </ToolbarButton>
        <ToolbarButton
          title="Titre H3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <span className="text-xs font-bold">H3</span>
        </ToolbarButton>
        <ToolbarButton
          title="Paragraphe"
          active={editor.isActive("paragraph")}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          <span className="text-xs font-medium">¶</span>
        </ToolbarButton>

        <div className="w-px h-5 bg-[#1b2a47]/15 mx-1" />

        {/* Inline styles */}
        <ToolbarButton
          title="Gras"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <MdFormatBold />
        </ToolbarButton>
        <ToolbarButton
          title="Italique"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <MdFormatItalic />
        </ToolbarButton>
        <ToolbarButton
          title="Souligné"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <MdFormatUnderlined />
        </ToolbarButton>

        <div className="w-px h-5 bg-[#1b2a47]/15 mx-1" />

        {/* Blockquote */}
        <ToolbarButton
          title="Citation"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <MdFormatQuote />
        </ToolbarButton>

        {/* Bullet list */}
        <ToolbarButton
          title="Liste à puces"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <MdFormatListBulleted />
        </ToolbarButton>

        <div className="w-px h-5 bg-[#1b2a47]/15 mx-1" />

        {/* Link */}
        <ToolbarButton
          title="Ajouter un lien"
          active={editor.isActive("link") || showLinkInput}
          onClick={() => setShowLinkInput((v) => !v)}
        >
          <MdLink />
        </ToolbarButton>
        {editor.isActive("link") && (
          <ToolbarButton
            title="Supprimer le lien"
            onClick={() => editor.chain().focus().unsetLink().run()}
          >
            <MdLinkOff />
          </ToolbarButton>
        )}
      </div>

      {/* Link input */}
      {showLinkInput && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-[#1b2a47]/10 bg-[#f9f5ec]/40">
          <input
            autoFocus
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addLink(); } }}
            placeholder="https://example.com"
            className="flex-1 text-sm px-2.5 py-1.5 rounded border border-[#1b2a47]/15 text-[#1b2a47] placeholder:text-[#1b2a47]/30 focus:outline-none focus:ring-1 focus:ring-[#ae894a]/40"
          />
          <button
            type="button"
            onClick={addLink}
            className="px-3 py-1.5 rounded text-xs font-semibold text-white"
            style={{ background: "#ae894a" }}
          >
            Valider
          </button>
          <button
            type="button"
            onClick={() => { setShowLinkInput(false); setLinkUrl(""); }}
            className="px-3 py-1.5 rounded text-xs font-medium text-[#1b2a47]/50 hover:text-[#1b2a47]"
          >
            Annuler
          </button>
        </div>
      )}

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  );
}
