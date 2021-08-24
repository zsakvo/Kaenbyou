import { app } from 'electron';
import Datastore from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import path from 'path';

const STORE_PATH = app.getPath('userData');
console.log(STORE_PATH);
const adapter = new FileSync(path.join(STORE_PATH, '/data.json'));
const db = Datastore(adapter);

export default db;
