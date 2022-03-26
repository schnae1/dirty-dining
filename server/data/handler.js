import extract from 'extract-zip';
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

export const uploadData = async () => {
  const url =
    'https://www.southernnevadahealthdistrict.org/restaurants/download/restaurants.zip';
  const RelativeFilesFolderPath = './data/files';
  const relativePathToZipFile = '/files/restaurats.zip';

  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    await createFolderIfNotExists(RelativeFilesFolderPath);

    await https.get(url, (res) => {
      console.info('Downloading zipped file...');
      const path = `${__dirname}${relativePathToZipFile}`;
      const filePath = fs.createWriteStream(path);
      res.pipe(filePath);
      filePath.on('finish', async () => {
        filePath.close();
        console.info('Download completed.');
        console.info('Unzipping folder...');
        await extract(`${__dirname}${relativePathToZipFile}`, {
          dir: `${__dirname}/files`,
        });
        console.info('Folder unzipped successfully.');
        await deleteFolderIfExists(RelativeFilesFolderPath);
      });
    });
  } catch (error) {
    console.error(`An error occured during data extraction. Error: ${error}`);
  }
};

const createFolderIfNotExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    console.info('No files folder exists. Creating files folder...');
    fs.mkdirSync(folderPath);
    console.info('Files folder created successfully.');
  }
};

const deleteFolderIfExists = (folderPath) => {
  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true });
    console.info(`${folderPath} is deleted!`);
  }
};
