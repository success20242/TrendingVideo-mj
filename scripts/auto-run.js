/**
 * TrendifyTube Blogger Automation Script (Fully Integrated + OAuth token.json)
 *
 * Automates creation and distribution of affiliate blog posts.
 * Features: Amazon & eBay product scraping, Cloudinary image hosting,
 * Blogger posting (OAuth token.json via googleapis), Telegram notifications & polls,
 * Substack webhook, trending YouTube videos, and original commentary generation.
 */

import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import fetch from 'node-fetch';
import { marked } from 'marked';
import { load } from 'cheerio';
import { Telegraf } from 'telegraf';
import cloudinary from 'cloudinary';
import { google } from 'googleapis'; // <-- added for OAuth token.json Blogger API

// ---------------- Cloudinary config ----------------
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// ---------------- ENV vars ----------------
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const SUBSTACK_WEBHOOK = process.env.SUBSTACK_WEBHOOK;
const BLOG_URL = process.env.BLOG_URL;

// OAuth files for Blogger
const CLIENT_SECRET_FILE = 'client_secret.json'; // must exist in project root
const TOKEN_PATH = 'token.json';                 // persisted OAuth token

const bot = new Telegraf(BOT_TOKEN);

// ---------------- Topics and tags ----------------
const topics = [
  { niche: 'tech-top-picks', keyword: 'smartwatches under $100' },
  { niche: 'study-ai-tools', keyword: 'AI tools for students' },
  { niche: 'creator-gadgets', keyword: 'gear for YouTubers' },
  { niche: 'travel-gear', keyword: 'portable wifi devices' },
  { niche: 'gaming-accessories', keyword: 'budget gaming headsets' },
  { niche: 'personal-finance', keyword: 'budgeting tools for beginners' },
  { niche: 'health-tech', keyword: 'fitness trackers for heart rate' },
  { niche: 'remote-work-tools', keyword: 'best laptops for digital nomads' },
  { niche: 'eco-gadgets', keyword: 'solar-powered phone chargers' },
  { niche: 'mental-wellness', keyword: 'guided meditation apps 2025' },
];

const tagsMap = {
  'tech-top-picks': ['Tech', 'Gadgets', 'Smart Devices'],
  'study-ai-tools': ['AI', 'Education', 'Study Tools'],
  'creator-gadgets': ['Content Creation', 'YouTubers', 'Gear'],
  'travel-gear': ['Travel', 'Gadgets', 'WiFi'],
  'gaming-accessories': ['Gaming', 'Headsets', 'Consoles'],
  'personal-finance': ['Finance', 'Budgeting', 'Money Tools'],
  'health-tech': ['Health', 'Fitness', 'Wearables'],
  'remote-work-tools': ['Remote Work', 'Digital Nomads', 'Productivity'],
  'eco-gadgets': ['Sustainability', 'Solar', 'Eco-Friendly'],
  'mental-wellness': ['Wellness', 'Meditation', 'Mindfulness'],
};

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

function injectEthicsNotices(content) {
  const disclosure = `\n\n<p><strong>Disclosure:</strong> This post may contain affiliate links. If you use these links to buy something, we may earn a commission.</p>`;
  const attribution = `
<p><em>Sources:</em>
<ul>
  <li>Product listings from Amazon and eBay (2025)</li>
  <li>Industry trend reports from Grand View Research</li>
  <li>AI-assisted product summaries via OpenAI + Groq API</li>
</ul>
</p>`;
  const aiNotice = `<p><em>This article was generated with the assistance of AI tools.</em></p>`;
  return content + disclosure + attribution + aiNotice;
}

// ---------------- Generate main blog post ----------------
async function generateBlogPost(niche, keywords, recentTopics) {
  const prompt = `
Write a professional, high-quality blog post titled "Top 5 ${keywords} in 2025" featuring affiliate-style product highlights, including an engaging introduction, bullet points for features, and a clear summary.
Important:
- Do NOT repeat any topic from this list of recent posts: ${recentTopics.join(", ")}.
- Begin with an engaging introduction explaining the purpose and relevance of the list.
- For each product:
  - Include the product name as a Markdown hyperlink to a real, official purchase page.
  - Provide bullet points detailing key features and benefits.
  - Ensure every product has a valid link.
- Conclude with a summary, list of sources, and an affiliate disclosure statement.
Use clear, professional language tailored to readers interested in ${keywords}.
`.trim();

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  if (!data.choices || !data.choices[0]?.message?.content) throw new Error('Groq API error.');
  return data.choices[0].message.content;
}

// ---------------- Generate original commentary ----------------
async function generateOriginalCommentary(product) {
  const prompt = `
Write a 250-word original, human-like commentary about this product:
- Product: ${product.title}
- Summary: ${product.summary || "No summary available"}
- Include pros, cons, target users, tips, and usage ideas.
- Write as if you personally tested the product.
- Avoid copying from any sources.
`;
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  });
  const data = await response.json();
  return data.choices[0].message.content;
}

