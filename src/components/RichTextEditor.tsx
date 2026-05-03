import React, { useRef, useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Heading1, Heading2, Heading3,
  Image as ImageIcon, Link as LinkIcon, AlignLeft, AlignCenter,
  AlignRight, AlignJustify, Undo, Redo, Quote, Code, Minus,
  Upload, Type, Maximize2, Minimize2
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ onClick, active, disabled, title, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-1.5 rounded text-sm transition-all ${
      active
        ? 'bg-slate-800 text-white shadow-inner'
        : 'text-slate-700 hover:bg-slate-200 hover:text-slate-900'
    } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px bg-slate-300 mx-0.5 self-stretch" />;

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        blockquote: {},
        code: {},
        codeBlock: {},
        horizontalRule: {},
        strike: {},
      }),
      Image.configure({
        inline: false,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4 block',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800 cursor-pointer',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      const text = editor.getText();
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none',
        spellcheck: 'true',
      },
    },
  });

  const insertImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url, alt: '' }).run();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editor) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        editor.chain().focus().setImage({ src: url, alt: file.name }).run();
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleLinkSubmit = useCallback(() => {
    if (!editor) return;
    if (linkUrl.trim()) {
      const href = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
      editor.chain().focus().setLink({ href }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
    setShowLinkInput(false);
    setLinkUrl('');
  }, [editor, linkUrl]);

  const openLinkInput = () => {
    if (!editor) return;
    const existingHref = editor.getAttributes('link').href || '';
    setLinkUrl(existingHref);
    setShowLinkInput(true);
    setTimeout(() => linkInputRef.current?.focus(), 50);
  };

  const headingOptions = [
    { label: 'Paragraph', value: 0 },
    { label: 'Heading 1', value: 1 },
    { label: 'Heading 2', value: 2 },
    { label: 'Heading 3', value: 3 },
    { label: 'Heading 4', value: 4 },
  ];

  const getCurrentHeading = () => {
    if (!editor) return 0;
    for (let i = 1; i <= 4; i++) {
      if (editor.isActive('heading', { level: i })) return i;
    }
    return 0;
  };

  if (!editor) return null;

  return (
    <div
      className={`border border-slate-300 rounded-lg overflow-hidden shadow-sm flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-[100] rounded-none border-0 shadow-none bg-white' : ''
      }`}
    >
      {/* Toolbar */}
      <div className="bg-slate-50 border-b border-slate-300 px-2 py-1.5 flex flex-wrap items-center gap-0.5">
        {/* Block type selector */}
        <select
          value={getCurrentHeading()}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            if (val === 0) {
              editor.chain().focus().setParagraph().run();
            } else {
              editor.chain().focus().toggleHeading({ level: val as 1|2|3|4 }).run();
            }
          }}
          className="text-xs border border-slate-300 rounded px-1.5 py-1 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400 mr-1"
          title="Text style"
        >
          {headingOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <Divider />

        {/* Text formatting */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold (Ctrl+B)">
          <Bold size={15} strokeWidth={2.5} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic (Ctrl+I)">
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline (Ctrl+U)">
          <UnderlineIcon size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
          <Strikethrough size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline code">
          <Code size={15} />
        </ToolbarButton>

        <Divider />

        {/* Headings quick buttons */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1">
          <Heading1 size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">
          <Heading2 size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">
          <Heading3 size={15} />
        </ToolbarButton>

        <Divider />

        {/* Lists */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list">
          <ListOrdered size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
          <Quote size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code block">
          <Type size={15} />
        </ToolbarButton>

        <Divider />

        {/* Alignment */}
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align left">
          <AlignLeft size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align center">
          <AlignCenter size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align right">
          <AlignRight size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })} title="Justify">
          <AlignJustify size={15} />
        </ToolbarButton>

        <Divider />

        {/* Media */}
        <ToolbarButton onClick={insertImage} title="Insert image from URL">
          <ImageIcon size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => fileInputRef.current?.click()} title="Upload image from device">
          <Upload size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={openLinkInput} active={editor.isActive('link')} title="Insert / edit link">
          <LinkIcon size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule">
          <Minus size={15} />
        </ToolbarButton>

        <Divider />

        {/* History */}
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)">
          <Undo size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (Ctrl+Y)">
          <Redo size={15} />
        </ToolbarButton>

        {/* Fullscreen toggle - push to right */}
        <div className="ml-auto">
          <ToolbarButton onClick={() => setIsFullscreen(!isFullscreen)} title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </ToolbarButton>
        </div>
      </div>

      {/* Link input bar */}
      {showLinkInput && (
        <div className="bg-blue-50 border-b border-blue-200 px-3 py-2 flex items-center gap-2">
          <LinkIcon size={14} className="text-blue-600 flex-shrink-0" />
          <input
            ref={linkInputRef}
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleLinkSubmit();
              if (e.key === 'Escape') { setShowLinkInput(false); setLinkUrl(''); }
            }}
            placeholder="https://example.com"
            className="flex-1 text-sm bg-white border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="button"
            onClick={handleLinkSubmit}
            className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
          >
            Apply
          </button>
          {editor.isActive('link') && (
            <button
              type="button"
              onClick={() => { editor.chain().focus().unsetLink().run(); setShowLinkInput(false); setLinkUrl(''); }}
              className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
            >
              Remove
            </button>
          )}
          <button
            type="button"
            onClick={() => { setShowLinkInput(false); setLinkUrl(''); }}
            className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Editor content area */}
      <div className={`flex-1 overflow-y-auto bg-white ${isFullscreen ? 'min-h-0' : ''}`}>
        <EditorContent
          editor={editor}
          className="h-full"
          style={{ minHeight: isFullscreen ? 'calc(100vh - 120px)' : '400px' }}
        />
      </div>

      {/* Status bar */}
      <div className="bg-slate-50 border-t border-slate-200 px-3 py-1 flex items-center justify-between text-xs text-slate-400">
        <span>{wordCount} words</span>
        <span className="text-slate-300">
          Tip: Select text for quick formatting options
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      <style>{`
        .ProseMirror {
          padding: 20px 24px;
          min-height: 400px;
          outline: none;
        }
        .ProseMirror p { margin: 0 0 1em; line-height: 1.7; color: #1e293b; }
        .ProseMirror h1 { font-size: 2em; font-weight: 800; margin: 1.2em 0 0.4em; color: #0f172a; line-height: 1.2; }
        .ProseMirror h2 { font-size: 1.5em; font-weight: 700; margin: 1.1em 0 0.4em; color: #0f172a; line-height: 1.3; }
        .ProseMirror h3 { font-size: 1.25em; font-weight: 600; margin: 1em 0 0.4em; color: #0f172a; }
        .ProseMirror h4 { font-size: 1.1em; font-weight: 600; margin: 0.9em 0 0.3em; color: #0f172a; }
        .ProseMirror ul { list-style: disc; padding-left: 1.5em; margin: 0.5em 0 1em; }
        .ProseMirror ol { list-style: decimal; padding-left: 1.5em; margin: 0.5em 0 1em; }
        .ProseMirror li { margin: 0.25em 0; line-height: 1.6; }
        .ProseMirror blockquote {
          border-left: 4px solid #f97316;
          margin: 1.2em 0;
          padding: 0.75em 1em 0.75em 1.25em;
          background: #fff7ed;
          border-radius: 0 6px 6px 0;
          font-style: italic;
          color: #7c3aed;
        }
        .ProseMirror blockquote p { margin: 0; color: #374151; }
        .ProseMirror code {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 2px 6px;
          font-family: 'Courier New', monospace;
          font-size: 0.875em;
          color: #dc2626;
        }
        .ProseMirror pre {
          background: #1e293b;
          color: #e2e8f0;
          border-radius: 8px;
          padding: 1em 1.25em;
          margin: 1em 0;
          overflow-x: auto;
        }
        .ProseMirror pre code {
          background: none;
          border: none;
          padding: 0;
          color: inherit;
          font-size: 0.9em;
        }
        .ProseMirror a { color: #2563eb; text-decoration: underline; cursor: pointer; }
        .ProseMirror a:hover { color: #1d4ed8; }
        .ProseMirror img { max-width: 100%; height: auto; border-radius: 8px; margin: 1em 0; display: block; }
        .ProseMirror hr { border: none; border-top: 2px solid #e2e8f0; margin: 2em 0; }
        .ProseMirror strong { font-weight: 700; }
        .ProseMirror em { font-style: italic; }
        .ProseMirror s { text-decoration: line-through; color: #94a3b8; }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
          float: left;
          height: 0;
        }
        .ProseMirror *::selection { background: #bfdbfe; }
      `}</style>
    </div>
  );
};
