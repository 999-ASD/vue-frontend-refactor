<template>
  <div class="doctor-list">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="/dashboard">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item><a href="/doctor">医生管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>医生列表</el-breadcrumb-item>
    </el-breadcrumb>
    
    <div class="action-buttons">
      <el-button type="primary" @click="showAddModal = true">添加医生</el-button>
    </div>
    
    <SearchForm :fields="searchFields" @search="handleSearch" />
    
    <el-table :data="filteredDoctors" border style="width: 100%;">
      <el-table-column prop="id" label="编号" width="80" />
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="department" label="科室" width="120" />
      <el-table-column prop="title" label="职称" width="100" />
      <el-table-column prop="workStatus" label="工作状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.workStatus === '在岗' ? 'success' : 'warning'">
            {{ scope.row.workStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="consultationCount" label="今日接诊" width="100" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <OperationDialog
      v-model:visible="showAddModal"
      :title="isEdit ? '编辑医生' : '添加医生'"
      :fields="doctorFields"
      :initial-data="currentDoctor"
      @confirm="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import SearchForm from '../../components/common/SearchForm.vue'
import OperationDialog from '../../components/common/OperationDialog.vue'
import { useRegistrationStore } from '../../stores/registration'
import type { Doctor } from '../../stores/registration'

interface ExtendedDoctor extends Doctor {
  workStatus: string
  consultationCount: number
}

const registrationStore = useRegistrationStore()

const searchKey = ref('')
const showAddModal = ref(false)
const isEdit = ref(false)
const currentDoctor = reactive<Partial<ExtendedDoctor>>({})

const searchFields = {
  searchKey: { label: '搜索', type: 'input' as const, placeholder: '姓名/科室/职称' }
}

const departments = registrationStore.departments.map(d => ({ label: d.name, value: d.name }))

const doctorFields = {
  name: { label: '姓名', type: 'input' as const, placeholder: '请输入姓名' },
  department: { 
    label: '科室', 
    type: 'select' as const, 
    placeholder: '请选择科室',
    options: departments
  },
  title: { label: '职称', type: 'input' as const, placeholder: '请输入职称' }
}

const doctors = ref<ExtendedDoctor[]>([
  { id: 1, name: '张三有', department: '呼吸内科', title: '主任医师', workStatus: '在岗', consultationCount: 8 },
  { id: 2, name: '李思华', department: '神经内科', title: '副主任医师', workStatus: '在岗', consultationCount: 6 },
  { id: 3, name: '王仆陆', department: '普外科', title: '主治医师', workStatus: '休息', consultationCount: 0 },
  { id: 4, name: '马梦梅', department: '儿科', title: '主任医师', workStatus: '在岗', consultationCount: 12 },
  { id: 5, name: '张新如', department: '骨科', title: '副主任医师', workStatus: '在岗', consultationCount: 5 },
  { id: 6, name: '李欣玲', department: '呼吸内科', title: '主治医师', workStatus: '在岗', consultationCount: 7 },
  { id: 7, name: '普亮', department: '神经内科', title: '主任医师', workStatus: '休息', consultationCount: 0 },
  { id: 8, name: '杨莉莉', department: '普外科', title: '副主任医师', workStatus: '在岗', consultationCount: 4 }
])

const filteredDoctors = computed(() => {
  if (!searchKey.value) return doctors.value
  const key = searchKey.value.toLowerCase()
  return doctors.value.filter(d => 
    d.name.toLowerCase().includes(key) ||
    d.department.toLowerCase().includes(key) ||
    d.title.toLowerCase().includes(key)
  )
})

function handleSearch(filters: Record<string, any>) {
  searchKey.value = filters.searchKey || ''
}

function handleEdit(doctor: ExtendedDoctor): void {
  Object.assign(currentDoctor, doctor)
  isEdit.value = true
  showAddModal.value = true
}

function handleDelete(id: number): void {
  const index = doctors.value.findIndex(d => d.id === id)
  if (index > -1) {
    doctors.value.splice(index, 1)
    ElMessage.success('删除成功！')
  }
}

function handleSave(data: Record<string, any>): void {
  if (!data.name) {
    ElMessage.warning('请输入姓名')
    return
  }
  
  if ((currentDoctor as ExtendedDoctor).id) {
    const index = doctors.value.findIndex(d => d.id === (currentDoctor as ExtendedDoctor).id)
    if (index > -1) {
      doctors.value[index] = { ...doctors.value[index], ...data } as ExtendedDoctor
    }
    ElMessage.success('修改成功！')
  } else {
    const newDoctor: ExtendedDoctor = {
      ...data as ExtendedDoctor,
      id: doctors.value.length + 1,
      workStatus: '在岗',
      consultationCount: 0
    }
    doctors.value.push(newDoctor)
    ElMessage.success('添加成功！')
  }
  
  isEdit.value = false
  Object.assign(currentDoctor, {})
  showAddModal.value = false
}
</script>

<style scoped>
.doctor-list { padding: 20px; }
.el-breadcrumb { margin-bottom: 32px; }
.action-buttons { margin-bottom: 24px; }
</style>