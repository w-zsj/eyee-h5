<!-- 2018.03.30 hn 标记废弃 -->
<template>
  <div class="pick_box">
    <div class="btn_p flex-between">
      <p @click="close(0)">取消</p>
      <p @click="close(1)">确定</p>
    </div>
    <mt-picker :slots="cityData" @change="onValuesChange"></mt-picker>
  </div>
</template>
<script>
  import { CityGanged } from '../../common/api/base'
  import { mapGetters } from 'vuex'
  import { ENUM } from '../../common/util'
  export default {
    data() {
      return {
        provinces: [],   // 省会循环数据
        citys: [],      // 市区循环数据，
        county: [],    // 县区循环数据
        proIndex: 0,   // 省会选择索引
        cityIndex: 0,  // 城市选择到索引
        countyIndex: 0, // 选择国家索引
        countrys: [
          {
            values: [],
            textAlign: 'center'
          }
        ],
        CityCounty: [
          {
            flex: 1,
            values: [],
            className: 'slot1',
            textAlign: 'center'
          },
          {
            flex: 1,
            values: [],
            className: 'slot2',
            textAlign: 'center'
          },
          {
            flex: 1,
            values: [],
            className: 'slot3',
            textAlign: 'center'
          }
        ],
        seleCity: ''

      }
    },
    mounted() {
      CityGanged().then((res) => {
        console.log('城市基础数据', res)
        if (res && res.length > 0) {
          for (var i = 0; i < res.length; i++) {
            if (res[i].issendgoods) {
              this.countrys[0].values.push(res[i].name)
              this.seleCoun = res[i].name
              this.provinces = res[i].provinces
              // 省会集合
              let pro = this.provinces
              this.countyIndex = i
              for (var j = 0; j < pro.length; j++) {
                this.proIndex = 0
                this.cityIndex = 0
                // 市区集合
                this.citys = pro[this.proIndex].cities
                // 县区集合
                this.county = this.citys[this.cityIndex].districts
                // 省会
                this.CityCounty[0].values.push(pro[j].name)
              }
            }
          }
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    methods: {
      onValuesChange(picker, values) {
        if (this.cityType == 0) return false
        else {
          // var b = picker.getValues(1)
          // picker.setSlotValues(1, [])
          // getSlotValue(index) ：获取给定 slot 目前被选中的值
          // setSlotValue(index, value) ：设定给定 slot 被选中的值，该值必须存在于该 slot 的备选值数组中
          // getSlotValues(index) ：获取给定 slot 的备选值数组
          // setSlotValues(index, values) ：设定给定 slot 的备选值数组
          // getValues() ：获取所有 slot 目前被选中的值（分隔符 slot 除外）
          // setValues(values) ：
          // if(values[0])
          var a = values[0]
          var pro = this.provinces, c = []
          for (var i = 0; i < pro.length; i++) {
            if (a == pro[i].name) {
              c = pro[i].cities
            }
          }
          var p = []
          if (c && c.length > 0) {
            for (var j = 0; j < c.length; j++) {
              p.push(c[j].name)
            }
            picker.setSlotValues(1, p)
            var cit = values[1], l = 0
            for (var m = 0; m < p.length; m++) {
              if (cit == p[m]) {
                l = m
              }
            }
            var d = [], di = c[l].districts
            if (di && di.length > 0) {
              for (var k = 0; k < di.length; k++) {
                d.push(di[k].name)
              }
              picker.setSlotValues(2, d)
            }
          }
          if (values[0] && values[1]) {
            this.seleCity = values[0] + ' ' + values[1] + ' ' + values[2]
          }
        }
      },
      close(type) {
        var data = ''
        // console.log(this.cityType)
        if (type == 0) {
          console.log('取消')
          this.$store.dispatch('selectCity', { open: false })
        } else {
          console.log('更新选择的国家或者城市')
          if (this.cityType == 0) {
            data = this.seleCoun
          } else {
            data = this.seleCity
          }
          let [pa, isAddData] = [this.$route.params, false]
          if (pa.type == ENUM.editAddressType.add.val) {
            // 添加
            isAddData = true
          }
          this.$store.dispatch('selectCity', { type: this.cityType, data: data, open: false, 'isAddData': isAddData })
        }
      }
    },
    computed: {
      cityData() {
        if (this.cityType == 0) {
          // 0 选择国家
          return this.countrys
        } else {
          // 城市
          return this.CityCounty
        }
      },
      ...mapGetters({ cityType: 'cityType' })
    }
  }

</script>
<style scoped>
  .pick_box {
    height: auto;
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 200;
    background: #eee;
  }

  .btn_p {
    color: #26a2ff;
    font-size: 14px;
  }

  .btn_p p {
    line-height: 50px;
    height: 50px;
    width: 50px;
    text-align: center;
  }
</style>
