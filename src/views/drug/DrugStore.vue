<template>
  <div class="drugstore">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="/dashboard">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>药房管理</el-breadcrumb-item>
      <el-breadcrumb-item>药房管理</el-breadcrumb-item>
    </el-breadcrumb>
    
    <el-tabs v-model="activeTab" class="drug-tabs">
      <el-tab-pane label="发药管理" name="dispense">
        <div class="dispense-section">
          <SearchForm :fields="dispenseSearchFields" @search="handleSearchPrescription" />
          
          <div v-if="currentPrescription" class="prescription-detail">
            <el-card title="处方信息">
              <el-row :gutter="20">
                <el-col :span="8"><span class="label">病历号：</span>{{ currentPrescription.caseNo }}</el-col>
                <el-col :span="8"><span class="label">患者姓名：</span>{{ currentPrescription.patientName }}</el-col>
                <el-col :span="8"><span class="label">就诊科室：</span>{{ currentPrescription.department }}</el-col>
              </el-row>
            </el-card>
            
            <el-card title="药品明细" style="margin-top: 20px;">
              <el-table :data="currentPrescription.drugs" border style="width: 100%;">
                <el-table-column prop="drugName" label="药品名称" width="150" />
                <el-table-column prop="spec" label="规格" width="150" />
                <el-table-column prop="quantity" label="数量" width="100" />
                <el-table-column prop="unit" label="单位" width="80" />
                <el-table-column prop="price" label="单价" width="100">
                  <template #default="scope">¥ {{ scope.row.price.toFixed(2) }}</template>
                </el-table-column>
                <el-table-column prop="total" label="金额" width="100">
                  <template #default="scope">¥ {{ (scope.row.price * scope.row.quantity).toFixed(2) }}</template>
                </el-table-column>
                <el-table-column label="库存状态" width="120">
                  <template #default="scope">
                    <el-tag :type="getStockStatus(scope.row.drugName).type">{{ getStockStatus(scope.row.drugName).text }}</el-tag>
                  </template>
                </el-table-column>
              </el-table>
              <div class="prescription-total">
                <span>处方合计：¥ {{ currentPrescription.totalAmount.toFixed(2) }}</span>
              </div>
            </el-card>
            
            <div class="action-buttons">
              <el-button type="success" @click="handleDispense">确认发药</el-button>
              <el-button @click="handleReset">重置</el-button>
            </div>
          </div>
          
          <div v-else class="empty-state">
            <div class="empty-icon">📋</div>
            <p>请输入病历号查询处方信息</p>
          </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="药品库存" name="inventory">
        <div class="inventory-section">
          <div class="section-header">
            <SearchForm :fields="inventorySearchFields" @search="handleSearchInventory" />
            <el-button type="success" @click="showAddModal = true">添加药品</el-button>
          </div>
          
          <el-table :data="filteredInventory" border style="width: 100%;">
            <el-table-column prop="code" label="药品编码" width="120" />
            <el-table-column prop="name" label="药品名称" width="150" />
            <el-table-column prop="spec" label="规格" width="150" />
            <el-table-column prop="unit" label="单位" width="80" />
            <el-table-column prop="manufacturer" label="生产厂家" width="150" />
            <el-table-column prop="price" label="单价" width="100">
              <template #default="scope">¥ {{ scope.row.price.toFixed(2) }}</template>
            </el-table-column>
            <el-table-column prop="stock" label="库存数量" width="100">
              <template #default="scope">
                <span :class="{ 'low-stock': scope.row.stock <= scope.row.minStock }">{{ scope.row.stock }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button type="primary" size="small" @click="handleEditDrug(scope.row)">编辑</el-button>
                <el-button type="danger" size="small" @click="handleDeleteDrug(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
    
    <OperationDialog
      v-model:visible="showAddModal"
      :title="isEdit ? '编辑药品' : '添加药品'"
      :fields="drugFields"
      :initial-data="currentDrug"
      @confirm="handleSaveDrug"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useDrugStore } from '../../stores/drug'
import type { Drug } from '../../stores/drug'
import SearchForm from '../../components/common/SearchForm.vue'
import OperationDialog from '../../components/common/OperationDialog.vue'
import { ElMessage } from 'element-plus'

const drugStore = useDrugStore()

const activeTab = ref('dispense')

const dispenseForm = reactive({
  caseNo: '',
  name: ''
})

const dispenseSearchFields = {
  caseNo: { label: '病历号', type: 'input' as const, placeholder: '请输入病历号' },
  name: { label: '姓名', type: 'input' as const, placeholder: '请输入姓名' }
}

const currentPrescription = ref<{
  caseNo: string
  patientName: string
  department: string
  drugs: { drugName: string; spec: string; quantity: number; unit: string; price: number }[]
  totalAmount: number
} | null>(null)

