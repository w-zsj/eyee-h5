/* eslint-disable camelcase */
/*
 * util.js
 * 工具类
 */
import axios from "axios";
import APP from "./appConfig";
import * as ENUM from "./enum";
import { hexMD5 as MD5, de } from "./md5";
import { Indicator } from "mint-ui";
import store from "../store";

const SK = JSON.parse(de(ENUM.SecretKeys)); // JSON.parse(decodeURIComponent(window.atob(ENUM.SecretKeys.replace(/[\+\/-]/g, ''))))

const ls = window.localStorage;

const DEV_DOMAIN = '//202.101.32.162:8010' // '//118.31.250.187:8888'
const DOMAIN = "https://mapi.eyee.com";
const MOCK_DOMAIN = "http://mock.api.eyee.com";

const isDev = process.env.NODE_ENV !== "production"; // || process.env.QQZONE_TEST === 'yes'
const baseUrlDomain = isDev ? DEV_DOMAIN : DOMAIN;
const NETDOMAIN = isDev ? DEV_DOMAIN : DOMAIN;
// const baseUrlDomain = isDev ? 'http://140.207.155.74:1234' : 'https://mapi.eyee.com' http://stest.eyee.com stestadmin.eyee.com:8686
// const baseUrlDomainGroup = isDev ? DEV_DOMAIN : DOMAIN
const WN = window.navigator;
const IN_APP = () => WN.userAgent.indexOf("platform/app") !== -1;

// 上报级别接口地址配置以全小写匹配, 已做转小写处理
const ReportLevelConfig = {
  // 紧急
  urgent: [
    // b2c
    "/api/Mall/AddOrderV243",
    "/api/Mall/AddOrderZone",
    "/api/Mall/PayTypeList",
    "/api/Mall/H5PrePay",
    // c2c
    "/capi/channel/qiuxie/submitsell",
    "/capi/order/front/channel/addOrder",
    "/capi/pay/public/pay/payTypeList",
    "/capi/pay/public/pay/h5Prepay",
    "/capi/pay/public/pay/appPrepay"
  ].map((i) => i.toLocaleLowerCase()),
  // 高级别
  high: [
    "/api/User/RegisterV235",
    "/api/User/RegisterOpen",
    "/api/User/Login",
    "/api/User/LoginByCode",
    "/api/User/LoginAuto",
    "/api/User/LoginOpen",
    "/api/User/WXRegisterAuth",
    "/api/User/QQZoneLogin",
    "/api/Mall/AddShoppingCartV243",
    "/api/Product/GetItems",
    "/capi/channel/qiuxie/getNewItems"
  ].map((i) => i.toLocaleLowerCase())
};
/**
 * 上报
 * @param {Object} options
 * @param {Number?} options.l 级别 1：低级别 2：中级别 3：高级别 4：紧急
 * @param {String?} options.p 上报页面
 * @param {String?} options.ac 上报操作描述
 * @param {String?} options.ap 接口路径
 * @param {String?} options.ai 接口信息
 */
const Reporter = ({ l = 1, p = "", ac = "", ap = "", ai = "" } = {}) => {
  if (!WN.onLine) {
    console.error("无网络~");
    return;
  }
  let bp = baseParam();
  // 1:ios 2:andriod 3:h5 4:b2cxcx 5:c2cxcx 6:qqzone
  let o = bp.os === "qqzone" ? 6 : 3;
  let v = bp.version;
  let rs = (store.getters.userInfo || {}).uid || "";
  axios
    .post("https://actionlog.eyee.com/open/log/alarm", {
      l,
      o,
      v,
      p,
      ac,
      ap,
      ai,
      rs
    })
    .then((res) => {
      console.log("reporter result", res);
    })
    .catch((e) => {
      console.error("report error", e);
    });
};

const getQueryString = (name) => {
  let obj = JSON.parse(ls.getItem("currentUser"));
  if (obj && obj.os) {
    delete obj.token;
    delete obj.mobile;
    delete obj.distributionId;
    return obj;
  } else return null;
};
let pa = getQueryString("param");
let UrlParams = null;
if (pa) {
  UrlParams = {
    os: pa.os,
    deviceid: pa.deviceid,
    version: pa.version,
    token: pa.token
  };
}
var _queryParam = null;
const baseParam = () => {
  if (!_queryParam) {
    try {
      let query = getUrlParam("param");
      if (query) {
        let param = JSON.parse(decodeURIComponent(query));
        _queryParam = {
          version: param.version || ENV.version,
          lang: param.lang || "zh",
          os: param.os,
          deviceid: param.deviceid || "",
          sign: "",
          param: ""
        };
      }
    } catch (e) {
      console.error("get query param error: ", e);
    }
  } else {
    _queryParam = {
      ..._queryParam,
      sign: "",
      param: ""
    };
  }
  return (
    _queryParam ||
    UrlParams || {
      version: ENV.version, // '3.1.0',
      lang: "zh",
      os: "h5",
      deviceid: "h5",
      sign: "",
      param: ""
    }
  );
};

