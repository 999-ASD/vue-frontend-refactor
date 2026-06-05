<template>
  <div class="page-content">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>门诊医生</el-breadcrumb-item>
      <el-breadcrumb-item>患者查看</el-breadcrumb-item>
    </el-breadcrumb>
    
    <el-form :inline="true" class="search-form">
      <el-form-item label="病历号"><el-input v-model="searchForm.caseNo" placeholder="请输入病历号"></el-input></el-form-item>
      <el-form-item label="姓名"><el-input v-model="searchForm.name" placeholder="请输入姓名"></el-input></el-form-item>
      <el-form-item><el-button type="primary" @click="handleSearch">搜索</el-button></el-form-item>
    </el-form>
    
    <div class="queue-title">排队患者</div>
    
    <el-table :data="filteredPatients" border style="width: 100%;" class="patient-table">
      <el-table-column prop="id" label="编号"></el-table-column>
      <el-table-column prop="caseNo" label="患者病历号"></el-table-column>
      <el-table-column prop="name" label="患者姓名"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope"><el-tag :type="getStatusTagType(scope.row.status)">{{ getStatusText(scope.row.status) }}</el-tag></template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleCreateRecord(scope.row)">创建病历</el-button>
          <el-button type="danger" size="small" @click="handleSkip(scope.row.id)">跳过</el-button>
          <el-button type="success" size="small" @click="handleCall(scope.row.id)">叫号</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useHospitalStore } from '../stores/hospital'
import type { QueuePatient } from '../stores/hospital'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const store = useHospitalStore()
const router = useRouter()
const searchForm = reactive({ caseNo: '', name: '' })

const filteredPatients = computed<QueuePatient[]>(() => store.queuePatients.filter(patient => {
  const matchCaseNo = !searchForm.caseNo || patient.caseNo.includes(searchForm.caseNo)
  const matchName = !searchForm.name || patient.name.includes(searchForm.name)
  return matchCaseNo && matchName
}))

function getStatusTagType(status: string): string {
  switch(status) {
    case 'waiting': return 'info'
    case 'calling': return 'warning'
    case 'called': return 'success'
    case 'skipped': return 'danger'
    default: return 'info'
  }
}

function getStatusText(status: string): string {
  switch(status) {
    case 'waiting': return '等待中'
    case 'calling': return '叫号中'
    case 'called': return '已叫号'
    case 'skipped': return '已跳过'
    default: return status
  }
}

function handleSearch(): void {}

function handleCreateRecord(patient: QueuePatient): void {
  const fullPatient = store.patients.find(p => p.caseNo === patient.caseNo)
  if (fullPatient) {
    store.setCurrentPatient(fullPatient)
  }
  router.push('/medical-record')
}

function handleSkip(id: number): void {
  store.skipPatient(id)
  ElMessage.info('已跳过该患者')
}

function handleCall(id: number): void {
  store.callPatient(id)
  ElMessage.success('正在叫号...')
}
</script>

<style scoped>
.page-content { padding: 20px; }
.search-form { margin-bottom: 20px; }
.queue-title { font-weight: bold; margin-bottom: 10px; }
.patient-table { margin-top: 10px; }
</style>
