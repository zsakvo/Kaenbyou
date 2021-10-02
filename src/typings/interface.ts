export interface Book {
  book_id: string;
  cover: string;
  book_name: string;
  category_index?: string;
  author_name?: string;
  description?: string;
  up_status?: string;
  total_word_count?: string;
  total_yp?: string;
  total_recommend?: string;
  total_blade?: string;
  total_click?: string;
  total_favor?: string;
  last_chapter_info?: LastChapterInfo;
}

export interface Rank {
  title: string;
  introduce: string;
  books: Book[];
}

export interface LastChapterInfo {
  book_id: string;
  chapter_id: string;
  chapter_index: string;
  chapter_title: string;
  mtime: string;
  uptime: string;
}

export interface Itsukkomi {
  tsukkomi_id: number;
  paragraph_index: number;
  reader_info: {
    reader_id: string;
    reader_name: string;
    gender: string;
    avatar_thumb_url: string;
    is_author: string;
    used_decoration: any[];
    book_fans_value: number;
    vip_lv: string;
    is_following: string;
  };
  tsukkomi_content: string;
  like_amount: number;
  unlike_amount: number;
  is_like: number;
  is_unlike: number;
  abscissa: string;
  ordinate: string;
  member_lou: number;
  hot_reply: any[];
  reply_num: number;
  ctime: number;
}