const dealMockUrl = (url) => {
  const mockPre = "/mock";
  // 使用mock数据时，需在请求地址前增加前缀 '/mock' 由基础请求处理掉
  if (!/https?/i.test(url) && url.indexOf(mockPre) === 0) {
    url = url.replace(mockPre, "");
    axios.defaults.baseURL = MOCK_DOMAIN;
  }
  return url;
};

var eyeeToken = "";
const Timeout = 6000;
/* 一些请求的全局配置 */
axios.defaults.baseURL = baseUrlDomain;
// axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.timeout = Timeout;
/* GET请求 */
function GET(url, params) {
  axios.defaults.timeout = Timeout;

  axios.defaults.baseURL = IN_APP() ? baseUrlDomain : NETDOMAIN;
  if (typeof params === "string") url = "/" + params;

  return axios
    .get(dealMockUrl(url), { params: params })
    .then(reqResult)
    .catch(reqErr);
}
function GETGROUP(url, params) {
  axios.defaults.timeout = Timeout;

  axios.defaults.baseURL = baseUrlDomain;
  let t = JSON.parse(ls.getItem("currentUser") || "{}");
  let bp = baseParam(),
    os = bp.os || "h5",
    version = bp.version || "9.9.9";
  eyeeToken = t.token || (params || {}).token || "";
  return axios
    .get(dealMockUrl(url), {
      params: params,
      headers: {
        "Content-Type": "application/json",
        Authorization: eyeeToken,
        os,
        version
      }
    })
    .then(reqResult)
    .catch(reqErr);
}

/* POST请求 */
function POST(
  url,
  params,
  hasLoad = true,
  cacheKey = "",
  contentType = "application/json"
) {
  let cache = getCache(url + cacheKey);
  if (cache) return Promise.resolve(cache);
  axios.defaults.cacheKey = cacheKey;
  if (/https?/.test(url)) axios.defaults.baseURL = "";
  else if (url === "/api/Mall/addOrderV242") {
    axios.defaults.baseURL = baseUrlDomain;
  } else {
    axios.defaults.baseURL = IN_APP() ? baseUrlDomain : NETDOMAIN;
  }

  let isUpload = url.toLowerCase() == "/api/user/upload";

  if (isUpload) {
    axios.defaults.timeout = 150000;
  } else axios.defaults.timeout = Timeout;

  if (hasLoad) {
    Indicator.open({
      text: isUpload ? "上传中..." : "加载中...",
      spinnerType: "triple-bounce" // 'snake''fading-circle''double-bounce''triple-bounce'
    });
  }
  // param 业务参数json字符串 urlencode编码一次后替换加号(+)为%20
  // sign=md5(secretkey+token+md5(urlencode(param))) 签名 必需
  // console.log(JSON.stringify(params))
  var tempParam = MD5("");
  let bp = baseParam();
  if (params && typeof params !== "undefined") {
    // console.log(params)
    bp.param = encodeURIComponent(JSON.stringify(params));
    tempParam = MD5(encodeURIComponent(JSON.stringify(params)));
  }
  let t = JSON.parse(ls.getItem("currentUser") || "{}");
  eyeeToken = t.token || (params || {}).token || "";
  bp.sign = MD5(de(SK[bp.os]) + eyeeToken + tempParam);
  if (bp.os === "android" || bp.os === "ios") {
  } else {
    bp.extend = url;
  }
  return axios
    .post(dealMockUrl(url), bp, {
      headers: { "Content-Type": contentType, Authorization: eyeeToken }
    })
    .then(reqResult)
    .catch(reqErr);
}
function POSTGROUP(
  url,
  params,
  hasLoad = true,
  token,
  cacheKey = "",
  contentType = "application/json"
) {
  axios.defaults.timeout = Timeout;

  axios.defaults.baseURL = baseUrlDomain;
  let t = JSON.parse(ls.getItem("currentUser") || "{}");
  let bp = baseParam(),
    os = bp.os || "h5",
    version = bp.version || "9.9.9",
    deviceid = bp.deviceid || "";
  eyeeToken = t.token || token || "";
  if (hasLoad) {
    Indicator.open({
      text: "加载中...",
      spinnerType: "triple-bounce" // 'snake''fading-circle''double-bounce''triple-bounce'
    });
  }

  return axios
    .post(dealMockUrl(url), params, {
      headers: {
        "Content-Type": contentType,
        Authorization: eyeeToken,
        os,
        version,
        deviceid
      }
    })
    .then(reqResult)
    .catch(reqErr);
}
function TESTPOST(url, params, contentType = "application/json") {
  axios.defaults.baseURL = "";
  eyeeToken =
    "LeDVvyKzUR6%2FLPd%2BRZYbfeVm2P%2FP8s8Xobg9qpo38hfJZcO7jY2he5GRmZ3eIy5JZMbGCBc4%2BasPspKCY1WZL1L3UihiA0GNcVLyf1NV5RfWtvvsdp29qA%3D%3D";
  return axios
    .post(dealMockUrl(url), params, {
      headers: { "Content-Type": contentType, Authorization: eyeeToken }
    })
    .then(reqResult)
    .catch(reqErr);
}
// http request 拦截器
// axios.interceptors.request.use(
//   config => {
//     // if ((ls.getItem('currentUser'))&&(JSON.parse(ls.getItem('currentUser')).token !='')) {  // 判断是否存在token，如果存在的话，则基础参数token赋值
//     //   eyeeToken = JSON.parse(ls.getItem('currentUser')).token;
//     //   // config.headers.Authorization = eyeeToken
//     // }else{
//     //   eyeeToken ='';
//     // }
//     // console.log('requs 发送请求',config)
//     return config
//   },
//   err => {
//     return Promise.reject(err)
//   }
// )

