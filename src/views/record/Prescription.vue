<template>
  <div class="prescription">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="/dashboard">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>病历管理</el-breadcrumb-item>
      <el-breadcrumb-item>开设处方</el-breadcrumb-item>
    </el-breadcrumb>
    
    <el-card title="患者信息">
      <el-form :model="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="病历号">
              <el-input v-model="form.caseNo" placeholder="请输入病历号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名">
              <el-input v-model="form.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    
    <el-card title="处方信息" style="margin-top: 20px;">
      <el-form :model="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="就诊科室">
              <el-select v-model="form.department">
                <el-option v-for="dept in registrationStore.departments" :key="dept.id" :label="dept.name" :value="dept.name" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="处方日期">
              <el-date-picker v-model="form.date" type="date" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    
    <el-card title="药品明细" style="margin-top: 20px;">
      <el-table :data="form.drugs" border style="width: 100%;">
        <el-table-column prop="name" label="药品名称" width="180" />
        <el-table-column prop="spec" label="规格" width="150" />
        <el-table-column prop="quantity" label="数量" width="100">
          <template #default="scope">
            <el-input-number v-model="scope.row.quantity" :min="1" :max="99" />
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column prop="price" label="单价" width="100">
          <template #default="scope">¥ {{ scope.row.price.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="total" label="金额" width="100">
          <template #default="scope">¥ {{ (scope.row.price * scope.row.quantity).toFixed(2) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="100">
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
      <SearchForm :fields="searchFields" @search="handleSearchDrug" />
      
      <el-table :data="filteredDrugs" border style="width: 100%;">
        <el-table-column prop="code" label="药品编码" width="120" />
        <el-table-column prop="name" label="药品名称" width="150" />
        <el-table-column prop="spec" label="规格" width="150" />
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column prop="manufacturer" label="生产厂家" width="150" />
        <el-table-column prop="price" label="单价" width="100">
          <template #default="scope">¥ {{ scope.row.price.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="100">
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
import { useRouter } from 'vue-router'
import { useDrugStore } from '../../stores/drug'
import type { Drug } from '../../stores/drug'
import { useRegistrationStore } from '../../stores/registration'
import SearchForm from '../../components/common/SearchForm.vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const drugStore = useDrugStore()
const registrationStore = useRegistrationStore()

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
  date: new Date().toISOString().split('T')[0],
  drugs: [] as PrescriptionDrug[]
})

const showDrugModal = ref(false)
const searchDrug = ref('')

const searchFields = {
  searchDrug: { label: '药品名称', type: 'input' as const, placeholder: '请输入药品名称' }
}

const filteredDrugs = computed(() => 
  drugStore.filteredDrugs(searchDrug.value)
)

const totalAmount = computed(() => 
  form.drugs.reduce((sum, drug) => sum + drug.price * drug.quantity, 0)
)

function handleSearchDrug(filters: Record<string, any>) {
  searchDrug.value = filters.searchDrug || ''
}

function handleAddDrug(drug: Drug) {
  form.drugs.push({
    name: drug.name,
    spec: drug.spec,
    quantity: 1,
    unit: drug.unit,
    price: drug.price
  })
  showDrugModal.value = false
}

function handleRemoveDrug(index: number) {
  form.drugs.splice(index, 1)
}

function handleSave() {
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
  
  drugStore.addPrescription({
    caseNo: form.caseNo,
    patientName: form.name,
    department: form.department,
    doctorName: '张三有',
    createTime: new Date().toLocaleString('zh-CN'),
    drugs: form.drugs.map(d => ({
      drugId: 0,
      drugName: d.name,
      spec: d.spec,
      quantity: d.quantity,
      unit: d.unit,
      price: d.price
    })),
    totalAmount: totalAmount.value,
    status: 'pending'
  })
  
  ElMessage.success('处方保存成功！')
}

function handlePrint() {
  ElMessage.info('处方已发送至打印机')
}

function handleClear() {
  form.caseNo = ''
  form.name = ''
  form.department = ''
  form.date = new Date().toISOString().split('T')[0]
  form.drugs = []
}

function handleBack() {
  router.push('/medical-record')
}
</script>

<style scoped>
.prescription {
  padding: 20px;
}

.prescription-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
}

.total-info {
  font-size: 18px;
}

.total-amount {
  font-size: 24px;
  font-weight: bold;
  color: #dc3545;
}

.action-buttons button {
  margin-left: 10px;
}
</style>