#!/usr/bin/env node
/**
 * Intellia SG — Multiplication Arrays
 * ElevenLabs Audio Pre-Generator
 * Run: node scripts/generate_audio.js
 * Requires: ELEVENLABS_API_KEY env var or .env.local with VITE_ELEVENLABS_API_KEY
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load API key
let API_KEY = process.env.ELEVENLABS_API_KEY || process.env.VITE_ELEVENLABS_API_KEY;
if (!API_KEY) {
  try {
    const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
    const match = envFile.match(/VITE_ELEVENLABS_API_KEY=(.+)/);
    if (match) API_KEY = match[1].trim();
  } catch {}
}
if (!API_KEY) {
  // Hardcoded for initial generation per PRD
  API_KEY = 'sk_7ef27dccb32144843f8ee5068dfd4223a85326c56c14b00a';
}

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const MODEL    = 'eleven_multilingual_v2';

const STYLE_SETTINGS = {
  celebration:   { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question:      { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis:      { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking:      { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement:     { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
};

// All narration phrases
const phrases = [
  // Wonder
  { text: "Welcome, young mathematician! I am LearnFlow, your learning companion.", style: 'statement' },
  { text: "Imagine this... It is morning at school. The canteen aunty is arranging muffins on a tray.", style: 'thinking' },
  { text: "She places 3 rows of muffins, with 4 muffins in each row.", style: 'statement' },
  { text: "Can you figure out how many muffins there are in all, without counting one by one?", style: 'question' },
  { text: "That is the magic of arrays! Rows and columns help us multiply!", style: 'emphasis' },
  { text: "Get ready to discover how arrays make multiplication easy and fun!", style: 'celebration' },

  // Story
  { text: "Let me tell you about Ryan. Ryan is a Primary 2 student at Westwood Primary School.", style: 'statement' },
  { text: "One day, his teacher asked him to help set up chairs in the hall for an assembly.", style: 'statement' },
  { text: "Ryan placed 4 rows of chairs, with 5 chairs in each row.", style: 'statement' },
  { text: "Ryan wondered: how many chairs did he set up in all?", style: 'question' },
  { text: "Ryan looked carefully. He saw 4 rows, each with 5 chairs.", style: 'emphasis' },
  { text: "He wrote it as a multiplication sentence: 4 times 5 equals 20.", style: 'statement' },
  { text: "The chairs were arranged in an array! An array has equal rows and equal columns.", style: 'statement' },
  { text: "Rows go across. Columns go up and down. And rows times columns gives us the total!", style: 'emphasis' },
  { text: "Ryan counted: 5, 10, 15, 20. Yes! 20 chairs in all. Ryan did it!", style: 'celebration' },
  { text: "Now YOU will learn to read and build arrays just like Ryan!", style: 'encouragement' },

  // Simulate introductions
  { text: "Welcome to Station A — the Array Builder!", style: 'statement' },
  { text: "Use the plus and minus buttons to add or remove rows and columns.", style: 'statement' },
  { text: "Watch the multiplication sentence update as you build your array!", style: 'emphasis' },
  { text: "Can you build an array with 3 rows and 4 columns? What is the total?", style: 'question' },
  { text: "Great work! Now try Station B — the Missing Factor Finder!", style: 'encouragement' },
  { text: "I will show you an array, but one part is hidden with a question mark.", style: 'statement' },
  { text: "Look at the array carefully. How many rows or columns are missing?", style: 'emphasis' },
  { text: "Type your answer using the number pad and press Check to see if you are right!", style: 'statement' },
  { text: "Excellent! You have reached Station C — the Multiplication Sentence!", style: 'celebration' },
  { text: "Here you will see a multiplication sentence with one blank to fill in.", style: 'statement' },
  { text: "Use what you know about rows and columns to find the missing number!", style: 'emphasis' },
  { text: "If you need help, tap the hint button to see the array diagram!", style: 'statement' },

  // Reflect
  { text: "Amazing work today! You have completed the entire lesson on arrays!", style: 'celebration' },
  { text: "You learned that an array is a group of objects arranged in equal rows and columns.", style: 'statement' },
  { text: "Rows go across. Columns go down. Rows times columns equals the total.", style: 'emphasis' },
  { text: "You also discovered that multiplication is just a fast way to count equal groups!", style: 'statement' },
  { text: "Before we finish, take a moment to think about what you learned today.", style: 'question' },
  { text: "Tell me one thing that surprised you, or one thing you found tricky. I am here to help!", style: 'encouragement' },
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 60);
}

const audioDir = path.join(__dirname, '../public/assets/audio');
if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

async function generateOne(text, style) {
  const slug = slugify(text);
  const filename = `${style}_${slug}.mp3`;
  const filepath = path.join(audioDir, filename);

  if (fs.existsSync(filepath)) {
    console.log(`  ✓ Exists: ${filename}`);
    return { text, path: `/assets/audio/${filename}` };
  }

  console.log(`  → Generating: ${filename}`);
  const settings = STYLE_SETTINGS[style] || STYLE_SETTINGS.statement;

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, model_id: MODEL, voice_settings: settings }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`  ✗ Failed: ${err}`);
    return null;
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(filepath, buffer);
  console.log(`  ✓ Saved: ${filename}`);
  return { text, path: `/assets/audio/${filename}` };
}

async function main() {
  console.log('🎙️  Intellia SG — Audio Generator');
  console.log(`📁 Output: ${audioDir}`);
  console.log(`📝 Phrases: ${phrases.length}`);
  console.log('');

  const map = {};
  for (const phrase of phrases) {
    const result = await generateOne(phrase.text, phrase.style);
    if (result) map[result.text] = result.path;
    // Rate limit
    await new Promise(r => setTimeout(r, 600));
  }

  // Write audioMap.js
  const mapPath = path.join(__dirname, '../src/utils/audioMap.js');
  const mapContent = `// Auto-generated — do not edit manually\n// Run: node scripts/generate_audio.js\nconst audioMap = ${JSON.stringify(map, null, 2)};\nexport default audioMap;\n`;
  fs.writeFileSync(mapPath, mapContent);
  console.log(`\n✅ audioMap.js written with ${Object.keys(map).length} entries`);
}

main().catch(console.error);