/**
 * 响应结果统一处理
 * @param {Object} res 响应的结果
 * @returns {Object} 响应结果的数据
 */
function reqResult(res) {
  let data = null;
  if (res.status === 200) {
    // && res.statusText.toLowerCase() == 'ok'
    // console.log('req res', res)
    // || res.data.code === ENUM.StatusCode.exsuccess
    if (res.data && res.data.code === ENUM.StatusCode.success) {
      data = res.data.data;

      if (data && parseInt(res.data.expiretime) > 0) {
        let key =
          res.config.url.replace(res.config.baseURL, "") +
          (res.config.cacheKey || "");
        if (key.indexOf("/") !== 0) key = "/" + key;
        setCache(key, res.data.expiretime, data);
      }
    } else {
      // throw { code: res.data.code, msg: res.data.msg + (res.data.data ? (',' + res.data.data) : '') } // eslint-disable-line
      throw res; // eslint-disable-line
    }
  } else {
    // throw 'Request failed, ' + JSON.stringify(res) // eslint-disable-line
    throw res; // eslint-disable-line
  }
  Indicator.close();
  return data;
}
/**
 * 响应异常统一处理
 * @param {Object} 响应的异常
 */
function reqErr(e) {
  // console.error('catch error:', { ...e });
  e = e.response || e;

  let { config, data, status, statusText, message } = e;
  let code = status === 200 ? (data && data.code) || -1 : status;
  try {
    let apiPath = config.url.replace(config.baseURL, "").toLowerCase();

    let l = 1;
    let send = 1;
    let subLen = 100;
    if (ReportLevelConfig.urgent.findIndex((i) => apiPath.indexOf(i) > -1) > -1) { l = 4; } else if (
      ReportLevelConfig.high.findIndex((i) => apiPath.indexOf(i) > -1) > -1
    ) { l = 3; }
    // 仅上报 紧急或高级别 的接口时，取消下面注释
    // else send = 0

    let paramStr = config.data || ""; // !!config.data ? JSON.stringify(config.data) : ''
    let responseText =
      status == 200
        ? `${data.code}，${data.msg}，${
          (data.data &&
              (typeof data.data === "string"
                ? data.data
                : JSON.stringify(data.data)
              ).substr(0, subLen)) ||
            "无响应数据"
        }`
        : (message || `${status},${statusText}`).substr(0, subLen);

    // 空间兼容的特殊处理放低级别
    // if (paramStr.indexOf('qqzone') > -1) {
    //   if (apiPath.indexOf('/api/mall/paytypelist') > -1 || apiPath.indexOf('/api/mall/addorderzone') > -1 || apiPath.indexOf('/api/mall/h5prepay') > -1) l = 2
    //   if (responseText.indexOf('已使用的优惠券') > -1) l = 2
    // }

    let ai = JSON.stringify({
      api: apiPath,
      request: paramStr,
      response: responseText
    });
    // console.log('catch error:', status, statusText, e.message);

    // !isDev && send && Reporter({ l, ap: apiPath, ai })
  } catch (err) {
    console.error("request error report error: ", err);
  }

  // 账号异常or无效的身份令牌,或空间潮物下的异常
  // C2C 接口 504 是未授权
  // 1511548: 用户名格式错误
  if (
    (code != 1511548 && String(code).indexOf("151154") > -1) ||
    code == 1511504
  ) {
    let notclear = sessionStorage.getItem("notClearserInfo"); // 登录注册 完善个人信息时 不清除 用户信息
    if (!notclear) store.dispatch("setUserInfo", {});
  }

  // if(e && e.code == 1511545){ //未登录
  //   ls.removeItem('currentUser');
  //   store.dispatch('setUserInfo', '');
  // }
  // if (e && e.message && e.message.toLowerCase().indexOf('timeout') > -1) {
  // e = { code: 1511545, msg: '未登录' }
  // e = { code: 0, msg: '请求超时,请稍候再试' }
  // }
  Indicator.close();
  throw {
    code,
    msg:
      code === -1
        ? data.msg + (data.data ? "," + data.data : "")
        : data.msg || data.message || statusText || "请求异常" + code,
    data: data.data ? data.data : {}
  }; // eslint-disable-line
}

