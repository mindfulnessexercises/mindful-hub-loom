import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const items = [
  ['supports-practice-audio', 'joseph-goldstein-morning-meditation-instructions.mp3'],
  ['the-power-of-loving-kindness-how-to-cultivate-it', 'matthew-brensilver-metta-cultivation-concentration-and-purification.mp3'],
  ['style-over-summit-what-dirtbag-billionaire-taught-me-about-practice', 'kittisaro-practice-guided-by-wisdom.mp3'],
  ['cope-with-difficult-emotions-through-mindfulness', 'martin-aylward-the-instinctual-body.mp3'],
  ['10-tips-for-teaching-mindfulness-of-breathing-practices', 'tara-brach-coming-back-to-the-breath.mp3'],
  ['supports-practice-audio', 'oren-jay-sofer-guided-mindfulness-meditation.mp3'],
  ['the-power-of-loving-kindness-how-to-cultivate-it', 'lila-kate-wheeler-kindness-for-all-beings.mp3'],
  ['loving-kindness-benefactor', 'lila-kate-wheeler-kindness-for-all-beings.mp3'],
  ['cope-with-difficult-emotions-through-mindfulness', 'matthew-brensilver-love-relationship-sexuality-and-dharma.mp3'],
  ['what-the-world-needs', 'matthew-brensilver-history-is-ending-today.mp3'],
  ['supports-practice-audio', 'bhikkhu-analayo-guided-meditation-exploring-the-four-satipatthanas.mp3'],
];
for (const [slug, file] of items) {
  const buf = fs.readFileSync(`/tmp/audio/${file}`);
  const path = `${slug}/${file}`;
  const { error } = await sb.storage.from('meditation-audio').upload(path, buf, { contentType: 'audio/mpeg', upsert: true });
  console.log(error ? `ERR ${path}: ${error.message}` : `OK  ${path}`);
}
