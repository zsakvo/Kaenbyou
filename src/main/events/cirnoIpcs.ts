import { app, ipcMain, IpcMainEvent } from 'electron';
import db from '../plugins/datastore';
import Datastore from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import path from 'path';
const STORE_PATH = app.getPath('userData');

export default {
  listen() {
    console.log('开始监听 IPC 事件');
    ipcMain.on('setShelfList', async (evt: IpcMainEvent, shelfList) => {
      if (!(db.shelfDB.get('list').value() instanceof Array)) {
        db.shelfDB.set('list', shelfList).write();
      }
    });
    ipcMain.on('setShelfBooks', async (evt: IpcMainEvent, shelfId: string, books: any[]) => {
      console.log('--->setShelfBooks');
      const list: any = db.shelfDB.get('list');
      const shelf = list.find({
        shelf_id: shelfId
      });
      if (!(shelf.get('books').value() instanceof Array)) {
        shelf.set('books', books).write();
      }
      console.log('setShelfBooks<---');
    });
    ipcMain.on('setChapters', async (evt: IpcMainEvent, data: any) => {
      console.log('--->setChapters');
      console.log(data);
    });
    ipcMain.on('setContent', async (evt: IpcMainEvent, data: any) => {
      console.log('--->setCpt');
      console.log(data);
      data = data.chapter_info;
      const cpt = Datastore(new FileSync(path.join(STORE_PATH, 'db', 'cpts', data.chapter_id)));
      console.log(cpt);
      cpt.set('chapter_title', data.chapter_title).write();
      cpt.set('txt_content', data.txt_content).write();
      cpt.set('author_say', data.author_say).write();
    });
  }
};
