import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Patient } from '../api/patient'
import type { Prescription } from '../api/drug'

export const useHospitalStore = defineStore('hospital', () => {
  const currentPatient = ref<Patient | null>(null)
  const currentPrescription = ref<Prescription | null>(null)

  function setCurrentPatient(patient: Patient): void {
    currentPatient.value = patient
  }

  function setCurrentPrescription(prescription: Prescription): void {
    currentPrescription.value = prescription
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
    setCurrentPatient,
    setCurrentPrescription,
    clearCurrentPatient,
    clearCurrentPrescription
  }
})