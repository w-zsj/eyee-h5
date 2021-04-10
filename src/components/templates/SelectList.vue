<template>
  <div>
    <ul>
      <template v-for='(item,index) in items'>
        <li @click='changCate(item,index)' v-if='listType!=1'>{{item.name}}
          <p><span :class='{
        icon_selectedNo:index==0&&dataOptions.category!=null||index==0&&dataOptions.size!=null,
        icon_selected:selectIndex==2&&index==0&&dataOptions.category==null||selectIndex==4&&index==0&&!dataOptions.size,
        icon_selectedNo:index==0&&dataOptions.category!=null||index==0&&dataOptions.size!=null,
        icon_up:index!=0,icon_down:index!=0&&currIndex==index&&show}'></span></p>
        </li>
        <li @click='changCate(item,index)' v-if='listType==1' class="listLi">
          <img :src="item.logourl|https" alt="">
        </li>
        <transition name="custom-classes-transition" enter-active-class="animated fadeIn" >
          <div v-show="currIndex==index&&show" class="divs">
            <!--<transition name="custom-classes-transition" enter-active-class="animated slideInDown">-->
              <SelectListUnit  :items='item.child' :listType='listTypes' :class="{unit:index!=0&&listType==1}" :selectIndex='selectIndex'></SelectListUnit>
            <!--</transition>-->
          </div>
        </transition>
      </template>
    </ul>
  </div>
</template>
<script>
  // listType如果是1 就是图标加列表
  import SelectListUnit from '../templates/SelectListUnit'
import { mapGetters } from 'vuex'
  export default {
    components: { SelectListUnit },
    data() {
      return {
        currIndex: 0,
        show: false
      }
    },
    props: {
      items: Array,
      listType: { type: Number, default: 0 }, // 默认是0显示类目名字 1显示类目logo
      selectIndex: { type: Number }
    },
    methods: {
      changCate(item, index) {
        if (this.listType && this.listType == 1) {
          this.searchOption.items = item
          if (this.currIndex == index) {
            this.show = !this.show
          } else {
            this.show = true
          }
          this.currIndex = index
        } else {
          var t = this.selectIndex
          var set
          var param = this.$route.params
          if (param) {
            if (param.type == 2) {
              set = this.searchOption
              // this.setOptions = set
            } else if (this.filterType == 3) {
              set = this.shopOption
            }
          }
          if (t == 2) set.items = item
          if (t == 2 && index == 0) {
            set.categoryName = '全部'
            set.category = null
            set.categoryid = item.id
          } else if (t == 4 && index == 0) {
            set.sizeName = '全部'
            set.size = null
            set.keyword = null
          }
          if (index == 0) {
            this.show = false
          } else {
            if (this.currIndex == index) {
              this.show = !this.show
            } else {
              this.show = true
            }
            this.currIndex = index
          }
          this.currIndex = index
        }
      }
    },
    computed: {
      ...mapGetters({
        filterData: 'filterData',
        // setOptions: 'setOptions',
        homeOption: 'homeOption',
        searchOption: 'searchOption',
        shopOption: 'shopOption',
        filterType: 'filterType'
      }),
      listTypes() {
        return this.listType
      },
      dataOptions() {
        let param = this.$route.params
        if (param.type == 2) {
          return this.searchOption
        }
        if (this.filterType == 3) {
          return this.shopOption
        }
      }
    }
  }

</script>
<style scoped>
  li {
    border-bottom: 1px solid #f2f2f2;
    font-size: 0.875rem;
    line-height: 50px;
    color: #666;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  li p span {
    display: inline-block;
    transition: all 0.2s linear;
  }

  li span.icon_up {
    display: inline-block;
    transform: rotate(180deg);
  }

  li span.icon_down {
    display: inline-block;
    transform: rotate(0deg);
  }

  .icon_selectedNo {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 1px solid #eee;
    border-radius: 50%;
  }

  .unit {
    border-bottom: 1px solid #eee;
    width: 100%;
  }

  .listLi {
    margin: 10px 0;
  }

  .divs {
    overflow: hidden;
  }
</style>
