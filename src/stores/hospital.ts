import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Patient {
  id: number
  caseNo: string
  name: string
  gender: string
  age: number
  idCard: string
  address: string
}

export interface Doctor {
  id: number
  name: string
  department: string
  title: string
}

export interface RegistrationRecord {
  id: number
  caseNo: string
  name: string
  department: string
  doctor: string
  visitDate: string
  noon: string
  fee: number
  payMethod: string
  status: '待就诊' | '已就诊' | '已退号'
}

export interface QueuePatient {
  id: number
  caseNo: string
  name: string
  status: 'waiting' | 'calling' | 'called' | 'skipped'
}

export interface Drug {
  id: number
  code: string
  name: string
  spec: string
  unit: string
  manufacturer: string
  price: number
}

export interface MedicalRecord {
  recordId: string
  caseNo: string
  name: string
  gender: string
  age: number
  createTime: string
  chiefComplaint: string
  presentHistory: string
  pastHistory: string
  physicalExam: string
  diagnosis: string
  treatmentPlan: string
}

export const useHospitalStore = defineStore('hospital', () => {
  const currentUser = ref({ name: '李思', role: '超级管理员' })
  
  const departments = ref([
    { id: 1, name: '呼吸内科' },
    { id: 2, name: '神经内科' },
    { id: 3, name: '普外科' },
    { id: 4, name: '儿科' },
    { id: 5, name: '骨科' }
  ])

  const doctors = ref<Doctor[]>([
    { id: 1, name: '张三有', department: '呼吸内科', title: '主任医师' },
    { id: 2, name: '李思华', department: '神经内科', title: '副主任医师' },
    { id: 3, name: '王仆陆', department: '普外科', title: '主治医师' },
    { id: 4, name: '马梦梅', department: '儿科', title: '主任医师' },
    { id: 5, name: '张新如', department: '骨科', title: '副主任医师' },
    { id: 6, name: '李欣玲', department: '呼吸内科', title: '主治医师' },
    { id: 7, name: '普亮', department: '神经内科', title: '主任医师' },
    { id: 8, name: '杨莉莉', department: '普外科', title: '副主任医师' },
    { id: 9, name: '王一丰', department: '儿科', title: '主治医师' },
    { id: 10, name: '贾雪明', department: '骨科', title: '主任医师' },
    { id: 11, name: '周忠厚', department: '呼吸内科', title: '主治医师' }
  ])

  const patients = ref<Patient[]>([
    { id: 1, caseNo: '1000014', name: '张三有', gender: '男', age: 35, idCard: '222123200112120012', address: '北京市朝阳区' },
    { id: 2, caseNo: '1000015', name: '李思华', gender: '女', age: 42, idCard: '222123199005150023', address: '北京市海淀区' },
    { id: 3, caseNo: '1000016', name: '王仆陆', gender: '男', age: 28, idCard: '222123199508200014', address: '北京市西城区' },
    { id: 4, caseNo: '1000017', name: '马梦梅', gender: '女', age: 56, idCard: '222123196703100025', address: '北京市东城区' }
  ])

  const registrationRecords = ref<RegistrationRecord[]>([
    { id: 1, caseNo: '1000014', name: '张三有', department: '呼吸内科', doctor: '张三有', visitDate: '2024-01-15', noon: '上午', fee: 50, payMethod: '现金', status: '已就诊' },
    { id: 2, caseNo: '1000015', name: '李思华', department: '神经内科', doctor: '李思华', visitDate: '2024-01-15', noon: '下午', fee: 60, payMethod: '微信', status: '已就诊' },
    { id: 3, caseNo: '1000016', name: '王仆陆', department: '普外科', doctor: '王仆陆', visitDate: '2024-01-16', noon: '上午', fee: 50, payMethod: '支付宝', status: '待就诊' },
    { id: 4, caseNo: '1000017', name: '马梦梅', department: '儿科', doctor: '马梦梅', visitDate: '2024-01-16', noon: '下午', fee: 40, payMethod: '医保卡', status: '待就诊' }
  ])

  const queuePatients = ref<QueuePatient[]>([
    { id: 1, caseNo: '1000014', name: '张三有', status: 'waiting' },
    { id: 2, caseNo: '1000015', name: '李思华', status: 'waiting' },
    { id: 3, caseNo: '1000016', name: '王仆陆', status: 'waiting' },
    { id: 4, caseNo: '1000017', name: '马梦梅', status: 'waiting' }
  ])

  const drugs = ref<Drug[]>([
    { id: 1, code: '8697947002695', name: '冠心丹参滴丸', spec: '0.04g×180粒/盒', unit: '盒', manufacturer: '中发实业集团北京制药有限公司', price: 12.92 },
    { id: 2, code: '8697947003146', name: '荞参益气滴丸', spec: '0.5g×15袋/盒', unit: '盒', manufacturer: '天士力制药集团股份有限公司', price: 7.83 },
    { id: 3, code: '8697947004364', name: '六味地黄丸', spec: '0.8g×10袋/盒', unit: '盒', manufacturer: '大力制药集团股份有限公司', price: 15 },
    { id: 4, code: '8697947002947', name: '补气益血丹', spec: '0.6g×12袋/盒', unit: '盒', manufacturer: '精益制药集团股份有限公司', price: 13.4 },
    { id: 5, code: '8697947005138', name: '印度格列宁', spec: '0.5g×30袋/盒', unit: '瓶', manufacturer: '印度制药集团股份有限公司', price: 6.6 }
  ])

  const currentPatient = ref<Patient | null>(null)

  const filteredDoctors = computed(() => (dept: string) => {
    if (!dept) return doctors.value
    return doctors.value.filter(d => d.department === dept)
  })

  function setCurrentPatient(patient: Patient) {
    currentPatient.value = patient
  }

  function addRegistration(record: Omit<RegistrationRecord, 'id' | 'status'>) {
    const newId = registrationRecords.value.length + 1
    registrationRecords.value.push({ id: newId, ...record, status: '待就诊' })
    queuePatients.value.push({ id: newId, caseNo: record.caseNo, name: record.name, status: 'waiting' })
  }

  function cancelRegistration(id: number) {
    const index = registrationRecords.value.findIndex(r => r.id === id)
    if (index > -1) registrationRecords.value[index].status = '已退号'
    const queueIndex = queuePatients.value.findIndex(p => p.id === id)
    if (queueIndex > -1) queuePatients.value.splice(queueIndex, 1)
  }

  function callPatient(id: number) {
    const patient = queuePatients.value.find(p => p.id === id)
    if (patient) {
      patient.status = 'calling'
      setTimeout(() => { patient.status = 'called' }, 5000)
    }
  }

  function skipPatient(id: number) {
    const patient = queuePatients.value.find(p => p.id === id)
    if (patient) patient.status = 'skipped'
  }

  function createMedicalRecord(patient: Patient): MedicalRecord {
    return {
      recordId: 'MR' + Date.now(),
      caseNo: patient.caseNo,
      name: patient.name,
      gender: patient.gender,
      age: patient.age,
      createTime: new Date().toISOString(),
      chiefComplaint: '',
      presentHistory: '',
      pastHistory: '',
      physicalExam: '',
      diagnosis: '',
      treatmentPlan: ''
    }
  }

  return {
    currentUser, departments, doctors, patients, registrationRecords, queuePatients, drugs, currentPatient,
    filteredDoctors, setCurrentPatient, addRegistration, cancelRegistration, callPatient, skipPatient, createMedicalRecord
  }
})
