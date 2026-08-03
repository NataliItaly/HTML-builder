const fs = require('fs/promises');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

async function buildBundle() {
  try {
    const items = await fs.readdir(stylesDir, {
      withFileTypes: true,
    });

    let bundle = '';

    for (const item of items) {
      if (!item.isFile()) {
        continue;
      }

      if (path.extname(item.name) !== '.css') {
        continue;
      }

      const filePath = path.join(stylesDir, item.name);
      const content = await fs.readFile(filePath, 'utf8');

      bundle += `${content}\n`;
    }

    await fs.writeFile(bundlePath, bundle);
  } catch (err) {
    console.error(err.message);
  }
}

buildBundle();
