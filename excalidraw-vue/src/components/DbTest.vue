<template>
  <div class="db-test-dialog">
    <h2>数据库测试面板</h2>
    <div class="button-group">
      <button @click="testSaveRecent">测试保存最近项目</button>
      <button @click="testGetRecents">获取最近项目列表</button>
      <button @click="testSaveFile">测试保存文件</button>
      <button @click="testGetFile">获取文件</button>
    </div>
    
    <div class="result" v-if="testResult">
      <h3>测试结果：</h3>
      <pre>{{ testResult }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { db } from '../db/database'

const testResult = ref('')

// 测试保存最近项目
const testSaveRecent = async () => {
  try {
    const testItem = {
      id: "test-" + Date.now(),
      name: "测试项目",
      date: Date.now(),
      image: "data:image/png;base64,test..."
    }
    
    await db.saveRecent(testItem)
    testResult.value = '保存最近项目成功：\n' + JSON.stringify(testItem, null, 2)
  } catch (error) {
    testResult.value = '保存失败：' + error
  }
}

// 测试获取最近项目列表
const testGetRecents = async () => {
  try {
    const items = await db.getRecentItems()
    testResult.value = '获取最近项目列表：\n' + JSON.stringify(items, null, 2)
  } catch (error) {
    testResult.value = '获取失败：' + error
  }
}

// 测试保存文件
const testSaveFile = async () => {
  try {
    const testFile = {
      mimeType: "image/jpeg",
      id: "test-file-" + Date.now(),
      dataURL: "data:image/jpeg;base64,test...",
      created: Date.now(),
      lastRetrieved: Date.now()
    }
    
    await db.saveFile(testFile)
    testResult.value = '保存文件成功：\n' + JSON.stringify(testFile, null, 2)
  } catch (error) {
    testResult.value = '保存失败：' + error
  }
}

// 测试获取文件
const testGetFile = async () => {
  try {
    // 获取最后保存的文件ID
    const items = await db.getRecentItems()
    if (items.length > 0) {
      const file = await db.getFile(items[0].id)
      testResult.value = '获取文件成功：\n' + JSON.stringify(file, null, 2)
    } else {
      testResult.value = '没有找到文件'
    }
  } catch (error) {
    testResult.value = '获取失败：' + error
  }
}
</script>

<style scoped>
.db-test-dialog {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.button-group {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}

button {
  padding: 8px 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #45a049;
}

.result {
  margin-top: 20px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
