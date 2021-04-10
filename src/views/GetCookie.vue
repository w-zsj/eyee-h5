<script>
export default {
  name: "GetCookie",
  beforeCreate() {
    let _ = this,
      ck = $ck.get("DNCNL") || "";
    alert("cks=" + document.cookie + "-------ck=" + ck);
    location.href = "cookiefromweb://sendcookie?ck=" + ck;

    // 非法进入此路由时重定向到首页
    // setTimeout(() => {
    //   _.$router.replace("/");
    // }, 1300);
  }
};
</script>