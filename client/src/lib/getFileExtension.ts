export function getFileExtension(url: string) {
    // Use the URL constructor to parse the URL and get pathname
    const pathname = new URL(url).pathname;
  
    // Use a regular expression to extract the file extension
    const extensionMatch = pathname.match(/\.(.+)$/);
  
    if (extensionMatch && extensionMatch[1]) {
      // extensionMatch[1] contains the file extension
      return extensionMatch[1];
    } else {
      // No file extension found
      return null;
    }
}