import path from 'path';
import fs from 'fs';

const pkgJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json')));

export default async (req, res) => {
  res.status(200).json({version: pkgJson.version});
};
