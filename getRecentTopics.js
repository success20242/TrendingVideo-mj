import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDir = path.join(process.cwd(), 'content', 'posts');

function getRecentTopics() {
  let topics = [];

  // Read year-month folders (e.g., 2025-07)
  const yearMonthFolders = fs.readdirSync(postsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const folder of yearMonthFolders) {
    const folderPath = path.join(postsDir, folder);

    // Read all files in the folder
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
      const fullPath = path.join(folderPath, file);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Parse frontmatter
      const { data } = matter(fileContents);

      if (data && data.title) {
        topics.push(data.title.trim());
      }
    }
  }

  return topics;
}

// Export or log
const recentTopics = getRecentTopics();
console.log(recentTopics);  // For testing: print array of titles

export default recentTopics;
