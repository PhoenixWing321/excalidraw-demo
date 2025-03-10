<template>
  <div class="container">
    <div class="header" v-if="props.msg">{{ props.msg }}</div>
    <div class="excalidraw" id="excalidraw"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Excalidraw } from '@excalidraw/excalidraw'

// 定义 props
const props = defineProps({
  msg: {
    type: String,
    default: ''
  }
})

let root = null
let app = null

// 使用 ref 替代 data
const appState = ref({
  viewBackgroundColor: '#fff',
  currentItemStrokeColor: '#000000',
  currentItemBackgroundColor: '#ffffff',
  activeTool: 'selection',
  zoom: 1
})

// 方法定义
const initializeExcalidraw = () => {
  const savedElements = localStorage.getItem('excalidrawElements')
  const savedAppState = localStorage.getItem('appState')

  const initialData = savedElements
    ? JSON.parse(savedElements)
    : { elements: [], appState: appState.value }
  const currentAppState = savedAppState ? JSON.parse(savedAppState) : appState.value

  const excalidrawElement = React.createElement(Excalidraw, {
    initialData: initialData,
    onChange: handleDrawingChange,
    excalidrawAPI: excalidrawAPI,
    langCode: 'zh-CN'
  })

  root = createRoot(document.getElementById('excalidraw'))
  root.render(excalidrawElement)
}

const handleDrawingChange = (elements, newAppState) => {
  let state = app.getAppState()
  // console.log(state, 'state')

  let { collaborators, ...currentAppState } = state
  // console.log(currentAppState, 'appState')

  localStorage.setItem(
    'excalidrawElements',
    JSON.stringify({ elements, appState: currentAppState })
  )
}

const excalidrawAPI = (e) => {
  app = e
  window.app = e
}

// 生命周期钩子
onMounted(() => {
  initializeExcalidraw()
})

onUnmounted(() => {
  if (root) {
    root.unmount()
  }
})
</script>

<style scoped lang="scss">
// 添加全局样式
:root, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  position: relative;

  .header {
    height: 3rem;
    line-height: 3rem;
    padding: 0 1rem;
    font-size: 1.2rem;
    background-color: #038fe5;
    color: white;
  }

  .footer {
    height: 2rem;
    line-height: 2rem;
    text-align: center;
    background-color: #038fe5;
    color: white;
  }

  .excalidraw {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
