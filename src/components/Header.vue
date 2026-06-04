<template>
  <header class="header">
    <div class="header-content">
      <div class="header-left">
        <span class="logo">🏥 智慧医院HIS系统</span>
        <span class="version">v1.0</span>
      </div>
      <div class="header-right">
        <span class="role">{{ store.currentUser.role }}</span>
        <el-dropdown trigger="click" class="user-dropdown">
          <span class="user-name">{{ store.currentUser.name }} ▼</span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>切换账户</el-dropdown-item>
              <el-dropdown-item divided>退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useHospitalStore } from '../stores/hospital'
const store = useHospitalStore()
</script>

<style scoped>
.header { background-color: #dc3545; color: white; padding: 0 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.header-content { display: flex; justify-content: space-between; align-items: center; height: 60px; }
.header-left { display: flex; align-items: center; gap: 12px; }
.logo { font-size: 18px; font-weight: bold; }
.version { font-size: 14px; opacity: 0.8; }
.header-right { display: flex; align-items: center; gap: 20px; }
.role { font-size: 14px; }
.user-dropdown { cursor: pointer; }
.user-name { font-size: 14px; padding: 8px 12px; border-radius: 4px; transition: background-color 0.2s; }
.user-name:hover { background-color: rgba(255,255,255,0.2); }
</style>
