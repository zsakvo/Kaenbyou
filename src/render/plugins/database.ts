const electron = window.require('electron');
import { CHAPTER_LIST, DIVISION_LIST, SHELF_BOOK_LIST, SHELF_LIST } from './const';

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
    case DIVISION_LIST:
      electron.ipcRenderer.send('setDivisions', data.division_list);
      break;
    case CHAPTER_LIST:
      electron.ipcRenderer.send('setChapters', data.chapter_list, params);
      break;
  }
};

export default {
  set
};