/**
 * 获取本地缓存
 * @param {String} key 缓存键(请求地址的路径)
 */
function getCache(key) {
  let cache = Storage.get(window.btoa(key)) || {};
  let ret = null;
  // console.groupCollapsed('[*cache getter]', key)
  // console.info('get data', cache)
  if (cache && cache.expire) {
    let expire = parseInt(cache.expire) * 1000;
    let diff = expire - Date.now();
    // console.info('expired', diff, 'can use:', diff > 0 && diff < 3600000)
    // 3600000 = 1*60*60*1000 最大缓存间隔1小时
    if (diff > 0 && diff < 3600000) ret = cache.data;
  }
  // console.groupEnd()
  return ret;
}
/**
 * 设置本地缓存
 * @param {String} key 缓存键(请求地址的路径)
 * @param {String} expire 缓存过期的时间戳字符串
 * @param {*} data 缓存的数据体
 */
function setCache(key, expire, data) {
  // console.groupCollapsed('[*cache setter]', key, expire)
  // console.info('set data', data)
  let timespan = parseInt(expire) * 1000;
  if (timespan > Date.now()) { Storage.set(window.btoa(key), { expire: expire, data: data }); }
  // console.info('set?', timespan > Date.now())
  // console.groupEnd()
}

/*
 * 本地存储
 * set(key,val) 设置给定键名存储
 * get(key) 获取对应键名存储
 * del(key) 删除对应键名存储
 * clear() 清空本地存储
 */
const Storage = {
  set: (key, val) => {
    let b = false;
    let valstr = val;
    if (key) {
      if (typeof val !== "undefined" && val !== null) {
        if (typeof val !== "string") valstr = JSON.stringify(val);

        ls.setItem("FC_" + key, valstr);
        b = true;
      }
    }
    return b;
  },
  get: (key) => {
    let val = null;
    if (key) {
      // console.log('[*Storage]get', key)
      val = ls.getItem("FC_" + key);
      try {
        val = JSON.parse(val);
      } catch (e) {}
    }
    return val;
  },
  del: (key) => {
    let b = false;
    if (key) {
      ls.removeItem(key);
      b = true;
    }
    return b;
  },
  clear: () => {
    ls.clear();
  }
};

function _getDate(datetime) {
  if (typeof datetime === "string") {
    let arr = datetime.split(/[- : \/ T]/);
    // console.log("TCL: function_getDate -> arr", arr)
    if (arr[0].length === 4) arr[1] = arr[1] - 1;
    datetime = new Date(...arr);
  }
  // console.log("TCL: function_getDate -> datetime", datetime)

  return datetime;
}
/*
 * 时间格式化
 * datetime:String,必须,要格式化的时间字符串
 * format:String,可无,时间的格式(注意格式中对应的字母),默认为'yyyy-MM-dd HH:mm:ss' 全角ｍ表示英文月份
 */
