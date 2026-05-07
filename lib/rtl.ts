// Arabic and RTL language detection
const RTL_CHARS_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/

export function isRTLText(text: string): boolean {
  // Check if the text contains Arabic/Persian/Hebrew characters
  return RTL_CHARS_REGEX.test(text)
}

export function getTextDirection(text: string): 'ltr' | 'rtl' {
  // Find the first significant character to determine direction
  const trimmed = text.trim()
  if (!trimmed) return 'ltr'
  
  // Check first 100 characters for RTL
  const sample = trimmed.substring(0, 100)
  const rtlChars = (sample.match(RTL_CHARS_REGEX) || []).length
  const latinChars = (sample.match(/[a-zA-Z]/g) || []).length
  
  // If more RTL characters than Latin, consider it RTL
  return rtlChars > latinChars ? 'rtl' : 'ltr'
}

export function formatMessageContent(content: string): { text: string; dir: 'ltr' | 'rtl' } {
  return {
    text: content,
    dir: getTextDirection(content),
  }
}
