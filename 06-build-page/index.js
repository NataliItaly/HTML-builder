const fs = require('fs/promises');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');

const templatePath = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');

async function buildHtml() {
  let template = await fs.readFile(templatePath, 'utf8');

  const components = await fs.readdir(componentsDir, {
    withFileTypes: true,
  });

  for (const component of components) {
    if (!component.isFile() || path.extname(component.name) !== '.html') {
      continue;
    }

    const componentName = path.parse(component.name).name;
    const componentContent = await fs.readFile(
      path.join(componentsDir, component.name),
      'utf8',
    );

    const tag = new RegExp(`{{${componentName}}}`, 'g');
    template = template.replace(tag, componentContent);
  }

  await fs.writeFile(path.join(projectDist, 'index.html'), template);
}

async function buildCss() {
  const files = await fs.readdir(stylesDir, {
    withFileTypes: true,
  });

  let bundle = '';

  for (const file of files) {
    if (!file.isFile() || path.extname(file.name) !== '.css') {
      continue;
    }

    bundle += await fs.readFile(path.join(stylesDir, file.name), 'utf8');

    bundle += '\n';
  }

  await fs.writeFile(path.join(projectDist, 'style.css'), bundle);
}

async function copyDirectory(source, destination) {
  await fs.mkdir(destination, { recursive: true });

  const destinationItems = await fs.readdir(destination, {
    withFileTypes: true,
  });

  for (const item of destinationItems) {
    const itemPath = path.join(destination, item.name);

    if (item.isDirectory()) {
      await fs.rm(itemPath, {
        recursive: true,
        force: true,
      });
    } else {
      await fs.unlink(itemPath);
    }
  }

  const sourceItems = await fs.readdir(source, {
    withFileTypes: true,
  });

  for (const item of sourceItems) {
    const sourcePath = path.join(source, item.name);
    const destinationPath = path.join(destination, item.name);

    if (item.isDirectory()) {
      await copyDirectory(sourcePath, destinationPath);
    } else {
      await fs.copyFile(sourcePath, destinationPath);
    }
  }
}

async function buildPage() {
  try {
    await fs.mkdir(projectDist, { recursive: true });

    await buildHtml();
    await buildCss();
    await copyDirectory(assetsDir, path.join(projectDist, 'assets'));
  } catch (err) {
    console.error(err.message);
  }
}

buildPage();
