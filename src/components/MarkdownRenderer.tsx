import React, { useEffect, useState } from "react";
import styles from "../App/App.module.scss";
import Tweet from "./Tweet";

// Add Twitter type declaration
declare global {
  interface Window {
    twttr: any;
  }
}

// Import syntax highlighting if available
let Prism: any;
try {
  Prism = require("prismjs");
  // Import any language support you need
  require("prismjs/components/prism-javascript");
  require("prismjs/components/prism-typescript");
  require("prismjs/components/prism-jsx");
  require("prismjs/components/prism-tsx");
  require("prismjs/components/prism-json");
  require("prismjs/components/prism-css");
  require("prismjs/components/prism-scss");
  require("prismjs/components/prism-bash");
  require("prismjs/components/prism-markdown");
} catch (e) {
  console.warn("Prism syntax highlighting not available");
}

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
}) => {
  const [processedHTML, setProcessedHTML] = useState<string>("");
  const [tweets, setTweets] = useState<Array<{ id: string; caption?: string }>>(
    []
  );

  // Apply syntax highlighting after the component mounts
  useEffect(() => {
    if (Prism) {
      setTimeout(() => {
        Prism.highlightAll();
      }, 10);
    }
  }, [processedHTML]);

  // Extract and deduplicate tweets based on ID to avoid duplicates
  const extractAndDedupeTweets = (content: string) => {
    // Find tweet placeholders in the content with optional captions
    // Matches patterns like {tweet:1234567890123456789} or {tweet:1234567890123456789|Caption text here}
    const tweetRegex = /\{tweet:(\d+)(?:\|(.*?))?\}/g;

    // Match Twitter URLs in formats:
    // 1. @https://x.com/username/status/ID
    // 2. @https://twitter.com/username/status/ID
    const twitterUrlRegex =
      /@https?:\/\/(x\.com|twitter\.com)\/[^\/]+\/status\/(\d+)/g;

    // Also match full URLs without @ prefix
    const fullUrlRegex =
      /https?:\/\/(x\.com|twitter\.com)\/[^\/]+\/status\/(\d+)/g;

    const tweetMatches = [...content.matchAll(tweetRegex)];
    const urlMatches = [...content.matchAll(twitterUrlRegex)];
    const fullUrlMatches = [...content.matchAll(fullUrlRegex)];

    // Use a Map to deduplicate tweets based on their ID
    const tweetsMap = new Map<
      string,
      { id: string; caption?: string; originalText: string }
    >();

    // Add tweets from each format, keeping original text for replacement later
    tweetMatches.forEach((match) => {
      const id = match[1];
      tweetsMap.set(id, {
        id,
        caption: match[2] ? match[2].trim() : undefined,
        originalText: match[0],
      });
    });

    urlMatches.forEach((match) => {
      const id = match[2];
      // Only add if it doesn't already exist (prioritize explicit tweet format)
      if (!tweetsMap.has(id)) {
        tweetsMap.set(id, {
          id,
          caption: undefined,
          originalText: match[0],
        });
      }
    });

    fullUrlMatches.forEach((match) => {
      const id = match[2];
      // Only add if it doesn't already exist
      if (!tweetsMap.has(id)) {
        tweetsMap.set(id, {
          id,
          caption: undefined,
          originalText: match[0],
        });
      }
    });

    return Array.from(tweetsMap.values());
  };

  // Process the markdown to HTML first
  useEffect(() => {
    const extractedTweets = extractAndDedupeTweets(content);
    setTweets(extractedTweets);

    // Process markdown into HTML
    let html = renderMarkdownToHTML(content);

    // Replace tweet placeholders with special markers
    extractedTweets.forEach((tweet, index) => {
      // Handle {tweet:ID} format
      const placeholderRegex = new RegExp(
        `<p>\\{tweet:${tweet.id}(?:\\|.*?)?\\}</p>`,
        "g"
      );

      // Handle @https://x.com/username/status/ID format
      const urlRegex = new RegExp(
        `<p>@https?:\\/\\/(x\\.com|twitter\\.com)\\/[^\\/]+\\/status\\/${tweet.id}<\\/p>`,
        "g"
      );

      // Handle full URLs https://x.com/username/status/ID format
      const fullUrlRegex = new RegExp(
        `<p>https?:\\/\\/(x\\.com|twitter\\.com)\\/[^\\/]+\\/status\\/${tweet.id}<\\/p>`,
        "g"
      );

      // Replace all formats with placeholder divs
      html = html
        .replace(
          placeholderRegex,
          `<div id="tweet-placeholder-${index}" data-tweet-id="${tweet.id}"></div>`
        )
        .replace(
          urlRegex,
          `<div id="tweet-placeholder-${index}" data-tweet-id="${tweet.id}"></div>`
        )
        .replace(
          fullUrlRegex,
          `<div id="tweet-placeholder-${index}" data-tweet-id="${tweet.id}"></div>`
        );
    });

    setProcessedHTML(html);
  }, [content]);

  const decodeHTMLEntities = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
  };

  const renderMarkdownToHTML = (markdown: string): string => {
    // First, escape any HTML in the content
    let processedContent = escapeHtml(markdown);

    // Handle HTML entities that might be in the markdown
    processedContent = processedContent
      .replace(/&amp;#039;/g, "'")
      .replace(/&amp;quot;/g, '"')
      .replace(/&amp;lt;/g, "<")
      .replace(/&amp;gt;/g, ">")
      .replace(/&amp;amp;/g, "&");

    // Process image links with special syntax ![alt text](url)
    processedContent = processedContent.replace(
      /!\[(.*?)\]\((.*?)\)/g,
      (_, alt, src) => {
        const imageAlt = decodeHTMLEntities(alt);
        const imageSrc = decodeHTMLEntities(src);
        return `<div class="markdown-image">
          <img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(imageAlt)}" loading="lazy" />
          ${imageAlt ? `<figcaption>${escapeHtml(imageAlt)}</figcaption>` : ""}
        </div>`;
      }
    );

    // Process code blocks with syntax highlighting
    processedContent = processedContent
      // Replace code blocks with placeholders and add syntax highlighting class
      .replace(/```(.*?)\n([\s\S]*?)```/g, (_, lang, code) => {
        const language = lang.trim() || "plaintext";
        // Decode HTML entities in the code
        const decodedCode = decodeHTMLEntities(code.trim());

        // Format the code with proper indentation
        const formattedCode = formatCode(decodedCode, language);

        return `<pre class="code-block" data-language="${escapeHtml(language)}">
          <div class="code-header"><span class="language-badge">${escapeHtml(language)}</span></div>
          <code class="language-${escapeHtml(language)}">${escapeHtml(formattedCode)}</code>
        </pre>`.replace(/\n\s+/g, "\n");
      })
      // Process inline code
      .replace(/`([^`]+)`/g, (_, code) => {
        const decodedCode = decodeHTMLEntities(code);
        return `<code>${escapeHtml(decodedCode)}</code>`;
      })
      // Process headers
      .replace(/^# (.*?)$/gm, "<h1>$1</h1>")
      .replace(/^## (.*?)$/gm, "<h2>$1</h2>")
      .replace(/^### (.*?)$/gm, "<h3>$1</h3>")
      .replace(/^#### (.*?)$/gm, "<h4>$1</h4>")
      // Process bold and italic
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Process links with special styling
      .replace(/\[(.*?)\]\((.*?)\)/g, (_, text, url) => {
        // Skip if already processed as image
        if (text.startsWith("!")) return _;

        // Determine if it's an external link
        const isExternal =
          url.startsWith("http") && !url.includes(window.location.hostname);
        const externalMark = isExternal
          ? ' <span class="external-link-icon">↗</span>'
          : "";
        return `<a href="${escapeHtml(url)}" class="md-link" ${
          isExternal ? 'target="_blank" rel="noopener noreferrer"' : ""
        }>${text}${externalMark}</a>`;
      })
      // Process lists (unordered)
      .replace(/^- (.*?)$/gm, "<li>$1</li>")
      // Process numbered lists
      .replace(/^\d+\. (.*?)$/gm, "<li>$1</li>");

    // Split into blocks and process paragraphs
    const blocks = processedContent.split(/\n\n+/);
    processedContent = blocks
      .map((block) => {
        // Skip if already processed as block element
        if (
          block.startsWith("<h") ||
          block.startsWith("<pre") ||
          block.startsWith("<ul") ||
          block.startsWith("<ol") ||
          block.startsWith("<div") ||
          block.startsWith("<blockquote")
        ) {
          return block;
        }

        // Process lists
        if (block.includes("<li>")) {
          if (block.match(/^\d+\./m)) {
            return `<ol>${block}</ol>`;
          }
          return `<ul>${block}</ul>`;
        }

        // Process paragraphs
        return `<p>${block.replace(/\n/g, "<br />")}</p>`;
      })
      .join("");

    return processedContent;
  };

  // Format code with proper indentation
  const formatCode = (code: string, language: string) => {
    // Basic formatting - ensure proper line breaks
    let formatted = code.replace(/\\n/g, "\n");

    // For JSX/TSX/JS/TS, do more formatting
    if (["jsx", "tsx", "javascript", "typescript"].includes(language)) {
      // Add line breaks after certain characters if not already present
      formatted = formatted
        .replace(/;\s*(?!\n)/g, ";\n") // Add newline after semicolons
        .replace(/{\s*(?!\n)/g, "{\n") // Add newline after opening braces
        .replace(/}\s*(?!\n)/g, "}\n") // Add newline after closing braces
        .replace(/>\s*(?!\n)(?!<\/)/g, ">\n"); // Add newline after closing tags (but not before closing tags)

      // Fix indentation
      const lines = formatted.split("\n");
      let indentLevel = 0;
      formatted = lines
        .map((line) => {
          // Adjust indent level based on braces and tags
          const closingBraceOrTag =
            line.trim().startsWith("}") || line.trim().startsWith("</");
          if (closingBraceOrTag) indentLevel = Math.max(0, indentLevel - 1);

          const indent = "  ".repeat(indentLevel);
          const formattedLine = indent + line.trim();

          const openingBraceOrTag =
            (line.includes("{") && !line.includes("}")) ||
            (line.includes("<") && !line.includes("</"));
          if (openingBraceOrTag) indentLevel++;

          return formattedLine;
        })
        .join("\n");
    }

    return formatted;
  };

  const escapeHtml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // Render content with React Tweet components
  const renderContent = () => {
    return (
      <>
        <div
          className={styles.markdownContent}
          dangerouslySetInnerHTML={{ __html: processedHTML }}
        />
        {tweets.map((tweet, index) => {
          // Find the placeholder element
          const placeholder =
            typeof document !== "undefined"
              ? document.getElementById(`tweet-placeholder-${index}`)
              : null;

          // Only render if there's a placeholder or we're server-side
          return (
            <div
              key={tweet.id}
              className={styles.tweetContainer}
              style={{
                // Use margin to adjust position if placeholder exists
                marginTop: placeholder ? "-1rem" : undefined,
              }}
            >
              <Tweet id={tweet.id} caption={tweet.caption} />
            </div>
          );
        })}
      </>
    );
  };

  return renderContent();
};

export default MarkdownRenderer;
