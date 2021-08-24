import { ipcMain, IpcMainEvent } from 'electron';
import db from '../plugins/datastore';

export default {
  listen() {
    console.log('开始监听 IPC 事件');
    ipcMain.on('setShelfList', async (evt: IpcMainEvent, shelfList) => {
      console.log(db.shelfDB.get('list').value());
      if (!(db.shelfDB.get('list').value() instanceof Array)) {
        db.shelfDB.set('list', shelfList).write();
      }
    });
  }
};