function DateFormat(datetime, format = "yyyy-MM-dd HH:mm:ss") {
  let date = datetime;
  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  try {
    if (Object.prototype.toString.call(date) !== "[object Date]") { date = _getDate(date); }
    var o = {
      "ｍ+": month[date.getMonth()],
      "M+": date.getMonth() + 1, // 月份
      "d+": date.getDate(), // 日
      "H+": date.getHours(), // 小时
      "m+": date.getMinutes(), // 分
      "s+": date.getSeconds(), // 秒
      "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(format)) {
      format = format.replace(
        RegExp.$1,
        (date.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(
          RegExp.$1,
          RegExp.$1.length === 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length)
        );
      }
    }
    return format;
  } catch (e) {
    return datetime;
  }
}

/*
 * 时间差(用于倒计时)
 * type:String,可无,结果类型,默认为'H',可选值:'d'天,'H'时,'m'分,'s'秒
 * source:String|Object(Date),可无,源时间,默认为当前时间
 * destination:String|Object(Date),可无,目标时间,默认为当前时间
 * source与destination 必须同时有一个有值
 * 返回值null|{s:秒,m:分,H:时,d:天}(若为负值则表示时间指向反了)
 */
function DateDiff({
  type = "H",
  source = new Date(),
  destination = new Date()
} = {}) {
  let date = source;
  let ts = 0;
  try {
    date = _getDate(date);
    destination = _getDate(destination);
    ts = destination.getTime() - date.getTime(); // Math.abs(destination.getTime() - date.getTime());
    // console.log('sTs:%s,dTs:%s,ts:%s', date.getTime(), destination.getTime(), ts);
    let o = {
      s: Math.floor(ts / 1000),
      m: Math.floor(ts / 60000), // 1000*60
      H: Math.floor(ts / 3600000), // 1000*60*60
      d: Math.floor(ts / 86400000) // 1000*60*60*24
    };

    switch (type) {
      case "H":
      default:
        return { s: o.s % 60, m: o.m % 60, H: o.H, d: 0 };
      case "s":
        return { s: o.s, m: 0, H: 0, d: 0 };
      case "m":
        return { s: o.s % 60, m: o.m, H: 0, d: 0 };
      case "d":
        return { s: o.s % 60, m: o.m % 60, H: o.H % 24, d: o.d };
    }
  } catch (e) {
    return null;
  }
}

/*
 * 时间差值格式化
 * 大于24小时显示日期
 * 大于60分钟显示n小时前
 * 大于1分钟显示n分钟前
 * 否则显示刚刚
 */
function DateDiffFormat(datetime, format = "yyyy.MM.dd") {
  let diff = DateDiff({ source: datetime });
  let result = "";
  // console.log(datetime, diff);
  if (diff) {
    if (diff.H >= 24) {
      result = DateFormat(datetime, format);
    } else {
      if (diff.H > 0) {
        result = diff.H + "小时前";
      } else {
        if (diff.m > 1) result = diff.m + "分钟前";
        else result = "刚刚";
      }
    }
  }
  return result;
}

/*
 * 将秒转为时分秒格式 天 h:m:s
 */
function FormatSeconds(sends, type) {
  // type = 1 为 天 h:m:s
  // type = 2 为 h:m:s 不展示天
  // type = 3 为 天 h时m分s秒
  let h = parseInt(sends / 3600);

  if (h < 10) h = "0" + h;
  let m = parseInt((sends - h * 3600) / 60);
  if (m < 10) m = "0" + m;
  let s = parseInt((sends - h * 3600) % 60);
  if (s < 10) s = "0" + s;
  let time = "";
  let day = "";
  if (type === 2) {
    // type = 2 为 h:m:s 不展示天
    time = h + ":" + m + ":" + s;
  } else if (type === 1) {
    // type = 1 为 天 h:m:s
    if (h > 24) {
      let hh = parseInt(h % 24);
      day = parseInt(h / 24);
      time = day + "天" + hh + ":" + m + ":" + s;
    } else {
      time = h + ":" + m + ":" + s;
    }
  } else if (type === 3) {
    // type = 3 为 天 h时m分s秒
    if (h > 24) {
      let hh = parseInt(h % 24);
      day = parseInt(h / 24);
      time = day + "天" + hh + "小时" + m + "分钟" + s + "秒";
    } else {
      if (h > "00" && m > "00" && s > "00") {
        time = h + "小时" + m + "分钟" + s + "秒";
      } else if (h > "00" && m > "00") {
        time = h + "小时" + m + "分钟";
      } else if (m > "00" && s > "00") {
        time = m + "分钟" + s + "秒";
      } else if (h > "00" && s > "00") {
        time = h + "小时" + s + "秒";
      } else if (h > "00") {
        time = h + "小时";
      } else if (m > "00") {
        time = m + "分钟";
      } else if (s > "00") {
        time = s + "秒";
      }
    }
  }

  if (sends) {
    return time;
  } else {
    return "end";
  }
}

