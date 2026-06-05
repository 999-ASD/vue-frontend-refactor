import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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
  createTime: string
}

export const useRegistrationStore = defineStore('registration', () => {
  const departments = ref([
    { id: 1, name: '呼吸内科' },
    { id: 2, name: '神经内科' },
    { id: 3, name: '普外科' },
    { id: 4, name: '儿科' },
    { id: 5, name: '骨科' },
    { id: 6, name: '心内科' },
    { id: 7, name: '消化内科' }
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
    { id: 11, name: '周忠厚', department: '心内科', title: '主治医师' },
    { id: 12, name: '陈小燕', department: '消化内科', title: '副主任医师' }
  ])

  const records = ref<RegistrationRecord[]>([
    { id: 1, caseNo: '1000014', name: '张三有', department: '呼吸内科', doctor: '张三有', visitDate: '2024-01-15', noon: '上午', fee: 50, payMethod: '现金', status: '已就诊', createTime: '2024-01-15 08:30:00' },
    { id: 2, caseNo: '1000015', name: '李思华', department: '神经内科', doctor: '李思华', visitDate: '2024-01-15', noon: '下午', fee: 60, payMethod: '微信', status: '已就诊', createTime: '2024-01-15 14:00:00' },
    { id: 3, caseNo: '1000016', name: '王仆陆', department: '普外科', doctor: '王仆陆', visitDate: '2024-01-16', noon: '上午', fee: 50, payMethod: '支付宝', status: '待就诊', createTime: '2024-01-16 09:00:00' },
    { id: 4, caseNo: '1000017', name: '马梦梅', department: '儿科', doctor: '马梦梅', visitDate: '2024-01-16', noon: '下午', fee: 40, payMethod: '医保卡', status: '待就诊', createTime: '2024-01-16 15:30:00' },
    { id: 5, caseNo: '1000018', name: '张新如', department: '骨科', doctor: '张新如', visitDate: '2024-01-17', noon: '上午', fee: 60, payMethod: '现金', status: '待就诊', createTime: '2024-01-17 08:45:00' }
  ])

  const filteredDoctors = computed(() => (dept: string) => {
    if (!dept) return doctors.value
    return doctors.value.filter(d => d.department === dept)
  })

  const filteredRecords = computed(() => (filters: { caseNo?: string; name?: string; status?: string }) => {
    return records.value.filter(record => {
      const matchCaseNo = !filters.caseNo || record.caseNo.includes(filters.caseNo)
      const matchName = !filters.name || record.name.includes(filters.name)
      const matchStatus = !filters.status || record.status === filters.status
      return matchCaseNo && matchName && matchStatus
    })
  })

  const todayRegistrations = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return records.value.filter(r => r.visitDate === today && r.status === '待就诊').length
  })

  function addRegistration(data: Omit<RegistrationRecord, 'id' | 'status' | 'createTime'>): RegistrationRecord {
    const newRecord: RegistrationRecord = {
      ...data,
      id: records.value.length + 1,
      status: '待就诊',
      createTime: new Date().toLocaleString('zh-CN')
    }
    records.value.push(newRecord)
    return newRecord
  }

  function cancelRegistration(id: number): void {
    const index = records.value.findIndex(r => r.id === id)
    if (index > -1) {
      records.value[index].status = '已退号'
    }
  }

  function completeRegistration(id: number): void {
    const index = records.value.findIndex(r => r.id === id)
    if (index > -1) {
      records.value[index].status = '已就诊'
    }
  }

  return {
    departments,
    doctors,
    records,
    filteredDoctors,
    filteredRecords,
    todayRegistrations,
    addRegistration,
    cancelRegistration,
    completeRegistration
  }
})