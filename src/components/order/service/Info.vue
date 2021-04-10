
<template>
  <div v-scroll='menuScroll'>
       <!-- v-scroll='menuScroll' -->
      <!-- style="background-color:rgba(0,0,0,0);"-->
        <v-header   id="transition">
            <div class="nav-tab2" >
                {{presentStatus}}
            </div>
            <v-server :click="QiyuProd"></v-server>
        </v-header>
        <div class="topHead"></div>
        <div class="content">
            <div class="content-common">
                <dl>
                    <dd>
                        <div class="Oimg">
                            <img :src="info.mainpic|https" alt="">
                        </div>
                        <div class="describe">
                            <p class="shop">{{info.brandname}}</p>
                            <p class="name">{{info.productname}}</p>
                        </div>
                    </dd>
                    <!--
                        1.order-service-return-lg //退货class
                        2.order-service-refund-lg //退款class
                        3.order-service-exchange-lg //换货class
                        -->
                    <dd :class="ChangingShopBg">
                        <p :class="classPass=='currentThis'?'color':classBack=='currentThis'?'color':''"><span :class="yellowgreen">{{presentStatusPace}}</span></p>
                        <p class="time" v-if='isShow'><span>{{cda.d |decpadleft}}</span>天<span>{{cda.H |decpadleft}}</span>时<span>{{cda.m |decpadleft}}</span>分</p>
                    </dd>
                </dl>
            </div>
             <!-- 换货 退货 退款不退货  -->
             <template>
                <div class="progress-bar ">
                     <!-- //currentThis 审核失败的时候加上这个class,'currentThis':indexStatus==16&&currentSelect==index -->
                      <!-- this.statusVal = ['提交申请','待审核','商品寄回','换货完成']; -->
                     <span class="current">1.提交申请</span>
                     <span :class="classPass">2.{{currentOval}}</span>
                     <span :class="classBack">3.{{currentTval}}</span>
                     <span :class="classComplete" v-show='isHide'>4.{{currentSval}}</span>
                </div>
                <div class="shop-return-info">
                    <ul>
                        <!--operatortype": int 操作类型 1-用户 2-商家 3-平台, form-shop  :class="item.operatortype==1?'':item.operatortype==2?'form-shop':'form-shop-ping'">-->
                        <li v-for="(item,index) in referApply" :key='index'
                         :class="item.operatortype==1?'':'form-shop'">
                            <p class="return-time">{{item.createtime}}</p>
                            <p class="return-text" v-html="item.operatememo">
                            </p>
                        </li>
                    </ul>
                </div>
                <div class="apply" >
                    <div class="applyDiv" v-if='amend'>
                        <span class="amend-apply" @click="changeInfo">修改申请</span>
                    </div>
                    <div class="applyDiv" v-if='hasdata==1 '>
                        <span class="apply-intervene" @click="intervenerStatus">申请介入</span>
                    </div>
                    <div class="applyDiv" v-if='hasdata==2'>
                        <span class="apply-intervene"  @click="repealCheck">撤销申请</span>
                    </div>
                    <div class="applyDiv" v-if='hasdata==3'>
                        <span class="apply-intervene" @click="uploadingLeaflets">{{uploadingVal}}</span>
                    </div>
                    <div class="applyDiv" v-if='hasdata==4'>
                        <span class="apply-intervene" @click="QiyuProd">联系客服</span>
                    </div>
                    <div class="applyDiv" v-if='hasdata==5'>
                        <span class="apply-intervene" @click="ensureShop">确认收货</span>
                    </div>
                </div>
             </template>
        </div>
  </div>
