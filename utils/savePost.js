import fs from 'fs/promises';
import path from 'path';

export async function savePostLocally(title, content) {
  try {
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const folderPath = path.join(process.cwd(), 'content', 'posts', yearMonth);

    await fs.mkdir(folderPath, { recursive: true });

    // sanitize title to create filename
    const filename = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '.md';

    const filePath = path.join(folderPath, filename);
    const mdContent = `# ${title}\n\n${content}`;

    await fs.writeFile(filePath, mdContent, 'utf8');
    console.log(`✅ Saved post locally: ${filePath}`);
    return filePath;
  } catch (error) {
    console.error('❌ Error saving post locally:', error);
    throw error;
  }
}
