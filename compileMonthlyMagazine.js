import fs from 'fs/promises';
import path from 'path';
import markdownpdf from 'markdown-pdf'; // install with npm i markdown-pdf

async function compileMonthlyMagazine(year, month) {
  try {
    const postsDir = path.join(process.cwd(), 'content', 'posts', `${year}-${String(month).padStart(2, '0')}`);
    const files = await fs.readdir(postsDir);
    const markdowns = [];

    for (const file of files) {
      if (file.endsWith('.md')) {
        const content = await fs.readFile(path.join(postsDir, file), 'utf8');
        markdowns.push(content);
      }
    }

    if (markdowns.length === 0) {
      console.log('No posts found for the month.');
      return;
    }

    const combinedContent = markdowns.join('\n\n---\n\n');

    const outputMdPath = path.join(process.cwd(), `TrendifyTube_Magazine_${year}_${month}.md`);
    await fs.writeFile(outputMdPath, combinedContent, 'utf8');

    const outputPdfPath = outputMdPath.replace('.md', '.pdf');

    markdownpdf().from(outputMdPath).to(outputPdfPath, () => {
      console.log(`✅ Monthly magazine PDF generated at ${outputPdfPath}`);
    });
  } catch (err) {
    console.error('❌ Error compiling monthly magazine:', err);
  }
}

// Run it for the current month (can be scheduled monthly)
if (require.main === module) {
  const now = new Date();
  compileMonthlyMagazine(now.getFullYear(), now.getMonth() + 1);
}

export default compileMonthlyMagazine;
