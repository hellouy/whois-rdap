/**
 * One-time script: converts word-corpus.ts and word-corpus-extra.ts to JSON.
 * Run with: node scripts/extract-corpus.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

function findMatchingBracket(text, start, open, close) {
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === open) depth++;
    else if (text[i] === close) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function extractStringArray(tsContent, exportName) {
  const marker = `export const ${exportName}`;
  const start = tsContent.indexOf(marker);
  if (start === -1) throw new Error(`Cannot find export ${exportName}`);

  // Find "= [" after the export declaration (skip past type annotations)
  const assignPos = tsContent.indexOf("= [", start);
  if (assignPos === -1) throw new Error(`No array assignment for ${exportName}`);

  const bracketStart = assignPos + 2; // position of '['
  const bracketEnd = findMatchingBracket(tsContent, bracketStart, "[", "]");
  if (bracketEnd === -1) throw new Error(`No closing bracket for ${exportName}`);

  const arrayText = tsContent.slice(bracketStart, bracketEnd + 1);
  const words = [];
  const regex = /"([^"]+)"/g;
  let m;
  while ((m = regex.exec(arrayText)) !== null) {
    words.push(m[1]);
  }
  return words;
}

function extractStringRecord(tsContent, exportName) {
  const marker = `export const ${exportName}`;
  const start = tsContent.indexOf(marker);
  if (start === -1) return {};

  const assignPos = tsContent.indexOf("= {", start);
  const colonPos = tsContent.indexOf(": {", start);
  const braceStart = (assignPos !== -1 && (colonPos === -1 || assignPos < colonPos))
    ? assignPos + 2
    : colonPos + 2;

  if (braceStart < 2) return {};

  const braceEnd = findMatchingBracket(tsContent, braceStart, "{", "}");
  if (braceEnd === -1) return {};

  const objText = tsContent.slice(braceStart, braceEnd + 1);
  const record = {};

  // Match both "key": "value" (quoted keys) and key: "value" (unquoted keys)
  const quotedKeyRegex = /"([^"]+)":\s*"([^"]+)"/g;
  const unquotedKeyRegex = /^\s+([\w-]+):\s*"([^"]+)"/gm;
  let m;
  while ((m = quotedKeyRegex.exec(objText)) !== null) {
    record[m[1]] = m[2];
  }
  while ((m = unquotedKeyRegex.exec(objText)) !== null) {
    if (!record[m[1]]) record[m[1]] = m[2];
  }
  return record;
}

const outDir = join(ROOT, "public", "data");
mkdirSync(outDir, { recursive: true });

const corpusTs = readFileSync(join(ROOT, "src", "lib", "word-corpus.ts"), "utf8");
const corpusExtraTs = readFileSync(join(ROOT, "src", "lib", "word-corpus-extra.ts"), "utf8");

const WORD_CORPUS = extractStringArray(corpusTs, "WORD_CORPUS");
const CORPUS_MEANINGS = extractStringRecord(corpusTs, "CORPUS_MEANINGS");
const WORD_CORPUS_EXTRA = extractStringArray(corpusExtraTs, "WORD_CORPUS_EXTRA");
const CORPUS_EXTRA_MEANINGS = extractStringRecord(corpusExtraTs, "CORPUS_EXTRA_MEANINGS");

writeFileSync(
  join(outDir, "word-corpus.json"),
  JSON.stringify({ words: WORD_CORPUS, meanings: CORPUS_MEANINGS })
);
writeFileSync(
  join(outDir, "word-corpus-extra.json"),
  JSON.stringify({ words: WORD_CORPUS_EXTRA, meanings: CORPUS_EXTRA_MEANINGS })
);

console.log(`✓ word-corpus.json       ${WORD_CORPUS.length} words, ${Object.keys(CORPUS_MEANINGS).length} meanings`);
console.log(`✓ word-corpus-extra.json ${WORD_CORPUS_EXTRA.length} words, ${Object.keys(CORPUS_EXTRA_MEANINGS).length} meanings`);
