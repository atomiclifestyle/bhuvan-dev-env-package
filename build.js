import JavaScriptObfuscator from 'javascript-obfuscator';
import fs from 'fs';
import path from 'path';

const srcDir = 'src';
const distDir = 'dist';
const inputFile = path.join(srcDir, 'index.js');
const outputFile = path.join(distDir, 'index.js');

console.log('Starting obfuscation process...');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
  console.log(`Created directory: ${distDir}`);
}

const sourceCode = fs.readFileSync(inputFile, 'utf8');
console.log(`Read source file: ${inputFile}`);

const obfuscationResult = JavaScriptObfuscator.obfuscate(sourceCode, {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  debugProtection: false,
  debugProtectionInterval: 0,
  disableConsoleOutput: true,
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: true,
  renameGlobals: false,
  selfDefending: true,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 10,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayEncoding: ['base64'],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 2,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 4,
  stringArrayWrappersType: 'function',
  stringArrayThreshold: 0.75,
  transformObjectKeys: true,
  unicodeEscapeSequence: false
});

fs.writeFileSync(outputFile, obfuscationResult.getObfuscatedCode());
console.log(`Successfully obfuscated code to: ${outputFile}`);