const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

// HTML

async function getComponentsData(name) {
  try {
    const data = await fsPromises.readFile(path.join(__dirname, '/components', name), { encoding: 'utf8' });
    return data;
  } catch (err) {
    console.log(err);
  }
}

async function replaceTemplate(elementsArr) {
  let reader = fs.createReadStream(path.resolve(__dirname, 'template.html'), 'utf-8');

  function streamToString (stream) {
    const chunks = [];
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('error', (err) => reject(err));
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
  }

  let content = await streamToString(reader);

  for (const element of elementsArr) {
    if (content.includes(`{{${element}}}`)) {
      let elementData = await getComponentsData(`${element}.html`);
      content = await content.replaceAll(`{{${element}}}`, elementData);
    }
  }

  reader.close();
  return content;
}

async function readFiles(dir) {
  try {
    const fileArray = [];
    const files = await fsPromises.readdir(dir, {withFileTypes: true});
    for (const file of files)
      if (!file.isDirectory() && path.extname(file.name) === '.html') {
        let name = path.parse(file.name).name;
        fileArray.push(name);
      }
    return fileArray;
  } catch (error) {
    console.error('there was an error:', error.message);
  }
}

async function makeHtmlBundle() {
  let elements = [];
  elements = await readFiles(path.join(__dirname, 'components'));
  const newHTML = await replaceTemplate(elements);
  await fsPromises.writeFile(path.join(__dirname, '/project-dist', 'index.html'), newHTML);
}

// CSS

async function readCssContent(dir, file) {
  try {
    const filePath = path.join(dir, file);
    const data = await fsPromises.readFile(filePath, { encoding: 'utf8' });
    return data;
  } catch (err) {
    console.log(err);
  }
}

async function readStyles(dir) {
  try {
    await fsPromises.writeFile(path.join(__dirname, '/project-dist', 'style.css'), '');
    const Styles = await fsPromises.readdir(dir, {withFileTypes: true});
    for (const file of Styles)
      if (!file.isDirectory() && path.extname(file.name) === '.css') {
        const content = await readCssContent(dir, file.name);
        await fsPromises.appendFile(path.join(__dirname, '/project-dist', 'style.css'), content);
      }
  } catch (error) {
    console.error('there was an error:', error.message);
  }
}

async function makeCssBundle() {
  await fsPromises.rm(path.join(__dirname, '/project-dist', 'style.css'), { recursive: true, force: true });
  await readStyles(path.join(__dirname, 'styles'));
}

// Assets

async function copyFiles(src,dest) {
  const entries = await fsPromises.readdir(src, {withFileTypes: true});
  await fsPromises.mkdir(dest, {recursive: true});
  for(let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if(entry.isDirectory()) {
      await copyFiles(srcPath, destPath);
    } else {
      await fsPromises.copyFile(srcPath, destPath);
    }
  }
}

async function makeAssets() {
  await fsPromises.rm(path.join(__dirname,'/project-dist', 'assets'), { recursive: true, force: true });
  await copyFiles(path.join(__dirname, 'assets'), path.join(__dirname, '/project-dist', 'assets'));
}

// Full

async function makeFullBundle() {
  await makeAssets();
  console.log('--> Copied assets');
  await makeHtmlBundle();
  console.log('--> Compiled html');
  await makeCssBundle();
  console.log('--> Compled css');
}

makeFullBundle();