<template>
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    :width="width"
    :before-close="handleClose"
  >
    <slot name="body">
      <el-form :model="formData" :label-width="labelWidth" class="dialog-form">
        <template v-for="(field, key) in fields" :key="key">
          <el-form-item :label="field.label" :prop="key">
            <el-input
              v-if="field.type === 'input'"
              v-model="formData[key]"
              :placeholder="field.placeholder"
              :disabled="field.disabled"
            />
            <el-input
              v-else-if="field.type === 'textarea'"
              v-model="formData[key]"
              type="textarea"
              :placeholder="field.placeholder"
              :rows="field.rows || 3"
            />
            <el-select
              v-else-if="field.type === 'select'"
              v-model="formData[key]"
              :placeholder="field.placeholder"
            >
              <el-option
                v-for="option in field.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
            <el-input-number
              v-else-if="field.type === 'number'"
              v-model="formData[key]"
              :min="field.min"
              :max="field.max"
              :placeholder="field.placeholder"
            />
            <el-date-picker
              v-else-if="field.type === 'date'"
              v-model="formData[key]"
              type="date"
              :placeholder="field.placeholder"
            />
          </el-form-item>
        </template>
      </el-form>
    </slot>
    <template #footer>
      <slot name="footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </slot>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue'

interface FieldOption {
  label: string
  value: string | number
}

interface DialogField {
  label: string
  type: 'input' | 'textarea' | 'select' | 'number' | 'date'
  placeholder?: string
  options?: FieldOption[]
  disabled?: boolean
  min?: number
  max?: number
  rows?: number
}

const props = defineProps<{
  visible: boolean
  title: string
  width?: string
  labelWidth?: string
  fields?: Record<string, DialogField>
  initialData?: Record<string, any>
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  confirm: [form: Record<string, any>]
  cancel: []
}>()

const formData = reactive<Record<string, any>>({})

const dialogVisible = computed({
  get: () => props.visible,
  set: (val: boolean) => emit('update:visible', val)
})

watch(() => props.visible, (val) => {
  if (val) {
    Object.keys(formData).forEach(key => delete formData[key])
    if (props.initialData) {
      Object.assign(formData, props.initialData)
    }
  }
})

function handleClose() {
  emit('update:visible', false)
}

function handleCancel() {
  emit('update:visible', false)
  emit('cancel')
}

function handleConfirm() {
  emit('confirm', { ...formData })
  emit('update:visible', false)
}
</script>

<style scoped>
.dialog-form {
  max-height: 400px;
  overflow-y: auto;
}
</style>