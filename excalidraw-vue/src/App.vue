<script setup lang="ts">
import Excalidraw from './components/Excalidraw.vue'
import { ref } from 'vue'
import DbTest from './components/DbTest.vue'

const showDbTest = ref(false)
const isCollapsed = ref(false)
</script>

<template>
  <div id="app">
    <Excalidraw msg="Excalidraw + Vue" />

    <!-- 使用 v-if 控制对话框显示 -->
    <div v-if="showDbTest" class="dialog-overlay" @click="showDbTest = false">
      <div class="dialog-content" @click.stop>
        <button class="close-button" @click="showDbTest = false">×</button>
        <DbTest />
      </div>
    </div>

    <div class="floating-toolbar" :class="{ 'collapsed': isCollapsed }">
      <button class="collapse-button" @click="isCollapsed = !isCollapsed">
        {{ isCollapsed ? '展开' : '收起' }}
      </button>
      <div class="toolbar-content" v-show="!isCollapsed">
        <button class="toolbar-button">TODO</button>
        <button class="toolbar-button" @click="showDbTest = true">打开数据库测试</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-content {
  position: relative;
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 500px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.close-button:hover {
  color: #000;
}

.floating-toolbar {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.9);
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 10px;
  z-index: 100;

  &.collapsed {
    padding: 10px;
    .toolbar-content {
      display: none;
    }
  }

  .collapse-button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    background: #4CAF50;
    color: white;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;

    &:hover {
      background: #45a049;
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .toolbar-content {
    display: flex;
    gap: 10px;

    .toolbar-button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      background: #4CAF50;
      color: white;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;

      &:hover {
        background: #45a049;
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}
</style>

<style>
/* 重置 Vite 的默认样式 */
#app {
  max-width: none !important; /* 移除最大宽度限制 */
  margin: 0 !important;
  padding: 0 !important;
  width: 100%;
  height: 100%;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
