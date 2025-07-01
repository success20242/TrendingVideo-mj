import dotenv from 'dotenv';
dotenv.config();

import { Telegraf } from 'telegraf';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error('Error: TELEGRAM_BOT_TOKEN is not set.');
  process.exit(1);
}

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

// Create inline buttons
const topicsButtons = topics.map(t => [{ text: t.keyword, callback_data: t.niche }]);

bot.start((ctx) => {
  ctx.reply('Welcome to TrendifyTube! Choose a topic:', {
    reply_markup: {
      inline_keyboard: topicsButtons
    }
  });
});

bot.on('callback_query', async (ctx) => {
  const niche = ctx.callbackQuery.data;
  await ctx.answerCbQuery(); // Acknowledge button press

  const topic = topics.find(t => t.niche === niche);
  if (!topic) {
    await ctx.reply('Sorry, topic not found.');
    return;
  }

  await ctx.reply(`Generating post for: *${topic.keyword}* ...`, { parse_mode: 'Markdown' });

  try {
    // Import the handler module that generates posts
    const { generateAndPublishPost } = await import('./daily.js');

    // Call the generation function with niche and keyword
    const postUrl = await generateAndPublishPost(topic.niche, topic.keyword);

    if (postUrl) {
      await ctx.reply(`✅ Post published! Read here: ${postUrl}`);
    } else {
      await ctx.reply('⚠️ Post generated but no URL returned.');
    }
  } catch (err) {
    console.error('Telegram bot error:', err);
    await ctx.reply('❌ Error occurred during post generation.');
  }
});

bot.launch();

console.log('🤖 Telegram bot started');
