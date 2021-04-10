## 微信支付流程

#### [官方文档](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=7_4) 

#### 准备工作1 JSSDK 

1. 第一步 准备工作, 由于网页端需要使用微信的 JSSDK 调用 [wx.chooseWXPay](https://mp.weixin.qq.com/wiki?action=doc&id=mp1421141115&t=0.3243538363018639#59) 发起支付. wx.config 需要签名 

2. 第二步 [附录1-JS-SDK使用权限签名算法](https://mp.weixin.qq.com/wiki?action=doc&id=mp1421141115&t=0.3243538363018639#62)

```

wx.config({
    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: '', // 必填，公众号的唯一标识
    timestamp: , // 必填，生成签名的时间戳
    nonceStr: '', // 必填，生成签名的随机串
    signature: '',// 必填，签名
    jsApiList: [] // 必填，需要使用的JS接口列表
});


```

目前是 /api/Imp/WxShareHelp 接口  返回的 JSSDK 签名, 获取签名之前需要后端获取开发者的 [access_token] (https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140183 ), 通过access_token 获取 jsapi_ticket 才可以计算签名.





#### 准备工作2 获取用户微信联合登录openid 和 access_token 保存在用户信息里面

3. 第三步 [微信统一下单接口](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_1) 需要 用户 openid 参数. 所以需要事先获取用户openid

4. 第四步 [用户微信网页授权](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140842). 首先第一步用户同意授权，获取code. 在微信中跳转到 

```
https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect 
若提示“该链接无法访问”，请检查参数是否填写错误，是否拥有scope参数对应的授权作用域权限。

```


5. 第五步：通过code换取网页授权access_token. 获取code后，请求以下链接获取access_token：
  
```
https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code
微信返回结果

{ "access_token":"ACCESS_TOKEN",
"expires_in":7200,
"refresh_token":"REFRESH_TOKEN",
"openid":"OPENID",
"scope":"SCOPE" }

```
尤其注意：由于公众号的secret和获取到的access_token安全级别都非常高，必须只保存在服务器，不允许传给客户端。后续刷新access_token、通过access_token获取用户信息等步骤，也必须从服务器发起。



6.  第六步 刷新 access_token（如果需要）由于access_token拥有较短的有效期，当access_token超时后，可以使用refresh_token进行刷新，refresh_token有效期为30天，当refresh_token失效之后，需要用户重新授权。

获取第二步的refresh_token后，请求以下链接获取access_token：

```
https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=APPID&grant_type=refresh_token&refresh_token=REFRESH_TOKEN
```


#### 发起微信支付

7. 第七步 网页中发起微信支付有两种:  通过JSSDK 中的wx.chooseWXPay 发起 或 通过WeixinJSBridge的getBrandWCPayRequest方法发起. 注意：WeixinJSBridge内置对象在其他浏览器中无效。

发起之前需要[参数和签名字段如下](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=7_7&index=6)


```

function onBridgeReady(){
   WeixinJSBridge.invoke(
       'getBrandWCPayRequest', {
           "appId":"wx2421b1c4370ec43b",     //公众号名称，由商户传入     
           "timeStamp":"1395712654",         //时间戳，自1970年以来的秒数     
           "nonceStr":"e61463f8efa94090b1f366cccfbbb444", //随机串     
           "package":"prepay_id=u802345jgfjsdfgsdg888",     
           "signType":"MD5",         //微信签名方式：     
           "paySign":"70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名 
       },
       function(res){     
           if(res.err_msg == "get_brand_wcpay_request:ok" ) {}     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
       }
   ); 
}
if (typeof WeixinJSBridge == "undefined"){
   if( document.addEventListener ){
       document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
   }else if (document.attachEvent){
       document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
   }
}else{
   onBridgeReady();
}


```


8. 第八步 目前是后端接口 /api/Mall/H5PrePay  返回需要发起支付的参数和签名.     
   该接口 [首先需要通过调用微信的统一接口生成预支付订单ID prepay_id](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_1)  

9  第九步 前端得到参数后 通过步骤7发起支付. 支付成功或失败跳转相应页面.



#### 注意 

1. h5使用微信支付，细心的人会发现，微信是有两个方案的，一个是js-sdk中开放的能力 wx.chooseWXPay ，一个是微信支付开放平台提供的接口getBrandWCPayRequest. 生成的签名,字段名可能不同.要仔细检查.

2. 微信公众号后台和微信支付后台有很多地方(4个地方好像, H5支付域名, 网页授权安全域名, JS接口安全域名, 扫码支付回调域名?)要设置域名. 必须https [设置支付目录](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=7_3)

3. 由于域名限制,导致只能在生产环境调试. 或使用ngrok这种软件把外网合法域名转发到内网开发机上.

4. 很多页面跳转目前是由前端做的,由于在微信内,无法看到url上的参数, 浏览器兼容性也可能会遇到一些问题, 建议改成后端跳转, 这样后端能把url参数纪录下来,方便调试. 

5. 把每一个步骤分开. 例如现在这个 /api/Mall/H5PrePay, 前端通过第四步,得到code作为参数后发给后端,后端其实整合做了很多步骤, 返回给前端. 如果某个步骤出错就很难调试. 应该把每个步骤拆开独立,方便调试. 例如把获取openid和用户access_token 前置.在登录的时候处理.这样在结算页面就不需要了.

6. 签名算法h5和app端可能参数和计算方法不同. 要注意区分.

7. 测试环境 https://qzone.eyee.com 已经设置了添加到后台的域名, 但提示redirectUrl不正确. 最好能申请另外一个独立的微信账号进行测试.

8. 这次支付成功无法跳转是因为调用了wx.config两次, 从而触发了wx.ready两次,导致吊起两次支付界面.

