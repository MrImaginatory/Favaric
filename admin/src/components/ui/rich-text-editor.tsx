import { useRef, useEffect, useState } from "react";
import { Bold, Italic, Underline, List, ListOrdered, Table as TableIcon, Settings, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export function RichTextEditor({ value, onChange, placeholder = "Type something...", maxLength }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [activeTableNode, setActiveTableNode] = useState<HTMLTableElement | null>(null);
  const [activeCellNode, setActiveCellNode] = useState<HTMLTableCellElement | null>(null);
  const savedSelectionRef = useRef<Range | null>(null);

  // Initialize value only once on mount or when value changes externally
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
    checkTableSelection();
  };

  const textLength = (value || "").replace(/<[^>]*>?/gm, '').length;
  const isOverLimit = maxLength ? textLength >= maxLength : false;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!maxLength) return;
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab'];
    if (e.ctrlKey || e.metaKey || allowedKeys.includes(e.key)) return;
    const html = editorRef.current?.innerHTML || "";
    const textOnly = html.replace(/<[^>]*>?/gm, '');
    if (textOnly.length >= maxLength) e.preventDefault();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (!maxLength) return;
    const html = editorRef.current?.innerHTML || "";
    const textOnly = html.replace(/<[^>]*>?/gm, '');
    const pastedText = e.clipboardData.getData('text/plain');
    if (textOnly.length + pastedText.length > maxLength) e.preventDefault();
  };

  const executeCommand = (command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      editorRef.current.focus();
      handleInput();
    }
  };

  // Check if cursor is inside a table
  const checkTableSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      let node = sel.anchorNode;
      let td: HTMLTableCellElement | null = null;
      let table: HTMLTableElement | null = null;
      
      while (node && node !== editorRef.current) {
        if (node.nodeName === "TD" || node.nodeName === "TH") {
          td = node as HTMLTableCellElement;
        }
        if (node.nodeName === "TABLE") {
          table = node as HTMLTableElement;
          break;
        }
        node = node.parentNode;
      }
      
      setActiveTableNode(table);
      setActiveCellNode(td);
    } else {
      setActiveTableNode(null);
      setActiveCellNode(null);
    }
  };

  const insertCustomTable = (rows: number, cols: number) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }

    if (savedSelectionRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelectionRef.current);
      }
    }

    let trs = "";
    for (let r = 0; r < rows; r++) {
      let tds = "";
      for (let c = 0; c < cols; c++) {
        tds += `<td style="padding: 8px; border: 1px solid #ccc;"><br></td>`;
      }
      trs += `<tr>${tds}</tr>`;
    }
    const tableHTML = `<table border="1" style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;"><tbody>${trs}</tbody></table><br>`;
    executeCommand("insertHTML", tableHTML);
    setPopoverOpen(false);
  };

  // Table Manipulation Functions
  const getRowIndex = (td: HTMLTableCellElement) => {
    const tr = td.parentElement as HTMLTableRowElement;
    return tr ? tr.rowIndex : 0;
  };

  const getColIndex = (td: HTMLTableCellElement) => td.cellIndex;

  const addRow = (direction: 'above' | 'below') => {
    if (!activeTableNode || !activeCellNode) return;
    const tbody = activeTableNode.querySelector('tbody');
    if (!tbody) return;
    const currentRow = activeCellNode.parentElement as HTMLTableRowElement;
    if (!currentRow) return;

    const newRow = document.createElement('tr');
    const colsCount = currentRow.cells.length;
    for (let i = 0; i < colsCount; i++) {
      const newTd = document.createElement('td');
      newTd.style.padding = '8px';
      newTd.style.border = '1px solid #ccc';
      newTd.innerHTML = '<br>';
      newRow.appendChild(newTd);
    }

    if (direction === 'above') {
      tbody.insertBefore(newRow, currentRow);
    } else {
      tbody.insertBefore(newRow, currentRow.nextSibling);
    }
    handleInput();
  };

  const addCol = (direction: 'left' | 'right') => {
    if (!activeTableNode || !activeCellNode) return;
    const colIndex = getColIndex(activeCellNode);
    const rows = activeTableNode.rows;

    for (let i = 0; i < rows.length; i++) {
      const newTd = document.createElement('td');
      newTd.style.padding = '8px';
      newTd.style.border = '1px solid #ccc';
      newTd.innerHTML = '<br>';
      const targetCell = rows[i].cells[colIndex];
      if (direction === 'left') {
        rows[i].insertBefore(newTd, targetCell);
      } else {
        rows[i].insertBefore(newTd, targetCell.nextSibling);
      }
    }
    handleInput();
  };

  const deleteRow = () => {
    if (!activeTableNode || !activeCellNode) return;
    const row = activeCellNode.parentElement as HTMLTableRowElement;
    if (row) row.remove();
    // if table is empty after deletion
    if (activeTableNode.rows.length === 0) {
      activeTableNode.remove();
      setActiveTableNode(null);
    }
    handleInput();
  };

  const deleteCol = () => {
    if (!activeTableNode || !activeCellNode) return;
    const colIndex = getColIndex(activeCellNode);
    const rows = activeTableNode.rows;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].cells[colIndex]) {
        rows[i].cells[colIndex].remove();
      }
    }
    // if table has no columns
    if (activeTableNode.rows.length > 0 && activeTableNode.rows[0].cells.length === 0) {
      activeTableNode.remove();
      setActiveTableNode(null);
    }
    handleInput();
  };

  const deleteTable = () => {
    if (!activeTableNode) return;
    activeTableNode.remove();
    setActiveTableNode(null);
    handleInput();
  };

  return (
    <div className="flex flex-col border rounded-md overflow-hidden bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      {/* Main Toolbar */}
      <div className="flex items-center flex-wrap gap-1 p-1 border-b bg-muted/50">
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => executeCommand("bold")} title="Bold" tabIndex={-1}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => executeCommand("italic")} title="Italic" tabIndex={-1}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => executeCommand("underline")} title="Underline" tabIndex={-1}>
          <Underline className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => executeCommand("insertUnorderedList")} title="Bullet List" tabIndex={-1}>
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => executeCommand("insertOrderedList")} title="Numbered List" tabIndex={-1}>
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        
        {/* Table Selector Popover */}
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button onMouseDown={(e) => {
              e.preventDefault();
              const sel = window.getSelection();
              if (sel && sel.rangeCount > 0) {
                savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
              }
            }} type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" title="Insert Table" tabIndex={-1}>
              <TableIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-2" 
            side="bottom" 
            align="start" 
            onOpenAutoFocus={(e) => e.preventDefault()} 
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <div className="flex flex-col gap-1" onMouseDown={(e) => e.preventDefault()}>
              <span className="text-xs font-medium text-center text-muted-foreground mb-1">
                {hoveredCell ? `${hoveredCell.r} x ${hoveredCell.c}` : "Insert Table"}
              </span>
              <div className="flex flex-col gap-1">
                {Array.from({ length: 6 }).map((_, rIndex) => (
                  <div key={rIndex} className="flex gap-1">
                    {Array.from({ length: 6 }).map((_, cIndex) => {
                      const row = rIndex + 1;
                      const col = cIndex + 1;
                      const isHighlighted = hoveredCell && row <= hoveredCell.r && col <= hoveredCell.c;
                      return (
                        <div
                          key={cIndex}
                          onMouseEnter={() => setHoveredCell({ r: row, c: col })}
                          onClick={() => insertCustomTable(row, col)}
                          className={`w-4 h-4 border border-border rounded-sm cursor-pointer transition-colors ${isHighlighted ? 'bg-primary/50 border-primary' : 'bg-background hover:bg-muted'}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Table Options Popover (visible when cursor is in a table) */}
        {activeTableNode && (
          <>
            <div className="w-px h-4 bg-border mx-1" />
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-primary" title="Table Options" tabIndex={-1}>
                  <Settings className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-52 p-2" side="bottom" align="start">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium text-muted-foreground px-2 py-1">Rows</span>
                  <Button type="button" variant="ghost" size="sm" className="h-8 justify-start gap-2" onClick={() => addRow('above')} tabIndex={-1}>
                    <ArrowUp className="h-3.5 w-3.5" />
                    <span className="text-xs">Add Row Above</span>
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="h-8 justify-start gap-2" onClick={() => addRow('below')} tabIndex={-1}>
                    <ArrowDown className="h-3.5 w-3.5" />
                    <span className="text-xs">Add Row Below</span>
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="h-8 justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={deleteRow} tabIndex={-1}>
                    <Trash className="h-3.5 w-3.5" />
                    <span className="text-xs">Delete Row</span>
                  </Button>

                  <div className="h-px bg-border my-1" />

                  <span className="text-xs font-medium text-muted-foreground px-2 py-1">Columns</span>
                  <Button type="button" variant="ghost" size="sm" className="h-8 justify-start gap-2" onClick={() => addCol('left')} tabIndex={-1}>
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span className="text-xs">Add Column Left</span>
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="h-8 justify-start gap-2" onClick={() => addCol('right')} tabIndex={-1}>
                    <ArrowRight className="h-3.5 w-3.5" />
                    <span className="text-xs">Add Column Right</span>
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="h-8 justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={deleteCol} tabIndex={-1}>
                    <Trash className="h-3.5 w-3.5" />
                    <span className="text-xs">Delete Column</span>
                  </Button>

                  <div className="h-px bg-border my-1" />

                  <Button type="button" variant="ghost" size="sm" className="h-8 justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={deleteTable} tabIndex={-1}>
                    <Trash className="h-3.5 w-3.5" />
                    <span className="text-xs">Delete Table</span>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </>
        )}
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[120px] p-3 focus:outline-none prose dark:prose-invert max-w-none text-sm break-words [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-border [&_td]:p-2"
        onInput={handleInput}
        onBlur={handleInput}
        onKeyDown={handleKeyDown}
        onKeyUp={checkTableSelection}
        onMouseUp={checkTableSelection}
        onPaste={handlePaste}
        data-placeholder={placeholder}
        style={{
          lineHeight: "1.5",
          lineBreak: "anywhere"
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
