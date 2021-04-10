<template>
    <div>
        <v-header v-if="!insq">
            <div class="nav-tab2">
                <h3>保证金记录</h3>
            </div>
        </v-header>
        <v-cutlist  :more-handle='loadmore' :more-handling='css.isLoading' :isend='css.isEnd'  v-if="css.hasData" >
          <div class="deductList">
            <ul>
                <li class="flex-between index-one" v-for="(item,index) in deductList" :key="index">
                    <div class="deduct">
                        <p class="name ">{{item.productname}}</p>
                        <p class="time ellipsis">{{item.deducttime}}</p>
                    </div>
                    <div class="flex-ctr-end flex-col">
                        <p class="name">{{item.price}}</p>
                        <p class="time">{{item.deductmessage}}</p>
                    </div>
                </li>
            </ul>
        </div>
      </v-cutlist>
      <div v-else class="nodata">
        暂无记录~
      </div>
    </div>
</template>
<script>
import { deductDetail } from "../../../common/api/snekc2c.js";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      deductList: [],
      css: {
        isLoading: false,
        isEnd: false,
        hasData: true
      },
      pagination: {
        sumcount: 0,
        pagesize: 10,
        pageindex:1,
        hasLoad: true
      }
    };
  },
  computed: {
    ...mapGetters({
      insq: "insq",
      userInfo: "userInfo"
    })
  },
  mounted() {
    this.ded();
  },
  methods: {
    loadmore() {
      if (this.css.isEnd === true) {
        this.toast("已无更多");
      } else {
        this.pagination.pageindex += 1;
        this.ded();
      }
    },
    ded() {
      let postParams = {
        page: this.pagination.pageindex,
        size: this.pagination.pagesize
      };
      if (postParams.page === 1) {
        this.css.isEnd = false;

        window.scrollTo(0, 0);
      }
      deductDetail(postParams)
        .then(res => {
          if (res && res.list.length > 0) {
            this.css.isLoading = false;
            this.deductList.push(...res.list);
            let t = this.deductList;
            t = t.map(i => {
              i.price = `${i.deductmoney < 0 ? '-' : '+'}¥${Math.abs(i.deductmoney).toFixed(2)}`
              // i.deductmoney =
              //   (i.deductmoney >= 0 ? "+" : "-") +
              //   "¥" +
              //   Math.abs(Number(i.deductmoney)).toFixed(2);
              return i;
            });
            this.css.hasData = true;
            if (
              res.page * res.size >= res.total &&
              this.deductList.length !== 1
            ) {
              this.css.isEnd = true;
            }
          } else {
            this.css.isEnd = true;
            if (this.deductList.length === 0) {
              this.css.hasData = false;
            }
          }
        })
        .catch(e => {
          console.error(e);
          this.css.isLoading = false;
          this.css.hasData = false;
        });
    }
  }
};
</script>
<style scoped>
.deductList li {
  border-bottom: 1px solid #f2f2f2;
  padding: 15px;
}
.deductList li.index-one {
  border-top: 1px solid #f2f2f2;
}
.deductList li .deduct {
  max-width: 65%;
}
.name {
  font-size: 14px;
  color: #333;
  font-weight: bold;
}
.time {
  color: #666;
  font-size: 12px;
  line-height: 24px;
}
.nodata {
  text-align: center;
  margin: 150px 0;
  font-size: 14px;
}
</style>


