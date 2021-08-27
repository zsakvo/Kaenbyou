const electron = window.require('electron');
import { SHELF_BOOK_LIST, SHELF_LIST } from './const';

const set = (url: string | undefined, data: any, params: any) => {
  console.log(url);
  console.log(data);
  console.log(params);
  switch (url) {
    case SHELF_LIST:
      electron.ipcRenderer.send('setShelfList', data.shelf_list);
      break;
    case SHELF_BOOK_LIST:
      electron.ipcRenderer.send('setShelfBooks', data.book_list, params.shelf_id);
      break;
  }
};

export default {
  set
};
