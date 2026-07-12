"use client";

import { useEditorStore } from "@/store/useEditorStore";

interface RetroToolbarProps {
  className?: string;
}

export default function RetroToolbar({ className }: RetroToolbarProps) {
  const { activeTab, htmlCode, setHtmlCode } = useEditorStore();

  // Insert text at cursor position in HTML editor
  const insertAtCursor = (text: string) => {
    if (activeTab !== 'html') return;
    
    // For simplicity, append to the end of HTML code
    // In a more sophisticated implementation, you'd track cursor position
    setHtmlCode(htmlCode + text);
  };

  // Quick action buttons
  const quickActions = [
    { label: "Bold", value: "<strong>Bold Text</strong>", icon: "B" },
    { label: "Italic", value: "<em>Italic Text</em>", icon: "I" },
    { label: "Link", value: '<a href="#">Link Text</a>', icon: "🔗" },
    { label: "Image", value: '<img src="" alt="Image">', icon: "🖼️" },
    { label: "Heading 1", value: "<h1>Heading 1</h1>", icon: "H1" },
    { label: "Heading 2", value: "<h2>Heading 2</h2>", icon: "H2" },
    { label: "List", value: "<ul><li>Item 1</li></ul>", icon: "•" },
    { label: "Button", value: '<button>Click Me</button>', icon: "□" },
  ];

  return (
    <div className={className || "retro-toolbar"}>
      <div className="flex flex-wrap gap-1 p-2 bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-inner">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => insertAtCursor(action.value)}
            className="retro-toolbar-btn"
            title={action.label}
            type="button"
          >
            <span className="font-bold text-sm">{action.icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
