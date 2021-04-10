<template>
  <div class="titleContainer">
    <span class="two"></span>
    <span class="one"></span>
    <div class="title">
      <slot></slot>
    </div>
    <span class="one"></span>
    <span class="two"></span>
  </div>
</template>

<style lang="scss" scoped>
.titleContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5.3333vw;
  margin-bottom: 4vw;

  .title {
    color: #232323;
    font-weight: 600;
    font-size: 5.3333vw;
    margin: 0 4vw;
  }

  span {
    display: inline-block;
    width: 1.6vw;
    height: 1.6vw;
    border-radius: 0.8vw;
    overflow: hidden;
    margin:0 0.8vw;
  }

  .one{
      background: #c5c5c5;
  }
  
  .two{
      background: #E0E0E0;
  }
}
</style>