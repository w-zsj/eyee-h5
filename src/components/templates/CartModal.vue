<template>
  <div class="cartModal" @click.stop="close">
    <mt-popup v-model="showCartModel" position="bottom">
      <div class="modelBox">
        <section class="modelHead flex">
          <div class="mhead_left"><img :src="selectImg|https" alt=""></div>
          <div class="mhead_right">
            <p v-if="reInfo.salestatus == 2 && reInfo.producttype == 7">
              <span class="font-price">¥{{reInfo.saleprice | tofixed}} </span>
            </p>
            <p v-else>
              <span v-if="(proPrice&&proSpecialPrice==0 )||reInfo.producttype==5" class="font-price">¥{{proPrice | tofixed}} </span>
              <span v-if="proPrice&&proSpecialPrice&&proSpecialPrice>0&&reInfo.producttype!=5" class="font-price">
                ¥{{proSpecialPrice | tofixed}} <em class="spec_sale">¥{{proPrice | tofixed}}</em>
              </span>
              <span style="font-size:38px;color:#999;padding:0 15px;" @click.stop="close">×</span>
            </p>
            <p>已选 {{selected.color|selected}} {{selected.size|selected}}</p>
          </div>
        </section>
        <section class="modelContent">
          <ul>
            <li>
              <span class="sizeT">规格</span>
              <div class="label_d">
                <span class="label_i" v-for="(n,index) in reSize" :key="index"
                :class="{sele_label:n==selected.size&&selected.setSize,currentSize:judge(n,curStore)}"
                @click.stop="judge(n,curStore)?'':seleItems(n,0)">
             {{n}}
                </span>
              </div>
            </li>
            <li>
              <span class="sizeT">颜色</span>
              <div class="label_d">
                <span class="label_i" v-for="(n,index) in reColor" :key="index"
                :class="{sele_label:n==selected.color&&selected.setColor,currentColor:judge(n,indexY)}"
                 @click.stop="judge(n,indexY)?'':seleItems(n,1)">{{n}}</span>
              </div>
            </li>
            <li class="flex-aic count_li">
              <span class="sizeT">数量</span>
              <div class="input_div">
                <span @click.stop="changCount(0)">-</span>
                <input type="number" name="" value="" readonly v-model='selected.count'>
                <span @click.stop="changCount(1)">+</span>
              </div>
              <span v-if="stockCount>0&&stockCount<6" class="input_stock">(仅剩{{stockCount}}件)</span>
            </li>
          </ul>
        </section>
        <button type="button" disabled @click.stop="confirmAddCart" >请选择颜色规格</button>
      </div>
    </mt-popup>
  </div>
