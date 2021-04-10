<template>
    <div>
        <p class="title">所在地区</p>
        <div class="selectAddress">
          <span class="cancel" @click.stop='cancel'>取消</span>
          <span class="affirm" @click.stop="areaCffirm">确认</span>
        </div>
        <div class="tabCity">
            <dl>
                <!-- <dd @click="tabCity" v-show="areaCity.isShow">{{areaCity.province}}</dd> -->
                <dd v-for="(item,index) in areaCity" :class="contentShowList==index?'activeTab':''"
                  :key="item.id" v-if="item.isShow" @click.stop="tabCity(index)">
                   {{item.provinceCityCounty}}
                </dd>
            </dl>
        </div>
        <div class="contentShowList">
            <transition name="fade">
                <ul v-if="contentShowList==0">
                    <li v-for="(item,index) in provinceId" :class="currentIndex0==index?'active':''"
                        :key="item.id" @click.stop="selectProvince(item.name,item.id,0,index)">
                        {{item.name}}
                    </li>
                </ul>
            </transition>
            <transition name="fade">
                <ul v-if="contentShowList==1" >
                    <li v-for="(item,index) in city" :key="item.id" :class="currentIndex1==index?'active':''" @click.stop="selectCity(item,item.id,1,index)">
                        {{item.name}}
                    </li>
                </ul>
            </transition>
            <transition name="fade">
                <ul v-if="contentShowList==2" >
                    <li v-for="(item,index) in districts" :key="item.id" :class="currentIndex2==index?'active':''" @click.stop="district(item.name,2,index)">{{item.name}}</li>
                </ul>
            </transition>
        </div>
        <transition name="fadeLoad">
        <div v-show="hasdata!=0" class="loading">加载中...</div>
         </transition>
    </div>
</template>
<script>
import {
  BaseProvinces,
  BaseGetCitiesAndDistricts
} from "../../common/api/base";
import { ENUM } from '../../common/util'
  import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      provinceId: [], //省份
      hasdata:0,
      areaCity: [
        { provinceCityCounty: "请选择", isShow: true },
        { provinceCityCounty: "请选择", isShow: false },
        { provinceCityCounty: "请选择", isShow: false }
      ],
      city: [],
      districts:[],//区
      storageCity:[],//所有shi
      contentShowList: 0,
      currentIndex0:null,
      currentIndex1:null,
      currentIndex2:null,
      areaValue:''

    };
  },
  mounted() {
    //省份
    if(this.newCity.length>0){
      this.provinceId = this.newCity;
    }else{
       BaseProvinces().then(res => {
        if (res) {
          this.$store.dispatch('newCity',res)
          this.provinceId = res;
        }
      });
    }

  },
  computed: {
    ...mapGetters({
      newCity: 'newCity'
    })
  },
  methods: {
    tabCity(index) {
      this.contentShowList = index
    },
    selectProvince(name, id, type,index) {
      //  console.log(id, "市区");
        this.areaCity[type].provinceCityCounty = name;
        this.areaCity[1].isShow = true;
        this.areaCity[2].isShow = false;
        this.areaCity[1].provinceCityCounty = '请选择';
        this.areaCity[2].provinceCityCounty = '请选择';
        this.contentShowList = 1;
        this.currentIndex0=index;
        this.currentIndex1=null;
        this.currentIndex2=null;
        this.hasdata=1
        this.city =[]
      BaseGetCitiesAndDistricts({ provinceId: id }).then(res => {
       if(res && res.length>0){
         this.hasdata=0
         this.city = res;
       }
        
      });
    },
    selectCity(item, id, type,index){
        this.areaCity[type].provinceCityCounty = item.name;
        this.areaCity[2].isShow = true;
        this.areaCity[2].provinceCityCounty = '请选择';
        this.districts = item.districts
        this.contentShowList = 2;
        this.currentIndex1=index
        this.currentIndex2=null;
        // console.log(this.areaValue, "区");
    },
    district(name,type,index){
        this.areaCity[type].provinceCityCounty = name;
        this.currentIndex2=index
    },
    areaCffirm(){
      this.areaValue = this.areaCity[0].provinceCityCounty + ' ' +  this.areaCity[1].provinceCityCounty + ' ' + this.areaCity[2].provinceCityCounty;
      if(this.areaCity[1].provinceCityCounty=='请选择'){
        this.toast('请选择区县')
        return
      }
      let [pa, isAddData] = [this.$route.params, false]
      if (pa.type == ENUM.editAddressType.add.val) {
        // 添加
        isAddData = true
      }
      this.$emit('hasselect',this.areaValue)
      this.$store.dispatch('selectCity', { type: 1,data: this.areaValue, open: false, 'isAddData': isAddData })
      //  console.log(this.addUserData,'addUserData')
    },
    cancel(){
     this.$store.dispatch('selectCity', { open: false })
      // console.log(this.areaValue,'value')
    }
  }
};
</script>
<style scoped>
.loading{
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  position: fixed;
  left: 50%;
  top: 70%;
  transform: translate(-50%,-50%);
  padding: 5px 10px;
  text-align: center;
  line-height: 25px;
  border-radius: 5px;
}
.title{
  font-size:14px;
  color:#111111;
  line-height: 20px;
  margin-top: 20px;
  /* letter-spacing:0; */
  text-align:center;
}
.fadeLoad-enter-active,
.fadeLoad-leave-active {
  transition: all 0.3s;
  opacity: 1;
}
.fadeLoad-enter,
.fadeLoad-leave {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}
.fade-enter,
.fade-leave {
  transform: translateX(300px);
  opacity: 0;
  /* display: none; */
}
.selectAddress{
  display: flex;
}
.selectAddress span{
  flex: 1;
  text-align: center;
  font-size: 14px;
  line-height: 30px;
  color: #26a2ff;
}
.selectAddress span.cancel{
  text-align: left;
  padding-left: 6.5%;
}
.selectAddress span.affirm{
  text-align: right;
   padding-right: 6.5%;
}
.tabCity{
    width: 100%;
    overflow: hidden;
}
.tabCity dl {
  /* display: flex; */
  width: 100%;
}
.tabCity dl dd {
  float: left;
  width: 33.3333%;
  line-height: 30px;
  /* flex: 1; */
  text-align: center;
}
contentShowList{
  margin-top: 10px;
}
.contentShowList ul {
  height: 245px;
  overflow-x: hidden;
  overflow-y: auto;
  line-height: 28px;
  padding-left: 8%;
}
.active{
  color:#ffc700;
}
.activeTab{
  color:#ffc700;
  border-bottom: 2px solid #ffc700;

}
</style>


