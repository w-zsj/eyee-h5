# 斗牛移动端H5项目

# 每次从release 分支 新建分支！！！！
# 不要从develop 分支 新建分支！！！！

>### 环境
>
>1. Installing ```npm i```
>2. 出现运行异常时： `npm rebuild node-sass` 结束后重新运行

---

>## 项目新结构说明
> - 文件结构
>    - `src/views` `src/components` 视图、页面 级组件，路由
>    - `src/comps` 模版组件
>    - `src/utils`  `src/common` 工具库，包括接口
>    - `src/globalPlugins` 挂载到全局的组件/过滤器/指令
>    - `src/store` vuex数据仓库
> - 命名约定
>    - **css类名** 使用 *kebab-case*;
>    - **.vue** 的文件名使用 *PascalCase*, 文件中 的 **name** 与文件名同名或按业务链路的名(如 `/views/mall/Home.vue`的 **name** 为 *MallHome*);
>    - **router** 中, **component** 定义变量名使用 *PascalCase*, 路由的 **name** 命名使用 *camelCase*;
>    - **utils** 中的工具名 使用 *PascalCase*;
>
>

---
---
---

>### 项目结构概述
>
>1. 项目开发基于 **src** 目录下
>2. 子目录包括 **assets**(资源),**common**(公共工具),**components**(组件),**store**(数据仓储)
>3. 子目录概述：
> * **assets**资源目录，存放项目引用的资源，如图片、图标等;
> * **common**公共工具目录，存放全局使用的配置、工具、路由、外部组件等;
> * **components**组件目录，包含页面组件与模版组件，全局性质和通用模版组件放在 **components/templates** 子目录中，其他按业务区分文件夹存放;

---

