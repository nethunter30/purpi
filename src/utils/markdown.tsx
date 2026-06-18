import React from "react";

/**
 * Parses a subset of standard Markdown to inline and block elements for safe React rendering.
 * Supports: Headings (#, ##, ###), bold (**text**), lists (- or * for bullet, numbered lists), blockquotes (>), and links ([text](url)).
 */
export function parseMarkdown(text: string): React.ReactNode {
  if (!text) return null;

  // Split content into paragraph/block units by double newlines
  const blocks = text.split(/\r?\n\r?\n/);

  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Code Block
        if (trimmed.startsWith("```")) {
          const lines = trimmed.split("\n");
          const code = lines.slice(1, lines.length - 1).join("\n");
          return (
            <pre key={index} className="bg-purple-950/10 border border-purple-900/20 p-4 rounded-lg overflow-x-auto text-xs font-mono text-purple-200 my-4 leading-relaxed">
              <code>{code}</code>
            </pre>
          );
        }

        // Heading 1
        if (trimmed.startsWith("# ")) {
          return (
            <h1 key={index} className="text-3xl font-extrabold text-white mt-8 mb-4 tracking-tight">
              {renderInlineStyles(trimmed.slice(2))}
            </h1>
          );
        }

        // Heading 2
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4 tracking-tight border-b border-purple-950/20 pb-2">
              {renderInlineStyles(trimmed.slice(3))}
            </h2>
          );
        }

        // Heading 3
        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={index} className="text-xl font-bold text-white mt-6 mb-3 tracking-tight">
              {renderInlineStyles(trimmed.slice(4))}
            </h3>
          );
        }

        // Unordered List
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const items = trimmed.split(/\n[-*]\s+/);
          items[0] = items[0].replace(/^[-*]\s+/, "");
          return (
            <ul key={index} className="list-disc pl-6 space-y-2 text-gray-300 text-sm md:text-base font-light my-4">
              {items.map((item, i) => (
                <li key={i}>{renderInlineStyles(item)}</li>
              ))}
            </ul>
          );
        }

        // Ordered List
        if (/^\d+\.\s+/.test(trimmed)) {
          const items = trimmed.split(/\n\d+\.\s+/);
          items[0] = items[0].replace(/^\d+\.\s+/, "");
          return (
            <ol key={index} className="list-decimal pl-6 space-y-2 text-gray-300 text-sm md:text-base font-light my-4">
              {items.map((item, i) => (
                <li key={i}>{renderInlineStyles(item)}</li>
              ))}
            </ol>
          );
        }

        // Blockquote
        if (trimmed.startsWith("> ")) {
          const content = trimmed.split("\n").map(line => line.replace(/^>\s?/, "")).join("\n");
          return (
            <blockquote key={index} className="border-l-4 border-purple-500 bg-purple-950/10 pl-4 py-2 italic text-gray-400 my-4">
              {renderInlineStyles(content)}
            </blockquote>
          );
        }

        // Paragraph
        return (
          <p key={index} className="text-gray-300 text-sm md:text-base leading-relaxed font-light whitespace-pre-wrap">
            {renderInlineStyles(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function renderInlineStyles(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let currentText = text;
  let keyIdx = 0;

  while (currentText.length > 0) {
    const boldMatch = currentText.match(/\*\*(.*?)\*\*/);
    const linkMatch = currentText.match(/\[(.*?)\]\((.*?)\)/);

    let firstMatch: "bold" | "link" | null = null;
    let matchIdx = -1;

    if (boldMatch && boldMatch.index !== undefined) {
      firstMatch = "bold";
      matchIdx = boldMatch.index;
    }
    if (linkMatch && linkMatch.index !== undefined) {
      if (firstMatch === null || linkMatch.index < matchIdx) {
        firstMatch = "link";
        matchIdx = linkMatch.index;
      }
    }

    if (firstMatch === null) {
      parts.push(<React.Fragment key={keyIdx++}>{currentText}</React.Fragment>);
      break;
    }

    if (matchIdx > 0) {
      parts.push(<React.Fragment key={keyIdx++}>{currentText.slice(0, matchIdx)}</React.Fragment>);
    }

    if (firstMatch === "bold" && boldMatch) {
      parts.push(
        <strong key={keyIdx++} className="font-semibold text-white">
          {boldMatch[1]}
        </strong>
      );
      currentText = currentText.slice(matchIdx + boldMatch[0].length);
    } else if (firstMatch === "link" && linkMatch) {
      parts.push(
        <a
          key={keyIdx++}
          href={linkMatch[2]}
          target={linkMatch[2].startsWith("http") ? "_blank" : undefined}
          rel={linkMatch[2].startsWith("http") ? "noopener noreferrer" : undefined}
          className="text-purple-400 hover:text-purple-300 underline transition-colors"
        >
          {linkMatch[1]}
        </a>
      );
      currentText = currentText.slice(matchIdx + linkMatch[0].length);
    }
  }

  return parts;
}
