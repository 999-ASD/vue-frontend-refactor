<template>
  <div class="test-page">
    <h1>测试页面</h1>
    <p>这是一个测试页面，用于验证Vue应用是否正常运行</p>
    <el-button type="primary" @click="testClick">点击测试</el-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  console.log('测试页面已挂载')
})

function testClick() {
  alert('按钮点击成功！')
}
</script>

<style scoped>
.test-page {
  padding: 20px;
  text-align: center;
}

.test-page h1 {
  color: #dc3545;
}
</style>