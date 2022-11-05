const fs = require('fs/promises');
const path = require('path');

async function readContent(dir, file) {
  try {
    const filePath = path.join(dir, file);
    const data = await fs.readFile(filePath, { encoding: 'utf8' });
    return data;
  } catch (err) {
    console.log(err);
  }
}

async function readFiles(dir) {
  try {
    await fs.writeFile(path.join(__dirname, '/project-dist', 'bundle.css'), '');
    const files = await fs.readdir(dir, {withFileTypes: true});
    for (const file of files)
      if (!file.isDirectory() && path.extname(file.name) === '.css') {
        const content = await readContent(dir, file.name);
        await fs.appendFile(path.join(__dirname, '/project-dist', 'bundle.css'), content);
      }
  } catch (error) {
    console.error('there was an error:', error.message);
  }
}

async function updateBundle() {
  await fs.rm(path.join(__dirname, '/project-dist', 'bundle.css'), { recursive: true, force: true });
  await readFiles(path.join(__dirname, 'styles'));
}

updateBundle();