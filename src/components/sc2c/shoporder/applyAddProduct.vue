<template>
    <div>
         <v-header v-if="!insq">
            <div class="nav-tab2">
                <h3>添加商品</h3>
            </div>
            <!-- <v-cart :isshow="true" :isdark="true"></v-cart> -->
        </v-header>
        <div class="form">
          <div class="productinfoform">
              <div class="flex-between formlist" @click.stop="selectallbrand">
                   <!-- v-model="productinfo.brandname"  -->
                    <span class="ftitle">商品品牌</span><span class="fbrand ellipsis">{{productinfo.brandname}}</span><span class="selectbrand"><em>></em></span>
              </div>
              <div class="flex-between formlist">
                    <span class="ftitle">*商品货号</span>
                    <input class="finput ellipsis" placeholder="请输入商品货号" maxlength="20" size="20" v-model="productinfo.sku" @change="storevalue()"/>
              </div>
              <div class="flex-between formlist">
                    <span class="ftitle">商品名称</span>
                    <input class="finput ellipsis" placeholder="请输入商品名称" maxlength="72" size="72" v-model="productinfo.productname" @change="storevalue()" />
              </div>
               <!-- <div class="flex-between formlist">
                    <span class="ftitle">发售日期</span>
                    <input class="finput" placeholder="请输入发售日期,格式为yyyy.MM.dd" v-model="productinfo.saledate"/>
              </div> -->
              <!-- <div class="flex-between formlist">
                    <span class="ftitle">发售价格</span>
                    <input class="finput ellipsis" placeholder="请输入发售价格" v-model="productinfo.saleprice" />
              </div> -->
          </div>
          <div class="submitBtn" :class="{clicksubmit: changesubmitstatus ==1}" @click="submitproductinfo()">提交申请</div>
        </div>
    </div>
</template>
<script>
import { ApplyAddProduct } from "../../../common/api/sneaker.js";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      productinfo: {
        brandname: null,
        sku: null,
        productname: null
        // saledate: null,
        // saleprice: null
      },
      submitstatus: 0,
      destorystatus: true
    };
  },
  computed: {
    ...mapGetters({
      insq: "insq",
      userInfo: "userInfo",
      applyaddproduct: "applyaddproduct"
    }),

    changesubmitstatus() {
      if ( this.productinfo.brandname && this.productinfo.sku) {
        this.submitstatus = 1
        return this.submitstatus
      } else {
        this.submitstatus = 0
        return this.submitstatus
      }
    }
  },
  mounted() {
    this.emptyform()
    this.submitstatus = 0
    this.productinfo.brandname = this.applyaddproduct.name

    this.productinfo.sku = this.applyaddproduct.sku
    this.productinfo.productname = this.applyaddproduct.productname
    // if(this.$route.query.branditem  ) {
    //     this.productinfo.brandname = this.$route.query.branditem.name
    // }
  },
  beforeDestroy() {
    if (this.destorystatus) {
      let _ = this;
      let info = _.applyaddproduct;
      info.name = '';
      info.sku = ''
      info.productname = ''
      
      _.$store.dispatch("Applyaddproduct", info);
    }
  },
  methods: {
    storevalue() {
      let _ = this;
      let info = _.applyaddproduct;
      info.name = _.productinfo.brandname;
      info.sku = _.productinfo.sku
      info.productname = _.productinfo.productname
      
      _.$store.dispatch("Applyaddproduct", info);
      // console.log(' _.productinfo', _.productinfo)
      // console.log(' info', info)

    },
    emptyform() {
      this.productinfo.brandname = null
      this.productinfo.sku = null
      this.productinfo.productname = null
      // this.productinfo.saledate = null
      // this.productinfo.saleprice = null
    },
    selectallbrand() {
      this.$router.push("/allproductbrand");
    },
    // isValidDate(date) {
    //   let reg = /^(\d{4}).(\d{2}).(\d{2})$/;
    //   if (!reg.test(date)) {
    //     return false
    //   } else {
    //     return true
    //   }
    // },
    submitproductinfo() {
      
      if (this.submitstatus && this.productinfo.brandname && this.productinfo.sku) {
        // this.submitstatus = 0
        // console.log("this.productinfo.date",this.productinfo.saledate)
        // if (this.productinfo.saledate) {
        //   if (!this.isValidDate(this.productinfo.saledate)) {
        //     return this.toast('请输入正确格式的发售日期时间！如：2018.11.05');
        //   }
        // } else {
        //   this.productinfo.saledate = null
        // }
        let params = this.productinfo
        console.log('params', params)
        ApplyAddProduct(params)
          .then(res => {
            this.toast('感谢您对我们商品的完整 我们会尽快审核并通知您的')

            this.submitstatus = 0
            setTimeout(() => {
              this.$router.back()
            }, 1000)

            let _ = this;
            let info = _.applyaddproduct;
            info.name = '';
            info.sku = ''
            info.productname = ''
            
            _.$store.dispatch("Applyaddproduct", info);

          })
          .catch(e => {
            // this.toast('申请添加商品失败', e)
            // this.toast(e.msg, e)
            if(e.code == 1511401) {
              this.toast('该商品已存在系统中 无需申请哦~', e)
            }else if(e.code == 10711){
              this.toast('服务器错误', e)
            }else {
              this.toast('申请添加商品失败', e)
            }
            console.error('申请添加商品失败', e)
          })
      } else {
        if ( !this.productinfo.brandname) {
          this.toast('商品品牌为必选选项')
        }
        if ( !this.productinfo.sku) {
          this.toast('商品货号为必填选项')
        }
       
      }
    }
  }
};
</script>
<style scoped>
.form {
  border-top: 15px solid #f7f7f7;
  overflow: hidden;
  width:100%;
  /* background-color: #f7f7f7; */
  position: relative;
}
.form .productinfoform .formlist{
    padding: 14px 15px 16px 16px;
    width:100%;
    float:none;
    color:#333333;
    font-size: 14px;
    font-family: 'PingFangSC';
    font-weight: 600;
    line-height: 20px;
    letter-spacing: 1px;
    background-color: #fff;
    border-bottom: 2px #f7f7f7 solid;
}
.form .productinfoform .formlist span.selectbrand em {
    color:#999999;
    font-size: 15px;
}
.form .productinfoform .formlist .fbrand {
    color:#333;
    font-size: 14px;
    line-height: 20px;
    font-weight: normal;
    display:block;
    padding-right:28%;
}
.form .productinfoform .formlist input.finput{
    /* border:1px #000 solid; */
    width:75%;
    padding: 5px 10px;
    color:#333;
    font-size: 14px;
    line-height: 20px;
    font-family: 'PingFangSC';
}
.form .productinfoform .formlist input{
    /* border:1px #000 solid; */
    width:75%;
    padding: 5px 10px;
    color:#333;
    font-size: 14px;
    line-height: 20px;
    font-family: 'PingFangSC';
}
.form .productinfoform .formlist input{
    color:#333333;
}

.form .submitBtn{
    width:94.6667vw;
    background:rgba(204,204,204,1);
    border-radius:2px;  
    padding: 10px 0;
    margin: 10px 10px 10px 10px; 
    text-align: center;
    color:#666666;
    font-size:16px;
    line-height: 16px;
    position:fixed;
    bottom: 0;
    left:0;
    font-family: 'PingFangSC';
}
.form  div.clicksubmit {
    background-color: #333333;
    color:#fff;
}

</style>
