<template>
  <div class="registration-record">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="/dashboard">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item><a href="/registration-home">挂号管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>挂号记录</el-breadcrumb-item>
    </el-breadcrumb>
    
    <SearchForm :fields="searchFields" @search="handleSearch" />
    
    <el-table :data="filteredRecords" border style="width: 100%;">
      <el-table-column prop="id" label="编号" width="80" />
      <el-table-column prop="caseNo" label="病历号" width="120" />
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="department" label="科室" width="120" />
      <el-table-column prop="doctor" label="医生" width="100" />
      <el-table-column prop="visitDate" label="就诊日期" width="120" />
      <el-table-column prop="noon" label="午别" width="80" />
      <el-table-column prop="fee" label="费用" width="100">
        <template #default="scope">¥ {{ scope.row.fee.toFixed(2) }}</template>
      </el-table-column>
      <el-table-column prop="payMethod" label="付款方式" width="100" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="getStatusTagType(scope.row.status)">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button 
            v-if="scope.row.status === '待就诊'" 
            type="danger" 
            size="small" 
            @click="handleCancel(scope.row.id)"
          >
            退号
          </el-button>
          <span v-else class="disabled-text">-</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useRegistrationStore } from '../../stores/registration'
import SearchForm from '../../components/common/SearchForm.vue'
import { ElMessage } from 'element-plus'

const registrationStore = useRegistrationStore()

const searchForm = reactive({
  caseNo: '',
  name: '',
  status: ''
})

const searchFields = {
  caseNo: { label: '病历号', type: 'input' as const, placeholder: '请输入病历号' },
  name: { label: '姓名', type: 'input' as const, placeholder: '请输入姓名' },
  status: { 
    label: '状态', 
    type: 'select' as const, 
    placeholder: '请选择状态',
    options: [
      { label: '全部', value: '' },
      { label: '待就诊', value: '待就诊' },
      { label: '已就诊', value: '已就诊' },
      { label: '已退号', value: '已退号' }
    ]
  }
}

const filteredRecords = computed(() => 
  registrationStore.filteredRecords(searchForm)
)

function handleSearch(filters: Record<string, any>) {
  Object.assign(searchForm, filters)
}

function getStatusTagType(status: string): string {
  const statusMap: Record<string, string> = {
    '待就诊': 'warning',
    '已就诊': 'success',
    '已退号': 'danger'
  }
  return statusMap[status] || 'info'
}

function handleCancel(id: number) {
  registrationStore.cancelRegistration(id)
  ElMessage.success('退号成功！')
}
</script>

<style scoped>
.registration-record {
  padding: 20px;
}

.el-breadcrumb {
  margin-bottom: 32px;
}

.disabled-text {
  color: #999;
}
</style>