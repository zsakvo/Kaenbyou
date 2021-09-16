export interface Book {
  book_id: string;
  cover: string;
  book_name: string;
  category?: string;
  author?: string;
  description?: string;
}

export interface Rank {
  title: string;
  introduce: string;
  books: Book[];
}
