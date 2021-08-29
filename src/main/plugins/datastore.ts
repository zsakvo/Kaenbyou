import { app } from 'electron';
import Datastore from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import path from 'path';
import fs from 'fs-extra';
import id from 'lodash-id';

const STORE_PATH = app.getPath('userData');

if (!fs.pathExistsSync(path.join(STORE_PATH, 'db', 'cpts'))) {
  fs.mkdirpSync(path.join(STORE_PATH, 'db', 'cpts'));
}

console.log(STORE_PATH);
const shelfDB = Datastore(new FileSync(path.join(STORE_PATH, 'db', 'shelf.json')));
const bookDB = Datastore(new FileSync(path.join(STORE_PATH, 'db', 'book.json')));
const cptDB = Datastore(new FileSync(path.join(STORE_PATH, 'db', 'cpt.json')));
shelfDB._.mixin(id);
bookDB._.mixin(id);
cptDB._.mixin(id);

export default {
  shelfDB,
  bookDB,
  cptDB
};
