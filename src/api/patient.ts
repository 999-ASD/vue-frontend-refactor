import request from '../utils/request'

export interface Patient {
  id: number
  caseNo: string
  name: string
  gender: string
  age: number
  idCard: string
  phone: string
  address: string
  createTime: string
}

export const getPatientList = () => request.get('/patients')

export const getPatientById = (id: number) => request.get(`/patients/${id}`)

export const getPatientByCaseNo = (caseNo: string) => request.get(`/patients/case/${caseNo}`)

export const createPatient = (data: Omit<Patient, 'id' | 'createTime'>) => 
  request.post('/patients', data)

export const updatePatient = (id: number, data: Partial<Patient>) => 
  request.put(`/patients/${id}`, data)

export const deletePatient = (id: number) => request.delete(`/patients/${id}`)