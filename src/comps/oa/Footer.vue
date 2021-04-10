<template>
  <footer>
    <router-link to="/oa/home">首页</router-link>
    <router-link to="/oa/team">团队</router-link>
    <router-link to="/oa/finance">财务</router-link>
  </footer>
</template>
<style lang="scss" scoped>
footer {
  position: fixed;
  z-index: 99;
  display: flex;
  right: 0;
  bottom: 0;
  left: 0;
  line-height: 50px;
  box-shadow: 0 3px 4px 1px rgba(0,0,0,.3); 
  background-color: #fff;

  a {
    display: block;
    flex: 1;
    text-align: center;
    color: #666;
    font-size: 14px;
  }
  .router-link-active{
    font-weight: bold;
    color: orange;
  }
}
</style>

