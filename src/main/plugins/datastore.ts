import { app } from 'electron';
import Datastore from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import path from 'path';
import fs from 'fs-extra';

const STORE_PATH = app.getPath('userData');

if (!fs.pathExistsSync(path.join(STORE_PATH, 'db'))) {
  fs.mkdirpSync(path.join(STORE_PATH, 'db'));
}

console.log(STORE_PATH);
const shelfDB = Datastore(new FileSync(path.join(STORE_PATH, 'db', 'shelf.json')));
const bookDB = Datastore(new FileSync(path.join(STORE_PATH, 'db', 'book.json')));
const cptDB = Datastore(new FileSync(path.join(STORE_PATH, 'db', 'cpt.json')));

export default {
  shelfDB,
  bookDB,
  cptDB
};
