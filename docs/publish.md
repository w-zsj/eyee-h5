>## 项目发布流程
>1. 切换至`release`分支，拉取到最新，运行验证无错；
>2. 执行 `npm run build:cdn` ，!!如果有图片更新 运行指令'npm run build:cdn-all' 等待打包上传完成；
>3. 复制本地 **dist** 文件夹下所有文件；
>4. 登录远程：IP（**47.96.42.236**）、账号（**administrator**）、密码单独询问；
>5. 远程C盘根目录下拷贝最新旧版副本，修改副本文件夹名，格式为 `newH5 - mmddHH`，如 *12月27日14时05分* 发布，则文件夹名为 *newH5 - 12271405*，删除新文件夹内 **static**、**index.html** 二项；
>6. 将 **3.** 中复制文件粘贴在当前文件夹内；
>7. 打开iis，选择 **【高级设置】** 如图： ![iis example](./publish-iis.jpg 'iis设置示例')
>8. **高级设置** 中修改 **【物理路径】** 中文件夹名为新文件夹的名称（注意文件夹名中的空格），确认；
>9. 如 **7.** 中图片点击 **重启刷新**；
>10. 完成；
>
># ！！！注意：若发布有问题，则按照 **7. - 9.** 步骤重置回更新前的状态；

---