>### 代码规范
>
>1. 使用Eslint作为代码规范指导, vscode 需要配置才可以.vue文件也使用eslint [如何优雅地使用 VSCode 来编辑 vue 文件](https://www.clarencep.com/2017/03/18/edit-vue-file-via-vscode/)
>2. 命名规则： *文件夹名*、*.js文件名*、*.css文件名* 使用 *camelCase(驼峰命名)*，*组件名/Vue单文件组件* 使用 *PascalCase(帕斯卡命名，驼峰命名后首字母大写)*，*css类名* 全小写以连字符分隔
>3. 使用 '===' 代替 '==' 作比较
>4. 使用 单引号 '' 而不是双引号 "" 作为引号使用
>5. 尽量不要使用英文或拼音缩写, 一定要使用英文的完整单词来命名, 不要怕文件名太长. 并且使用驼峰命名变量名称.
>6. 无用的代码尽量删除,而不是注释掉.既然有了git版本控制,尽量保留无用代码.这是一个大原则.
>7. 注意大小写问题, windows下不区分大小写, 例如 .Vue 扩展名在windows下编译成功, 但在linux下编译报错, 文件名使用驼峰, 扩展名一律使用小写.
>8. 使用 git config core.ignorecase false [让git提交区分大小写](http://yijiebuyi.com/blog/e96eccc4e6f7168e0ce92fa9c79f0d23.html).  然后需要删除该文件, git rm readme.md. git提交. 然后在添加该文件,再提交才可以改变文件名大小写.


---


>### git 代码提交规范
>
>#### 参考 [GitHub Flow](http://scottchacon.com/2011/08/31/github-flow.html)
>#### 参考 [git-flow 的工作流程](https://www.git-tower.com/learn/git/ebook/cn/command-line/advanced-topics/git-flow)
>
>---
>
>1. 项目提交时添加说明约定：**A-** 添加/新增，**U-** 更新/修改/优化，**D-** 删除/移除，**F-** 修复bug/异常/问题，**M-merge [分支名]** 合并分支，如：优化路由延迟加载时，提交说明文言为 `U-延迟加载路由`
>2. 分支 master 为生产分支, 可以部署的正式无BUG的代码. 分支 develop 为开发分支.
>3. 分支 feature-开头的为新功能或项目的分支, 基于 develop 分支创建.
>4. 分支 hn/zsj 为个人分支, 建议个人远程分支使用user-前缀开头. 例如user-hn, user-zsj.   以后个人分支尽量不要上传到远程gitlab上, 除非需要把该分支分享给其他人,或需要发布merge request时.
>5. 每次开发,需要先在自己本地已 develop 或 feature 为基础新建开发本地分支. 然后新写的代码提交到该本地分支. 最后通过发起MR或直接合并到develop或feature分支上.

---

>### 项目开发约定
>
>1. 每个业务页添加路由时必须准确定义路由名，会用于网页标题
>2. 业务页路由扩展数据说明：
>```
>  meta:{
>        hideMenu: Boolean(是否隐藏底部菜单，可无，true时必须),
>        tab: String(路由所对应的底部菜单标识，必须),
>        b2cTab: String(路由所对应的b2c部分顶部菜单标识，b2c模块路由必须)
>  }
>```
>
>3. 每个 **v-for** 遍历时必须添加绑定属性 **key**，可用index做key的值
>4. div元素内不要直接有文本，文本样式重置不带div标签
>5. **common**下工具添加在 **util.js** 中并由其导出使用
>6. 业务接口的js文件中，应当在顶部声明一个键值对象以列举当前业务所有接口的请求地址
>7. *全局变量window及其属性字段*(如`document`、`loacalStorage`等)使用时，必须添加`window.`约束，若当前作用域有使用相同全局变量 *超过一次* 的，在当前作用域顶部使用 **常量定义** 后使用

---

>### Vue模板与CSS代码规范
>
>1. 模板中尽量不要使用太过复杂的v-if, v-else 逻辑,方便阅读.   复杂的逻辑判断可以放到js代码里面, 最后在模板中使用计算的结果变量判断.
>2. 文字 html 标签尽量放到 html模板中, 把文字都列出来, 而不要把文字作为变量放到js里面. 例如 <span v-if="type===1">状态1</span> <span v-if="type===2">状态2</span>  而不要写成  <span >{{typeText}}</span>
>3. 所有与控制样式有关的变量全部增加'css'前缀. 例如:在模板中使用 <span v-if="css.isShowGroupList">列表</span>
>
>```
>data()
>    {
>        return {
>          css : {
>            isShowGroupList
>          }
>        }
>    }
>```
>
>4. 每个业务页私有样式必须在 **style** 标签上添加 **scoped** 属性约束
>5. 书写css样式时，不需要添加浏览器前缀兼容，框架已通过 autoprefixer 自动补充
>6. 使用的mint-ui的样式重置时，必须统一添加在 *reset-ui.css* 中，除非单独的有特殊样式修改加在当前页面私有样式中
>7. 绝对定位的样式设置层级**z-index**时，①从当前页面最低级**0**开始计算，若无其他层级提升，**z-index**应设置为**9**以内，②若要设置层级高出*底部菜单或顶部导航*时，以*底部菜单或顶部导航*的**99**开始计算，递增1，否则不得超过**99**
>8. 使用vw/vh单位替代rem单位 [vw相比rem，在实际开发中究竟有多大区别？](https://www.zhihu.com/question/37179916)

---

>### 接口请求
>
>1. 通过路径`common/util`工具引入请求函数。
>2. 请求方式包括：
> * HttpGET：`GET(url: any, params: any)`;
> * HttpPOST：`POST(url: any, params: Object|Array|Undefined)`;
>3. **GET**请求参数传入时，若接口地址为`/api/a/b/[参数]`，则参数以 *单个字符串值* 传入；若接口地址参数为**query参数**形式(?param1=val1&param2=val2...)，则参数以 *键值对象* 传入。
>4. **POST**请求参数类型必须仅为`Object(null)|Array|Undefined`。

---

>### 一些全局的Vue组件介绍
>
>1. 后退：通用模版 **v-back**,使用方式 ``<v-back></v-back>``,提供后退操作
>2. 分享钩子：``this.initShare({type:Number,info:Object})``,**type**参数(Number,分享类型:0资讯、1商城、2其他，不传默认2),**info**参数(Object,分享数据,``info={title:分享标题,desc:分享描述,img:分享图标/图片}``)  ~~通用模版 **v-share**,使用方式 ``<v-share :url='/'></v-share>``, **url**属性(String,必须,分享的路径), **isdark**属性(Boolean,可无,默认false,图标颜色true时为黑色)~~
>3. 头部：通用模版 **v-header**,使用方式 ``<v-header :showback='true' :bg='dark'>自定义内容</v-header>``,**showback**属性(Boolean,可无,默认为true,是否显示后退按钮),**bg**属性(String,可无,默认为'dark',可供选择的值有 *['dark 深色','light 浅色','tran 透明']* ),通过 **自定义内容** 定制不同头部
>4. 提示：``this.toast(msg,icon)``,**msg**参数(String,必须,提示内容),**icon**参数(String,可无,自定义icon图标类名,若传值则提示位于屏幕中心)
>5. 警示框：``this.alert(msg,callback)``,**msg**参数(String,必须,内容),**callback**参数(Function,可无,关闭的回调函数)
>6. 确认框：``this.confirm(options)``,以对象形式传参,**msg**参数(String,必须,确认提示信息),**okText**参数(String,可无,确认按钮文本,默认为'确定'),**cancelText**参数(String,可无取消按钮文本,默认为'取消'),**ok**参数(Function,可无,确认操作后的回调函数),**cancel**参数(Function,可无,取消操作后的回调函数)
>7. 列表：通用模版 **v-list**,使用方式 ``<v-list :load-handle='' :more-handle='' :more-handling='false' :isend='false'>列表项</v-list>``,**load-handle**属性(Function,必须,下拉刷新的函数,回调参数传入当前模块DOM),**more-handle**属性(Function,必须,加载更多的函数,回调参数传入当前模块DOM),**more-handling**属性(Boolean,可无,默认为false,是否正在加载更多,使用该属性可防止加载时出现一次滚动多次调用加载更多函数),**isend**属性(Boolean,可无,默认为false,已无更多数据时是否禁用加载更多)
>8. ProductUnit模板 productType:不传值默认推荐商品，1:鬼市产品 ,2:品牌商品
>9. 页面含有底部导航栏的 在页面最外层添加class=“.page-footer” 底部footer固定高度50 可以采用公共样式
>10. 延迟渲染：``<v-delay :delay="30" @loaded="loaded"><slot></slot></v-delay>``,**delay**属性(Number,可选,延迟的时间,单位毫秒,默认/最小值为30),**loaded**(Function,可选,延迟渲染后的回调函数)
>11. 跳转搜索结果页面使用 `this.$store.dispatch('confirOption', {data:set,type:type})` 参数 set可以是{}也可以是指定的值 例如 set.brandid=''，参数type可以不传，可以参照




### 在linux  Centos 7 上运行 npm run build

1. prerender-spa-plugin 库依赖于 puppeteer 但 puppeteer 在centos7上有问题  [解决方法](https://github.com/GoogleChrome/puppeteer/issues/391)
2. 注意文件名大小写问题. 例如在windows上 .Vue 和 .vue 都可以运行.但在 linux 上无法运行.

---

> ## [∮项目发布流程(windows)](./docs/publish.md)
