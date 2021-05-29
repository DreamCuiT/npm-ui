# p8-components-ui

> 组件库

## Build Setup
## 私服切换源
npm install nrm -g

nrm add rongzhi http://192.168.0.191:8888/repository/npm-group/

nrm use rongzhi

``` bash
# install dependencies
npm install p8-components-ui

## 或者定义临时源
cnpm --registry http://192.168.0.191:8888/repository/npm-group/ i p8-components-ui 

安装成功如果运行报错，删除package-lock.json

执行cnpm i后启动

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
