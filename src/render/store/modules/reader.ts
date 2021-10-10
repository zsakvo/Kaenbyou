import { getTsukkomiList } from '@/api';
import { Itsukkomi } from 'src/typings/interface';

const ReaderModule = {
  namespaced: true,
  state: () => ({
    cid: 0,
    showPopup: false,
    showCatalog: false,
    showTsukkomi: false,
    tsukkomis: [] as Itsukkomi[],
    pTxt: ''
  }),
  mutations: {
    setCid: (state, cid) => {
      console.log('设定 cid --->', cid);
      state.cid = cid;
    },
    showPopup: (state) => {
      console.log('尝试显示工具条');
      state.showPopup = true;
      console.log(state);
      console.log('尝试完毕');
    },
    hidePopup: (state) => {
      state.showPopup = false;
    },
    showCatalog: (state) => {
      state.showPopup = false;
      state.showCatalog = true;
    },
    hideCatalog: (state) => {
      state.showCatalog = false;
    },
    showTsukkomi: (state) => {
      console.log(state);
    },
    hideTsukkomi: (state) => {
      state.showTsukkomi == true ? (state.showTsukkomi = false) : null;
    }
  },
  actions: {
    getTsukkomi: async ({ state }, { pid, pTxt }) => {
      state.showTsukkomi = true;
      console.log('获取间贴-->', state.cid, pid, pTxt);
      const res: any = await getTsukkomiList(state.cid, pid, 0);
      const list: Itsukkomi[] = res.tsukkomi_list;
      console.log(list);
      state.tsukkomis = list;
      state.pTxt = pTxt;
    }
  },
  getters: {}
};

export default ReaderModule;
