const fs = require('fs/promises');
const path = require('path');

const sourceDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    // Create the destination folder if it doesn't exist
    await fs.mkdir(targetDir, { recursive: true });

    // Remove old contents of files-copy
    const targetFiles = await fs.readdir(targetDir);

    for (const file of targetFiles) {
      await fs.unlink(path.join(targetDir, file));
    }

    // Read the source folder
    const sourceFiles = await fs.readdir(sourceDir);

    // Copy every file
    for (const file of sourceFiles) {
      await fs.copyFile(path.join(sourceDir, file), path.join(targetDir, file));
    }
  } catch (err) {
    console.error(err.message);
  }
}

copyDir();
