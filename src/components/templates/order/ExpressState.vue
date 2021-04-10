<template>
  <div class="od_status flex-aic">
    <!--  -->
    <div class="act" v-for="(item,index) in timedata" :key="index" :class="{pass:item.status<=ordetail.status&&ordetail.status!=4}">
      <span></span>
      <i v-if="item.status==ordetail.status&&ordetail.status!=4"></i>
      <div>
        <p>{{item.text}}</p>
        <p v-if="item.date&&ordetail.status!=4">{{item.date}}</p>
        <p v-if="item.time&&ordetail.status!=4">{{item.time}}</p>
      </div>
    </div>
  </div>
</template>
<script>
  import { DateFormat } from '../../../common/util'
  export default {
    props: {
      ordetail: Object
    },
    data() {
      return {
        timedata: [
          { status: 0, text: '创建', date: '', time: '' },
          { status: 1, text: '付款', date: '', time: '' },
          { status: 2, text: '发货', date: '', time: '' },
          { status: 3, text: '收货', date: '', time: '' }
        ]

      }
    },
    mounted() {
      var d = this.ordetail
      // console.log('订单详情', d)
      let [t, createtime, paytime, sendtime, confirmtime] = [
        this.timedata,
        d.createtime, // 创建时间
        d.paytime,    // 付款时间
        d.sendgoodtime,  // 发货时间
        d.confirmgoodtime  // 已经完成时间
      ]
      if (createtime) {
        t[0].date = this.filtime(createtime, 0)
        t[0].time = this.filtime(createtime, 1)
      }
      if (paytime) {
        t[1].date = this.filtime(paytime, 0)
        t[1].time = this.filtime(paytime, 1)
      }
      if (sendtime) {
        t[2].date = this.filtime(sendtime, 0)
        t[2].time = this.filtime(sendtime, 1)
      }
      if (confirmtime) {
        t[3].date = this.filtime(confirmtime, 0)
        t[3].time = this.filtime(confirmtime, 1)
      }
    },
    methods: {
      filtime(time, type) {
        // type 0 返回日期 1 返回时间
        if (time) {
          if (type == 0) {
            return DateFormat(time, 'yyyy.MM.dd')
          } else {
            return DateFormat(time, 'HH:mm')
          }
        } else {
          return ''
        }
      }
    }
  }

</script>
<style scoped>
  .od_status {
    width: 80%;
    margin: 0 auto;
    justify-content: space-between;
  }

  .od_status>div {
    position: relative;
    border-top: 1px solid #ccc;
    width: 23%;
    height: 60px;
  }

  .act span {
    display: inline-block;
    border: 2px solid #ccc;
    border-radius: 50%;
    position: absolute;
    left: -12px;
    top: -2.5px;
  }

  .act i {
    width: 10px;
    height: 10px;
    display: inline-block;
    border: 1px solid #ffc700;
    position: absolute;
    left: -15px;
    top: -5px;
    border-radius: 50%;
  }

  .act>div {
    text-align: center;
    position: absolute;
    font-size: 12px;
    color: #ccc;
    width: 100%;
    left: -65%;
    top: 10px;
  }

  .act>div p {
    font-size: 12px;
    margin-top: 4px;
  }

  .act:nth-last-child(1)>div {
    width: 60px;
    left: -35px;
  }

  .pass>div {
    color: #ffc700
  }

  .pass span {
    border: 2px solid #ffc700;
  }

  .od_status>div.pass {
    border-top: 1px solid #ffc700;
  }

  .od_status>div:nth-last-of-type(1) {
    border-top: none;
    width: 5px;
  }
</style>