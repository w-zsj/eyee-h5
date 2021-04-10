<template>
    <div>
         <v-header>
            <div class="nav-tab2">
                <h3>商品品牌</h3>
            </div>
            <!-- <v-cart :isshow="true" :isdark="true"></v-cart> -->
        </v-header>
            <div class="addbrands">
                <mt-index-list>
                <template v-for='(item,index) in mallBrands'>
                    <mt-index-section :index="item.code">
                    <template v-for="i in item.list">
                        <div @click.stop="selectBrand(i)">
                        <mt-cell :title="i.name">
                            <img :src="i.logourl|https" alt="">
                        </mt-cell>
                        </div>
                    </template>
                    </mt-index-section>
                </template>
                </mt-index-list>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { ENUM } from '../../../common/util'
import { C2CBrandAll } from '../../../common/api/sneaker'
export default {
  data() {
    return {
      bodyStyle: ''
    }
  },
  beforeMount() {
    // this.bodyStyle = document.body.style.overflow

    if (!(this.mallBrands && this.mallBrands.length > 0)) this.getAllBrand()
        document.body.style.overflow = 'hidden'
  },
  methods: {
    
    getAllBrand() {
      let _ = this
      C2CBrandAll()
        .then(res => {
          if (res) {
            // console.log(res)
            var brandList = [],
              codes = []
            for (var i = 0; i < res.length; i++) {
              var code = res[i].code,
                same = null
              codes.map(val => {
                if (val.code == code) {
                  same = val
                }
              })
              if (same == null || same == undefined) {
                codes.push({ code: code, index: i, list: [] })
              }
            }
            _.codes = codes
            for (var i = 0; i < codes.length; i++) {
              var cd = codes[i].code
              for (var j = 0; j < res.length; j++) {
                if (res[j].code == cd) {
                  codes[i].list.push(res[j])
                }
              }
            }
            // console.log(codes,'codes')

            ;(function rd(x) {
              let offset = x * 10
              if (offset > codes.length) offset = codes.length
              _.$store.dispatch('setMallBrandLists', codes.slice(0, offset))
              x++
              if (offset < codes.length) {
                setTimeout(() => {
                  rd(x)
                }, 30)
              }
            })(1)
          }
          // console.log(codes, 'dsdsdssd')
        })
        .catch(e => {
          this.toast('品牌加载失败', e)
          console.error('品牌加载失败', e)
        })
    },

    selectBrand(branditem) {
      // console.log(branditem)
      // this.$router.replace({
      //   path: "/applyAddProduct",
      //   query: {
      //     branditem: branditem
      //   }
      // });
      // console.log('add product branditem',branditem)
      let _ = this;
      let info = _.applyaddproduct;
      info.name = branditem.name;
      _.$store.dispatch("Applyaddproduct", info);
      this.$router.back()

    }
  },
  computed: {
    ...mapGetters({
      homeOption: 'homeOption',
      mallBrands: 'mallBrands',
      applyaddproduct: "applyaddproduct"
    })
  }

}

</script>
<style>
.mint-header {
  background-color: rgb(51, 51, 51);
  height: 48px;
}

.addbrands {
  margin-top: 62px;
  border-top: 15px solid #f7f7f7;
}

.item {
  border: 0.5px solid #eee;
  width: 33.3%;
  float: left;
}

.modal {
  position: fixed;
  background-color:  rgba(0, 0, 0, 0.7);
  width: 30px;
  height: 30px;
  line-height: 30px;
  border-radius: 50%;
  font-size: 0.875rem;
  text-align: center;
  color: #333333;
  font-weight:600;
  right: 15px;
  top: 63px;
}
.addbrands .mint-indexsection-index {
    background-color: #fff;
    color: #333;
    font-weight:600;
    font-size: 14px;
    border-bottom: 1px #f7f7f7 solid;
}
.addbrands .mint-cell-text {
    color: #333;
    font-weight:600;
    font-size: 14px;
    line-height:20px;
}
.mint-cell-wrapper img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.addbrands .mint-cell-wrapper {
    border-bottom: 1px #f7f7f7 solid;
}
.addbrands .mint-indexlist-navitem {
    color: #333;
    font-weight:600;
    font-size: 12px;
}
.addbrands .mint-cell-value {
  float: left;
}
.addbrands .mint-cell .mint-cell-wrapper > .mint-cell-title {
  display: inline !important;
  padding-left: 10px;
  width: auto;
}
.addbrands .mint-cell {
  /* display: flex; */
  float: none;
  clear: both;
  width: 100% !important;
  margin-bottom: 10px;
}
.addbrands .mint-cell-value {
  width: auto !important;
}
.addbrands .hot .mint-cell-text::after{
    content: "HOT";
    background: #ffc700;
    padding: 3px 8px;
    margin-left: 8px;
    border-radius:26px;
    color: #fff;
    font-size: 0.4rem;
    font-weight: bold;
}

.addbrands .mint-indexlist-indicator {
    background-color: rgba(51, 51, 51, 0.30);
}
</style>
