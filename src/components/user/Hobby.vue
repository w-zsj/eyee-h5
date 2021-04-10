<template>
    <div class="hobby">
      <v-header >
        <div class="nav-tab"><h4>选择你的兴趣</h4></div><div style="width: 60px;height: 60px"></div>
      </v-header>
      <div class="hobbyMain">
        <div class="hobbyList" v-for="(item,index) in iconList" :key="index">
          <div class="ImgWrap" @click="isChecked(item)">
            <div class="Img">
              <img :src="item.logourl|https">
            </div>
            <span class="check " :class="{'check-show':item.checked}"></span>
          </div>
          <span class="hobbyName">{{item.name}}</span>
        </div>
      </div>
      <div class="finish" @click.stop="commit" :class="{'finish-bg':hobbyList.length&&hobbyList.length>0}">完成</div>
    </div>
</template>
<script>
  import { HobbyLabels, BindHobbyLabels } from '../../common/api/user'
  export default {
    data() {
      return {
        iconList: [],
        hobbyList: []
      }
    },
    props: {},
    computed: {},
    watch: {},
    methods: {
      req() {
        HobbyLabels().then((res) => {
          if (res) {
            console.log(res)
            for (var i = 0; i < res.length; i++) {
              res[i].checked = false
            }
            this.iconList = res
          }
        }).catch((err) => {
          console.log(err + '信息')
        })
      },
      isChecked(item) {
        item.checked = !item.checked
        if (item.checked) {
          this.hobbyList[this.hobbyList.length] = {
            HobbyLabelGroupId: item.hobbylabelid
          }
        } else {
          console.log(item)
          for (let j = 0; j < this.hobbyList.length; j++) {
            if (item.hobbylabelid == this.hobbyList[j].HobbyLabelGroupId) {
              this.hobbyList.splice(j, 1)
            }
          }
        }
        // console.log(this.hobbyList)
      },
      commit() {
        if (this.hobbyList.length > 0) {
          BindHobbyLabels(this.hobbyList).then((res) => {
            if (!res) {
              this.toast('添加兴趣菜单成功')
            }
            this.$router.push('/')
          }).catch((e) => {
            console.log(e)
          })
        }
      }
    },
    mounted() {
      this.req()
    },
    components: {}
  }
</script>
<style scoped>
.hobby{
  position: relative;
  top: 0;
  left: 0;
}
.nav-tab{
  height: 48px;
  width: 100%;
  line-height: 48px;
  text-align: center;
  color: #333333;
}
.hobbyMain{
  width: 100%;
  display: flex;
  flex-direction:row ;
  flex-wrap: wrap;
  padding:  0 10px 0;
}
.hobbyList{
  width: 25%;
  text-align: center;
  position: relative;
  padding: 13px;
}
  .hobbyName{
    font-size: 12px;
    color: #333333;
  }
.check{
  display: block;
  width: 18px;
  height: 18px;
  position: absolute;
  top: 15%;
  left: 70%;
  background-position:center ;
  background-size:cover ;
}
.check-show{
  background-image:url('/static/imgs/cart_choose.png');
}
  .finish{
    width:300px;
    height: 35px;
    background: #333333;
    text-align: center;
    line-height: 35px;
    color: white;
    border-radius: 4px;
    margin:90px auto ;
  }
.finish-bg{
  background: #ffc700;
}
</style>