</template>
<script>
  import * as api from '../../common/api/product'
  import * as CartApi from '../../common/api/cart'
  import { mapGetters } from 'vuex'
  import { ENUM, DateFormat } from '../../common/util'

  const ls = window.localStorage
  const cartkey = 'LOCAL_CART'
  export default {
    props: {
      info: Object,
      logoImg: Array
    },
    data() {
      return {
        selected: { size: '', color: '', count: 1, setSize: false, setColor: false, saleprice: '', specialprice: 0 },
        selectData: {},
        sizeList: [],
        colorList: [],
        indexY: [],
        curStore: []

      }
    },
    mounted() {
      var _this = this
      setTimeout(function () {
        _this.reperTory
        //  console.log(_this.productSeleItem.productItems,'uuuuuu')
      }, 500)

      let item = this.productSeleItem
      if (this.showCartModel) {
        if (!(item && item.id == this.reInfo.id && item.productItems)) {
          this.getSeleItems(this.reInfo.id)
        }
      }
      var oCart = document.getElementsByClassName('cartModal')
      if (oCart && oCart.length > 0) {
        oCart[0].onclick = (ev) => {
          var ev = ev || window.event
          var target = ev.target || ev.srcElement
          if (target.className == 'v-modal') {
            this.$store.state.cart.showCartModel = false
          }
        }
      }
    },
    computed: {
      reInfo() {
        // console.log('eidiid',this.editData)
        if (this.editData && this.cartType == 3) {
          return this.editData
        }
        // console.log('666', this.info)
        var item = this.info ? this.info : []
        let sizeType = (typeof item.sizeattribute)
        let colorType = (typeof item.colorattribute)
        if (item && item.sizeattribute && sizeType == 'string') {
          item.sizeattribute = item.sizeattribute.split(',')
        }
        if (item && item.colorattribute && colorType == 'string') {
          item.colorattribute = item.colorattribute.split(',')
        }
        return item
      },
      showCartModel: {
        get: function () {
          return this.$store.state.cart.showCartModel
        },
        set: function (newValue) {
          return this.$store.state.cart.showCartModel
        }
      },
      ...mapGetters({
        insq: 'insq',
        productSeleItem: 'productSeleItem',
        userInfo: 'userInfo',
        editData: 'editData',
        cartType: 'cartType',
        cartList: 'cartList'
      }),
      // 判断库存
      reperTory() {
        //   let   coun = 0;
        //   let it = this.productSeleItem.productItems;
        // if (it) {
        //    this.indexY=[]
        //   for (var i = 0; i < it.length; i++) {
        //       for(var j = 0; j < this.reSize.length; j++){
        //         if(this.reSize[j]==it[i].size){
        //           coun = it[i].stockcount;
        //             if(coun==0){
        //               this.indexY.push(j);
        //               // console.log(this.index,'ggggggd fff')
        //             }
        //         }
        //       }
        //   }

        //  return this.indexY
        // }
      },
      stockCount() {
        let [sel, pro, coun] = [this.selected, this.productSeleItem, 0]
        if (sel.size && sel.color && pro && pro.productItems) {
          let it = pro.productItems
          for (var i = 0; i < it.length; i++) {
            if (sel.size == it[i].size && sel.color == it[i].color) {
              coun = it[i].stockcount
              // this.curStore=coun
              //  console.log(it,'rrrr')
              this.selectData = it[i]
            }
          }
          //  console.log(this.curStore,'rrrr')
          // console.log(coun,'库存')
          return coun
        }
        return 0
      },
      proPrice() {
        let [sel, pro, price] = [this.selected, this.productSeleItem, 0]
        if (sel.size && sel.color && pro && pro.productItems) {
          let it = pro.productItems
          for (var i = 0; i < it.length; i++) {
            if (sel.size == it[i].size && sel.color == it[i].color) {
              price = it[i].saleprice
              this.selectData = it[i]
            }
          }
          return price
        }
        return 0
      },
      proSpecialPrice() {
        let [sel, pro, specialPri] = [this.selected, this.productSeleItem, 0, 0]
        if (sel.size && sel.color && pro && pro.productItems) {
          let it = pro.productItems
          for (var i = 0; i < it.length; i++) {
            if (sel.size == it[i].size && sel.color == it[i].color) {
              specialPri = it[i].specialprice
              this.selectData = it[i]
            }
          }
          return specialPri
        }
        return 0
      },
      selectImg() {
        let [sel, pro, coun] = [this.selected, this.productSeleItem, 0]
        if (pro && pro.productItems) {
          let it = pro.productItems
          if (sel.color) {
            for (var i = 0; i < it.length; i++) {
              if (sel.color == it[i].color) {
                return it[i].colorimg
              }
            }
          } else {
            return it[0].colorimg
          }
        }
        if (this.logoImg && this.logoImg.length > 0) {
          return this.logoImg[0]
        }
      },
      reColor() {
        if (this.$route.params.id) {
          return this.reInfo.colorattribute
        } else {
          return this.colorList
        }
      },
      reSize() {
        if (this.$route.params.id) {
          return this.reInfo.sizeattribute
        } else {
          return this.sizeList
        }
      },
      dealLocal() {
        return this.insq && !(this.userInfo || {}).uid
      }
    },
    methods: {
      unique(array, type) {
        // type ：0  获取颜色 1获取尺寸
        var n = []
        for (var i = 0; i < array.length; i++) {
          if (type == 0) {
            if (n.indexOf(array[i].color) == -1) n.push(array[i].color)
          } else {
            if (n.indexOf(array[i].size) == -1) n.push(array[i].size)
          }
        }
        return n
      },
      close() {
        this.$store.state.cart.showCartModel = false
      },
      getSeleItems(id) {
        api.ProdGetItems({ 'productid': id }).then((res) => {
          console.log('获取商品属性', res)
          // 获取商品属性
          if (res) {
            this.colorList = this.unique(res, 0)
            this.sizeList = this.unique(res, 1)
            this.$store.dispatch('setProductItems', { id: this.reInfo.id, productItems: res })
          }
        }).catch((err) => {
          console.log('err', err)
          this.toast('请稍后再试！')
        })
      },
      // 判断元素
      judge(val, arr) {
        for (var t = 0; t < arr.length; t++) {
          if (val == arr[t]) {
            return true
          }
        }
        return false
      },
      seleItems(item, type) {
        // this.reperTory
        // type:0是选择尺寸，1是选择颜色
        let sel = this.selected
        sel.count = 1
        if (type == 0) {
          this.indexY = []
          //  console.log(this.curStore,'rrrr')
          if (sel.size == item) {
            sel.setSize = !sel.setSize

            if (sel.setSize) {
              sel.size = item
            } else {
              sel.size = ''
            }
          } else {
            sel.size = item
            sel.setSize = true
            //
            let itt = this.productSeleItem.productItems || []
            this.indexY = []
            // this.curStore=[]
            for (var i = 0; i < itt.length; i++) {
              if (sel.size == itt[i].size) {
                if (itt[i].stockcount == 0) {
                  // console.log(itt[i],'颜色');
                  this.indexY.push(itt[i].color)
                }
              }
            }
          }
        } else {
          this.curStore = []
          if (sel.color == item) {
            sel.setColor = !sel.setColor
            if (sel.setColor) {
              sel.color = item
            } else {
              sel.color = ''
            }
          } else {
            sel.color = item
            sel.setColor = true
            //
            let itt = this.productSeleItem.productItems
            this.curStore = []
            // this.indexY=[];
            for (var i = 0; i < itt.length; i++) {
              if (sel.color == itt[i].color) {
                if (itt[i].stockcount == 0) {
                  // console.log(itt[i],'尺寸');
                  this.curStore.push(itt[i].size)
                }
              }
            }
          }
        }
        this.checkAll()
      },
      changCount(n) {
        // n: 0是减 1 是加
        if (this.selected.size && this.selected.color) {
          if (n == 0) {
            this.selected.count -= 1
            if (this.selected.count <= 1) {
              this.selected.count = 1
            }
          } else {
            if (this.selected.count < this.stockCount) {
              this.selected.count += 1
            } else {
              this.toast('库存仅剩' + this.stockCount + '件')
            }
          }
        }
        // this.reperTory
        this.checkAll()
      },
      checkAll() {
        let sel = this.selected
        let btn = document.querySelector('.modelBox button')
        // console.log( this.stockCount,'zsj')
        if (btn) {
          if (sel.size && sel.color && sel.count >= 1 && this.stockCount > 0) {
            btn.removeAttribute('disabled')
            btn.innerHTML = '确定'
          } else {
            if (btn) {
              btn.innerHTML = '请选择颜色规格'
              btn.setAttribute('disabled', 'disabled')
            }
          }
        }
      },
      confirmAddCart() {
        var option = {
          BusinessId: this.reInfo.businessid,
          ContentId: this.reInfo.contentid ? this.reInfo.contentid : '',
          Type: this.reInfo.producttype,
          ProductItemId: this.selectData.id,
          count: this.selected.count
        }
        let [t1, t2] = [this.cartType, ENUM.cartType]
        if (t1 == t2.add.val) this.addCart(option)
        if (t1 == t2.buyNow.val) this.buyNow(option)
        if (t1 == t2.update.val) this.updateCart(option)
      },
      addCart(option) {
        // console.log('添加购物车', option, this.reInfo, this.selected, this.selectData)
        if (this.dealLocal) this.addLocalCart()
        else {
          CartApi.Add(option).then((res) => {
            console.log(res)
            this.toast('已成功添加到您的购物车!')
            this.close()
          }).catch((err) => {
            this.toast('添加失败!')
            console.log(err)
            this.close()
          })
        }
      },
      addLocalCart() {
        let now = DateFormat(new Date())
        let info = this.dealBuy()
        let p = {
          businessid: info.businessid,
          businessname: info.businessname,
          businesstype: info.businesstype,
          isopen: true,
          createtime: now
        }
        let item = {
          productid: info.productid,
          productname: info.productname,
          brandname: info.brandname,
          mainpic: info.mainpic,
          limitcount: info.limitcount,
          expresstemplateid: info.expresstemplateid,
          isoverseas: info.isoverseas,
          sendplace: info.sendplace,
          producttype: info.producttype,
          color: info.color,
          size: info.size,
          saleprice: info.pay,
          specialprice: info.pay,
          stockcount: this.selectData.stockcount,
          colorimg: info.colorimg,
          isok: true,
          type: info.producttype,
          contentid: this.selectData.contentid,
          businessid: info.businessid,
          productitemid: info.productitemid,
          count: info.count,
          createtime: now,
          id: info.productitemid
        }
        let cart = JSON.parse(ls.getItem(cartkey) || '[]')
        if (cart.length > 0) {
          let ok = false
          cart = cart.map(c => {
            if (c.businessid === p.businessid) {
              c.items = c.items.map(i => {
                if (i.productitemid === item.productitemid) {
                  ok = true
                  i.count += item.count
                }
                return i
              })

              if (!ok) c.items.push(item)

              ok = true
            }
            return c
          })
          if (!ok) cart.push({ ...p, items: [item] })
        } else cart = [{ ...p, items: [item] }]
        console.log('local add cart', cart)
        ls.setItem(cartkey, JSON.stringify(cart))
        this.toast('已成功添加到您的购物车!')
        this.close()
      },
      buyNow(option) {
        this.close()
        let rf = this.dealBuy()
        this.$store.dispatch('setOrderOut', rf)
        this.$store.dispatch('setFromeType', 1)
        this.$router.push('/order/checkout')
      },
      dealBuy() {
        let paymoney = this.proPrice
        let rf = { ...this.reInfo }
        rf.specialprice = this.proSpecialPrice
        // if (rf && rf.type == 2 && rf.contentid && rf.contentid.length > 0) {
        //   this.SpecialIsSigned(rf.contentid)
        // }
        // 当为活动大促商品且未开始时，特价置0，类型置为普通商品
        if (rf.producttype == 7 && rf.salestatus == 2) {
          rf.producttype = 0
          rf.specialprice = 0
        }
        // 当为牛币兑换的商品 不用兑换 直接购买 特价置0 类型置为普通商品
        if (rf.producttype == 5) {
          rf.producttype = 0
          rf.specialprice = 0
        }
        if (rf.specialprice && rf.specialprice > 0 && rf.specialprice <= rf.saleprice) {
          paymoney = rf.specialprice
          // rf.salemoney = rf.specialprice
        }
        rf.count = this.selected.count
        rf.allPay = this.selected.count * paymoney
        rf.colorimg = this.selectImg
        rf.size = this.selected.size
        rf.color = this.selected.color
        rf.checked = true
        rf.productid = rf.id
        rf.productitemid = this.selectData.id
        rf.pay = paymoney
        rf.salemoney = paymoney
        rf.saleprice = paymoney
        rf.productname = rf.name
        // console.log('立即购买0000', rf)
        let item = { ...rf }
        delete item.item
        rf.item = [item]
        // console.log('dealBuy---', rf)
        return rf
      },
      updLocalCart(option) {
        let cart = JSON.parse(ls.getItem(cartkey) || '[]')
      },
      updateCart(option) {
        option.id = this.reInfo.id
        console.log('修改购物车属性', option)
        if (this.dealLocal) this.updLocalCart(option)
        else {
          CartApi.Update(option).then((res) => {
            console.log(res)
            this.editData.color = this.selected.color
            this.editData.count = this.selected.count
            this.editData.size = this.selected.size
            this.editData.colorimg = this.selectImg
            this.toast('修改成功!')
            // CartApi.GroupList().then((res) => {
            if (res) {
              console.log(res)
              res = res.map((data) => {
                data.count = 0
                data.checked = false
                data.disable = true
                data.allPay = 0
                data.item = data.items.map((i) => {
                  i.checked = false
                  if (i.specialprice > 0) {
                    i.pay = i.count * i.specialprice
                  } else {
                    i.pay = i.count * i.saleprice
                  }
                  return i
                })
                return data
              })
              this.$store.dispatch('setCartList', res)
            }
            // }).catch((err) => {
            //   console.log(err)
            // })
          }).catch((err) => {
            console.log(err)
            this.toast('修改失败!')
          })
        }
        this.close()
      }
      // SpecialIsSigned(specialid) {
      //   let option = {
      //     token: this.userInfo.token,
      //     specialid: specialid
      //   }
      //   SpecialIsSigned(option).then((res) => {
      //     if (res && res.issigned) {
      //       this.reInfo.hasSpecial = false
      //       // this.reInfo.allPay = this.selected.count * this.reInfo.specialprice
      //       console.log('有鬼市资格')
      //     } else {
      //       console.log('没有鬼市资格')
      //       this.reInfo.pay = this.reInfo.saleprice
      //       this.reInfo.salemoney = this.reInfo.saleprice
      //       this.reInfo.allPay = this.selected.count * this.reInfo.saleprice
      //       this.reInfo.hasSpecial = true
      //     }
      //     this.reInfo.item = [this.reInfo]
      //     this.$store.dispatch('setOrderOut', this.reInfo);
      //   }).catch((err) => {
      //     console.log(err)
      //   })
      // },
    },
    filters: {
      selected(item) {
        if (item) {
          return '“' + item + '”'
        }
      }
    },
    watch: {
      showCartModel() {
        if (this.showCartModel && this.cartType == 3) {
          this.selected.color = this.editData.color
          this.selected.size = this.editData.size
          this.selected.setSize = true
          this.selected.setColor = true
          this.selected.count = this.editData.count
          // this.stockCount = this.editData.stockcount
          this.checkAll()
          this.reperTory
          this.getSeleItems(this.editData.productid)
        }
      },
      reInfo() {
        if (this.info) {
          console.log(this.info)
          this.getSeleItems(this.info.id)
          this.selected = { size: '', color: '', count: 1, setSize: false, setColor: false, saleprice: '', specialprice: 0 }
        }
      }
    }
  }

