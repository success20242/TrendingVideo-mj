import { generateAndPublishPost } from '../pages/api/daily';

(async () => {
  const niche = 'tech-top-picks';
  const keyword = 'smartwatches under $100';

  try {
    const url = await generateAndPublishPost(niche, keyword);
    console.log('Automation completed! Post URL:', url);
  } catch (error) {
    console.error('Automation error:', error);
  }
})();