</template>
<<script>
import { DateDiff } from '../../../common/util'
import { OrderServiceStatus, ServiceCancelApply, ServiceConfirmReceive, ServiceApplyIntervene } from '../../../common/api/order'
import { QiyuProd } from '../../../common/api/WyQiyu'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      hasdata: '',
      presentStatus: '我要换货', // 当前要选择的售后方式
      presentStatusPace: '', // 售后进行到哪一步
      yellowgreen: '', // 已完成的时候字体颜色变化
      isShow: false,
      classPass: '',
      classBack: '',
      classComplete: '',
      currentOval: '待审核',
      currentTval: '商品寄回',
      currentSval: '换货完成',
      isHide: true,
      amend: false, // 修改
      uploadingVal: '上传单号',
      uploadingValNum: 4, // 上传物流单号id
      ChangingShopBg: 'order-service-refund-lg', // 退换货，退款背景图
      cda: '',
      referApply: [], // 返回系统消息
      optionParams: {},
      scroll: '',
      paramsInfoReturn: {}// 回传申请信息 
    }
  },
  computed: {
    ...mapGetters({ info: 'orderServiceInfo', ch: 'changeInformation' })
  },
  mounted() {
    window.addEventListener("scroll", this.menuScroll);
    this.OrderStatus()
  },
  methods: {
    menuScroll() { // 头部背景显示
      // let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      // if (scrollTop > 100) {
      //   document.getElementById('transition').style.background = 'rgba(255,255,255,0.95)'
      // } else if (scrollTop > 70) {
      //   document.getElementById('transition').style.background = 'rgba(255,255,255,0.8)'
      // } else if (scrollTop > 20) {
      //   document.getElementById('transition').style.background = 'rgba(255,255,255,0.3)'
      // } else {
      //   document.getElementById('transition').style.background = 'transparent'
      // };
     
    },
    OrderStatus() { // 订单售后信息
        let  orderitemidT ={}
      if(this.info.status==1){
          orderitemidT.orderno = this.info.orderno
      }else{
         orderitemidT.orderitemid =this.info.orderitemid
      }
       console.log(orderitemidT,'订单售后信息参数')
      this.referApply = []
      // setTimeout(function () {},300)
      OrderServiceStatus(orderitemidT)
        .then((res) => {
          if (res) {
          // 切换 头部 状态值
            if (res.type == 1) {
              this.presentStatus = '我要换货'
              this.ChangingShopBg = 'order-service-exchange-lg'
            } else if (res.type == 2||res.type == 4) {
              this.presentStatus = '我要退款 '
              this.ChangingShopBg = 'order-service-refund-lg'
            } else {
              this.presentStatus = '我要退货'
              this.ChangingShopBg = 'order-service-return-lg'
            }
            // console.log(JSON.stringify(res.items[2].operatememo),'jjjj')
            // 接口请求需要传的参数
            this.optionParams.aftersaleid = res.aftersaleid
            this.optionParams.orderitemid = res.orderitemid
            this.optionParams.status = res.status
            this.referApply = res.items.reverse()// 数组倒序
            // 循环的目的是 后台传过来的值 带换行符 '\n'或者回车 没有自动换行
            this.referApply.map(i => {
              i.createtime = i.createtime.split('+')[0]
              i.operatememo = i.operatememo.replace(/\r/g, '<br/>')
              i.operatememo = i.operatememo.replace(/\n/g, '<br/>')
              return i.operatememo, i.createtime
            })
            // 调用倒计时
            var ti3 = res.items[0].createtime + (3 * 24 * 60 * 60 * 1000 - 10 * 1000)// 定义三天时间倒计时3 * 24 * 60 * 60 * 1000 - 6000
            var ti7 = res.items[0].createtime + (7 * 24 * 60 * 60 * 1000 - 10 * 1000)// 定义七天时间倒计时7 * 24 * 60 * 60 * 1000 - 6000
            var ti10 = res.items[0].createtime + (10 * 24 * 60 * 60 * 1000 - 10 * 1000)// 定义十天时间倒计时10 * 24 * 60 * 60 * 1000 - 6000

            // 判断后台系统在自动关闭的时候  当前进度停留在哪
            if (res.status == 16 || res.status == 36) {
              this.presentStatusPace = '已关闭'
              this.isShow = false; this.amend = false
              this.hasdata = 4
              // 申请未通过
              if (res.items[1].status == 11 || res.items[1].status == 31) {
                this.classPass = 'currentThis'; this.classBack = ''; this.classComplete = ''
                this.currentOval = '申请未通过'
              }
              // 寄回商品失败
              if (res.items[1].status == 12 || res.items[1].status == 32) {
                this.classPass = 'current'; this.classBack = 'currentThis'; this.classComplete = ''
                this.currentOval = '申请通过'
              }
            }
            // 仅退款不退货 申请失败
            if (res.status == 24) {
              this.presentStatusPace = '已关闭'
              this.isShow = false
              this.amend = false
              this.hasdata = 4
              if (res.items[1].status == 21) {
                this.classPass = 'currentThis'; this.classBack = ''
                this.currentOval = '申请未通过'
              }
            }
            // 介入状态判断 items 最后一条和倒数第二天的status状态值是否相同  相同为 介入 不相同未通过
            if (res.status == 11 || res.status == 31) {
              this.classPass = 'currentThis'; this.classBack = ''; this.classComplete = ''
              this.currentOval = '申请未通过'
              this.yellowgreen = 'black'
              if (res.items[1].status == 11 || res.items[1].status == 31) {
                this.duplicatedCode('介入中', false, '申请未通过', false, 7)
                return
              }
              this.cda = DateDiff({ destination: ti3, type: 'd' }) // 时间转化方法
              this.duplicatedCode('未通过', true, '申请未通过', true, 1)
            }
            if (res.status == 21) {
              this.classPass = 'currentThis'; this.classBack = ''
              this.currentOval = '申请未通过'; this.currentTval = '退款完成'
              this.isHide = false
              this.yellowgreen = 'black'
              if (res.items[1].status == 21) {
                this.duplicatedCode('介入中', false, '申请未通过', false, 7)
                return
              }
              this.cda = DateDiff({ destination: ti3, type: 'd' }) // 时间转化方法
              this.duplicatedCode('未通过', true, '申请未通过', true, 1)
            }

            // 状态不同 更改进度条内容不同
            if (res.status >= 10 && res.status <= 16) {
              this.currentSval = '换货完成'
            } else if (res.status >= 20 && res.status <= 24) {
              this.currentSval = '退款完成'
            } else {
              this.currentSval = '退货完成'
            }
            // 换货状态值
            switch (res.status) {
              case 10:
                this.cda = DateDiff({ destination: ti3, type: 'd' }) // 时间转化方法
                this.classPass = 'current'; this.classBack = ''; this.classComplete = ''
                this.duplicatedCode('待审核', true, '待审核', true, 2)
                break
              case 12:
                this.cda = DateDiff({ destination: ti7, type: 'd' }) // 时间转化方法
                this.classPass = 'current'; this.classBack = ''; this.classComplete = ''
                this.duplicatedCode('待发货', true, '申请通过', false, 3)
                break
              case 13:
                this.classPass = 'current'; this.classBack = 'current'; this.classComplete = ''
                this.uploadingVal = '修改单号'
                this.uploadingValNum = 5
                this.duplicatedCode('待换货', false, '申请通过', false, 3)
                break
              case 14:
                this.classPass = 'current'; this.classBack = 'current'; this.classComplete = ''
                this.cda = DateDiff({ destination: ti7, type: 'd' }) // 时间转化方法
                this.duplicatedCode('待收货', true, '申请通过', false, 5)
                break
              case 15:
                this.classPass = 'current'; this.classBack = 'current'; this.classComplete = 'current'
                this.yellowgreen = 'yellowgreen'
                this.duplicatedCode('已完成', false, '申请通过', false, 7)
                break
              case 20:
                // 退款状态值
                this.cda = DateDiff({ destination: ti3, type: 'd' }) // 时间转化方法
                this.classPass = 'current'; this.classBack = ''
                this.currentTval = '退款完成',
                this.isHide = false
                this.duplicatedCode('待审核', true, '待审核', true, 2)
                break
              case 22:
                this.classPass = 'current'; this.classBack = ''
                this.currentTval = '退款完成',
                this.isHide = false
                // this.yellowgreen='yellowgreen'
                this.duplicatedCode('已通过', false, '申请通过', false, 7)
                break
              case 23:
                this.classPass = 'current'; this.classBack = 'current'
                this.currentTval = '退款完成'
                this.isHide = false
                this.yellowgreen = 'yellowgreen'
                this.duplicatedCode('已完成', false, '申请通过', false, 7)
                break
              case 30:
                // 退货状态
                this.cda = DateDiff({ destination: ti3, type: 'd' }) // 时间转化方法
                this.classPass = 'current'; this.classBack = ''; this.classComplete = ''
                this.duplicatedCode('待审核', true, '待审核', true, 2)
                break
              case 32:
                this.cda = DateDiff({ destination: ti7, type: 'd' }) // 时间转化方法
                this.classPass = 'current'; this.classBack = ''; this.classComplete = ''
                this.duplicatedCode('待发货', true, '申请通过', false, 3)
                break
              case 33:
                this.cda = DateDiff({ destination: ti10, type: 'd' }) // 时间转化方法
                this.classPass = 'current'; this.classBack = 'current'; this.classComplete = ''
                this.uploadingVal = '修改单号'
                this.uploadingValNum = 5
                this.duplicatedCode('待退款', true, '申请通过', false, 3)
                break
              case 34:
                this.duplicatedCode('待退款', false, '申请通过', false, 7)
                this.classPass = 'current'; this.classBack = 'current'; this.classComplete = ''

                break
              case 35:
                this.classPass = 'current'; this.classBack = 'current'; this.classComplete = 'current'
                this.yellowgreen = 'yellowgreen'
                this.duplicatedCode('已完成', false, '申请通过', false, 7)
                break
            }
            this.paramsInfoReturn = res// 回传申请信息
            this.paramsInfoReturn.returnlogisticsmoney = res.returnlogisticsmoney;
           
            //颜色规格
            // this.paramsInfoReturn.size = res.size
            // this.paramsInfoReturn.color = res.color
            // this.paramsInfoReturn.count = res.count
            this.paramsInfoReturn.size =res.changecolor
            this.paramsInfoReturn.color = res.changesize
            this.paramsInfoReturn.count = res.changecount

            delete this.paramsInfoReturn.items
          } else {
            this.toast('暂无数据')
            this.hasdata = 7
            this.isShow = false
            this.presentStatusPace = ''
          }
          // console.log(res, ' res  kkkk')
        }).catch(e => {
          this.toast(e.msg)
        })
    },
    duplicatedCode(presentStatusPace, isShow, currentOval, amend, hasdata) { // 重复代码
      this.presentStatusPace = presentStatusPace
      this.isShow = isShow // 倒计时判断
      this.currentOval = currentOval // 有没有通过
      this.amend = amend  // 修改申请按钮判断
      this.hasdata = hasdata
    },
    commonApi(api, string) { // 接口
      if(this.info.status==1){
          this.optionParams.orderno = this.info.orderno
      }
      api(this.optionParams)
        .then(res => {
          res.items.map(i => {
            i.createtime = i.createtime.split('+')[0]
            return i.createtime
          })
          this.isShow = false
          this.presentStatusPace = string
          this.referApply = res.items.reverse()
          this.referApply.map(i => {
            i.createtime = i.createtime.split('+')[0]
            i.operatememo = i.operatememo.replace(/\r/g, '<br/>')
            i.operatememo = i.operatememo.replace(/\n/g, '<br/>')
            return i.operatememo, i.createtime
          })
          this.amend = false
          this.hasdata = 7
        }).catch(res => {
          this.toast(res.msg)
        })
    },
    changeInfo() { // 修改申请
      this.$router.replace({
        path: '/order/service/add',
        query: { 'type': 0 }
      })
      this.$store.dispatch('ChangeInfo', this.paramsInfoReturn)// 回传申请信息
    },
    repealCheck() { // 撤销审核
      this.classPass = ''
      this.commonApi(ServiceCancelApply, '已撤销')
    },
    intervenerStatus() { // 平台介入
      this.commonApi(ServiceApplyIntervene, '介入中')
    },
    uploadingLeaflets() { // 上传和修改物流单号
      this.$router.replace({
        path: '/order/service/add',
        query: { 'type': this.uploadingValNum }
      })
      this.$store.dispatch('ChangeInfo', this.paramsInfoReturn)// 回传申请信息
    },
    ensureShop() { // 确认收货
      this.commonApi(ServiceConfirmReceive, '已完成')
      this.yellowgreen = 'yellowgreen'
      this.classPass = 'current'; this.classBack = 'current'; this.classComplete = 'current'
    },
    QiyuProd() { // 跳客服的

      QiyuProd.call(this)
    }
  }
}
</script>
<style scoped>
#transition{
    background: transparent;
}
p.name {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.topHead {
  height: 160px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: -1;
  background:linear-gradient(top, #dbaa08, #fcf95c);

}
.topHead span {
  width: 25px;
  height: 25px;
}
.content {
  /* margin-top: 255px; */
  padding: 0 15px;
  padding-bottom: 55px;
  position: absolute;
  top: 48px;
  width: 100%;
  left: 0;
}
.content-common {
  padding: 15px 20px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 2px 5px #ccc;
  padding-right: 0;
  padding-top: 0;
}
.content-common dl {
  overflow: hidden;
}
.content-common dd {
  float: left;
  text-align: center;
  width: 50%;
}
.content-common dd:nth-child(2) {
  font-size: 30px;
  font-weight: bold;
  padding: 25px 0;
  padding-top: 35px;
  padding-bottom: 20px;
  height: 120px;
}
.content-common dd:nth-child(2).order-service-refund-lg {
  background: url("//files.eyee.com/mcdn/static/img/order-service-refund-lg.png") bottom left
    no-repeat #fff;
  background-size: 100% 100%;
}
.content-common dd:nth-child(2).order-service-return-lg {
  background: url("//files.eyee.com/mcdn/static/img/order-service-return-lg.png") bottom left
    no-repeat #fff;
  background-size: 100% 100%;
}
.content-common dd:nth-child(2).order-service-exchange-lg {
  background: url("//files.eyee.com/mcdn/static/img/order-service-exchange-lg.png") bottom left
    no-repeat #fff;
  background-size: 100% 100%;
}
.content-common dd:nth-child(2) p.time {
  font-size: 18px;
  line-height: 30px;
}
.content-common dd:nth-child(2) p.time span {
  color: #e90707;
}
.content-common dd:nth-child(2) .color {
  color: red;
  /* text-align: left; */
}
.content-common dd:nth-child(2) p .yellowgreen{
  color: #ffc700;
}
.content-common dd:nth-child(2) p .black{
  color:#000;
}
.content-common dd div.Oimg {
  width: 100px;
  height: 100px;
  margin-bottom: 8px;
  margin-top: 15px;
}
.content-common dd div img {
  width: 100%;
  height: 100%;
}
.content-common .describe {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #666;
  width: 100px;
  letter-spacing: 0;
  text-align: center;
  line-height: 18px;
}
.content-common .describe .shop {
  color: #333;
    text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.progress-bar {
  margin-top: 36px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #666666;
  letter-spacing: 0;
  line-height: 10px;
  text-align: center;
  display: flex;
  text-align: center;
}
.progress-bar span {
  flex: 1;
  position: relative;
}
.progress-bar span:before {
  content: "";
  width: 10px;
  height: 10px;
  background: #eee;
  position: absolute;
  top: -15px;
  left: 50%;
  margin-left: -5px;
  border-radius: 50%;
  z-index: 2;
}
.progress-bar span:after {
  content: "";
  background: #eee;
  position: absolute;
  height: 2px;
  width: 100%;
  top: -11px;
  left: 0;
  margin-left: -50%;
  /* border-radius:50%; */
}
.progress-bar span:first-child:after {
  width: 0;
  z-index: 1;
}
.progress-bar span.current:before,
.progress-bar span.current:after {
  background: #ffc700;
}
.progress-bar span.currentThis:before,
.progress-bar span.currentThis:after {
  background: #f05959;
}
.progress-bar span.currentThis:before {
  content: "x";
  color: #fff;
  line-height: 7px;
  text-align: center;
}
.shop-return-info {
  text-align: center;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #666666;
  width: 98%;
  margin: 0 auto;
  letter-spacing: 0;
  line-height: 20px;
  text-align: left;
}
.shop-return-info ul {
  overflow: hidden;
}

.shop-return-info li {
  margin: 20px auto;
  width: 97.8%;
  float: left;
  margin-bottom: 0;
}
.shop-return-info li .return-time {
  text-align: center;
  margin-bottom: 10px;
}
.shop-return-info li .return-text {
  background: #eeeeee;
  padding: 10px 5%;
  border-radius: 5px;
  position: relative;
  /* min-height: 40px; */
  line-height: 20px;
}
.shop-return-info li .return-text:after {
  content: "";
  width: 0px;
  height: 0px;
  position: absolute;
  top: 50%;
  right: -8px;
  transform: translateY(-50%);
  border-top: 5px solid transparent;
  border-left: 8px solid #eee;
  border-bottom: 5px solid transparent;
}
.shop-return-info li.form-shop {
  float: right;
}
.shop-return-info li.form-shop .return-text {
  background: #ffe37f;
}
.shop-return-info li.form-shop .return-text:after {
  border-top: 0 solid transparent;
  border-bottom: 0 solid transparent;
  border-left: 0 solid #ffe37f;
}
.shop-return-info li.form-shop .return-text:before {
  content: "";
  width: 0px;
  height: 0px;
  position: absolute;
  top: 50%;
  left: -8px;
  transform: translateY(-50%);
  border-top: 5px solid transparent;
  border-right: 8px solid #ffe37f;
  border-bottom: 5px solid transparent;
}
.apply {
  display: flex;
  background: #eeeeee;
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  /* padding: 15px 0; */
}
.apply .applyDiv {
  flex: 1;
  margin: 15px 0;
  text-align: center;
}
.apply .applyDiv span {
  outline-style: none;
  background: #fff;
  border: 1px solid #333;
  font-size: 14px;
  color: #666666;
  border-radius: 5px;
  padding: 7px;
}
</style>

