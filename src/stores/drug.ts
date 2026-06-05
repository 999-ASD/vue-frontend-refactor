import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Drug, Prescription } from '../api/drug'

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
      patientName: '刘建国',
      doctorName: '张三有',
      items: [
        { drugId: 1, drugName: '冠心丹参滴丸', dose: '每日2次', frequency: '早晚服用', quantity: 2, price: 12.92 },
        { drugId: 3, drugName: '六味地黄丸', dose: '每日1次', frequency: '睡前服用', quantity: 1, price: 15 }
      ],
      total: 40.84,
      status: '已发药',
      createTime: '2024-01-15 10:30:00'
    },
    {
      id: 2,
      caseNo: '1000015',
      patientName: '陈美玲',
      doctorName: '李思华',
      items: [
        { drugId: 2, drugName: '荞参益气滴丸', dose: '每日3次', frequency: '饭后服用', quantity: 3, price: 7.83 }
      ],
      total: 23.49,
      status: '待发药',
      createTime: '2024-01-15 14:00:00'
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
    if (!prescription || prescription.status !== '待发药') return false

    for (const pd of prescription.items) {
      if (!reduceStock(pd.drugId, pd.quantity)) {
        return false
      }
    }
    prescription.status = '已发药'
    return true
  }

  function updatePrescriptionStatus(id: number, status: '待发药' | '已发药'): void {
    const prescription = prescriptions.value.find(p => p.id === id)
    if (prescription) {
      prescription.status = status
    }
  }

  function deletePrescription(id: number): void {
    const index = prescriptions.value.findIndex(p => p.id === id)
    if (index > -1) {
      prescriptions.value.splice(index, 1)
    }
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
    updatePrescriptionStatus,
    deletePrescription,
    getPrescriptionByCaseNo
  }
})