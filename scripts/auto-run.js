/**
 * TrendifyTube Blogger Automation Script
 * 
 * This script automates the creation and distribution of high-quality affiliate blog posts.
 * - Fetches Amazon and eBay product images (Amazon preferred, eBay fallback)
 * - Ensures product links are visible (in a dedicated section)
 * - Posts to Blogger, Telegram (with blog link), Substack, and saves locally
 * - Includes trending YouTube videos and engagement poll to Telegram
 * - SEO, ethics, and disclosure handling
 */

import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import fetch from 'node-fetch';
import { marked } from 'marked';
import { Telegraf } from 'telegraf';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const SUBSTACK_WEBHOOK = process.env.SUBSTACK_WEBHOOK;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const BLOG_URL = process.env.BLOG_URL;

const bot = new Telegraf(BOT_TOKEN);

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
  { niche: 'mental-wellness', keyword: 'guided meditation apps 2025' }
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
  'mental-wellness': ['Wellness', 'Meditation', 'Mindfulness']
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

async function generateBlogPost(niche, keywords) {
  const prompt = `
Write a professional, high-quality blog post titled "Top 5 ${keywords} in 2025" featuring affiliate-style product highlights, including an engaging introduction, bullet points for features, and a clear summary.

Important:
- Do NOT repeat any topic from this list of recent posts: ${recentTopics.join(", ")}.
- Make sure the content and products are unique and have not appeared in the last 30 days.
- Begin with an engaging introduction explaining the purpose and relevance of the list.
- For each product:
  - Include the product name as a Markdown hyperlink to a real, official, Amazon, or trusted retailer purchase page (e.g. [Product Name](https://...)) immediately after the product name. Example: 
"1. [Anker PowerCore Fusion Solar Charger](https://www.anker.com/products/a1625): This charger ..."

  - Provide bullet points detailing key features and benefits.
  - Ensure every product has a valid link—do not use placeholders or fake URLs.
- Organize content using clear headings and concise, easy-to-read paragraphs.
- Conclude with a summary, list of sources, and an affiliate disclosure statement.

Make sure the content is original, informative, and tailored to readers interested in ${keywords}. Use clear, professional language throughout.
`.trim();
  
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })
  });
  const data = await response.json();
  if (!data.choices || !data.choices[0]?.message?.content) {
    throw new Error('Groq API did not return expected content.');
  }
  return data.choices[0].message.content;
}

// Scrape eBay for top 3 product listings (with images)
async function getProductPrices(keyword) {
  const ebayUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(keyword)}`;
  const res = await axios.get(ebayUrl);
  const cheerioModule = await import('cheerio');
  const $ = cheerioModule.load(res.data);
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

// Scrape first Amazon product image for a keyword
async function getAmazonProductImage(keyword) {
  try {
    const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
    const res = await axios.get(amazonUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      }
    });
    const cheerioModule = await import('cheerio');
    const $ = cheerioModule.load(res.data);

    let img = null;
    $('img.s-image').each((i, el) => {
      const src = $(el).attr('src');
      if (src && src.includes('amazon')) {
        img = src;
        return false; // break loop
      }
    });

    return img;
  } catch (err) {
    console.warn('Amazon image fetch failed:', err.message);
    return null;
  }
}

// Price comparison section
function generatePriceHTML(items) {
  const seen = new Set();
  const unique = items.filter(i => {
    const key = i.title + i.price;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return `\n<section><h3>🛍 Price Comparison</h3><ul>` +
    unique.map(i => `<li><a href="${i.link}" target="_blank" rel="noopener sponsored nofollow">${i.title}</a> - <strong>${i.price}</strong></li>`).join('') +
    '</ul></section>';
}

// Explicit visible product links section
function generateProductLinksHTML(items) {
  if (!items.length) return '';
  return `<section>
    <h3>🔗 Product Links</h3>
    <ul>
      ${items.map(i => `<li><a href="${i.link}" target="_blank" rel="noopener sponsored nofollow">${i.title}</a></li>`).join('\n')}
    </ul>
  </section>`;
}

// Fetch trending YouTube videos for visual/engagement value
async function fetchYouTubeTopVideos(keyword) {
  const RSS_URL = `https://www.youtube.com/feeds/videos.xml?search_query=${encodeURIComponent(keyword)}`;
  const response = await fetch(RSS_URL);
  const xml = await response.text();
  const matches = Array.from(xml.matchAll(/<title>(.*?)<\/title>/g));
  if (matches.length < 2) return [];
  return matches.slice(1, 4).map(t => t[1]);
}

// Notify Telegram group
async function postToTelegram(message) {
  try {
    await bot.telegram.sendMessage(CHAT_ID, message, { parse_mode: 'Markdown' });
  } catch (err) {
    console.error('❌ Telegram send message error:', err.message);
  }
}

