import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Patient } from './patient'
import type { Prescription } from './drug'

export interface HospitalState {
  currentPatient: Patient | null
  currentPrescription: Prescription | null
  recentActivity: ActivityLog[]
}

export interface ActivityLog {
  id: number
  type: 'registration' | 'prescription' | 'dispense' | 'queue'
  message: string
  timestamp: string
}

export const useHospitalStore = defineStore('hospital', () => {
  const currentPatient = ref<Patient | null>(null)
  const currentPrescription = ref<Prescription | null>(null)
  const recentActivity = ref<ActivityLog[]>([])

  const activityTypes: Record<string, string> = {
    registration: '挂号',
    prescription: '处方',
    dispense: '发药',
    queue: '叫号'
  }

  function setCurrentPatient(patient: Patient): void {
    currentPatient.value = patient
    addActivity('registration', `选择患者: ${patient.name} (病历号: ${patient.caseNo})`)
  }

  function setCurrentPrescription(prescription: Prescription): void {
    currentPrescription.value = prescription
    addActivity('prescription', `开具处方: ${prescription.patientName}`)
  }

  function addActivity(type: ActivityLog['type'], message: string): void {
    const activity: ActivityLog = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date().toLocaleString('zh-CN')
    }
    recentActivity.value.unshift(activity)
    if (recentActivity.value.length > 20) {
      recentActivity.value.pop()
    }
  }

  function clearCurrentPatient(): void {
    currentPatient.value = null
  }

  function clearCurrentPrescription(): void {
    currentPrescription.value = null
  }

  return {
    currentPatient,
    currentPrescription,
    recentActivity,
    activityTypes,
    setCurrentPatient,
    setCurrentPrescription,
    addActivity,
    clearCurrentPatient,
    clearCurrentPrescription
  }
})