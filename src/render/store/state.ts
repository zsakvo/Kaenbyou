import { BOOK, RANK, SHELF, USER } from './const';

export interface State {
  shelf: {
    list: any[];
  };
  rank: any;
  book: any;
  user: any;
}

export const state: State = {
  [SHELF]: {
    list: []
  },
  [RANK]: {},
  [BOOK]: {},
  [USER]: {}
};
