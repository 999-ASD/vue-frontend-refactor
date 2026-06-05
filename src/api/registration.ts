import request from '../utils/request'

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

export interface Doctor {
  id: number
  name: string
  department: string
  title: string
}

export const getDepartments = () => request.get('/departments')

export const getDoctors = () => request.get('/doctors')

export const getDoctorsByDepartment = (department: string) => 
  request.get(`/doctors?department=${department}`)

export const getRegistrationRecords = () => request.get('/registrations')

export const getRegistrationById = (id: number) => request.get(`/registrations/${id}`)

export const createRegistration = (data: Omit<RegistrationRecord, 'id' | 'status' | 'createTime'>) => 
  request.post('/registrations', data)

export const updateRegistrationStatus = (id: number, status: RegistrationRecord['status']) => 
  request.patch(`/registrations/${id}`, { status })