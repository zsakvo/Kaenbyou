import { ipcMain, IpcMainEvent } from 'electron';
import db from '../plugins/datastore';

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
    ipcMain.on('setDivisions', async (evt: IpcMainEvent, data: any) => {
      console.log('--->setDivisions');
      console.log(data);
    });
    ipcMain.on('setChapters', async (evt: IpcMainEvent, data: any) => {
      console.log('--->setChapters');
      console.log(data);
    });
    ipcMain.on(
      'setContent',
      async (evt: IpcMainEvent, cptId: string, content: string, authorSay: string) => {
        console.log('--->setCpt');
        const cpts: any = db.cptDB.get(cptId);
        cpts.set('content', content).write();
        cpts.set('authorSay', authorSay).write();
        console.log('setCpt<---');
      }
    );
  }
};
