<template>
  <div class="page-content">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>药房管理</el-breadcrumb-item>
      <el-breadcrumb-item>药房发药</el-breadcrumb-item>
    </el-breadcrumb>
    
    <el-form :inline="true" class="search-form">
      <el-form-item label="病历号"><el-input v-model="searchForm.caseNo" placeholder="请输入病历号"></el-input></el-form-item>
      <el-form-item label="姓名"><el-input v-model="searchForm.name" placeholder="请输入姓名"></el-input></el-form-item>
      <el-form-item><el-button type="primary" @click="handleSearch">搜索</el-button></el-form-item>
    </el-form>
    
    <div class="section-title">患者信息</div>
    
    <el-table :data="filteredPatients" border style="width: 100%;" class="patient-table">
      <el-table-column prop="id" label="编号"></el-table-column>
      <el-table-column prop="caseNo" label="患者病历号"></el-table-column>
      <el-table-column prop="name" label="患者姓名"></el-table-column>
      <el-table-column prop="gender" label="性别"></el-table-column>
      <el-table-column prop="idCard" label="身份证号"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" size="small" @click="toggleMedicineInfo(scope.row)">
            {{ expandedPatientId === scope.row.id ? '收起药品' : '显示药品' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <div v-if="expandedPatientId" class="medicine-section">
      <div class="section-title">药品信息</div>
      <el-table :data="patientMedicines" border style="width: 100%;">
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="code" label="药品编码"></el-table-column>
        <el-table-column prop="name" label="药品名称"></el-table-column>
        <el-table-column prop="spec" label="药品规格"></el-table-column>
        <el-table-column prop="unit" label="包装单位"></el-table-column>
        <el-table-column prop="manufacturer" label="生产厂家"></el-table-column>
        <el-table-column prop="price" label="单价"></el-table-column>
        <el-table-column prop="quantity" label="数量"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope"><el-button type="success" size="small" @click="handleGiveMedicine(scope.row)">发药</el-button></template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useHospitalStore } from '../stores/hospital'
import { ElMessage } from 'element-plus'

const store = useHospitalStore()
const searchForm = reactive({ caseNo: '', name: '' })
const expandedPatientId = ref(null)

const filteredPatients = computed(() => store.patients.filter(patient => {
  const matchCaseNo = !searchForm.caseNo || patient.caseNo.includes(searchForm.caseNo)
  const matchName = !searchForm.name || patient.name.includes(searchForm.name)
  return matchCaseNo && matchName
}))

const patientMedicines = computed(() => store.drugs.map(drug => ({ ...drug, quantity: 1 })))

function handleSearch() {
  ElMessage.info('搜索功能已触发')
}

function toggleMedicineInfo(patient) {
  expandedPatientId.value = expandedPatientId.value === patient.id ? null : patient.id
  if (expandedPatientId.value === patient.id) {
    ElMessage.info(`显示患者 ${patient.name} 的药品信息`)
  }
}

function handleGiveMedicine(drug) {
  ElMessage.success(`已发药：${drug.name} x ${drug.quantity}`)
}
</script>

<style scoped>
.page-content { padding: 20px; }
.search-form { margin-bottom: 20px; }
.section-title { font-weight: bold; margin-bottom: 10px; }
.patient-table { margin-bottom: 20px; }
.medicine-section { margin-top: 20px; padding: 20px; background-color: #f9f9f9; border-radius: 8px; }
</style>
