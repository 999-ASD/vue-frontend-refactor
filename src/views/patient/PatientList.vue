<template>
  <div class="patient-list">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="/dashboard">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>患者管理</el-breadcrumb-item>
      <el-breadcrumb-item>患者列表</el-breadcrumb-item>
    </el-breadcrumb>
    
    <div class="action-buttons">
      <el-button type="primary" @click="showAddModal = true">添加患者</el-button>
    </div>
    
    <SearchForm :fields="searchFields" @search="handleSearch" />
    
    <el-table :data="filteredPatients" border style="width: 100%;">
      <el-table-column prop="id" label="编号" width="80" />
      <el-table-column prop="caseNo" label="病历号" width="120" />
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="gender" label="性别" width="80" />
      <el-table-column prop="age" label="年龄" width="80" />
      <el-table-column prop="idCard" label="身份证号" width="180" />
      <el-table-column prop="phone" label="联系电话" width="120" />
      <el-table-column prop="address" label="住址" />
      <el-table-column prop="createTime" label="创建时间" width="150" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
          <el-button type="success" size="small" @click="handleCreateRecord(scope.row)">创建病历</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <OperationDialog
      v-model:visible="showAddModal"
      :title="isEdit ? '编辑患者' : '添加患者'"
      :fields="patientFields"
      :initial-data="currentPatient"
      @confirm="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePatientStore } from '../../stores/patient'
import type { Patient } from '../../stores/patient'
import SearchForm from '../../components/common/SearchForm.vue'
import OperationDialog from '../../components/common/OperationDialog.vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const patientStore = usePatientStore()

const searchKey = ref('')
const showAddModal = ref(false)
const isEdit = ref(false)
const currentPatient = reactive<Partial<Patient>>({})

const searchFields = {
  searchKey: { label: '搜索', type: 'input' as const, placeholder: '病历号/姓名/身份证号' }
}

const patientFields = {
  caseNo: { label: '病历号', type: 'input' as const, placeholder: '请输入病历号' },
  name: { label: '姓名', type: 'input' as const, placeholder: '请输入姓名' },
  gender: { 
    label: '性别', 
    type: 'select' as const, 
    options: [
      { label: '男', value: '男' },
      { label: '女', value: '女' }
    ]
  },
  age: { label: '年龄', type: 'number' as const, min: 0, max: 150 },
  idCard: { label: '身份证号', type: 'input' as const, placeholder: '请输入身份证号' },
  phone: { label: '联系电话', type: 'input' as const, placeholder: '请输入联系电话' },
  address: { label: '住址', type: 'input' as const, placeholder: '请输入住址' }
}

const filteredPatients = computed(() => 
  patientStore.filteredPatients(searchKey.value)
)

function handleSearch(filters: Record<string, any>) {
  searchKey.value = filters.searchKey || ''
}

function handleEdit(row: Patient) {
  isEdit.value = true
  Object.assign(currentPatient, row)
  showAddModal.value = true
}

function handleDelete(id: number) {
  patientStore.deletePatient(id)
  ElMessage.success('删除成功！')
}

function handleCreateRecord(patient: Patient) {
  patientStore.setCurrentPatient(patient)
  router.push('/medical-record')
}

function handleSave(data: Record<string, any>) {
  if (!data.caseNo) {
    ElMessage.warning('请输入病历号')
    return
  }
  if (!data.name) {
    ElMessage.warning('请输入姓名')
    return
  }
  
  if (isEdit.value && currentPatient.id) {
    patientStore.updatePatient(currentPatient.id, data)
    ElMessage.success('修改成功！')
  } else {
    patientStore.addPatient(data as Omit<Patient, 'id' | 'createTime'>)
    ElMessage.success('添加成功！')
  }
  
  isEdit.value = false
  Object.assign(currentPatient, {})
}
</script>

<style scoped>
.patient-list {
  padding: 20px;
}

.action-buttons {
  margin-bottom: 20px;
}
</style>