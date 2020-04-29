# vue-electron-personal-collection

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
启动
vue-cli-service electron:serve
```

### Compiles and minifies for production
```
打包
vue-cli-service electron:build
```

### Lints and fixes files
```
vue-cli-service lint
```

#####个人vue-electron项目，整合之前捣鼓的一些玩意，技术栈使用vue全家桶（vue-router、vuex、axios、vue-aplayer、element-ui、animate.css）+electron,包括实现音乐播放器、随机抽人、天气预报、计算器、cmd指令大全等，页面中也有介绍。
部分技术栈介绍：
* **1**.animate.css实现动画效果
* **2**.vue-aplayer实现左下角音乐播放器；
* **3**.vue-cropper实现骰子中图片裁剪；
* **4**.web-worker用于在随机抽人中计算；
* **5**.date-fns用于在日期计算器中配合操作；
* **6**.echarts+openlayers+高德开发接口实现省市区地图跳转及天气预报动态图表；
* **7**.live2d实现看板娘；
* **8**.node-cmd用于执行cmd指令
* **9**.animate.css结合自定义指令实现动画交互效果；
* **10**.eslint+prettier规范统一前端代码风格；

以下是部分截图：
![introduction1](https://github.com/Areocrystal/vue-electron-personal-collection/blob/master/introduction/1.PNG "首页")
![introduction2](https://github.com/Areocrystal/vue-electron-personal-collection/blob/master/introduction/2.PNG "随机抽人")
![introduction3](https://github.com/Areocrystal/vue-electron-personal-collection/blob/master/introduction/3.PNG "windows cmd指令大全")
![introduction4](https://github.com/Areocrystal/vue-electron-personal-collection/blob/master/introduction/4.PNG "骰子作图")
![introduction5](https://github.com/Areocrystal/vue-electron-personal-collection/blob/master/introduction/5.PNG "天气预报")
