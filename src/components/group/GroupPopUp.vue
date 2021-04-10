<template>
  <div>
    <div class="group_list_popup-title">
      正在开团 <span class="group_list_popup-close" @click="close()">X</span>
    </div>

    <div class="group_list group_list_popup">

      <div class="group_item" v-for="groupItem in groupItemList" :key="groupItem.teamid" v-if="groupItem.isOpen">
        <div class="item_avatar"><img :src="groupItem.headimgurl|https" alt=""></div>
        <div class="item_username ellipsis">{{groupItem.nickname}}</div>
        <div class="middle">
          <div class="item_left">还剩{{groupItem.remainingcount}}人成团</div>
          <div class="item_time">剩余: <span class="item_time_left">{{groupItem.displayTime}}</span></div>
        </div>
        <div><button class="join-button" @click="joinGroup(groupItem)">去参团</button></div>
      </div>
    </div>

  </div>
</template>

<script>
import { DateDiff } from '../../common/util' // DateFormat, ENUM,

export default {
  name: 'group-pop-up',
  props: {
    productList: {
      type: Array,
      required: true,
      default: []
    }
  },
  data: function () {
    return {
      groupItemList: []
    }
  },

  computed: {},

  watch: {
    // whenever question changes, this function will run
    productList: function (newProductList, oldProductList) {
      if (Array.isArray(this.productList) && this.productList.length > 0) {
        this.groupItemList = this.productList.slice(0, 10)
        this.groupItemList.forEach(group => {
          group.displayTime = this.formatTime(group.endtime.replace(/-/g, '/'))
        })

        return this.groupItemList
      }
    }
  },

  mounted: function () {
    this.groupItemList = this.productList.slice(0, 10)

    window.setInterval(() => {
      for (let i = 0; i < this.groupItemList.length; i++) {
        this.groupItemList[i].displayTime = this.formatTime(this.groupItemList[i].endtime.replace(/-/g, '/'))
        let time = this.groupItemList[i].displayTime.split(':')
        if (time[0] <= 0 && time[1] <= 0 && time[2] <= 0) {
          this.groupItemList[i].isOpen = false
        } else {
          this.groupItemList[i].isOpen = true
        }
        this.$set(this.groupItemList, i, this.groupItemList[i])
      }
    }, 1000)
  },
  methods: {
    formatTime(time) {
      let tempCountdownTimeObject = DateDiff({
        destination: new Date(time),
        type: 'H'
      })

      if (tempCountdownTimeObject.m < 0) {
        tempCountdownTimeObject.m = '00'
      } else if (tempCountdownTimeObject.m < 10) {
        tempCountdownTimeObject.m = '0' + tempCountdownTimeObject.m
      }

      if (tempCountdownTimeObject.s < 0) {
        tempCountdownTimeObject.s = '00'
      } else if (tempCountdownTimeObject.s < 10) {
        tempCountdownTimeObject.s = '0' + tempCountdownTimeObject.s
      }

      return (
        tempCountdownTimeObject.H +
        ':' +
        tempCountdownTimeObject.m +
        ':' +
        tempCountdownTimeObject.s
      )
    },

    close() {
      this.$emit('close')
    },

    joinGroup(groupItem) {
      this.$emit('join', groupItem)
    }
  }
}
</script>

