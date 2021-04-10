<template>
    <div class="main" @click.stop="cancel"  @touchmove.prevent>
        <div class="model" @click.stop="stop">
            <h3 class="flex-center" v-if="title">{{title}}</h3>
            <slot></slot>
            <div class="button" >
                <span v-if="cancelText" class="cancel flex-center" @click="cancel">{{cancelText}}</span>
                <span v-if="confirmText" class="confirm flex-center" @click="confirm">{{confirmText}}</span>
            </div>
        </div>
    </div>   
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    confirmText: {
      type: String,
      default: ""
    },
    cancelText: {
      type: String,
      default: ""
    }
  },

  methods: {
    cancel() {
      this.$emit("cancel");
    },

    confirm() {
      this.$emit("confirm");
    },

    stop() {
      return false;
    }
  }
};
</script>

<style scoped>
.main {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 100;
  top: 0;
  left: 0;
}

.model {
  width: 74.6667vw;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 2.6667vw 4vw;
  color: #333;
  border-radius: 1.6vw;
}
h3 {
  font-size: 16px;
  margin-top: 4vw;
}

.button {
  display: flex;
  justify-content: space-between;
  height: 10.1333vw;
}

.button span {
  flex: 1;
  height: 100%;
  border-radius: 1.0667vw;
}

.cancel {
  margin-right: 2.6667vw;
  border: 1px solid rgb(204, 204, 204);
  color: rgb(153, 153, 153);
}

.confirm {
  background-color: rgb(255, 199, 0);
}
</style>

