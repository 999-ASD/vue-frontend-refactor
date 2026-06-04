<template>
  <div class="page-content">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>挂号收费</el-breadcrumb-item>
      <el-breadcrumb-item>窗口退号</el-breadcrumb-item>
    </el-breadcrumb>
    
    <el-form :inline="true" class="search-form">
      <el-form-item label="病历号"><el-input v-model="searchForm.caseNo" placeholder="请输入病历号"></el-input></el-form-item>
      <el-form-item label="姓名"><el-input v-model="searchForm.name" placeholder="请输入姓名"></el-input></el-form-item>
      <el-form-item><el-button type="primary" @click="handleSearch">搜索</el-button></el-form-item>
    </el-form>
    
    <el-table :data="filteredRecords" border style="width: 100%;" class="record-table">
      <el-table-column prop="id" label="编号"></el-table-column>
      <el-table-column prop="caseNo" label="病历号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="department" label="科室"></el-table-column>
      <el-table-column prop="doctor" label="医生"></el-table-column>
      <el-table-column prop="visitDate" label="就诊日期"></el-table-column>
      <el-table-column prop="noon" label="午别"></el-table-column>
      <el-table-column prop="fee" label="费用"></el-table-column>
      <el-table-column prop="payMethod" label="付款方式"></el-table-column>
      <el-table-column prop="status" label="status">
        <template #default="scope"><el-tag :type="getStatusTagType(scope.row.status)">{{ scope.row.status }}</el-tag></template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button v-if="scope.row.status === '待就诊'" type="danger" size="small" @click="handleCancel(scope.row.id)">退号</el-button>
          <span v-else class="disabled-text">已完成</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useHospitalStore } from '../stores/hospital'
import { ElMessage } from 'element-plus'

const store = useHospitalStore()
const searchForm = ref({ caseNo: '', name: '' })

const filteredRecords = computed(() => store.registrationRecords.filter(record => {
  const matchCaseNo = !searchForm.value.caseNo || record.caseNo.includes(searchForm.value.caseNo)
  const matchName = !searchForm.value.name || record.name.includes(searchForm.value.name)
  return matchCaseNo && matchName
}))

function getStatusTagType(status) {
  switch(status) {
    case '待就诊': return 'warning'
    case '已就诊': return 'success'
    case '已退号': return 'danger'
    default: return 'info'
  }
}

function handleSearch() {}

function handleCancel(id) {
  store.cancelRegistration(id)
  ElMessage.success('退号成功！')
}
</script>

<style scoped>
.page-content { padding: 20px; }
.search-form { margin-bottom: 20px; }
.record-table { margin-top: 20px; }
.disabled-text { color: #999; font-size: 14px; }
</style>
