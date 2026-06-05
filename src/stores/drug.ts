import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Drug {
  id: number
  code: string
  name: string
  spec: string
  unit: string
  manufacturer: string
  price: number
  stock: number
  minStock: number
}

export interface Prescription {
  id: number
  caseNo: string
  patientName: string
  department: string
  doctorName: string
  createTime: string
  drugs: PrescriptionDrug[]
  totalAmount: number
  status: 'pending' | 'dispensed' | 'completed'
}

export interface PrescriptionDrug {
  drugId: number
  drugName: string
  spec: string
  quantity: number
  unit: string
  price: number
}

export const useDrugStore = defineStore('drug', () => {
  const drugs = ref<Drug[]>([
    { id: 1, code: '8697947002695', name: '冠心丹参滴丸', spec: '0.04g×180粒/盒', unit: '盒', manufacturer: '中发实业集团北京制药有限公司', price: 12.92, stock: 50, minStock: 10 },
    { id: 2, code: '8697947003146', name: '荞参益气滴丸', spec: '0.5g×15袋/盒', unit: '盒', manufacturer: '天士力制药集团股份有限公司', price: 7.83, stock: 30, minStock: 10 },
    { id: 3, code: '8697947004364', name: '六味地黄丸', spec: '0.8g×10袋/盒', unit: '盒', manufacturer: '大力制药集团股份有限公司', price: 15, stock: 15, minStock: 10 },
    { id: 4, code: '8697947002947', name: '补气益血丹', spec: '0.6g×12袋/盒', unit: '盒', manufacturer: '精益制药集团股份有限公司', price: 13.4, stock: 8, minStock: 10 },
    { id: 5, code: '8697947005138', name: '印度格列宁', spec: '0.5g×30袋/盒', unit: '瓶', manufacturer: '印度制药集团股份有限公司', price: 6.6, stock: 100, minStock: 20 },
    { id: 6, code: '8697947001234', name: '阿司匹林肠溶片', spec: '100mg×30片/瓶', unit: '瓶', manufacturer: '拜耳医药保健有限公司', price: 18.5, stock: 80, minStock: 15 },
    { id: 7, code: '8697947005678', name: '布洛芬缓释胶囊', spec: '0.3g×20粒/盒', unit: '盒', manufacturer: '中美史克制药有限公司', price: 25.0, stock: 45, minStock: 10 },
    { id: 8, code: '8697947009012', name: '阿莫西林胶囊', spec: '0.5g×24粒/盒', unit: '盒', manufacturer: '珠海联邦制药股份有限公司', price: 28.0, stock: 60, minStock: 15 }
  ])

  const prescriptions = ref<Prescription[]>([
    {
      id: 1,
      caseNo: '1000014',
      patientName: '张三有',
      department: '呼吸内科',
      doctorName: '张三有',
      createTime: '2024-01-15 10:30:00',
      drugs: [
        { drugId: 1, drugName: '冠心丹参滴丸', spec: '0.04g×180粒/盒', quantity: 2, unit: '盒', price: 12.92 },
        { drugId: 3, drugName: '六味地黄丸', spec: '0.8g×10袋/盒', quantity: 1, unit: '盒', price: 15 }
      ],
      totalAmount: 40.84,
      status: 'dispensed'
    },
    {
      id: 2,
      caseNo: '1000015',
      patientName: '李思华',
      department: '神经内科',
      doctorName: '李思华',
      createTime: '2024-01-15 14:00:00',
      drugs: [
        { drugId: 2, drugName: '荞参益气滴丸', spec: '0.5g×15袋/盒', quantity: 3, unit: '盒', price: 7.83 }
      ],
      totalAmount: 23.49,
      status: 'pending'
    }
  ])

  const lowStockDrugs = computed(() => 
    drugs.value.filter(d => d.stock <= d.minStock)
  )

  const totalDrugCount = computed(() => 
    drugs.value.reduce((sum, d) => sum + d.stock, 0)
  )

  const filteredDrugs = computed(() => (searchKey: string) => {
    if (!searchKey) return drugs.value
    const key = searchKey.toLowerCase()
    return drugs.value.filter(d => 
      d.code.includes(key) || 
      d.name.toLowerCase().includes(key) ||
      d.manufacturer.toLowerCase().includes(key)
    )
  })

  function addDrug(drug: Omit<Drug, 'id'>): Drug {
    const newDrug: Drug = {
      ...drug,
      id: drugs.value.length + 1
    }
    drugs.value.push(newDrug)
    return newDrug
  }

  function updateDrug(id: number, updates: Partial<Drug>): void {
    const index = drugs.value.findIndex(d => d.id === id)
    if (index > -1) {
      drugs.value[index] = { ...drugs.value[index], ...updates }
    }
  }

  function deleteDrug(id: number): void {
    const index = drugs.value.findIndex(d => d.id === id)
    if (index > -1) {
      drugs.value.splice(index, 1)
    }
  }

  function addStock(id: number, quantity: number): void {
    const drug = drugs.value.find(d => d.id === id)
    if (drug) {
      drug.stock += quantity
    }
  }

  function reduceStock(id: number, quantity: number): boolean {
    const drug = drugs.value.find(d => d.id === id)
    if (drug && drug.stock >= quantity) {
      drug.stock -= quantity
      return true
    }
    return false
  }

  function addPrescription(data: Omit<Prescription, 'id'>): Prescription {
    const newPrescription: Prescription = {
      ...data,
      id: prescriptions.value.length + 1
    }
    prescriptions.value.push(newPrescription)
    return newPrescription
  }

  function dispensePrescription(id: number): boolean {
    const prescription = prescriptions.value.find(p => p.id === id)
    if (!prescription || prescription.status !== 'pending') return false

    for (const pd of prescription.drugs) {
      if (!reduceStock(pd.drugId, pd.quantity)) {
        return false
      }
    }
    prescription.status = 'dispensed'
    return true
  }

  function getPrescriptionByCaseNo(caseNo: string): Prescription | undefined {
    return prescriptions.value.find(p => p.caseNo === caseNo)
  }

  return {
    drugs,
    prescriptions,
    lowStockDrugs,
    totalDrugCount,
    filteredDrugs,
    addDrug,
    updateDrug,
    deleteDrug,
    addStock,
    reduceStock,
    addPrescription,
    dispensePrescription,
    getPrescriptionByCaseNo
  }
})