const fs = require('fs/promises');
const path = require('path');

async function copyFiles(src,dest) {
  const entries = await fs.readdir(src, {withFileTypes: true});
  await fs.mkdir(dest, {recursive: true});
  for(let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if(entry.isDirectory()) {
      await copyFiles(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
      console.log(`Copied -- ${entry.name}`);
    }
  }
}

async function updateFiles() {
  console.log('--------------------');
  await fs.rm(path.resolve(__dirname, 'files-copy'), { recursive: true, force: true });
  await copyFiles(path.resolve(__dirname, 'files'), path.resolve(__dirname, 'files-copy'));
  console.log('--------------------');}

updateFiles();