<template>
  <div class="page-content">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>门诊医生</el-breadcrumb-item>
      <el-breadcrumb-item>开设处方</el-breadcrumb-item>
    </el-breadcrumb>
    
    <el-card title="患者信息">
      <el-row :gutter="20">
        <el-col :span="8"><el-form-item label="病历号"><el-input v-model="patientInfo.caseNo" disabled></el-input></el-form-item></el-col>
        <el-col :span="8"><el-form-item label="姓名"><el-input v-model="patientInfo.name" disabled></el-input></el-form-item></el-col>
        <el-col :span="8"><el-form-item label="性别"><el-input v-model="patientInfo.gender" disabled></el-input></el-form-item></el-col>
      </el-row>
    </el-card>
    
    <el-card title="处方药品" style="margin-top: 20px;">
      <div class="add-drug-section">
        <el-select v-model="selectedDrug" placeholder="选择药品" style="width: 200px;">
          <el-option v-for="drug in store.drugs" :key="drug.id" :label="drug.name" :value="drug"></el-option>
        </el-select>
        <el-input v-model.number="drugQuantity" placeholder="数量" style="width: 100px; margin-left: 10px;"></el-input>
        <el-button type="primary" @click="handleAddDrug" style="margin-left: 10px;">添加药品</el-button>
      </div>
      
      <el-table :data="prescriptionDrugs" border style="width: 100%; margin-top: 20px;">
        <el-table-column prop="name" label="药品名称"></el-table-column>
        <el-table-column prop="spec" label="规格"></el-table-column>
        <el-table-column prop="manufacturer" label="生产厂家"></el-table-column>
        <el-table-column prop="price" label="单价"></el-table-column>
        <el-table-column prop="quantity" label="数量"></el-table-column>
        <el-table-column label="金额">
          <template #default="scope">{{ (scope.row.price * scope.row.quantity).toFixed(2) }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope"><el-button type="danger" size="small" @click="handleRemoveDrug(scope.$index)">删除</el-button></template>
        </el-table-column>
      </el-table>
      
      <div class="total-section">
        <span class="total-label">处方合计：</span>
        <span class="total-value">{{ totalAmount.toFixed(2) }}</span>
        <span class="total-unit">元</span>
      </div>
    </el-card>
    
    <el-card title="处方信息" style="margin-top: 20px;">
      <el-form :model="prescriptionInfo">
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="诊断结果"><el-input type="textarea" v-model="prescriptionInfo.diagnosis" placeholder="请输入诊断结果"></el-input></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="用药说明"><el-input type="textarea" v-model="prescriptionInfo.instructions" placeholder="请输入用药说明"></el-input></el-form-item></el-col>
        </el-row>
      </el-form>
    </el-card>
    
    <div class="action-buttons">
      <el-button type="primary" @click="handleSavePrescription">保存处方</el-button>
      <el-button type="success" @click="handlePrint">打印处方</el-button>
      <el-button @click="handleBack">返回病历</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useHospitalStore } from '../stores/hospital'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const store = useHospitalStore()
const router = useRouter()

const patientInfo = reactive({ caseNo: '', name: '', gender: '' })
const selectedDrug = ref(null)
const drugQuantity = ref(1)
const prescriptionDrugs = ref([])
const prescriptionInfo = reactive({ diagnosis: '', instructions: '' })

const totalAmount = computed(() => prescriptionDrugs.value.reduce((sum, drug) => sum + drug.price * drug.quantity, 0))

onMounted(() => {
  if (store.currentPatient) {
    patientInfo.caseNo = store.currentPatient.caseNo
    patientInfo.name = store.currentPatient.name
    patientInfo.gender = store.currentPatient.gender || '未知'
  } else {
    router.push('/patient-list')
  }
})

function handleAddDrug() {
  if (!selectedDrug.value) {
    ElMessage.warning('请选择药品')
    return
  }
  const existingDrug = prescriptionDrugs.value.find(d => d.id === selectedDrug.value.id)
  if (existingDrug) {
    existingDrug.quantity += drugQuantity.value
  } else {
    prescriptionDrugs.value.push({ ...selectedDrug.value, quantity: drugQuantity.value })
  }
  drugQuantity.value = 1
  selectedDrug.value = null
  ElMessage.success('药品添加成功！')
}

function handleRemoveDrug(index) { 
  prescriptionDrugs.value.splice(index, 1) 
  ElMessage.info('药品已移除')
}

function handleSavePrescription() {
  if (prescriptionDrugs.value.length === 0) {
    ElMessage.warning('请添加至少一种药品')
    return
  }
  ElMessage.success('处方保存成功！')
}

function handlePrint() { ElMessage.info('正在打印处方...') }
function handleBack() { router.push('/medical-record') }
</script>

<style scoped>
.page-content { padding: 20px; }
.add-drug-section { display: flex; align-items: center; }
.total-section { display: flex; align-items: center; justify-content: flex-end; margin-top: 20px; padding-top: 10px; border-top: 1px solid #eee; }
.total-label { font-size: 16px; }
.total-value { font-size: 24px; font-weight: bold; color: #dc3545; margin: 0 5px; }
.total-unit { font-size: 16px; }
.action-buttons { margin-top: 20px; }
.action-buttons button { margin-right: 10px; }
</style>
