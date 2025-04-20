export function cleanForSpeech(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/^#+\s/gm, '')
      .replace(/[_*~]/g, '')
      .replace(/\n{2,}/g, '. ')
      .trim();
  }
  