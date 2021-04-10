<template>
  <div class="add-info-mask" v-if="hasdata==1">
    <div class="add-info">
      <div class="bindSex">
          <div class="checkLoge-main">
             <p class="explain">
              请选择您的性别<br>以便我们为您提供更好的服务
            </p>
            <div class="selectedSex">
              <span v-for="(sex,index) in sexSelected" :key="index" @click.stop="goNext(index)">{{sex}}</span>
            </div>
          </div>

      </div>
    </div>

  </div>
  <GetSuccess v-else-if="hasdata==2"></GetSuccess>
  <GetFail v-else-if="hasdata==3"></GetFail>
</template>
<script>
  import { UpdateInfo } from '../../common/api/user'
  import GetSuccess from './GetSuccess.vue'
  import GetFail from './GetFail.vue'
  import { mapGetters } from 'vuex'
  const elBody = document.getElementsByTagName("body")[0];
  export default {
    components: {
      GetSuccess, GetFail
    },
    data() {
      return {
        // imgUrl:[{url:require('../../assets/img/boy.png')},{url:require('../../assets/img/girl.png')}],
        sexSelected: ['我是潮男', '我是女神'],
        ischeck: 0,
        hasdata: 1
      }
    },
    props: {},
    computed: {
      ...mapGetters({ localUserInfos: 'userInfo' })
      // localUserInfos() {
      //   return JSON.parse(localStorage.getItem('currentUser'))
      // }
    },
    methods: {
      checked(index) {
        this.ischeck = index
      },
      goNext(sexVla) {
        console.log(this.localUserInfos)
        UpdateInfo({ sex: sexVla }).then((res) => {
          if (res) {
            // this.toast(res.msg)
            // this.toast('性别选择成功')
            this.$store.dispatch('setUserInfo', res)
            // localStorage.setItem('currentUser', JSON.stringify(res))
            // this.$router.replace('/uesrHobby')
            this.hasdata = 2
          }
        }).catch((e) => {
          console.log(e)
          //  this.toast(e.msg)
          this.hasdata = 3
          // this.toast('修改性别失败')
        })
      },
      mounted() {
        // elBody.classList.add("lock");
      }
    }
  }
</script>
<style scoped>
  .add-info-mask{
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 100;
  }
  .add-info{
    width: 240px;
    height: 316px;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    border-radius: 14px;
    background: #000;
    /* background-size: 100% 100%; */
    /* overflow: hidden; */
}

  .bindSexTitle{
    width: 100%;
    height: 48px;
    background: #333;
    color: white;
    text-align: center;
    line-height: 48px;
  }
  .explain,.sex{
    width: 100%;
    text-align: center;
    font-size: 12px;
    line-height:20px;
    margin-top: 50px;
  }
  .explain{
    font-family:PingFangSC-Medium;
    font-size:16px;
    color:#fff;
    letter-spacing:0;
    line-height:34px;
    text-align:left;
    padding: 0 15px;
    margin-top: 50px;
  }
  .checkLoge{
    width: 100%;
  }
  .checkLoge-main div.selectedSex{
    /* width: auto; */
    /* overflow: hidden; */
   position: absolute;
   left: 0;
   bottom: 0;
   width: 100%;

  }
  .checkLoge-main div.selectedSex span{
    height: 35px;
    line-height: 35px;
    width: 100px;
    background: #ffc700;
    border-radius: 4px;
    text-align: center;
    margin: 5px auto;
    color: white;
    position: absolute;
    left: 10px;
    /* margin-left: -50px; */
    bottom: 30px;
    font-size: 18px;
    float: left;

  }
  .checkLoge-main div.selectedSex span:nth-child(2){
    left: auto;
    right: 10px;
  }
  .checkLoge-main .Img{
    width:100px ;
    height: 100px;
  }
  .checkLoge-main img{
    width: 100%;
    height: 100%;
  }
  .goBtn{
    width: 300px;
    height:35px;
    margin: 100px auto;
    border-radius: 4px;
    background: #333333;
    color: white;
    text-align: center;
    line-height: 35px;
  }
  .choose{
    display:block;
    width: 18px;
    height: 18px;
    margin:5px auto;
    background-position:center ;
    background-size:cover ;
  }
  .Notcheck{
    background-image: url('//files.eyee.com/mcdn/static/img/cart_no.png');
  }
  .check{
    background-image:url('/static/imgs/cart_choose.png');
  }
</style>
