<template>
  <div>
    <v-header class=" categ_header">
      <div class="nav-tab2">
        <h3>分类</h3>
      </div>
      <router-link tag="div" class="seackBtn" :to="searchUrl">
        <img :src="sImg" alt="">
      </router-link>
      <v-cart></v-cart>
    </v-header>
    <div class="tab_cate flex-center">
      <div class="nav" :style="insqFix">
        <p class="nav_btns" v-for="(item,index) in category" :key="index" @click.prevent="selectSwi(item.name,index)" :class="{'choosen':index == indNow}">{{item.name}}</p>
      </div>
      <div class="page-tab-container">
        <mt-tab-container class="page-tabbar-tab-container" v-model="active" swipeable>
          <mt-tab-container-item v-for="(itemP,indexP) in category" :key="indexP" :id="itemP.name">
            <mt-cell v-for="(childI,indexI) in itemP.child" :key="indexI" title=''>
              <div class="child_img" :style="{backgroundImage: 'url('+https( childI.logourl) +')'}" @click="searchCate(childI,indexI,itemP.name)">
                <!-- <span>{{childI.name}}</span> -->
              </div>
            </mt-cell>
          </mt-tab-container-item>
        </mt-tab-container>
      </div>
    </div>
  </div>
</template>
<script>
// import FilterList from '../templates/FilterList'
import { CategoryAll } from '../../common/api/base'
import { ENUM } from '../../common/util'
import { mapGetters } from 'vuex'
export default {
  // components: { SelectList },
  data() {
    return {
      //   insqFix: window.INSQ ? { top: '10px' } : {},
      active: '男装',
      sImg: '//files.eyee.com/mcdn/static/img/search_h.png', // require('../../assets/img/search_h.png'),
      category: [],
      indNow: 0,
      allImg: ''
    }
  },
  mounted() {


    this.initShare({ type: 1 })
    this.getCategoty()
    console.log(this.searchOption)
  },
  methods: {
    selectSwi(name, ind) {
      this.active = name
      this.indNow = ind
      console.log(name)
    },
    getCategoty() {
      CategoryAll()
        .then(res => {
          console.log('category res', res)
          if (res) {
            for (var i = 0; i < res.length; i++) {
              if (res[i].haschildren == true) {
                this.category.push(res[i])
              } else if (res[i].name == 'all') {
                this.allImg = res[i].logourl
              }
            }
            for (var i = 0; i < this.category.length; i++) {
              if (this.category[i].id != null) {
                var id = this.category[i].id,
                  imgurl = this.allImg
                this.category[i].child = [{ name: '全部', id: id, logourl: imgurl }]
                for (var j = 0; j < res.length; j++) {
                  if (res.parentid == 0) {
                    continue
                  }
                  if (id == res[j].parentid) {
                    this.category[i].child.push(res[j])
                  }
                }
              }
            }
            console.log(this.category)
          } else {
            this.toast('加载失败')
          }
        })
        .catch(err => {
          this.toast('加载失败')
        })
    },
    searchCate(item, index, catename) {


      sessionStorage.setItem('zhekou', '2')
      console.log('searchCate', item, catename)
      var set = {}
      set.items = this.searchOption.items
      if (index == 0) {
        set.items.name = this.category[this.indNow].name
      }
      this.$router.push('/mall/Search/' + (index == 0 ? set.items.name : item.name))
      set.categoryid = item.id
      set.brandName = '全部'
      set.categoryName = item.name
      set.category = catename
      this.$store.dispatch('confirOption', { data: set, type: 2 })
      //   console.log('searchOption-----',this.searchOption)
    }
  },
  computed: {
    searchUrl() {
      return '/search/' + ENUM.SearchType.product.val
    },
    ...mapGetters({
      insq: 'insq',
      searchOption: 'searchOption'
    }),
    insqFix() {
      return this.insq ? { top: '10px' } : {}
    }
  }
}
</script>
<style scoped>
.categ_header {
  height: 48px;
}
.categ_header p {
  font-weight: 600;
}
.seackBtn {
  position: absolute;
  right: 40px;
  top: 13px;
  text-align: center;
  width: 60px;
}

.seackBtn img {
  vertical-align: middle;
  width: 20px;
}
.cates {
  width: 95%;
  margin: 0 auto;
}
.tab_cate {
  padding-top: 10px;
  border-top: 1px solid #f2f2f2;
}
.tab_cate .nav {
  position: fixed;
  height: 30px;
  line-height: 30px;
  top: 58px;
  left: 0;
  z-index: 1;
}
.tab_cate .nav .nav_btns {
  display: block;
  height: 40px;
  padding: 0 10px;
  line-height: 40px;
  background: #f2f2f2;
  border-bottom: 1px solid #fff;
  text-align: center;
  font-size: 14px;
  color: #333;
}
.tab_cate .nav .nav_btns.choosen {
  background: #fff;
}
.tab_cate .page-tab-container {
  width: 100%;
}
.child_img {
  position: relative;
  width: 100%;
  height: 80px;
  text-align: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}
.child_img p {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.2);
}
.child_img span {
  position: absolute;
  z-index: 1;
  display: block;
  top: 50%;
  color: #fff;
  font-size: 11px;
  width: 100%;
  text-align: center;
  height: 20px;
  margin-top: -10px;
}
.page-tab-container {
  padding-left: 90px;
  padding-right: 7px;
}
</style>
