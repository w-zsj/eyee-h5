<template>
  <div class="brands">
    <mt-index-list>
      <template v-for='(item,index) in mallBrands'>
        <mt-index-section :index="item.code">
          <template v-for="i in item.list">
            <div @click.stop="goSearch(i)">
              <mt-cell :title="i.name" :class="{'hot':i.ishot}">
                <img :src="i.logourl|https" alt="">
              </mt-cell>
            </div>
          </template>
        </mt-index-section>
      </template>
    </mt-index-list>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { ENUM } from '../../common/util'
import { BrandAll } from '../../common/api/base'
export default {
  props: { show: { type: Boolean, default: false }},
  data() {
    return {
      bodyStyle: ''
    }
  },
  beforeMount() {
    this.bodyStyle = document.body.style.overflow
  },
  methods: {
    goSearch(brand) {
      console.log(brand)
      var routedata = this.$route
      // console.log(this.$route)
      document.body.style.overflow = this.bodyStyle
      var set = {}
      if (routedata.path == '/shopFilter/1') {
        if (routedata && routedata.params.type == 1) {
          set = this.homeOption
          set.brandName = brand.name
          set.brandid = brand.id
          this.$store.dispatch('confirOption', { data: set, type: routedata.params.type })
          this.$emit('closeModal', 'close')
        }
      } else {
        if (brand && brand != 1) {
          this.$router.push('/mall/search/' + brand.name)
          set.brandid = brand.id
          set.brandName = brand.name
          this.$store.dispatch('confirOption', { data: set })
        } else {
          this.$router.push('/search/' + ENUM.SearchType.product.val)
          this.$store.dispatch('confirOption', { data: {}})
        }
      }
    },
    getAllBrand() {
      let _ = this
      BrandAll()
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
    }
  },
  computed: {
    ...mapGetters({
      homeOption: 'homeOption',
      mallBrands: 'mallBrands'
    })
  },
  watch: {
    show() {
      if (this.show) {
        if (!(this.mallBrands && this.mallBrands.length > 0)) this.getAllBrand()
        document.body.style.overflow = 'hidden'
      } else document.body.style.overflow = this.bodyStyle
    }
  }
}
</script>
<style>
.mint-header {
  background-color: rgb(51, 51, 51);
  height: 48px;
}

.brands {
  margin-top: 48px;
}

.item {
  border: 0.5px solid #eee;
  width: 33.3%;
  float: left;
}

.modal {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.7);
  width: 30px;
  height: 30px;
  line-height: 30px;
  border-radius: 50%;
  font-size: 0.875rem;
  text-align: center;
  color: #fff;
  right: 15px;
  top: 63px;
}

.mint-cell-wrapper img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.brands .mint-cell-value {
  float: left;
}
.brands .mint-cell .mint-cell-wrapper > .mint-cell-title {
  display: inline !important;
  padding-left: 10px;
  width: auto;
}
.brands .mint-cell {
  /* display: flex; */
  float: none;
  clear: both;
  width: 100% !important;
  margin-bottom: 10px;
}
.brands .mint-cell-value {
  width: auto !important;
}
.brands .hot .mint-cell-text::after{
    content: "HOT";
    background: #ffc700;
    padding: 3px 8px;
    margin-left: 8px;
    border-radius:26px;
    color: #333333;
    font-size: 0.4rem;
    font-weight: bold;
}
</style>
