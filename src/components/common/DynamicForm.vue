<template>
  <el-form :model="formData" :label-width="labelWidth" class="dynamic-form">
    <template v-for="(field, key) in fields" :key="key">
      <el-form-item :label="field.label" :prop="key">
        <component 
          :is="getFieldComponent(field.type)" 
          v-model="formData[key]"
          v-bind="getFieldProps(field)"
        />
      </el-form-item>
    </template>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { ElInput, ElSelect, ElInputNumber, ElDatePicker } from 'element-plus'

interface FieldOption {
  label: string
  value: string | number
}

interface BaseField {
  label: string
  type: FormFieldType
  placeholder?: string
  disabled?: boolean
}

interface InputField extends BaseField {
  type: 'input'
}

interface TextareaField extends BaseField {
  type: 'textarea'
  rows?: number
}

interface SelectField extends BaseField {
  type: 'select'
  options: FieldOption[]
}

interface NumberField extends BaseField {
  type: 'number'
  min?: number
  max?: number
  step?: number
}

interface DateField extends BaseField {
  type: 'date'
}

type FormField = InputField | TextareaField | SelectField | NumberField | DateField
type FormFieldType = FormField['type']

const props = defineProps<{
  fields: Record<string, FormField>
  labelWidth?: string
  modelValue?: Record<string, any>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
}>()

const formData = reactive<Record<string, any>>({})

const fieldComponents: Record<FormFieldType, any> = {
  input: ElInput,
  textarea: ElInput,
  select: ElSelect,
  number: ElInputNumber,
  date: ElDatePicker
}

function getFieldComponent(type: FormFieldType) {
  return fieldComponents[type] || ElInput
}

function getFieldProps(field: FormField) {
  const baseProps: Record<string, any> = {
    placeholder: field.placeholder,
    disabled: field.disabled
  }
  
  if (field.type === 'textarea') {
    baseProps.rows = field.rows || 3
  }
  
  if (field.type === 'select' && field.options) {
    baseProps.options = field.options
  }
  
  if (field.type === 'number') {
    baseProps.min = (field as NumberField).min
    baseProps.max = (field as NumberField).max
    baseProps.step = (field as NumberField).step || 1
  }
  
  if (field.type === 'date') {
    baseProps.type = 'date'
  }
  
  return baseProps
}

watch(() => props.modelValue, (data) => {
  if (data) {
    Object.assign(formData, data)
  }
}, { immediate: true, deep: true })

watch(formData, (newData) => {
  emit('update:modelValue', { ...newData })
}, { deep: true })
</script>

<style scoped>
.dynamic-form {
  max-height: 400px;
  overflow-y: auto;
}
</style>