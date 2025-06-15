import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";

interface RichTextEditorProps {
  name: string;
  className?: string;
}

const RichTextEditor = ({ name, className }: RichTextEditorProps) => {
  const { setValue, watch } = useFormContext();
  const content = watch(name) || "";

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content,
    onUpdate: ({ editor }) => {
      setValue(name, editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content]);

  if (!editor) return null;

  const buttonStyle = (active: boolean) =>
    `px-2 py-1 rounded text-sm ${
      active ? "bg-blue-500 text-white" : "bg-white dark:bg-gray-900"
    }`;

  return (
    <div className={className}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 border border-gray-300 dark:border-gray-700 rounded-t-md p-1 bg-gray-100 dark:bg-gray-800">
        <button
          type="button"
          className={buttonStyle(editor.isActive("bold"))}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </button>
        <button
          type="button"
          className={buttonStyle(editor.isActive("italic"))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </button>
        <button
          type="button"
          className={buttonStyle(editor.isActive("underline"))}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          Underline
        </button>
        <button
          type="button"
          className={buttonStyle(editor.isActive("bulletList"))}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Bullet
        </button>
        <button
          type="button"
          className={buttonStyle(editor.isActive("orderedList"))}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          Numbered
        </button>
        <button
          type="button"
          className={buttonStyle(editor.isActive("link"))}
          onClick={() => {
            const url = prompt("Enter URL:");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
        >
          Link
        </button>
        <button
          type="button"
          className={buttonStyle(editor.isActive("heading", { level: 1 }))}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          H1
        </button>
        <button
          type="button"
          className={buttonStyle(editor.isActive("heading", { level: 2 }))}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </button>
        <button
          type="button"
          className={buttonStyle(editor.isActive("codeBlock"))}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          Code
        </button>
        <button
          type="button"
          className={buttonStyle(false)}
          onClick={() => {
            const url = prompt("Enter image URL:");
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
        >
          Image
        </button>
      </div>

      {/* Editor Content */}
      <div className="rounded-b-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-900">
        <EditorContent
          editor={editor}
          className="prose dark:prose-invert max-w-none max-h-[400px] overflow-y-auto"
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
