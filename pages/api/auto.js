import fs from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken';
import { marked } from 'marked';

const axios = await import('axios').then(m => m.default);
const cheerio = await import('cheerio');
const fetch = (await import('node-fetch')).default;
const { Telegraf } = await import('telegraf');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GHOST_ADMIN_API = process.env.GHOST_API_URL;
const GHOST_ADMIN_KEY = process.env.GHOST_ADMIN_API_KEY;
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
  const attribution = `\n<p><em>Sources: Amazon, eBay, YouTube, OpenAI/Groq</em></p>`;
  const aiNotice = `\n<p><em>This article was generated with the assistance of AI tools.</em></p>`;
  return content + disclosure + attribution + aiNotice;
}

async function getAmazonImage(keyword) {
  const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    const $ = cheerio.load(data);
    const imageUrl = $('img.s-image').first().attr('src');
    if (!imageUrl) return null;
    // Clean Amazon URL image modifiers (optional)
    return imageUrl.replace(/\._.*_\.jpg/, '.jpg');
  } catch (err) {
    console.error('❌ Amazon image error:', err.message);
    return null;
  }
}

async function getProductPrices(keyword) {
  const ebayUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(keyword)}`;
  const res = await axios.get(ebayUrl);
  const $ = cheerio.load(res.data);
  const items = [];
  $('.s-item').slice(0, 3).each((i, el) => {
    const title = $(el).find('.s-item__title').text();
    const price = $(el).find('.s-item__price').text();
    const link = $(el).find('a.s-item__link').attr('href');
    if (title && price && link) items.push({ title, price, link });
  });
  return items;
}

function generatePriceHTML(items) {
  return `\n<section><h3>🛍 Price Comparison</h3><ul>` +
    items.map(i => `<li><a href="${i.link}" target="_blank" rel="noopener">${i.title}</a> - <strong>${i.price}</strong></li>`).join('') +
    '</ul></section>';
}

async function generateBlogPost(niche, keywords) {
  const prompt = `Write a professional, high-standard blog post titled "Top 5 ${keywords} in 2025" with affiliate-style product highlights, intro, bullet points, and summary. Include an engaging tone for a global audience and cite original sources where applicable.`;
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
    console.error('❌ Groq API response error:', JSON.stringify(data, null, 2));
    throw new Error('Groq API did not return expected content.');
  }
  return data.choices[0].message.content;
}

async function fetchYouTubeTopVideos(keyword) {
  const RSS_URL = `https://www.youtube.com/feeds/videos.xml?search_query=${encodeURIComponent(keyword)}`;
  const response = await fetch(RSS_URL);
  const xml = await response.text();
  const matches = Array.from(xml.matchAll(/<title>(.*?)<\/title>/g));
  if (matches.length < 2) return [];
  return matches.slice(1, 4).map(t => t[1]);
}

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

