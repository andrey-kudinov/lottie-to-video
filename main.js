const fs = require('fs');
const path = require('path');

const directoryPath = 'animations';
const directoryContents = fs.readdirSync(directoryPath, { withFileTypes: true });
const directories = directoryContents.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);

directories.forEach(directory => {
  const fileContents = fs.readFileSync(`${directoryPath}/${directory}/${directory}.json`, 'utf8');

  // загружаем json файл
  const jsonData = JSON.parse(fileContents);

  const fileNames = jsonData.assets.filter(asset => asset.id.includes('image'));
  // обходим все имена файлов

  for (const fileName of fileNames) {
    if (!fileName.p.includes('img')) return

    // открываем файл из директории images
    const imagePath = path.join(`${directoryPath}/${directory}/images`, fileName.p);
    const fileContent = fs.readFileSync(imagePath);

    // кодируем содержимое в base64
    // const encodedContent = base64.encode(fileContent);
    const encodedContent = 'data:image/png;base64,' + Buffer.from(fileContent).toString('base64');

    // заменяем имя файла на его base64-кодированное содержимое
    jsonData.assets.forEach(asset => {
      if (asset.p === fileName.p) {
        asset.p = encodedContent;
        asset.u = '';
      }
    });
  }

  // сохраняем изменения в json файле
  fs.writeFileSync(`${directoryPath}/${directory}/${directory}-base64.json`, JSON.stringify(jsonData));
});