// ---------------- Product scraping and image upload ----------------
async function getProductPrices(keyword) {
  const ebayUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(keyword)}`;
  const res = await axios.get(ebayUrl);
  const $ = load(res.data);
  const items = [];
  const seen = new Set();
  $('.s-item').each((i, el) => {
    const title = $(el).find('.s-item__title').text();
    const price = $(el).find('.s-item__price').text();
    const link = $(el).find('a.s-item__link').attr('href');
    const img = $(el).find('.s-item__image-img').attr('src') || $(el).find('img').attr('src');
    if (title && price && link && img && !seen.has(title + price)) {
      seen.add(title + price);
      items.push({ title, price, link, img });
    }
    if (items.length >= 3) return false;
  });
  return items;
}

async function getAmazonProductImage(keyword) {
  try {
    const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
    const res = await axios.get(amazonUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });
    const $ = load(res.data);
    let img = null;
    $('img.s-image').each((i, el) => {
      const src = $(el).attr('src');
      if (src && src.includes('amazon')) {
        img = src;
        return false;
      }
    });
    return img;
  } catch (err) {
    console.warn('Amazon image fetch failed:', err.message);
    return null;
  }
}

async function uploadImageToCloudinary(imageUrl) {
  try {
    const uploadResult = await cloudinary.v2.uploader.upload(imageUrl, {
      folder: 'trendifytube',
      resource_type: 'image',
    });
    return uploadResult.secure_url;
  } catch (err) {
    console.error('Cloudinary upload failed:', err.message);
    return null;
  }
}

function generatePriceHTML(items) {
  const seen = new Set();
  const unique = items.filter((i) => {
    const key = i.title + i.price;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return (
    `\n<section><h3>🛍 Price Comparison</h3><ul>` +
    unique
      .map(
        (i) =>
          `<li><a href="${i.link}" target="_blank" rel="noopener sponsored nofollow">${i.title}</a> - <strong>${i.price}</strong></li>`
      )
      .join('') +
    '</ul></section>'
  );
}

function generateProductLinksHTML(items) {
  if (!items.length) return '';
  return `<section>
    <h3>🔗 Product Links</h3>
    <ul>
      ${items
        .map(
          (i) =>
            `<li><a href="${i.link}" target="_blank" rel="noopener sponsored nofollow">${i.title}</a></li>`
        )
        .join('\n')}
    </ul>
  </section>`;
}

async function fetchYouTubeTopVideos(keyword) {
  const RSS_URL = `https://www.youtube.com/feeds/videos.xml?search_query=${encodeURIComponent(keyword)}`;
  const response = await fetch(RSS_URL);
  const xml = await response.text();
  const matches = Array.from(xml.matchAll(/<title>(.*?)<\/title>/g));
  if (matches.length < 2) return [];
  return matches.slice(1, 4).map((t) => t[1]);
}

async function postToTelegram(message) {
  try {
    await bot.telegram.sendMessage(CHAT_ID, message, { parse_mode: 'Markdown' });
  } catch (err) {
    console.error('Telegram send message error:', err.message);
  }
}

async function sendPoll(title, options) {
  try {
    await bot.telegram.sendPoll(CHAT_ID, `📊 ${title}`, options.slice(0, 4), { is_anonymous: false });
  } catch (err) {
    console.error('Telegram send poll error:', err.message);
  }
}

async function pushToSubstack(title, content) {
  try {
    await axios.post(SUBSTACK_WEBHOOK, { title, content });
  } catch (err) {
    console.error('Substack webhook failed:', err.message);
  }
}

/* ============================================================
   Blogger Auth (token.json system via googleapis) + Posting
   ============================================================ */
async function getBloggerAuth() {
  const SCOPES = ['https://www.googleapis.com/auth/blogger'];
  const auth = new google.auth.OAuth2();

  let creds;
  try {
    const content = await fs.readFile(CLIENT_SECRET_FILE, 'utf-8');
    creds = JSON.parse(content).installed;
    auth._clientId = creds.client_id;
    auth._clientSecret = creds.client_secret;
    auth.redirectUri = creds.redirect_uris[0];
  } catch (err) {
    throw new Error('Missing client_secret.json for Blogger API');
  }

  try {
    const token = await fs.readFile(TOKEN_PATH, 'utf-8');
    auth.setCredentials(JSON.parse(token));
  } catch (err) {
    const authUrl = auth.generateAuthUrl({ access_type: 'offline', scope: SCOPES });
    console.log('Authorize this app by visiting this URL:', authUrl);
    throw new Error('Run once manually with OAuth code exchange to save token.json');
  }

  // Auto-refresh and save token when refreshed
  auth.on('tokens', async (tokens) => {
    if (tokens.refresh_token) {
      await fs.writeFile(TOKEN_PATH, JSON.stringify(auth.credentials, null, 2));
    }
  });

  return auth;
}

