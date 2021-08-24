# p8-components-ui

> 组件库

## Sever Setup

## 私服切换源

## https://github.com/Pana/nrm/issues/93

## 在某些版本的 node 中使用 nrm 报错 ERR_INVALID_ARG_TYPE

## npm install nrm -g

## npm install -g Pana/nrm 代替 npm install nrm -g 暂时可以使用 github 方式安装

npm install -g Pana/nrm

nrm add rongzhi http://192.168.0.191:8888/repository/npm-group/

nrm use rongzhi

```bash
# install dependencies
npm install p8-components-ui

## 或者定义临时源
npm --registry http://192.168.0.191:8888/repository/npm-group/ i p8-components-ui

安装成功如果运行报错，删除package-lock.json

执行npm i后启动

# serve with hot reload at localhost:8080
npm run dev

## Build Setup

# build for production with minification
npm run build

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
```