async function postToGhost(title, markdown, niche, priceHtml, image) {
  const slug = slugify(title);

  // Debug raw markdown
  console.log('📄 [DEBUG] Raw Markdown Content:\n', markdown);

  const injectedContent = injectEthicsNotices(markdown);
  console.log('⚙️ [DEBUG] After Injecting Ethics Notices:\n', injectedContent);

  // Convert markdown to HTML
  const htmlBody = marked.parse(injectedContent);
  console.log('🧾 [DEBUG] HTML Converted by marked:\n', htmlBody);

  // Compose full HTML for Ghost, wrap all content inside one div
  const fullContent = `
    <div class="post-content">
      ${htmlBody}
      ${priceHtml}
    </div>
  `;

  // Final content preview
  console.log('✅ [DEBUG] Final HTML sent to Ghost:\n', fullContent);

  try {
    const [id, secret] = GHOST_ADMIN_KEY.split(':');
    const token = jwt.sign(
      { exp: Math.floor(Date.now() / 1000) + 5 * 60, aud: '/admin/' },
      Buffer.from(secret, 'hex'),
      { keyid: id, algorithm: 'HS256' }
    );

    // Ghost Admin API expects 'html' for HTML content
    const res = await fetch(`${GHOST_ADMIN_API}/ghost/api/admin/posts/`, {
      method: 'POST',
      headers: {
        'Authorization': `Ghost ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        posts: [{
          title,
          slug,
          html: fullContent,
          status: 'published',
          tags: ['TrendifyTube', ...tagsMap[niche]],
          feature_image: image
        }]
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ Ghost API HTTP Error (${res.status}):\n`, errorText);
      return null;
    }

    const result = await res.json();

    if (!result.posts || !result.posts[0] || !result.posts[0].url) {
      console.error('❌ Ghost post missing URL in API response.');
      return null;
    }

    return result.posts[0].url;

  } catch (err) {
    console.error('❌ Ghost post error:', err.message);
    return null;
  }
}

async function postToBlogger(title, markdown) {
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

    const htmlContent = `<div class="post-content">${marked.parse(injectEthicsNotices(markdown))}</div>`;

    const postRes = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ kind: 'blogger#post', title, content: htmlContent })
    });

    const result = await postRes.json();

    const postUrl = result.url || result.selfLink || null;

    if (!postUrl) {
      console.warn('⚠️ Blogger API response missing post URL');
    } else {
      console.log('✅ Blogger post published:', postUrl);
    }

    return postUrl;

  } catch (err) {
    console.error('❌ Blogger posting failed:', err.message);
    return null;
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
sources: [${sources.map(s => `"${s}"`).join(', ')}]
---

`;

    const fullContent = frontmatter + content;

    await fs.writeFile(path.join(dir, `${slug}.md`), fullContent, 'utf8');

    console.log(`✅ Saved post locally at content/posts/${yearMonth}/${slug}.md`);
  } catch (err) {
    console.error('❌ Failed to save post locally:', err);
  }
}

export async function generateAndPublishPost(niche, keyword) {
  const blogTitle = `Top 5 ${keyword} in 2025`;

  try {
    console.log(`[START] Generating blog post for niche=${niche}, keyword=${keyword}`);

    const content = await generateBlogPost(niche, keyword);
    console.log('[OK] Blog content generated');

    const priceItems = await getProductPrices(keyword);
    console.log('[OK] Product prices fetched:', priceItems.length);

    const priceHtml = generatePriceHTML(priceItems);

    const image = await getAmazonImage(keyword);
    console.log('[OK] Amazon image fetched:', image);

    const postUrl = await postToGhost(blogTitle, content, niche, priceHtml, image);
    if (!postUrl) throw new Error('Failed to get post URL from Ghost');

    console.log('[OK] Post published to Ghost:', postUrl);

    await savePostLocally(blogTitle, content, niche, tagsMap[niche], ['Amazon', 'eBay', 'YouTube']);
    console.log('[OK] Post saved locally');

    await postToTelegram(`🧠 *${blogTitle}* is live!\nRead: ${postUrl}`);
    console.log('[OK] Telegram notification sent');

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

    const bloggerPostUrl = await postToBlogger(blogTitle, content);
    if (bloggerPostUrl) {
      console.log('[OK] Posted to Blogger:', bloggerPostUrl);
    } else {
      console.log('[WARN] Blogger post URL undefined');
    }

    console.log('[SUCCESS] Automation completed');
    return postUrl;

  } catch (err) {
    console.error('❌ Automation error:', err);
    return null;
  }
}

export default async function handler(req, res) {
  const index = new Date().getDate() % topics.length;
  const { niche, keyword } = topics[index];

  const postUrl = await generateAndPublishPost(niche, keyword);

  if (postUrl) {
    res.status(200).send("✅ TrendifyTube automation completed");
  } else {
    res.status(500).send("❌ Error running automation");
  }
}
