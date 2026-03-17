export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Add file size validation (e.g., 2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      return reject(new Error('ファイルサイズは2MBを超えることはできません。'));
    }

    // Add file type validation (allow common text-based files)
    const allowedTypes = [
      'text/plain',
      'text/csv',
      'text/markdown',
      'application/json',
    ];
    // Also check file extension for markdown files which might not have a standard MIME type
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.md')) {
       return reject(new Error('対応しているファイル形式は、.txt, .csv, .md, .jsonのみです。'));
    }


    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsText(file, 'UTF-8');
  });
};
