import AdmZip from 'adm-zip';
import archiver from 'archiver';
import fs from 'fs';

export default { content };

function content(filePath, id) {
  const zip = new AdmZip(filePath);
  const archive = archiver('zip', {
    zlib: { level: 9 },
  });
  const newFilename =
    filePath.substring(0, filePath.length - 4) + '_' + id + '_.odt';

  archive.pipe(fs.createWriteStream(newFilename));

  zip.getEntries().forEach(zipEntry => {
    if (zipEntry.entryName !== 'content.xml') {
      archive.append(zipEntry.getData(), { name: zipEntry.entryName });
    } else {
      const content = zipEntry
        .getData()
        .toString('utf8')
        .slice();

      const regex = /{{TITRE}}/gi,
        newContent = content.replace(regex, 'Substitution du titre réussie');

      archive.append(newContent, { name: zipEntry.entryName });
    }
  });

  archive.finalize();
}
