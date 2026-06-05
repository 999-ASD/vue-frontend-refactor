<template>
  <div class="medical-record">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="/dashboard">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item><a href="/record-home">病历管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>病历记录</el-breadcrumb-item>
    </el-breadcrumb>
    
    <el-card title="患者信息">
      <el-form :model="patient" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="病历号">
              <el-input v-model="patient.caseNo" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名">
              <el-input v-model="patient.name" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别">
              <el-input v-model="patient.gender" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄">
              <el-input v-model="patient.age" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    
    <el-card title="病历信息" style="margin-top: 20px;">
      <el-form :model="record">
        <el-form-item label="主诉">
          <el-input 
            type="textarea" 
            v-model="record.chiefComplaint" 
            placeholder="请输入患者主诉"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="现病史">
          <el-input 
            type="textarea" 
            v-model="record.presentHistory" 
            placeholder="请输入现病史"
            :rows="4"
          />
        </el-form-item>
        <el-form-item label="既往史">
          <el-input 
            type="textarea" 
            v-model="record.pastHistory" 
            placeholder="请输入既往史"
            :rows="4"
          />
        </el-form-item>
        <el-form-item label="体格检查">
          <el-input 
            type="textarea" 
            v-model="record.physicalExam" 
            placeholder="请输入体格检查结果"
            :rows="4"
          />
        </el-form-item>
        <el-form-item label="诊断结果">
          <el-input 
            type="textarea" 
            v-model="record.diagnosis" 
            placeholder="请输入诊断结果"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="治疗方案">
          <el-input 
            type="textarea" 
            v-model="record.treatmentPlan" 
            placeholder="请输入治疗方案"
            :rows="4"
          />
        </el-form-item>
      </el-form>
    </el-card>
    
    <div class="action-buttons">
      <el-button type="primary" @click="handleSave">保存病历</el-button>
      <el-button type="success" @click="handleWritePrescription">开具处方</el-button>
      <el-button @click="handleBack">返回患者列表</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePatientStore } from '../../stores/patient'
import { ElMessage } from 'element-plus'

const router = useRouter()
const patientStore = usePatientStore()

interface MedicalRecordData {
  chiefComplaint: string
  presentHistory: string
  pastHistory: string
  physicalExam: string
  diagnosis: string
  treatmentPlan: string
}

const patient = reactive({
  caseNo: '',
  name: '',
  gender: '',
  age: 0
})

const record = reactive<MedicalRecordData>({
  chiefComplaint: '',
  presentHistory: '',
  pastHistory: '',
  physicalExam: '',
  diagnosis: '',
  treatmentPlan: ''
})

onMounted(() => {
  if (patientStore.currentPatient) {
    const p = patientStore.currentPatient
    patient.caseNo = p.caseNo
    patient.name = p.name
    patient.gender = p.gender
    patient.age = p.age
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
.medical-record {
  padding: 20px;
}

.action-buttons {
  margin-top: 20px;
}

.action-buttons button {
  margin-right: 10px;
}
</style>