async function sendPoll(title, options) {
  try {
    await bot.telegram.sendPoll(CHAT_ID, `📊 ${title}`, options.slice(0, 4), { is_anonymous: false });
  } catch (err) {
    console.error('❌ Telegram send poll error:', err.message);
  }
}

async function pushToSubstack(title, content) {
  try {
    await axios.post(SUBSTACK_WEBHOOK, { title, content });
  } catch (err) {
    console.error('❌ Substack webhook failed:', err.message);
  }
}

// Publish to Blogger and return the published URL
async function postToBlogger(title, markdown, imageUrl, productUrl) {
  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: REFRESH_TOKEN,
        grant_type: 'refresh_token'
      })
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    const blogRes = await fetch(`https://www.googleapis.com/blogger/v3/blogs/byurl?url=${BLOG_URL}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const blogData = await blogRes.json();
    const blogId = blogData.id;

    const htmlContent = `
      ${imageUrl ? `<img src="${imageUrl}" alt="${title}" style="max-width:100%;height:auto;display:block;margin-bottom:1rem;" />` : ''}
      <div class="post-content">${marked.parse(injectEthicsNotices(markdown))}</div>
    `;

    const postRes = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ kind: 'blogger#post', title, content: htmlContent })
    });

    const result = await postRes.json();
    console.log('✅ Blogger post published:', result.url);
    return result.url;
  } catch (err) {
    console.error('❌ Blogger posting failed:', err.message);
    return '';
  }
}

async function savePostLocally(title, content, niche, tags, sources) {
  try {
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const slug = slugify(title);
    const dir = path.join(process.cwd(), 'content', 'posts', yearMonth);

    await fs.mkdir(dir, { recursive: true });

    const frontmatter = `--- 
title: "${title}" 
date: "${now.toISOString()}" 
niche: "${niche}" 
tags: [${tags.map(t => `"${t}"`).join(', ')}] 
sources: [
  "Product listings from Amazon and eBay (2025)",
  "Industry trend reports from Grand View Research",
  "AI-assisted product summaries via OpenAI + Groq API"
]
---

`;

    const fullContent = frontmatter + content;

    await fs.writeFile(path.join(dir, `${slug}.md`), fullContent, 'utf8');

    console.log(`✅ Saved post locally at content/posts/${yearMonth}/${slug}.md`);
  } catch (err) {
    console.error('❌ Failed to save post locally:', err);
  }
}

// Main workflow
async function generateAndPublishPost(niche, keyword) {
  const blogTitle = `Top 5 ${keyword} in 2025`;

  try {
    console.log(`[START] Generating blog post for niche=${niche}, keyword=${keyword}`);

    const content = await generateBlogPost(niche, keyword);
    const priceItems = await getProductPrices(keyword);
    console.log('[OK] Product prices fetched:', priceItems.length);

    const amazonImg = await getAmazonProductImage(keyword);
    let imageUrl = amazonImg || priceItems[0]?.img || '';

    const priceHtml = generatePriceHTML(priceItems);
    const productLinksHtml = generateProductLinksHTML(priceItems);

    await savePostLocally(blogTitle, content, niche, tagsMap[niche], []);
    console.log('[OK] Post saved locally');

    await pushToSubstack(blogTitle, content);
    console.log('[OK] Pushed to Substack');

    const videos = await fetchYouTubeTopVideos(keyword);
    console.log('[OK] Fetched YouTube videos:', videos);

    if (videos.length > 0) {
      await postToTelegram(`🎥 Trending Videos:\n- ${videos.join('\n- ')}`);
      console.log('[OK] Trending videos posted to Telegram');
      await sendPoll('Which product should we review next?', videos);
      console.log('[OK] Telegram poll sent');
    } else {
      console.log('[INFO] No videos found for poll');
    }

    // Compose blog post with explicit product links and price comparison
    const blogUrl = await postToBlogger(
      blogTitle,
      content + productLinksHtml + priceHtml,
      imageUrl,
      priceItems[0]?.link || ''
    );
    console.log('[OK] Posted to Blogger');

    let telegramMsg = `🧠 *${blogTitle}* is live!\n\n[Read now on our blog](${blogUrl})`;
    await postToTelegram(telegramMsg);
    console.log('[OK] Telegram notification sent');

    console.log('[SUCCESS] Automation completed');
    return true;
  } catch (err) {
    console.error('❌ Automation error:', err);
    return false;
  }
}

async function main() {
  const index = new Date().getDate() % topics.length;
  const { niche, keyword } = topics[index];

  const success = await generateAndPublishPost(niche, keyword);

  if (success) {
    console.log("✅ TrendifyTube automation completed");
  } else {
    console.error("❌ Error running automation");
    process.exit(1);
  }
}

main();
