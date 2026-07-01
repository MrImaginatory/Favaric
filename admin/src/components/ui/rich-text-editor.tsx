import { useRef, useEffect } from "react";
import { Bold, Italic, Underline, List, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export function RichTextEditor({ value, onChange, placeholder = "Type something...", maxLength }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Initialize value only once on mount or when value changes externally
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      if (maxLength) {
        // Strip HTML to check length
        const textOnly = html.replace(/<[^>]*>?/gm, '');
        if (textOnly.length > maxLength) {
          // You could optionally revert or block typing here, but for a rich text editor 
          // it's tricky without messing up cursor position. We'll rely on the visual indicator
          // and form validation.
        }
      }
      onChange(html);
    }
  };

  const textLength = (value || "").replace(/<[^>]*>?/gm, '').length;
  const isOverLimit = maxLength ? textLength > maxLength : false;

  const executeCommand = (command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      editorRef.current.focus();
      handleInput();
    }
  };

  return (
    <div className="flex flex-col border rounded-md overflow-hidden bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-1 border-b bg-muted/50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => executeCommand("bold")}
          title="Bold"
          tabIndex={-1}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => executeCommand("italic")}
          title="Italic"
          tabIndex={-1}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => executeCommand("underline")}
          title="Underline"
          tabIndex={-1}
        >
          <Underline className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => executeCommand("insertUnorderedList")}
          title="Bullet List"
          tabIndex={-1}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => executeCommand("insertOrderedList")}
          title="Numbered List"
          tabIndex={-1}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[120px] p-3 focus:outline-none prose dark:prose-invert max-w-none text-sm"
        onInput={handleInput}
        onBlur={handleInput}
        data-placeholder={placeholder}
        style={{
          lineHeight: "1.5",
        }}
      />
      
      {/* Character Counter */}
      {maxLength && (
        <div className={`text-xs p-2 text-right border-t ${isOverLimit ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
          {textLength} / {maxLength}
        </div>
      )}
    </div>
  );
}