function DateBetween({ source = new Date(), begin, end } = {}) {
  let isBetween = false;
  try {
    begin = _getDate(begin);
    end = _getDate(end);
    return begin <= source && end >= source;
  } catch (e) {}
  console.log(isBetween);
  return isBetween;
}

function IsBegining({ source = new Date(), begin } = {}) {
  let isBegin = false;
  try {
    begin = _getDate(begin);
    return begin <= source;
  } catch (e) {}
  return isBegin;
}
/*
 * 判断图片是否为GIF格式
 */
function endWithGif(str) {
  if (str) {
    let pos = str.lastIndexOf(".gif");
    if (pos === -1) {
      return false;
    } else {
      return pos + 4 === str.length;
    }
  }
}

/*
 * 检查各个数据的格式
 */
function Checking(value, type) {
  switch (type) {
    case "phone":
      return /^(\+?0?\d{1,3})-?\d{9,11}$/.test(value);
    case "validcode":
      if (!value) {
        return "请输入验证码";
      } else {
        return false;
      }
    case "password":
    case "repassword":
      /**
       * 密码复杂度要求，以下要求的组合密码
       *  1.长度8到16位
       *  2.至少有一个数字
       *  3.至少有一个字母，区分大小写
       *  4.可以有特殊字符，非必选
       */
      if (!value) return type == "repassword" ? "请再次输入密码" : "请输入密码";
      else if (value.length < 8 || value.length > 16) return "密码长度8到16位";
      else if (!/\d+/g.test(value)) return "密码至少包含一位数字";
      else if (!/[a-zA-Z]+/g.test(value)) return "密码至少包含一位字母";
    case "isEmail":
      return /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(
        value
      ); // eslint-disable-line
    case "isChinese":
      return /^[\u4e00-\u9fa5]{2,5}$/.test(value);
  }
}
/*
 * 获取url参数
 */
function getUrlParam(paraName) {
  var url = window.document.location.toString();
  var arrObj = url.split("#")[0].split("?");
  if (arrObj.length > 1) {
    var arrPara = arrObj[1].split("&");
    var arr;
    for (var i = 0; i < arrPara.length; i++) {
      arr = arrPara[i].split("=");
      if (arr != null && arr[0] === paraName) {
        return arr[1];
      }
    }
    return "";
  } else {
    return "";
  }
}

const AntiBrush = (payload = {}, callback) => {
  // if (!window.TencentCaptcha) console.error('未加载到验证码组件！')
  // else {
  //   (new window.TencentCaptcha(
  //     "2033791445",
  //     function (res) {
  //       // console.log("-------->tcCaptcha", res);
  //       if (res && res.ret === 0) callback({ ...res.bizState, ticket: res.ticket, randstr: res.randstr })
  //       else callback(false)
  //     },
  //     { bizState: payload }
  //   )).show();
  // }
};
/*
 * 获取ios版本号第一个数字
 * 例10.2.3返回10
 */
function getIosVersion() {
  let str = navigator.userAgent.toLowerCase();
  let ver = str.match(/cpu iphone os (.*?) like mac os/);
  if (ver) {
    let ios_version_arr = ver[1].replace(/_/g, ".").split(".");
    return parseInt(ios_version_arr[0]);
  }
}
function addZero(n) {
  n = parseInt(n, 10);
  return n > 0 ? (n <= 9 ? "0" + n : n + "") : "00";
}
export {
  APP,
  ENUM,
  POSTGROUP,
  GET,
  GETGROUP,
  POST,
  TESTPOST,
  Reporter,
  MD5,
  Storage,
  DateFormat,
  DateDiffFormat,
  DateBetween,
  IsBegining,
  endWithGif,
  DateDiff,
  _getDate,
  Checking,
  getQueryString,
  getUrlParam,
  AntiBrush,
  FormatSeconds,
  getIosVersion,
  addZero
};
