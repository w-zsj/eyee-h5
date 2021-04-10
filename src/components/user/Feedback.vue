<template>
  <div class="feedback">
    <v-header>
      <div class="nav-tab2">
        <h3>意见反馈</h3>
      </div>
    </v-header>
    <p class="head_word">您有任何意见或者建议，我们都乐意接受哦~</p>
    <textarea placeholder="请将您的想法告诉我们哦~" style="width:100%;height:200px;" v-model="params.feedback">这里写内容</textarea>
    <input type="text" placeholder="请留下您的联系方式：邮箱/手机号码" v-model="params.contact">
    <p class="tips_word">O(∩_∩)O~~如果您的想法能帮助我们成长，我们一定会给予一定奖励给您哦~<br><br></p>
    <div class="add_footer" @click="cofirmFeed">确定提交</div>
  </div>
</template>
<script>
  import { AppAdvice } from '../../common/api/user'
  import { mapGetters } from 'vuex'
  export default {
    data() {
      return {
        params: {
          feedback: '',
          contact: ''
        }
      }
    },
    mounted() {

    },
    computed: {
      ...mapGetters({
        userInfo: 'userInfo',
        orderCouponList: 'orderCouponList',
        unOrderCouponList: 'unOrderCouponList'
      })
    },
    methods: {
      cofirmFeed() {
        console.log(this.params)
        if (this.params.feedback != '' && this.params.contact != '') {
          console.log('非空')
        } else {
          this.toast('内容不能为空')
          return false
        }
        AppAdvice(this.params).then((res) => {
          console.log(res)
          if (res == null) {
            this.$router.go(-1)
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    }
  }

</script>
<style scoped>
  .feedback{
    padding: 0 15px;
    background: #f2f2f2;
    font-size: 15px;
  }
  .head_word{
    padding: 10px 0;
    color: #ffc700;
  }
  .feedback input,.feedback textarea{
    display: block;
    width: 100%;
    margin-bottom: 20px;
  }
  .feedback input{
    height: 40px;
    line-height: 40px;
  }
  .tips_word{
    font-size: 11px;
    margin-bottom: 10px;
  }
</style>
