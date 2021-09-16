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
