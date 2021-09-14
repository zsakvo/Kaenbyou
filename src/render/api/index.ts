import { decrypt } from '@/plugins/decrypt';
import { get } from '@/plugins/request';
const electron = window.require('electron');

export const login = (params: object) => {
  return get('/signup/login', params);
};

export const getShelfList = (): any => {
  return get('/bookshelf/get_shelf_list');
};

/**
 * 获取书架书籍
 * @param {number|string} shelf_id - 书架id
 * @param {number} page - 页码
 */
export const getShelfBookList = (shelf_id: number | string, page: number): any => {
  return get('/bookshelf/get_shelf_book_list_new', {
    count: 100,
    page,
    shelf_id
  });
};

export const getIndexList = () => {
  const obj = Object.assign({
    tab_type: 200,
    theme_type: 'NORMAL'
  });
  return get('/bookcity/get_index_list', obj);
};

export const getDivisionList = (book_id: string) => {
  return get('/book/get_division_list', {
    book_id
  });
};

export const getChapterByDivisionId = (division_id: string, book_id: string) => {
  return get('/chapter/get_updated_chapter_by_division_id', {
    division_id,
    book_id
  });
};
export const getChapterCmd = (chapter_id: string) => {
  return get('/chapter/get_chapter_cmd', {
    chapter_id
  });
};

export const getCptIfm = (chapter_id: string, chapter_command: string) => {
  return get('/chapter/get_cpt_ifm', {
    chapter_command,
    chapter_id
  });
};

export const getContent = async (chapter_id: string, book_id: string) => {
  let res: any = await getChapterCmd(chapter_id);
  const cmd = res.command;
  res = await getCptIfm(chapter_id, cmd);
  res.chapter_info.txt_content = decrypt(res.chapter_info.txt_content, cmd);
  electron.ipcRenderer.send('setContent', res, { book_id });
  return res;
};

export const getMyInfo = async () => {
  return get('/reader/get_my_info');
};

/**
 * 获取书城首页
 */
export const getIndexInfo = async () => {
  return get('/bookcity/get_index_list', {
    tab_type: 200,
    theme_type: 'NORMAL'
  });
};