</script>
<style scoped>
  .mint-popup {
    width: 100%;
    height: 70%;
  }

  .mhead_left {
    width: 35%;
    margin: -30px 15px 15px;
  }

  .mhead_left img {
    width: 100%;
  }

  .mhead_right {
    width: 65%;
  }

  .mhead_right p:nth-of-type(1) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    margin: 5px 0;
  }

  .mhead_right p:nth-of-type(2) {
    font-size: 12px;
    color: #666;
  }

  .modelBox button {
    position: absolute;
    bottom: 0;
    width: 100%;
    background: #333;
    color: #fff;
    height: 50px;
    border: none;
    font-size: 1rem;
  }

  .modelContent {
    padding: 0 20px;
  }

  .modelContent li {
    font-size: 14px;
    display: flex;
    align-items: flex-start;
    margin: 20px 0;
  }

  .modelContent li.count_li {
    align-items: center;
  }

  .modelContent li .label_d {
    width: 90%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .modelContent li .sizeT {
    display: inline-block;
    color: #333;
    height: 30px;
    line-height: 30px;
  }

  .modelContent li .label_i {
    border: 1px solid #ccc;
    border-radius: 3px;
    color: #999;
    padding: 5px 8px;
    margin-left: 10px;
    margin-bottom: 5px;
  }

  .modelContent li .sele_label {
    color: #fff;
    background: #333;
    transition: all 0.5s;
  }
  .modelContent li .currentSize{
    background: #ccc;
    color: #fff;
  }
  .modelContent li .currentColor{
    background: #ccc;
    color: #fff;
  }
  .modelContent li .noBtn{
    background: #ccc;
  }
  .input_div {
    border: 1px solid #ccc;
    ;
    margin-left: 10px;
    height: 30px;
    line-height: 30px;
    border-radius: 2px;
    width: 150px;
  }

  .input_div span {
    width: 20%;
    text-align: center;
    box-sizing: border-box;
    float: left;
  }

  .input_div input {
    width: 60%;
    float: left;
    height: 100%;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    text-align: center;
    color: #999;
  }

  .modelBox button[disabled] {
    background: rgba(0, 0, 0, .3);
    transition: all 0.5s;
  }

  .input_stock {
    margin-left: 10px;
    color: red;
    font-size: 12px;
  }
  .spec_sale{
    text-decoration:line-through;
  }
</style>
