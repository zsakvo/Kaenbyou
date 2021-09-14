export interface Book {
  bookId: string;
  cover: string;
  bookName: string;
  category?: string;
  author?: string;
  description?: string;
}

export interface Rank {
  title: string;
  introduce: string;
  books: Book[];
}
