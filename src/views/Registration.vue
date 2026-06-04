<template>
  <div class="page-content">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>挂号收费</el-breadcrumb-item>
      <el-breadcrumb-item>窗口挂号</el-breadcrumb-item>
    </el-breadcrumb>
    
    <div class="action-buttons">
      <el-button type="primary" @click="handleRegister">挂号</el-button>
      <el-button type="danger" @click="handleClear">清空</el-button>
    </div>
    
    <el-form :model="form" label-width="100px" class="registration-form">
      <el-card title="基本信息">
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="病历号"><el-input v-model="form.caseNo" placeholder="请输入病历号"></el-input></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="姓名"><el-input v-model="form.name" placeholder="请输入姓名"></el-input></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="性别"><el-select v-model="form.gender"><el-option label="男" value="男"></el-option><el-option label="女" value="女"></el-option></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="年龄"><el-input v-model.number="form.age" placeholder="请输入年龄" style="width: 150px;"></el-input><span style="margin-left: 10px;">年</span></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="出生日期"><el-date-picker v-model="form.birth" type="date" placeholder="选择日期"></el-date-picker></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="身份证"><el-input v-model="form.idCard" placeholder="请输入身份证号"></el-input></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="家庭住址"><el-input v-model="form.address" placeholder="请输入家庭住址"></el-input></el-form-item></el-col>
        </el-row>
      </el-card>
      
      <el-card title="挂号信息" style="margin-top: 20px;">
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="结算类别"><el-select v-model="form.payType"><el-option label="自费" value="自费"></el-option><el-option label="医保" value="医保"></el-option></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="看诊日期"><el-date-picker v-model="form.visitDate" type="date" placeholder="选择日期"></el-date-picker></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="午别"><el-select v-model="form.noon"><el-option label="上午" value="上午"></el-option><el-option label="下午" value="下午"></el-option></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="挂号科室"><el-select v-model="form.dept" @change="handleDeptChange"><el-option v-for="dept in store.departments" :key="dept.id" :label="dept.name" :value="dept.name"></el-option></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="号别"><el-select v-model="form.noType"><el-option label="主治医生" value="主治医生"></el-option><el-option label="副主任医生" value="副主任医生"></el-option><el-option label="主任医生" value="主任医生"></el-option></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="看诊医生"><el-select v-model="form.doctor"><el-option v-for="doc in availableDoctors" :key="doc.id" :label="doc.name" :value="doc.name"></el-option></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="病历本"><el-select v-model="form.caseBook"><el-option label="是" value="是"></el-option><el-option label="否" value="否"></el-option></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="应收金额"><el-input v-model.number="form.fee" placeholder="请输入金额"></el-input></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="收款方式"><el-select v-model="form.payMethod"><el-option label="现金" value="现金"></el-option><el-option label="微信" value="微信"></el-option><el-option label="支付宝" value="支付宝"></el-option><el-option label="医保卡" value="医保卡"></el-option><el-option label="农合卡" value="农合卡"></el-option></el-select></el-form-item></el-col>
        </el-row>
      </el-card>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue'
import { useHospitalStore } from '../stores/hospital'
import { ElMessage } from 'element-plus'

const store = useHospitalStore()

const form = reactive({
  caseNo: '', name: '', gender: '男', age: '', birth: '', idCard: '', address: '',
  payType: '自费', visitDate: '', noon: '上午', dept: '呼吸内科', noType: '主治医生',
  doctor: '', caseBook: '是', fee: '', payMethod: '现金'
})

const availableDoctors = computed(() => store.filteredDoctors(form.dept))

onMounted(() => {
  form.doctor = availableDoctors.value[0]?.name || ''
})

function handleDeptChange() { 
  form.doctor = availableDoctors.value[0]?.name || '' 
}

function handleRegister() {
  if (!form.caseNo) {
    ElMessage.warning('请填写病历号')
    return
  }
  if (!form.name) {
    ElMessage.warning('请填写姓名')
    return
  }
  if (!form.dept) {
    ElMessage.warning('请选择挂号科室')
    return
  }
  store.addRegistration({
    caseNo: form.caseNo, name: form.name, department: form.dept,
    doctor: form.doctor, visitDate: form.visitDate, noon: form.noon,
    fee: form.fee, payMethod: form.payMethod
  })
  ElMessage.success('挂号成功！')
  handleClear()
}

function handleClear() {
  form.caseNo = ''
  form.name = ''
  form.gender = '男'
  form.age = ''
  form.birth = ''
  form.idCard = ''
  form.address = ''
  form.payType = '自费'
  form.visitDate = ''
  form.noon = '上午'
  form.dept = '呼吸内科'
  form.noType = '主治医生'
  form.doctor = availableDoctors.value[0]?.name || ''
  form.caseBook = '是'
  form.fee = ''
  form.payMethod = '现金'
}
</script>

<style scoped>
.page-content { padding: 20px; }
.action-buttons { margin-bottom: 20px; }
.action-buttons button { margin-right: 10px; }
.registration-form { max-width: 100%; }
</style>
