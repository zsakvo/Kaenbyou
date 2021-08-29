import { app } from 'electron';
import Datastore from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import path from 'path';

const STORE_PATH = app.getPath('userData');

console.log(STORE_PATH);
const shelfDB = Datastore(new FileSync(path.join(STORE_PATH, 'db', 'shelf.json')));

export default {
  shelfDB
};
