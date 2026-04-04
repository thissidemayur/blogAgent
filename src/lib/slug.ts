
export function generateSlug(topic: string, id: string): string {
  const base = topic
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove special chars
    .replace(/[\s_]+/g, "-") // spaces/underscores → hyphens
    .replace(/-+/g, "-") // collapse multiple hyphens
    .replace(/^-+|-+$/g, "") // trim leading/trailing hyphens
    .slice(0, 50); // max 50 chars for base

  // Take last 6 chars of the cuid as suffix — short but unique enough
  const suffix = id.slice(-6);

  return `${base}-${suffix}`;
}

// Extract plain text from markdown for summary generation
export function extractSummary(markdown: string, length = 300): string {
  return markdown
    .replace(/#{1,6}\s+/g, "") // remove headings
    .replace(/\*\*(.+?)\*\*/g, "$1") // remove bold
    .replace(/\*(.+?)\*/g, "$1") // remove italic
    .replace(/`(.+?)`/g, "$1") // remove inline code
    .replace(/\[(.+?)\]\(.+?\)/g, "$1") // remove links, keep text
    .replace(/^[-*+]\s/gm, "") // remove list markers
    .replace(/^\d+\.\s/gm, "") // remove numbered list markers
    .replace(/\n+/g, " ") // newlines → spaces
    .trim()
    .slice(0, length);
}

// Parse content field — handles both raw markdown and JSON wrapper
// Your pipeline may save {"improved_markdown":"..."} — we unwrap it
export function extractMarkdown(content: string): string {
  try {
    const parsed = JSON.parse(content);
    // Handle {"improved_markdown":"..."} pattern
    if (parsed.improved_markdown) return parsed.improved_markdown;
    // Handle {"content":"..."} pattern
    if (parsed.content) return parsed.content;
    // Handle {"markdown":"..."} pattern
    if (parsed.markdown) return parsed.markdown;
    // If it's JSON but none of the above, stringify it back
    return content;
  } catch {
    // Not JSON — it's already plain markdown
    return content;
  }
}
