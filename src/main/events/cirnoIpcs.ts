import { app, ipcMain, IpcMainEvent } from 'electron';
import db from '../plugins/datastore';
import Datastore from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import path from 'path';
import fs from 'fs-extra';
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
    //此处改为用 vuex 缓存目录数据然后按顺序存储
    ipcMain.on('setChapters', async (evt: IpcMainEvent, data: any, params: any) => {
      if (!fs.pathExistsSync(path.join(STORE_PATH, 'db', 'books', params.book_id))) {
        fs.mkdirpSync(path.join(STORE_PATH, 'db', 'books', params.book_id));
      }
      const catalog = Datastore(
        new FileSync(path.join(STORE_PATH, 'db', 'books', params.book_id, 'catalog'))
      );
      catalog.set(params.division_id, data).write();
      console.log('--->setChapters');
    });
    ipcMain.on('setContent', async (evt: IpcMainEvent, data: any, params: any) => {
      console.log('--->setCpt');
      console.log(data);
      data = data.chapter_info;
      const cpt = Datastore(
        new FileSync(path.join(STORE_PATH, 'db', 'books', params.book_id, data.chapter_id))
      );
      cpt.set('chapter_title', data.chapter_title).write();
      cpt.set('txt_content', data.txt_content).write();
      cpt.set('author_say', data.author_say).write();
    });
  }
};
