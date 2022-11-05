const fs = require('fs/promises');
const path = require('path');

async function readFiles(dir) {
  try {
    const files = await fs.readdir(dir, {withFileTypes: true});
    for (const file of files)
      if (!file.isDirectory()) {
        let name = path.parse(file.name).name;
        let ext = path.extname(file.name);
        let size = (await fs.stat(`${dir}\\${file.name}`)).size;
        console.log(`${name} -- ${ext} -- ${size} bytes`);
      }
  } catch (error) {
    console.error('there was an error:', error.message);
  }
}

readFiles(path.resolve(__dirname, 'secret-folder'));