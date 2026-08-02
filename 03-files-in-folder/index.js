const fs = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

async function showFiles() {
  try {
    const items = await fs.readdir(folderPath, {
      withFileTypes: true,
    });

    for (const item of items) {
      if (!item.isFile()) {
        continue;
      }

      const filePath = path.join(folderPath, item.name);
      const stats = await fs.stat(filePath);

      const fileName = path.parse(item.name).name;
      const extension = path.extname(item.name).slice(1);
      const fileSize = stats.size;

      console.log(`${fileName} - ${extension} - ${fileSize}`);
    }
  } catch (err) {
    console.error(err.message);
  }
}

showFiles();