const inventorySearch = ref('')

const inventorySearchFields = {
  inventorySearch: { label: '药品名称', type: 'input' as const, placeholder: '请输入药品名称' }
}

const showAddModal = ref(false)
const isEdit = ref(false)
const currentDrug = reactive<Partial<Drug>>({})

const drugFields = {
  code: { label: '药品编码', type: 'input' as const, placeholder: '请输入药品编码' },
  name: { label: '药品名称', type: 'input' as const, placeholder: '请输入药品名称' },
  spec: { label: '规格', type: 'input' as const, placeholder: '请输入规格' },
  unit: { label: '单位', type: 'input' as const, placeholder: '请输入单位' },
  manufacturer: { label: '生产厂家', type: 'input' as const, placeholder: '请输入生产厂家' },
  price: { label: '单价', type: 'number' as const, min: 0 },
  stock: { label: '库存数量', type: 'number' as const, min: 0 },
  minStock: { label: '最低库存', type: 'number' as const, min: 0 }
}

const filteredInventory = computed(() => 
  drugStore.filteredDrugs(inventorySearch.value)
)

function handleSearchPrescription(filters: Record<string, any>) {
  Object.assign(dispenseForm, filters)
  
  if (!dispenseForm.caseNo) {
    ElMessage.warning('请输入病历号')
    return
  }
  
  const prescription = drugStore.getPrescriptionByCaseNo(dispenseForm.caseNo)
  if (prescription) {
    currentPrescription.value = {
      caseNo: prescription.caseNo,
      patientName: prescription.patientName,
      department: prescription.department,
      drugs: prescription.drugs.map(d => ({
        drugName: d.drugName,
        spec: d.spec,
        quantity: d.quantity,
        unit: d.unit,
        price: d.price
      })),
      totalAmount: prescription.totalAmount
    }
  } else {
    currentPrescription.value = {
      caseNo: dispenseForm.caseNo,
      patientName: dispenseForm.name || '张三',
      department: '呼吸内科',
      drugs: [
        { drugName: '冠心丹参滴丸', spec: '0.04g×180粒/盒', quantity: 2, unit: '盒', price: 12.92 },
        { drugName: '六味地黄丸', spec: '0.8g×10袋/盒', quantity: 1, unit: '盒', price: 15 }
      ],
      totalAmount: 40.84
    }
  }
}

function getStockStatus(drugName: string): { type: string; text: string } {
  const drug = drugStore.drugs.find(d => d.name === drugName)
  if (!drug) return { type: 'info', text: '未知' }
  if (drug.stock > drug.minStock * 2) return { type: 'success', text: '充足' }
  if (drug.stock > drug.minStock) return { type: 'warning', text: '偏少' }
  return { type: 'danger', text: '紧缺' }
}

function handleDispense() {
  ElMessage.success('发药成功！')
  currentPrescription.value = null
  dispenseForm.caseNo = ''
  dispenseForm.name = ''
}

function handleReset() {
  currentPrescription.value = null
  dispenseForm.caseNo = ''
  dispenseForm.name = ''
}

function handleSearchInventory(filters: Record<string, any>) {
  inventorySearch.value = filters.inventorySearch || ''
}

function handleEditDrug(drug: Drug) {
  isEdit.value = true
  Object.assign(currentDrug, drug)
  showAddModal.value = true
}

function handleDeleteDrug(id: number) {
  drugStore.deleteDrug(id)
  ElMessage.success('删除成功！')
}

function handleSaveDrug(data: Record<string, any>) {
  if (!data.name) {
    ElMessage.warning('请输入药品名称')
    return
  }
  
  if (isEdit.value && currentDrug.id) {
    drugStore.updateDrug(currentDrug.id, data)
    ElMessage.success('修改成功！')
  } else {
    drugStore.addDrug(data as Omit<Drug, 'id'>)
    ElMessage.success('添加成功！')
  }
  
  isEdit.value = false
  Object.assign(currentDrug, {})
}
</script>

<style scoped>
.drugstore {
  padding: 20px;
}

.drug-tabs {
  height: calc(100vh - 180px);
}

.empty-state {
  text-align: center;
  padding: 60px 0;
  background: white;
  border-radius: 8px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.label {
  color: #666;
}

.prescription-detail {
  margin-top: 20px;
}

.prescription-total {
  text-align: right;
  font-size: 16px;
  font-weight: bold;
  color: #dc3545;
  margin-top: 10px;
}

.action-buttons {
  margin-top: 20px;
}

.action-buttons button {
  margin-right: 10px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.low-stock {
  color: #dc3545;
  font-weight: bold;
}
</style>