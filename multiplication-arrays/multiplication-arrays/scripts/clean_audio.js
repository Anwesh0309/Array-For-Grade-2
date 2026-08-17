#!/usr/bin/env node
/**
 * Removes orphaned .mp3 files not referenced in audioMap.js
 * Run: node scripts/clean_audio.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const audioDir = path.join(__dirname, '../public/assets/audio');
const mapPath  = path.join(__dirname, '../src/utils/audioMap.js');

const mapContent = fs.readFileSync(mapPath, 'utf8');
const referenced = new Set();
const matches = mapContent.matchAll(/"\/assets\/audio\/([^"]+\.mp3)"/g);
for (const m of matches) referenced.add(m[1]);

const files = fs.readdirSync(audioDir).filter(f => f.endsWith('.mp3'));
let removed = 0;
for (const file of files) {
  if (!referenced.has(file)) {
    fs.unlinkSync(path.join(audioDir, file));
    console.log(`  ✗ Removed: ${file}`);
    removed++;
  }
}
console.log(`\n✅ Cleaned ${removed} orphaned file(s). ${files.length - removed} files kept.`);
