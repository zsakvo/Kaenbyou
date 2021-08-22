import { defineComponent, onMounted, ref } from 'vue';
import { RouterView, useRoute } from 'vue-router';
// import { useStore } from 'vuex';

import { Tabbar, TabbarItem } from 'vant';

import books from '@/assets/imgs/books.png';
import booksFilled from '@/assets/imgs/books_filled.png';
import ranks from '@/assets/imgs/ranks.png';
import ranksFilled from '@/assets/imgs/ranks_filled.png';
import mine from '@/assets/imgs/mine.png';
import mineFilled from '@/assets/imgs/mine_filled.png';

export default defineComponent({
  name: 'App',
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem
  },
  setup() {
    // const store = useStore();
    const route = useRoute();
    const state = {
      books,
      booksFilled,
      ranks,
      ranksFilled,
      mine,
      mineFilled
    };
    const active = ref('');
    onMounted(() => {
      active.value = route.name as any;
      active.value = 'Shelf';
    });
    return () => (
      <>
        <RouterView />
        <van-tabbar v-model={active.value}>
          <van-tabbar-item
            replace
            to="/shelf"
            name="Shelf"
            v-slots={{
              icon: (props: any) => <img src={props.active ? state.booksFilled : state.books} />
            }}
          ></van-tabbar-item>
          <van-tabbar-item
            replace
            to="/rank"
            name="Rank"
            v-slots={{
              icon: (props: any) => <img src={props.active ? state.ranksFilled : state.ranks} />
            }}
          ></van-tabbar-item>
          <van-tabbar-item
            replace
            to="/user"
            name="User"
            v-slots={{
              icon: (props: any) => <img src={props.active ? state.mineFilled : state.mine} />
            }}
          ></van-tabbar-item>
        </van-tabbar>
      </>
    );
  }
});
