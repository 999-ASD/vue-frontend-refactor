<template>
  <div class="page-content">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>门诊医生</el-breadcrumb-item>
      <el-breadcrumb-item>开设处方</el-breadcrumb-item>
    </el-breadcrumb>
    
    <el-card title="患者信息">
      <el-row :gutter="20">
        <el-col :span="12"><el-form-item label="病历号"><el-input v-model="form.caseNo" placeholder="请输入病历号"></el-input></el-form-item></el-col>
        <el-col :span="12"><el-form-item label="姓名"><el-input v-model="form.name" placeholder="请输入姓名"></el-input></el-form-item></el-col>
      </el-row>
    </el-card>
    
    <el-card title="处方信息" style="margin-top: 20px;">
      <el-form :model="form">
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="就诊科室"><el-select v-model="form.department"><el-option v-for="dept in store.departments" :key="dept.id" :label="dept.name" :value="dept.name"></el-option></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="处方日期"><el-date-picker v-model="form.date" type="date"></el-date-picker></el-form-item></el-col>
        </el-row>
      </el-form>
    </el-card>
    
    <el-card title="药品明细" style="margin-top: 20px;">
      <el-table :data="form.drugs" border style="width: 100%;" class="drug-table">
        <el-table-column prop="name" label="药品名称"></el-table-column>
        <el-table-column prop="spec" label="规格"></el-table-column>
        <el-table-column prop="quantity" label="数量">
          <template #default="scope">
            <el-input-number v-model="scope.row.quantity" :min="1" :max="99"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="单位"></el-table-column>
        <el-table-column prop="price" label="单价"></el-table-column>
        <el-table-column prop="total" label="金额">
          <template #default="scope">{{ (scope.row.price * scope.row.quantity).toFixed(2) }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="danger" size="small" @click="handleRemoveDrug(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="add-drug" style="margin-top: 15px;">
        <el-button type="primary" @click="showDrugModal = true">添加药品</el-button>
      </div>
    </el-card>
    
    <div class="prescription-footer">
      <div class="total-info">
        <span>合计金额：</span>
        <span class="total-amount">¥ {{ totalAmount.toFixed(2) }}</span>
      </div>
      <div class="action-buttons">
        <el-button type="primary" @click="handleSave">保存处方</el-button>
        <el-button type="success" @click="handlePrint">打印处方</el-button>
        <el-button @click="handleClear">清空</el-button>
        <el-button @click="handleBack">返回</el-button>
      </div>
    </div>
    
    <el-dialog title="选择药品" v-model="showDrugModal" width="800px">
      <el-form :inline="true" class="search-form">
        <el-form-item label="药品名称"><el-input v-model="searchDrug" placeholder="请输入药品名称"></el-input></el-form-item>
        <el-form-item><el-button type="primary" @click="handleSearchDrug">搜索</el-button></el-form-item>
      </el-form>
      
      <el-table :data="filteredDrugs" border style="width: 100%;" class="drug-search-table">
        <el-table-column prop="code" label="药品编码"></el-table-column>
        <el-table-column prop="name" label="药品名称"></el-table-column>
        <el-table-column prop="spec" label="规格"></el-table-column>
        <el-table-column prop="unit" label="单位"></el-table-column>
        <el-table-column prop="manufacturer" label="生产厂家"></el-table-column>
        <el-table-column prop="price" label="单价"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="success" size="small" @click="handleAddDrug(scope.row)">添加</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useHospitalStore } from '../stores/hospital'
import type { Drug } from '../stores/hospital'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const store = useHospitalStore()
const router = useRouter()

interface PrescriptionDrug {
  name: string
  spec: string
  quantity: number
  unit: string
  price: number
}

const form = reactive({
  caseNo: '',
  name: '',
  department: '',
  date: '',
  drugs: [] as PrescriptionDrug[]
})

const showDrugModal = ref(false)
const searchDrug = ref('')

const filteredDrugs = computed(() => store.drugs.filter(drug => {
  return !searchDrug.value || drug.name.includes(searchDrug.value)
}))

const totalAmount = computed(() => {
  return form.drugs.reduce((sum, drug) => sum + drug.price * drug.quantity, 0)
})

function handleSearchDrug(): void {}

function handleAddDrug(drug: Drug): void {
  form.drugs.push({
    name: drug.name,
    spec: drug.spec,
    quantity: 1,
    unit: drug.unit,
    price: drug.price
  })
  showDrugModal.value = false
}

function handleRemoveDrug(index: number): void {
  form.drugs.splice(index, 1)
}

function handleSave(): void {
  if (!form.caseNo) {
    ElMessage.warning('请输入病历号')
    return
  }
  if (!form.name) {
    ElMessage.warning('请输入患者姓名')
    return
  }
  if (form.drugs.length === 0) {
    ElMessage.warning('请添加至少一种药品')
    return
  }
  ElMessage.success('处方保存成功！')
}

function handlePrint(): void {
  ElMessage.info('处方已发送至打印机')
}

function handleClear(): void {
  form.caseNo = ''
  form.name = ''
  form.department = ''
  form.date = ''
  form.drugs = []
}

function handleBack(): void {
  router.push('/medical-record')
}
</script>

<style scoped>
.page-content { padding: 20px; }
.drug-table { margin-bottom: 15px; }
.prescription-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
}
.total-info { font-size: 18px; }
.total-amount {
  font-size: 24px;
  font-weight: bold;
  color: #dc3545;
}
.action-buttons button { margin-left: 10px; }
.search-form { margin-bottom: 15px; }
.drug-search-table { max-height: 400px; overflow-y: auto; }
</style>