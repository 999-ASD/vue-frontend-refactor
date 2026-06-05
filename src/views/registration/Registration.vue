<template>
  <div class="registration">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="/dashboard">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>挂号管理</el-breadcrumb-item>
      <el-breadcrumb-item>窗口挂号</el-breadcrumb-item>
    </el-breadcrumb>
    
    <div class="action-buttons">
      <el-button type="primary" @click="handleRegister">确认挂号</el-button>
      <el-button type="danger" @click="handleClear">清空</el-button>
    </div>
    
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
          <el-col :span="12">
            <el-form-item label="性别">
              <el-select v-model="form.gender">
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄">
              <el-input-number v-model="form.age" :min="0" :max="150" placeholder="年龄" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号">
              <el-input v-model="form.idCard" placeholder="请输入身份证号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话">
              <el-input v-model="form.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="家庭住址">
              <el-input v-model="form.address" placeholder="请输入家庭住址" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    
    <el-card title="挂号信息" style="margin-top: 20px;">
      <el-form :model="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="就诊日期">
              <el-date-picker v-model="form.visitDate" type="date" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="午别">
              <el-select v-model="form.noon">
                <el-option label="上午" value="上午" />
                <el-option label="下午" value="下午" />
                <el-option label="晚上" value="晚上" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="挂号科室">
              <el-select v-model="form.department" @change="handleDeptChange">
                <el-option v-for="dept in registrationStore.departments" :key="dept.id" :label="dept.name" :value="dept.name" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="看诊医生">
              <el-select v-model="form.doctor">
                <el-option v-for="doc in availableDoctors" :key="doc.id" :label="doc.name" :value="doc.name" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收款方式">
              <el-select v-model="form.payMethod">
                <el-option label="现金" value="现金" />
                <el-option label="微信" value="微信" />
                <el-option label="支付宝" value="支付宝" />
                <el-option label="医保卡" value="医保卡" />
                <el-option label="农合卡" value="农合卡" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="挂号费用">
              <el-input-number v-model="form.fee" :min="0" placeholder="费用" />
              <span style="margin-left: 10px;">元</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue'
import { useRegistrationStore } from '../../stores/registration'
import type { Doctor } from '../../stores/registration'
import { usePatientStore } from '../../stores/patient'
import { ElMessage } from 'element-plus'

const registrationStore = useRegistrationStore()
const patientStore = usePatientStore()

const form = reactive({
  caseNo: '',
  name: '',
  gender: '男',
  age: 0,
  idCard: '',
  phone: '',
  address: '',
  visitDate: new Date().toISOString().split('T')[0],
  noon: '上午',
  department: '呼吸内科',
  doctor: '',
  payMethod: '现金',
  fee: 50
})

const availableDoctors = computed<Doctor[]>(() => 
  registrationStore.filteredDoctors(form.department)
)

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
  if (!form.department) {
    ElMessage.warning('请选择挂号科室')
    return
  }
  
  registrationStore.addRegistration({
    caseNo: form.caseNo,
    name: form.name,
    department: form.department,
    doctor: form.doctor,
    visitDate: form.visitDate,
    noon: form.noon,
    fee: form.fee,
    payMethod: form.payMethod
  })
  
  const patient = patientStore.getPatientByCaseNo(form.caseNo)
  if (!patient) {
    patientStore.addPatient({
      caseNo: form.caseNo,
      name: form.name,
      gender: form.gender,
      age: form.age,
      idCard: form.idCard,
      address: form.address,
      phone: form.phone
    })
  }
  
  patientStore.addToQueue({
    id: 0,
    caseNo: form.caseNo,
    name: form.name,
    gender: form.gender,
    age: form.age,
    idCard: form.idCard,
    address: form.address,
    phone: form.phone,
    createTime: new Date().toLocaleString('zh-CN')
  })
  
  ElMessage.success('挂号成功！')
  handleClear()
}

function handleClear() {
  form.caseNo = ''
  form.name = ''
  form.gender = '男'
  form.age = 0
  form.idCard = ''
  form.phone = ''
  form.address = ''
  form.visitDate = new Date().toISOString().split('T')[0]
  form.noon = '上午'
  form.department = '呼吸内科'
  form.doctor = availableDoctors.value[0]?.name || ''
  form.payMethod = '现金'
  form.fee = 50
}
</script>

<style scoped>
.registration {
  padding: 20px;
}

.action-buttons {
  margin-bottom: 20px;
}

.action-buttons button {
  margin-right: 10px;
}
</style>