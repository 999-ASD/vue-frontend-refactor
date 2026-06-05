<template>
  <div class="patient-queue">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="/dashboard">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>患者管理</el-breadcrumb-item>
      <el-breadcrumb-item>排队叫号</el-breadcrumb-item>
    </el-breadcrumb>
    
    <div class="queue-header">
      <div class="queue-stats">
        <span class="stats-item">
          <span class="stats-label">待就诊：</span>
          <span class="stats-value waiting">{{ waitingCount }}</span>
        </span>
        <span class="stats-item">
          <span class="stats-label">叫号中：</span>
          <span class="stats-value calling">{{ callingCount }}</span>
        </span>
        <span class="stats-item">
          <span class="stats-label">已叫号：</span>
          <span class="stats-value called">{{ calledCount }}</span>
        </span>
      </div>
    </div>
    
    <el-card title="排队患者列表" class="queue-card">
      <el-table :data="patientStore.queuePatients" border style="width: 100%;">
        <el-table-column prop="id" label="编号" width="80" />
        <el-table-column prop="caseNo" label="病历号" width="120" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button 
              v-if="scope.row.status === 'waiting'" 
              type="success" 
              size="small" 
              @click="handleCall(scope.row.id)"
            >
              叫号
            </el-button>
            <el-button 
              v-if="scope.row.status === 'waiting'" 
              type="warning" 
              size="small" 
              @click="handleSkip(scope.row.id)"
            >
              跳过
            </el-button>
            <el-button 
              v-if="scope.row.status === 'calling'" 
              type="primary" 
              size="small" 
              @click="handleCreateRecord(scope.row)"
            >
              创建病历
            </el-button>
            <el-button 
              v-if="scope.row.status === 'called' || scope.row.status === 'skipped'" 
              type="danger" 
              size="small" 
              @click="handleRemove(scope.row.id)"
            >
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <div v-if="currentCalling" class="calling-panel">
      <el-card class="calling-card">
        <div class="calling-title">🎙️ 当前叫号</div>
        <div class="calling-info">
          <span class="calling-name">{{ currentCalling.name }}</span>
          <span class="calling-case">病历号：{{ currentCalling.caseNo }}</span>
        </div>
        <div class="calling-tip">请前往诊室就诊</div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePatientStore } from '../../stores/patient'
import type { QueuePatient } from '../../stores/patient'
import { ElMessage } from 'element-plus'

const router = useRouter()
const patientStore = usePatientStore()

const waitingCount = computed(() => 
  patientStore.queuePatients.filter(p => p.status === 'waiting').length
)

const callingCount = computed(() => 
  patientStore.queuePatients.filter(p => p.status === 'calling').length
)

const calledCount = computed(() => 
  patientStore.queuePatients.filter(p => p.status === 'called').length
)

const currentCalling = computed(() => 
  patientStore.queuePatients.find(p => p.status === 'calling')
)

function getStatusTagType(status: string): string {
  const statusMap: Record<string, string> = {
    'waiting': 'info',
    'calling': 'warning',
    'called': 'success',
    'skipped': 'danger'
  }
  return statusMap[status] || 'info'
}

function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    'waiting': '等待中',
    'calling': '叫号中',
    'called': '已叫号',
    'skipped': '已跳过'
  }
  return statusMap[status] || status
}

function handleCall(id: number) {
  patientStore.callPatient(id)
  ElMessage.success('正在叫号...')
}

function handleSkip(id: number) {
  patientStore.skipPatient(id)
  ElMessage.info('已跳过该患者')
}

function handleRemove(id: number) {
  patientStore.removeFromQueue(id)
  ElMessage.success('已移除')
}

function handleCreateRecord(patient: QueuePatient) {
  const fullPatient = patientStore.getPatientByCaseNo(patient.caseNo)
  if (fullPatient) {
    patientStore.setCurrentPatient(fullPatient)
  }
  router.push('/medical-record')
}
</script>

<style scoped>
.patient-queue {
  padding: 20px;
}

.queue-header {
  margin-bottom: 20px;
}

.queue-stats {
  display: flex;
  gap: 30px;
}

.stats-item {
  font-size: 16px;
}

.stats-label {
  color: #666;
}

.stats-value {
  font-weight: bold;
  font-size: 24px;
}

.stats-value.waiting {
  color: #1890ff;
}

.stats-value.calling {
  color: #faad14;
}

.stats-value.called {
  color: #52c41a;
}

.queue-card {
  margin-bottom: 20px;
}

.calling-panel {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.calling-card {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  text-align: center;
  padding: 30px;
}

.calling-title {
  font-size: 18px;
  margin-bottom: 15px;
}

.calling-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.calling-name {
  font-size: 36px;
  font-weight: bold;
}

.calling-case {
  font-size: 16px;
  opacity: 0.9;
}

.calling-tip {
  margin-top: 15px;
  font-size: 14px;
  opacity: 0.8;
}
</style>