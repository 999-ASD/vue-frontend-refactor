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
  phone: string
  createTime: string
}

export interface QueuePatient {
  id: number
  caseNo: string
  name: string
  status: 'waiting' | 'calling' | 'called' | 'skipped'
}

export const usePatientStore = defineStore('patient', () => {
  const patients = ref<Patient[]>([
    { id: 1, caseNo: '1000014', name: '张三有', gender: '男', age: 35, idCard: '222123200112120012', address: '北京市朝阳区', phone: '13800138001', createTime: '2024-01-10 10:30:00' },
    { id: 2, caseNo: '1000015', name: '李思华', gender: '女', age: 42, idCard: '222123199005150023', address: '北京市海淀区', phone: '13800138002', createTime: '2024-01-11 14:20:00' },
    { id: 3, caseNo: '1000016', name: '王仆陆', gender: '男', age: 28, idCard: '222123199508200014', address: '北京市西城区', phone: '13800138003', createTime: '2024-01-12 09:15:00' },
    { id: 4, caseNo: '1000017', name: '马梦梅', gender: '女', age: 56, idCard: '222123196703100025', address: '北京市东城区', phone: '13800138004', createTime: '2024-01-13 11:45:00' },
    { id: 5, caseNo: '1000018', name: '张新如', gender: '男', age: 45, idCard: '222123197812250016', address: '北京市丰台区', phone: '13800138005', createTime: '2024-01-14 15:00:00' },
    { id: 6, caseNo: '1000019', name: '李欣玲', gender: '女', age: 32, idCard: '222123199106180027', address: '北京市石景山区', phone: '13800138006', createTime: '2024-01-15 10:00:00' }
  ])

  const queuePatients = ref<QueuePatient[]>([
    { id: 1, caseNo: '1000014', name: '张三有', status: 'waiting' },
    { id: 2, caseNo: '1000015', name: '李思华', status: 'waiting' },
    { id: 3, caseNo: '1000016', name: '王仆陆', status: 'waiting' },
    { id: 4, caseNo: '1000017', name: '马梦梅', status: 'waiting' }
  ])

  const currentPatient = ref<Patient | null>(null)

  const filteredPatients = computed(() => (searchKey: string) => {
    if (!searchKey) return patients.value
    const key = searchKey.toLowerCase()
    return patients.value.filter(p => 
      p.caseNo.includes(key) || 
      p.name.toLowerCase().includes(key) ||
      p.idCard.includes(key) ||
      p.phone.includes(key)
    )
  })

  const waitingCount = computed(() => 
    queuePatients.value.filter(p => p.status === 'waiting').length
  )

  function addPatient(patient: Omit<Patient, 'id' | 'createTime'>): Patient {
    const newPatient: Patient = {
      ...patient,
      id: patients.value.length + 1,
      createTime: new Date().toLocaleString('zh-CN')
    }
    patients.value.push(newPatient)
    return newPatient
  }

  function updatePatient(id: number, updates: Partial<Patient>): void {
    const index = patients.value.findIndex(p => p.id === id)
    if (index > -1) {
      patients.value[index] = { ...patients.value[index], ...updates }
    }
  }

  function deletePatient(id: number): void {
    const index = patients.value.findIndex(p => p.id === id)
    if (index > -1) {
      patients.value.splice(index, 1)
    }
  }

  function getPatientByCaseNo(caseNo: string): Patient | undefined {
    return patients.value.find(p => p.caseNo === caseNo)
  }

  function addToQueue(patient: Patient): void {
    const exists = queuePatients.value.find(p => p.caseNo === patient.caseNo)
    if (!exists) {
      queuePatients.value.push({
        id: patient.id,
        caseNo: patient.caseNo,
        name: patient.name,
        status: 'waiting'
      })
    }
  }

  function callPatient(id: number): void {
    const patient = queuePatients.value.find(p => p.id === id)
    if (patient) {
      patient.status = 'calling'
      setTimeout(() => {
        patient.status = 'called'
      }, 5000)
    }
  }

  function skipPatient(id: number): void {
    const patient = queuePatients.value.find(p => p.id === id)
    if (patient) {
      patient.status = 'skipped'
    }
  }

  function removeFromQueue(id: number): void {
    const index = queuePatients.value.findIndex(p => p.id === id)
    if (index > -1) {
      queuePatients.value.splice(index, 1)
    }
  }

  function setCurrentPatient(patient: Patient): void {
    currentPatient.value = patient
  }

  return {
    patients,
    queuePatients,
    currentPatient,
    filteredPatients,
    waitingCount,
    addPatient,
    updatePatient,
    deletePatient,
    getPatientByCaseNo,
    addToQueue,
    callPatient,
    skipPatient,
    removeFromQueue,
    setCurrentPatient
  }
})