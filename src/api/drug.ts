import request from '../utils/request'

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
  doctorName: string
  items: PrescriptionItem[]
  total: number
  status: '待发药' | '已发药'
  createTime: string
}

export interface PrescriptionItem {
  drugId: number
  drugName: string
  dose: string
  frequency: string
  quantity: number
  price: number
}

export const getDrugList = () => request.get('/drugs')

export const getDrugById = (id: number) => request.get(`/drugs/${id}`)

export const createDrug = (data: Omit<Drug, 'id'>) => request.post('/drugs', data)

export const updateDrug = (id: number, data: Partial<Drug>) => request.put(`/drugs/${id}`, data)

export const deleteDrug = (id: number) => request.delete(`/drugs/${id}`)

export const getPrescriptions = () => request.get('/prescriptions')

export const getPrescriptionById = (id: number) => request.get(`/prescriptions/${id}`)

export const createPrescription = (data: Omit<Prescription, 'id' | 'createTime'>) => 
  request.post('/prescriptions', data)

export const dispensePrescription = (id: number) => request.patch(`/prescriptions/${id}/dispense`)