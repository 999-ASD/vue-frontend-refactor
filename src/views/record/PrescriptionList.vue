<template>
  <div class="prescription-list">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="/dashboard">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item><a href="/record-home">病历管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>处方记录</el-breadcrumb-item>
    </el-breadcrumb>
    
    <div class="action-buttons">
      <el-button type="primary" @click="navigate('/prescription')">开具新处方</el-button>
    </div>
    
    <SearchForm :fields="searchFields" @search="handleSearch" />
    
    <el-table :data="filteredPrescriptions" border style="width: 100%;">
      <el-table-column prop="id" label="编号" width="80" />
      <el-table-column prop="caseNo" label="病历号" width="120" />
      <el-table-column prop="patientName" label="患者姓名" width="120" />
      <el-table-column prop="doctorName" label="医生" width="100" />
      <el-table-column prop="total" label="金额" width="100">
        <template #default="scope">¥ {{ scope.row.total.toFixed(2) }}</template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="开具时间" width="160" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button type="primary" size="small" @click="viewDetail(scope.row)">查看详情</el-button>
          <el-button type="success" size="small" @click="handleIssue(scope.row)" v-if="scope.row.status === '待发药'">确认发药</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-dialog title="处方详情" v-model="showDetailModal" width="600px">
      <div v-if="currentPrescription">
        <el-form :model="currentPrescription" label-width="100px">
          <el-form-item label="病历号">{{ currentPrescription.caseNo }}</el-form-item>
          <el-form-item label="患者姓名">{{ currentPrescription.patientName }}</el-form-item>
          <el-form-item label="医生">{{ currentPrescription.doctorName }}</el-form-item>
          <el-form-item label="开具时间">{{ currentPrescription.createTime }}</el-form-item>
          <el-form-item label="状态">
            <el-tag :type="getStatusType(currentPrescription.status || '')">
              {{ currentPrescription.status }}
            </el-tag>
          </el-form-item>
        </el-form>
        
        <el-table :data="currentPrescription.items" border style="width: 100%; margin-top: 20px;">
          <el-table-column prop="drugName" label="药品名称" width="180" />
          <el-table-column prop="dose" label="剂量" width="100" />
          <el-table-column prop="frequency" label="用法" width="120" />
          <el-table-column prop="quantity" label="数量" width="80" />
          <el-table-column prop="price" label="单价" width="80">
            <template #default="scope">¥ {{ scope.row.price.toFixed(2) }}</template>
          </el-table-column>
        </el-table>
        
        <div style="text-align: right; margin-top: 15px; font-weight: bold;">
          合计金额：¥ {{ (currentPrescription.total || 0).toFixed(2) }}
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDrugStore } from '../../stores/drug'
import type { Prescription } from '../../api/drug'
import SearchForm from '../../components/common/SearchForm.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const drugStore = useDrugStore()

const searchKey = ref('')
const showDetailModal = ref(false)
const currentPrescription = reactive<Partial<Prescription>>({})

const searchFields = {
  searchKey: { label: '搜索', type: 'input' as const, placeholder: '病历号/患者姓名' }
}

const filteredPrescriptions = computed(() => {
  if (!searchKey.value) return drugStore.prescriptions
  const key = searchKey.value.toLowerCase()
  return drugStore.prescriptions.filter(p => 
    p.caseNo.includes(key) || 
    p.patientName.toLowerCase().includes(key)
  )
})

function handleSearch(filters: Record<string, any>) {
  searchKey.value = filters.searchKey || ''
}

function navigate(path: string) {
  router.push(path)
}

function getStatusType(status: string): string {
  const statusMap: Record<string, string> = {
    '待发药': 'warning',
    '已发药': 'success',
    '已取消': 'danger'
  }
  return statusMap[status] || 'info'
}

function viewDetail(prescription: Prescription) {
  Object.assign(currentPrescription, prescription)
  showDetailModal.value = true
}

async function handleIssue(prescription: Prescription) {
  try {
    await ElMessageBox.confirm('确认发药吗？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'info'
    })
    drugStore.updatePrescriptionStatus(prescription.id, '已发药')
    ElMessage.success('发药成功！')
  } catch {
    ElMessage.info('已取消发药')
  }
}

async function handleDelete(id: number) {
  try {
    await ElMessageBox.confirm('确定要删除此处方吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    drugStore.deletePrescription(id)
    ElMessage.success('删除成功！')
  } catch {
    ElMessage.info('已取消删除')
  }
}
</script>

<style scoped>
.prescription-list {
  padding: 20px;
}

.el-breadcrumb {
  margin-bottom: 32px;
}

.action-buttons {
  margin-bottom: 20px;
}

.el-dialog {
  top: 50px;
}
</style>