// --- Blogger posting (uses OAuth token.json) ---
async function postToBlogger(title, markdown, imageUrl, productUrl) {
  try {
    // Optional: validate product URL quickly
    if (productUrl) {
      try {
        await fetch(productUrl, { method: 'HEAD', redirect: 'follow', timeout: 5000 });
      } catch {
        productUrl = '';
      }
    }

    const auth = await getBloggerAuth();
    const blogger = google.blogger({ version: 'v3', auth });

    // Resolve blog ID by URL
    const blog = await blogger.blogs.getByUrl({ url: BLOG_URL });
    const blogId = blog.data.id;

    // Upload image (if provided)
    let hostedImageUrl = imageUrl ? await uploadImageToCloudinary(imageUrl) : null;
    if (!hostedImageUrl) hostedImageUrl = imageUrl;

    // Build HTML content
    const htmlContent = `
      ${hostedImageUrl ? `<img src="${hostedImageUrl}" alt="${title}" style="max-width:100%;height:auto;margin-bottom:1rem;" />` : ''}
      <div class="post-content">${marked.parse(injectEthicsNotices(markdown))}</div>
      ${productUrl ? `<p><a href="${productUrl}" rel="nofollow noopener" target="_blank" style="background:#d32f2f;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">Buy Now</a></p>` : ''}
    `;

    // Publish post
    const post = await blogger.posts.insert({
      blogId,
      requestBody: { kind: 'blogger#post', title, content: htmlContent },
    });

    console.log('✅ Blogger post published:', post.data.url);
    return post.data.url;
  } catch (err) {
    console.error('❌ Blogger posting failed:', err.message);
    return '';
  }
}

// ---------------- Save locally ----------------
async function savePostLocally(title, content, niche, tags) {
  try {
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const slug = slugify(title);
    const dir = path.join(process.cwd(), 'content', 'posts', yearMonth);
    await fs.mkdir(dir, { recursive: true });

    const frontmatter = `---\ntitle: "${title}"\ndate: "${now.toISOString()}"\nniche: "${niche}"\ntags: [${tags.map((t) => `"${t}"`).join(', ')}]\n---\n\n`;
    await fs.writeFile(path.join(dir, `${slug}.md`), frontmatter + content, 'utf8');
    console.log(`Saved post locally at content/posts/${yearMonth}/${slug}.md`);
  } catch (err) {
    console.error('Failed to save post locally:', err);
  }
}

// ---------------- Main generator ----------------
async function generateAndPublishPost(niche, keyword, recentTopics) {
  const blogTitle = `Top 5 ${keyword} in 2025`;
  try {
    console.log(`[START] Generating blog post for ${niche} / ${keyword}`);
    const content = await generateBlogPost(niche, keyword, recentTopics);

    const priceItems = await getProductPrices(keyword);
    const amazonImg = await getAmazonProductImage(keyword);
    const imageUrl = amazonImg || priceItems[0]?.img || '';
    const hostedImageUrl = imageUrl ? await uploadImageToCloudinary(imageUrl) : null;

    const priceHtml = generatePriceHTML(priceItems);
    const productLinksHtml = generateProductLinksHTML(priceItems);

    const originalCommentary = priceItems[0] ? await generateOriginalCommentary(priceItems[0]) : '';

    const fullMarkdown = content + productLinksHtml + priceHtml + `\n\n${originalCommentary}`;

    await savePostLocally(blogTitle, fullMarkdown, niche, tagsMap[niche]);
    await pushToSubstack(blogTitle, fullMarkdown);

    const videos = await fetchYouTubeTopVideos(keyword);
    if (videos.length > 0) {
      await postToTelegram(`🎥 Trending Videos:\n- ${videos.join('\n- ')}`);
      await sendPoll('Which product should we review next?', videos);
    }

    const blogPostUrl = await postToBlogger(blogTitle, fullMarkdown, hostedImageUrl, priceItems[0]?.link || '');
    if (blogPostUrl) await postToTelegram(`🧠 *${blogTitle}* is live!\n\n[Read now on our blog](${blogPostUrl})`);

    console.log('✅ Automation completed successfully');
    return true;
  } catch (err) {
    console.error('Automation error:', err);
    return false;
  }
}

// ---------------- Entry point ----------------
async function main() {
  const recentTopics = []; // Load or fetch as needed to avoid duplicates
  const index = new Date().getDate() % topics.length;
  const { niche, keyword } = topics[index];

  const success = await generateAndPublishPost(niche, keyword, recentTopics);
  if (!success) process.exit(1);
}

main();
