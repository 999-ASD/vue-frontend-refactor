<template>
  <div class="page-content">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>药房管理</el-breadcrumb-item>
      <el-breadcrumb-item>发药管理</el-breadcrumb-item>
    </el-breadcrumb>
    
    <div class="tab-container">
      <el-tabs v-model="activeTab" class="drug-tabs">
        <el-tab-pane label="发药管理" name="dispense">
          <div class="dispense-section">
            <el-form :inline="true" class="search-form">
              <el-form-item label="病历号"><el-input v-model="dispenseForm.caseNo" placeholder="请输入病历号"></el-input></el-form-item>
              <el-form-item label="姓名"><el-input v-model="dispenseForm.name" placeholder="请输入姓名"></el-input></el-form-item>
              <el-form-item><el-button type="primary" @click="handleSearchPrescription">查询处方</el-button></el-form-item>
            </el-form>
            
            <div v-if="currentPrescription" class="prescription-detail">
              <el-card title="处方信息">
                <el-row :gutter="20">
                  <el-col :span="8"><span class="label">病历号：</span>{{ currentPrescription.caseNo }}</el-col>
                  <el-col :span="8"><span class="label">患者姓名：</span>{{ currentPrescription.name }}</el-col>
                  <el-col :span="8"><span class="label">就诊科室：</span>{{ currentPrescription.department }}</el-col>
                </el-row>
              </el-card>
              
              <el-card title="药品明细" style="margin-top: 20px;">
                <el-table :data="currentPrescription.drugs" border style="width: 100%;">
                  <el-table-column prop="name" label="药品名称"></el-table-column>
                  <el-table-column prop="spec" label="规格"></el-table-column>
                  <el-table-column prop="quantity" label="数量"></el-table-column>
                  <el-table-column prop="unit" label="单位"></el-table-column>
                  <el-table-column prop="price" label="单价"></el-table-column>
                  <el-table-column prop="total" label="金额"></el-table-column>
                  <el-table-column label="库存状态">
                    <template #default="scope">
                      <el-tag :type="getStockStatus(scope.row.name).type">{{ getStockStatus(scope.row.name).text }}</el-tag>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="prescription-total">
                  <span>处方合计：¥ {{ currentPrescription.total.toFixed(2) }}</span>
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
              <el-form :inline="true" class="search-form">
                <el-form-item label="药品名称"><el-input v-model="inventorySearch" placeholder="请输入药品名称"></el-input></el-form-item>
                <el-form-item><el-button type="primary" @click="handleSearchInventory">搜索</el-button></el-form-item>
              </el-form>
              <el-button type="success" @click="showAddModal = true">添加药品</el-button>
            </div>
            
            <el-table :data="filteredInventory" border style="width: 100%;" class="inventory-table">
              <el-table-column prop="code" label="药品编码"></el-table-column>
              <el-table-column prop="name" label="药品名称"></el-table-column>
              <el-table-column prop="spec" label="规格"></el-table-column>
              <el-table-column prop="unit" label="单位"></el-table-column>
              <el-table-column prop="manufacturer" label="生产厂家"></el-table-column>
              <el-table-column prop="price" label="单价"></el-table-column>
              <el-table-column prop="stock" label="库存数量">
                <template #default="scope">
                  <span :class="{ 'low-stock': scope.row.stock < 10 }">{{ scope.row.stock }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button type="primary" size="small" @click="handleEditDrug(scope.row)">编辑</el-button>
                  <el-button type="danger" size="small" @click="handleDeleteDrug(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    
    <el-dialog title="添加/编辑药品" v-model="showAddModal" width="600px">
      <el-form :model="drugForm" label-width="100px">
        <el-form-item label="药品编码"><el-input v-model="drugForm.code" placeholder="请输入药品编码"></el-input></el-form-item>
        <el-form-item label="药品名称"><el-input v-model="drugForm.name" placeholder="请输入药品名称"></el-input></el-form-item>
        <el-form-item label="规格"><el-input v-model="drugForm.spec" placeholder="请输入规格"></el-input></el-form-item>
        <el-form-item label="单位"><el-input v-model="drugForm.unit" placeholder="请输入单位"></el-input></el-form-item>
        <el-form-item label="生产厂家"><el-input v-model="drugForm.manufacturer" placeholder="请输入生产厂家"></el-input></el-form-item>
        <el-form-item label="单价"><el-input v-model.number="drugForm.price" placeholder="请输入单价"></el-input></el-form-item>
        <el-form-item label="库存数量"><el-input v-model.number="drugForm.stock" placeholder="请输入库存数量"></el-input></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddModal = false">取消</el-button>
        <el-button type="primary" @click="handleSaveDrug">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

interface PrescriptionDrug {
  name: string
  spec: string
  quantity: number
  unit: string
  price: number
  total: number
}

interface CurrentPrescription {
  caseNo: string
  name: string
  department: string
  drugs: PrescriptionDrug[]
  total: number
}

const activeTab = ref('dispense')

const dispenseForm = reactive({
  caseNo: '',
  name: ''
})

const currentPrescription = ref<CurrentPrescription | null>(null)

const inventorySearch = ref('')

const showAddModal = ref(false)
const drugForm = reactive({
  id: 0,
  code: '',
  name: '',
  spec: '',
  unit: '',
  manufacturer: '',
  price: 0,
  stock: 0
})

interface InventoryDrug {
  id: number
  code: string
  name: string
  spec: string
  unit: string
  manufacturer: string
  price: number
  stock: number
}

const inventory = ref<InventoryDrug[]>([
  { id: 1, code: '8697947002695', name: '冠心丹参滴丸', spec: '0.04g×180粒/盒', unit: '盒', manufacturer: '中发实业集团北京制药有限公司', price: 12.92, stock: 50 },
  { id: 2, code: '8697947003146', name: '荞参益气滴丸', spec: '0.5g×15袋/盒', unit: '盒', manufacturer: '天士力制药集团股份有限公司', price: 7.83, stock: 30 },
  { id: 3, code: '8697947004364', name: '六味地黄丸', spec: '0.8g×10袋/盒', unit: '盒', manufacturer: '大力制药集团股份有限公司', price: 15, stock: 15 },
  { id: 4, code: '8697947002947', name: '补气益血丹', spec: '0.6g×12袋/盒', unit: '盒', manufacturer: '精益制药集团股份有限公司', price: 13.4, stock: 8 },
  { id: 5, code: '8697947005138', name: '印度格列宁', spec: '0.5g×30袋/盒', unit: '瓶', manufacturer: '印度制药集团股份有限公司', price: 6.6, stock: 100 }
])

const filteredInventory = computed(() => inventory.value.filter(drug => {
  return !inventorySearch.value || drug.name.includes(inventorySearch.value)
}))

function handleSearchPrescription(): void {
  if (!dispenseForm.caseNo) {
    ElMessage.warning('请输入病历号')
    return
  }
  
  currentPrescription.value = {
    caseNo: dispenseForm.caseNo,
    name: dispenseForm.name || '张三',
    department: '呼吸内科',
    drugs: [
      { name: '冠心丹参滴丸', spec: '0.04g×180粒/盒', quantity: 2, unit: '盒', price: 12.92, total: 25.84 },
      { name: '六味地黄丸', spec: '0.8g×10袋/盒', quantity: 1, unit: '盒', price: 15, total: 15 }
    ],
    total: 40.84
  }
}

function getStockStatus(drugName: string): { type: string; text: string } {
  const drug = inventory.value.find(d => d.name === drugName)
  if (!drug) return { type: 'info', text: '未知' }
  if (drug.stock > 20) return { type: 'success', text: '充足' }
  if (drug.stock > 5) return { type: 'warning', text: '偏少' }
  return { type: 'danger', text: '紧缺' }
}

function handleDispense(): void {
  ElMessage.success('发药成功！')
  currentPrescription.value = null
  dispenseForm.caseNo = ''
  dispenseForm.name = ''
}

function handleReset(): void {
  currentPrescription.value = null
  dispenseForm.caseNo = ''
  dispenseForm.name = ''
}

function handleSearchInventory(): void {}

function handleEditDrug(drug: InventoryDrug): void {
  Object.assign(drugForm, drug)
  showAddModal.value = true
}

function handleDeleteDrug(id: number): void {
  const index = inventory.value.findIndex(d => d.id === id)
  if (index > -1) {
    inventory.value.splice(index, 1)
    ElMessage.success('删除成功！')
  }
}

function handleSaveDrug(): void {
  if (!drugForm.name) {
    ElMessage.warning('请输入药品名称')
    return
  }
  
  if (drugForm.id) {
    const index = inventory.value.findIndex(d => d.id === drugForm.id)
    if (index > -1) {
      Object.assign(inventory.value[index], drugForm)
    }
    ElMessage.success('修改成功！')
  } else {
    drugForm.id = inventory.value.length + 1
    inventory.value.push({ ...drugForm })
    ElMessage.success('添加成功！')
  }
  
  showAddModal.value = false
  Object.assign(drugForm, { id: 0, code: '', name: '', spec: '', unit: '', manufacturer: '', price: 0, stock: 0 })
}
</script>

<style scoped>
.page-content { padding: 20px; }
.tab-container { margin-top: 20px; }
.drug-tabs { height: calc(100vh - 180px); }
.search-form { margin-bottom: 20px; }
.empty-state {
  text-align: center;
  padding: 60px 0;
  background: white;
  border-radius: 8px;
}
.empty-icon { font-size: 48px; margin-bottom: 15px; }
.label { color: #666; }
.prescription-detail { margin-top: 20px; }
.prescription-total {
  text-align: right;
  font-size: 16px;
  font-weight: bold;
  color: #dc3545;
  margin-top: 10px;
}
.action-buttons { margin-top: 20px; }
.action-buttons button { margin-right: 10px; }
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.inventory-table { max-height: calc(100vh - 350px); overflow-y: auto; }
.low-stock { color: #dc3545; font-weight: bold; }
</style>