# Vue 3 + ExcaliDraw 学习

参考：https://blog.csdn.net/GISShiXiSheng/article/details/143918346

## Project Setup
使用
官方文档：https://docs.excalidraw.com/docs
1. 引入依赖
```
npm install react react-dom @excalidraw/excalidraw
```

2.添加配置
修改vite.config.js，添加如下配置：
```
export default defineConfig({
  ...,
  define: {
    'process.env': {}
  },
})
```

3.页面使用

添加一个Excalidraw.vue 
从参考文件里面拷贝代码，然后修改为Vue3的写法。

# 需求
建立一个db的ts文件，进行本地IndexedDb的读写。
1. 建立一个 excalidraw-demo-db
1.1 建立一个documents表，通过键值存储文件的json
1.2 建立一个recents的db，储存最近的文件列表，缩略图等