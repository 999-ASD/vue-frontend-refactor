<template>
  <div class="layout-container">
    <Header></Header>
    <div class="layout-content">
      <Sidebar></Sidebar>
      <main class="main-content">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
import Header from './Header.vue'
import Sidebar from './Sidebar.vue'
</script>

<style scoped>
.layout-container { display: flex; flex-direction: column; min-height: 100vh; }
.layout-content { display: flex; flex: 1; }
.main-content { flex: 1; padding: 20px; background-color: #f5f5f5; }
</style>
