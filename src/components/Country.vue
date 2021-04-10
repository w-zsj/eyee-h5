<template>
    <div class="countrys" :class="{isHeadHide:$root.ISAPP}">
        <v-header v-if="!$root.ISAPP">
            <div class="nav-tab2">
                <h3 style="color:#000;">国家地区列表</h3>
            </div>
        </v-header>
        <div class="list_country">
            <label :class="{'act':index%2==1}" v-for="(item,index) in baseCountrys" :key="index" @click="selectCode(item)">
                <!-- <img :src="item.flag|https"> -->
                <span>{{item.name}}</span>
                <span class="code_country">{{item.areacode}}</span>
            </label>
        </div>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex'
    export default {
      computed: {
        ...mapGetters({ baseCountrys: 'baseCountrys', selectCountryCode: 'selectCountryCode' })
      },
      beforeMount() {
        if (!(this.baseCountrys && this.baseCountrys.length > 0)) this.$store.dispatch('setBaseCountrys')
      },
      mounted() {
        if (window.history.length < 2) {
          this.$router.push('/')// 单独进入时后退到首页
        }
      },
      methods: {
        selectCode(item) {
          console.log(item.areacode)
          this.$store.dispatch('setCountryCode', item.areacode)
          // 国外手机号区域处理
          if(this.$route.query.pathFromLogin)sessionStorage.setItem("pathFromLogin", "1");
          this.$router.go(-1)
        }
      },
      watch: {
        'selectCountryCode': function (val, oldVal) {
          // console.log(val,oldVal);
        }
      }
    }

</script>
<style scoped>
    .list_country label{
        display: block;
        height: 50px;
        line-height: 50px;
        /* border-bottom: 1px solid #f2f2f2; */
        padding: 0 15px;
    }
    .list_country label.act{
      background:#FAFAFA;
    }
    .list_country label>img{
        display: inline-block;
        width: 30px;
        vertical-align: middle;
        margin-right: 5px;
    }
    span.code_country{
        float: right;
        font-size: 12px;
        color: #444;
    }
</style>
