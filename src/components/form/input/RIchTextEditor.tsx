import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
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
    extensions: [StarterKit, Underline],
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

  return (
    <div className={`${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 border border-gray-300 dark:border-gray-700 rounded-t-md p-1 bg-gray-100 dark:bg-gray-800">
        <button
          type="button"
          className={`px-2 py-1 rounded text-sm ${
            editor.isActive("bold")
              ? "bg-blue-500 text-white"
              : "bg-white dark:bg-gray-900"
          }`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </button>
        <button
          type="button"
          className={`px-2 py-1 rounded text-sm ${
            editor.isActive("italic")
              ? "bg-blue-500 text-white"
              : "bg-white dark:bg-gray-900"
          }`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </button>
        <button
          type="button"
          className={`px-2 py-1 rounded text-sm ${
            editor.isActive("underline")
              ? "bg-blue-500 text-white"
              : "bg-white dark:bg-gray-900"
          }`}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          Underline
        </button>
      </div>

      {/* Editor */}
      <div className="rounded-b-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-900">
        <EditorContent editor={editor} className="border-0" />
      </div>
    </div>
  );
};

export default RichTextEditor;
