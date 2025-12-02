export function buildRelation(
  relationName: string,
  idField: string,
  id: number | null
) {
  if (id == null) {
    return {};
  }

  return {
    [relationName]: {
      connect: { [idField]: id },
    },
  };
}

export function rtfToHtml(rtf: string): string {
  if (!rtf) return "";

  let html = rtf;

  // Remove RTF header and footer
  html = html.replace(/^\\rtf1[^\\]*/g, "");
  html = html.replace(/\\fonttbl[^}]*}/g, "");
  html = html.replace(/\\colortbl[^}]*}/g, "");
  html = html.replace(/\\[*]?[^;\s]*;?/g, "");
  html = html.replace(/\n/g, " ");

  // Handle bold
  html = html.replace(/\\b\s/g, "<strong>");
  html = html.replace(/\\b0\s/g, "</strong>");

  // Handle italic
  html = html.replace(/\\i\s/g, "<em>");
  html = html.replace(/\\i0\s/g, "</em>");

  // Handle underline
  html = html.replace(/\\ul\s/g, "<u>");
  html = html.replace(/\\ulnone\s/g, "</u>");

  // Handle line breaks
  html = html.replace(/\\par\s*/g, "<br />");

  // Handle paragraph breaks
  html = html.replace(/}\s*{/g, "</p><p>");

  // Clean up remaining braces
  html = html.replace(/[{}]/g, "");

  // Trim whitespace
  html = html.trim();

  // Clean up multiple spaces
  html = html.replace(/\s+/g, " ");

  // Wrap in paragraph if not empty
  if (html.length > 0 && !html.startsWith("<p")) {
    html = `<p>${html}</p>`;
  }

  return html;
}

export function rtfToPlainText(rtf: string): string {
  if (!rtf) return "";

  let text = rtf;

  // Remove RTF markup
  text = text.replace(/\\[a-z0-9-]*\s*/gi, "");
  text = text.replace(/[{}]/g, "");

  // Handle common entities
  text = text.replace(/\\'([0-9a-f]{2})/gi, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });

  // Clean up whitespace
  text = text.replace(/\s+/g, " ");
  text = text.trim();

  return text;
}
