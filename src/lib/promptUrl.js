export function buildPromptUrl(tool) {
  if (tool.url?.includes('gemini.google.com')) {
    return `https://gemini.google.com/app?text=${encodeURIComponent(tool.prompt || '')}`
  }
  return tool.url || 'https://gemini.google.com/'
}
