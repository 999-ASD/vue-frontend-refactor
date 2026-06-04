<template>
  <div class="page-content">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>门诊医生</el-breadcrumb-item>
      <el-breadcrumb-item>病历首页</el-breadcrumb-item>
    </el-breadcrumb>
    
    <el-card title="患者信息">
      <el-row :gutter="20">
        <el-col :span="12"><el-form-item label="病历号"><el-input v-model="record.caseNo" disabled></el-input></el-form-item></el-col>
        <el-col :span="12"><el-form-item label="姓名"><el-input v-model="record.name" disabled></el-input></el-form-item></el-col>
        <el-col :span="12"><el-form-item label="性别"><el-input v-model="record.gender" disabled></el-input></el-form-item></el-col>
        <el-col :span="12"><el-form-item label="年龄"><el-input v-model="record.age" disabled></el-input></el-form-item></el-col>
      </el-row>
    </el-card>
    
    <el-card title="病历信息" style="margin-top: 20px;">
      <el-form :model="record">
        <el-form-item label="主诉"><el-input type="textarea" v-model="record.chiefComplaint" placeholder="请输入患者主诉"></el-input></el-form-item>
        <el-form-item label="现病史"><el-input type="textarea" v-model="record.presentHistory" placeholder="请输入现病史"></el-input></el-form-item>
        <el-form-item label="既往史"><el-input type="textarea" v-model="record.pastHistory" placeholder="请输入既往史"></el-input></el-form-item>
        <el-form-item label="体格检查"><el-input type="textarea" v-model="record.physicalExam" placeholder="请输入体格检查结果"></el-input></el-form-item>
        <el-form-item label="诊断结果"><el-input type="textarea" v-model="record.diagnosis" placeholder="请输入诊断结果"></el-input></el-form-item>
        <el-form-item label="治疗方案"><el-input type="textarea" v-model="record.treatmentPlan" placeholder="请输入治疗方案"></el-input></el-form-item>
      </el-form>
    </el-card>
    
    <div class="action-buttons">
      <el-button type="primary" @click="handleSave">保存病历</el-button>
      <el-button type="success" @click="handleWritePrescription">开具处方</el-button>
      <el-button @click="handleBack">返回患者列表</el-button>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useHospitalStore } from '../stores/hospital'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const store = useHospitalStore()
const router = useRouter()

const record = reactive({
  caseNo: '', name: '', gender: '', age: '',
  chiefComplaint: '', presentHistory: '', pastHistory: '',
  physicalExam: '', diagnosis: '', treatmentPlan: ''
})

onMounted(() => {
  if (store.currentPatient) {
    const patientData = store.createMedicalRecord(store.currentPatient)
    Object.assign(record, patientData)
  } else {
    router.push('/patient-list')
  }
})

function handleSave() { 
  ElMessage.success('病历保存成功！') 
}
function handleWritePrescription() { 
  router.push('/prescription') 
}
function handleBack() { 
  router.push('/patient-list') 
}
</script>

<style scoped>
.page-content { padding: 20px; }
.action-buttons { margin-top: 20px; }
.action-buttons button { margin-right: 10px; }
</style>
