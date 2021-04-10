<template>
    <div v-if="realCard" class="card_unit">
        <img :src="realCard.bgSrc|https" alt="">
        <section class="top_card flex-aic">{{realCard.name}} <em class="memo_card" @click="reChargeGetMemo(0)"></em></section>
        <section class="bottom_card flex-aic">
            <p class="left_bottomCard">
                <img :src="realCard.imgSrc|https" alt="">
            </p>
            <p class="right_bottomCard" :class="{g4Line:realCard.type == 3}">
                <label>{{realCard.name}}</label>
                <label v-if="realCard.type == 4" class="copy_label flex-aic">卡号：<input type="text" v-model="realCard.cardno" id="cardNo"><span class="copyBtn" @click.stop="copyText(0)">复制</span></label>
                <label v-if="realCard.type == 4" class="copy_label flex-aic">卡密：<input type="text" v-model="realCard.cardpwd" id="cardPwd"><span class="copyBtn" @click.stop="copyText(1)">复制</span></label>
                <label v-if="realCard.type == 4">有效期至：{{realCard.usetime|usefulDate}}</label>
                <label v-else>{{realCard.usetime}}</label>
            </p>
            <span class="rig_bottomCard" v-if="realCard.type == 3" :class="{rechargeBtn:cardStatus == 0}" @click="reChargeGetMemo(1)">{{realCard.statusWord}}</span>
            <em></em>
        </section>
    </div>
</template>
<script>
    import { DateFormat } from '../../common/util'
    export default {
      props: {
        cardInfos: {},
        cardStatus: { type: Number }
      },
      data() {
        return {
          G4Img: '//files.eyee.com/mcdn/static/img/card_4g.png', // require('../../assets/img/card_4g.png'),
          IqiyiImg: '//files.eyee.com/mcdn/static/img/card_iqiyi.png', // require('../../assets/img/card_iqiyi.png'),
          cardG4Unuse: '//files.eyee.com/mcdn/static/img/cardLabel_4g.png', // require('../../assets/img/cardLabel_4g.png'),
          cardIqiyiUnuse: '//files.eyee.com/mcdn/static/img/cardLabel_iqiyi.png', // require('../../assets/img/cardLabel_iqiyi.png'),
          cardOver: '//files.eyee.com/mcdn/static/img/cardLabel_over.png' // require('../../assets/img/cardLabel_over.png')
        }
      },
      computed: {
        realCard() {
          let co = this.cardInfos
          if (co) {
            if (this.cardStatus == 0) {
              if (co.type == 4) {
                co.bgSrc = this.cardIqiyiUnuse
              } else if (co.type == 3) {
                co.bgSrc = this.cardG4Unuse
              }
              co.statusWord = '去充值'
            } else {
              co.bgSrc = this.cardOver
              if (this.cardStatus == 1) {
                co.statusWord = '已使用'
              } else if (this.cardStatus == 2) {
                co.statusWord = '已过期'
              }
            }
            if (co.type == 4) {
              co.imgSrc = this.IqiyiImg
            } else if (co.type == 3) {
              co.imgSrc = co.iconurl
              // co.imgSrc = this.G4Img
            }
          }
          console.log(co, 'co-----------------------------------')
          return co
        }
      },
      mounted() {

      },
      filters: {
        usefulDate(time) {
          if (time) {
            time = time.split('-')[1]
            return DateFormat(time, 'yyyy年M月d日')
          }
        }
      },
      methods: {
        copyText(n) {
          if (this.cardStatus == 0) {
            document.execCommand('Copy')
            if (n == 0) {
              var UrlNo = document.getElementById('cardNo')
              UrlNo.select()
            } else {
              var UrlPwd = document.getElementById('cardPwd')
              UrlPwd.select()
            }
            document.execCommand('Copy') // 执行浏览器复制命令
            this.toast('复制成功！')
          } else {
            this.toast('该卡已经无效了~~')
          }
        },
        reChargeGetMemo(type) {
          var rulesData = {}
          rulesData.type = type
          if (type == 0) {
            rulesData.showRule = true
            rulesData.name = this.realCard.name
            rulesData.memo = this.realCard.memo
            rulesData.cardId = null
          } else if (type == 1) {
            if (this.cardStatus == 0) {
              rulesData.showRule = true
              rulesData.name = null
              rulesData.memo = null
              rulesData.cardId = this.realCard.id
            }
          }
          this.$emit('showRules', rulesData)
        }
      }
    }
</script>
<style scoped>
    .card_unit{
        position: relative;
        margin-bottom: 10px;
    }
    .card_unit>img{
        display: block;
    }
    .card_unit .top_card,.card_unit .bottom_card{
        position: absolute;
        width: 100%;
        color: #fff;
        padding: 0 15px;
        font-size: 1.125rem;
    }
    .card_unit .top_card{
        height: 30%;
        top: 0;
    }
    .card_unit .bottom_card{
        height: 70%;
        top: 30%;
    }
    .card_unit .bottom_card>em{
        position: absolute;
        width: 1px;
        height: 100%;
        border-left: 1px dashed #f2f2f2;
        right: 69%;
        top: -3px;
    }
    .card_unit .bottom_card .left_bottomCard{
        width: 31%;
        padding-right: 20px;
    }
    .card_unit .bottom_card .right_bottomCard{
        width: 69%;
        color: #999;
        font-size: 12px;
    }
    .card_unit .bottom_card .right_bottomCard.g4Line{
        width: 70%;
    }
    .card_unit .bottom_card .right_bottomCard>label{
        display: block;
        margin-bottom: 3px;
    }
    .card_unit .bottom_card .right_bottomCard>label:first-child{
        color: #666;
        font-size: 14px;
    }
    .card_unit .bottom_card .right_bottomCard>label.copy_label{
        position: relative;
    }
    .card_unit .bottom_card .right_bottomCard>label.copy_label input{
        width: 40%;
    }
    .copyBtn {
        /*position: absolute;*/
        /*right: 0;*/
        display: inline-block;
        border: 1px solid #ccc;
        border-radius: 2px;
        padding: 0px 5px;
        font-size: 12px;
    }
    .memo_card{
        position: absolute;
        display: inline-block;
        right: 10px;
        top: 50%;
        margin-top: -10px;
        font-style: normal;
        width: 20px;
        height: 20px;
        border: 2px solid #fff;
        border-radius: 50%;
        text-align: center;
        font-weight: 600;
        font-size: 14px;
    }
    .memo_card:after{
        content: '?';
    }
    span.rig_bottomCard {
        position: absolute;
        display: inline-block;
        width: 51px;
        height: 24px;
        line-height: 24px;
        right: 8px;
        background: #fff;
        top: 50%;
        margin-top: -12px;
        text-align: center;
        border:1px solid #ccc;
        color: #ccc;
        font-size: 13px;
        border-radius: 5px;
    }
    span.rig_bottomCard.rechargeBtn{
        color: #ffc700;
        border-color: #ffc700;
    }
</style>
