<template>
    <div class="bindSex">
      <!-- <div class="bindSexTitle">个性化</div> -->
      <p class="explain">
        请选择您的性别<br>以便我们为您提供更好的服务
      </p>
      <div class="checkLoge">
        <!-- <p class="sex">性别</p> -->
        <div class="checkLoge-main">
          <!-- <div v-for="(it,idx) in imgUrl" :key="idx">
            <div class="Img" @click.stop="checked(idx)">
              <img :src="it.url">
            </div>
            <span class="choose Notcheck" :class="{check:idx===ischeck}">
            </span>
          </div> -->
          <div class="selectedSex">
            <span v-for="(sex,index) in sexSelected" :key="index" @click.stop="goNext(index)">{{sex}}</span>
          </div>
        </div>
        <!-- <div class="goBtn" @click.stop="goNext">下一步</div> -->
      </div>
    </div>
</template>
<script>
import { UpdateInfo } from "../../common/api/user";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      // imgUrl:[{url:require('../../assets/img/boy.png')},{url:require('../../assets/img/girl.png')}],
      sexSelected: ["我是潮男", "我是女神"],
      ischeck: 0
    };
  },
  props: {},
  computed: {
    ...mapGetters({ localUserInfos: "userInfo" })
    // localUserInfos() {
    //   return JSON.parse(localStorage.getItem('currentUser'))
    // }
  },
  methods: {
    checked(index) {
      this.ischeck = index;
    },
    goNext(sexVla) {
      console.log(this.localUserInfos);
      UpdateInfo({ sex: sexVla })
        .then(res => {
          if (res) {
            // this.toast(res.msg)
            // this.toast('性别选择成功')
            this.$store.dispatch("setUserInfo", res);
            // localStorage.setItem('currentUser', JSON.stringify(res))
            // this.$router.replace('/uesrHobby')
            // this.$router.replace('/addUserInfo')
            this.$router.push("/");
          }
        })
        .catch(e => {
          console.log(e);
          this.toast(e.msg);
          // this.toast('修改性别失败')
        });
    },
    mounted() {}
  }
};
</script>
<style scoped>
#app {
}
.bindSex {
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
  background: url("//files.eyee.com/mcdn/static/img/wanshanBg.jpg") 0 0
    no-repeat;
  background-size: 100%;
  padding-top: 120px;
  height: 100vh;
  background-position: 0 -100px;
}
.bindSexTitle {
  width: 100%;
  height: 48px;
  background: #333;
  color: white;
  text-align: center;
  line-height: 48px;
}
.explain,
.sex {
  width: 100%;
  text-align: center;
  font-size: 12px;
  line-height: 20px;
  margin-top: 50px;
}
.explain {
  font-family: PingFangSC-Medium;
  font-size: 20px;
  color: #fff;
  letter-spacing: 0;
  line-height: 34px;
  text-align: left;
  padding: 0 30px;
  margin-top: 0;
}
.checkLoge {
  width: 100%;
}
.checkLoge-main {
  width: 95%;
  margin: 90px auto;
  margin-bottom: 0;
  display: flex;
  justify-content: space-between;
}
.checkLoge-main div {
  width: 100px;
  height: 150px;
}
.checkLoge-main div.selectedSex {
  width: 100%;
  overflow: hidden;
  margin-top: 150px;
  text-align: center;
  display: flex;
}
.checkLoge-main div.selectedSex span {
  /* float: left;
     */
  display: inline-block;
  background: #ffc700;
  border-radius: 5px;
  /* width:143px; */
  flex: 1;
  height: 40px;
  color: #fff;
  text-align: center;
  line-height: 40px;
}
.checkLoge-main div.selectedSex span:nth-child(2) {
  margin-left: 15px;
}
.checkLoge-main .Img {
  width: 100px;
  height: 100px;
}
.checkLoge-main img {
  width: 100%;
  height: 100%;
}
.goBtn {
  width: 300px;
  height: 35px;
  margin: 100px auto;
  border-radius: 4px;
  background: #333333;
  color: white;
  text-align: center;
  line-height: 35px;
}
.choose {
  display: block;
  width: 18px;
  height: 18px;
  margin: 5px auto;
  background-position: center;
  background-size: cover;
}
.Notcheck {
  background-image: url("//files.eyee.com/mcdn/static/img/cart_no.png");
}
.check {
  background-image: url("/static/imgs/cart_choose.png");
}
</style>
