<template>
  <el-form :inline="true" :model="searchForm" class="search-form">
    <template v-for="(field, key) in fields" :key="key">
      <el-form-item :label="field.label">
        <el-input
          v-if="field.type === 'input'"
          v-model="searchForm[key]"
          :placeholder="field.placeholder"
          @keyup.enter="handleSearch"
        />
        <el-select
          v-else-if="field.type === 'select'"
          v-model="searchForm[key]"
          :placeholder="field.placeholder"
        >
          <el-option
            v-for="option in field.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <el-date-picker
          v-else-if="field.type === 'date'"
          v-model="searchForm[key]"
          type="date"
          :placeholder="field.placeholder"
        />
      </el-form-item>
    </template>
    <el-form-item>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

interface FieldOption {
  label: string
  value: string | number
}

interface SearchField {
  label: string
  type: 'input' | 'select' | 'date'
  placeholder?: string
  options?: FieldOption[]
}

defineProps<{
  fields: Record<string, SearchField>
}>()

const emit = defineEmits<{
  search: [form: Record<string, any>]
}>()

const searchForm = reactive<Record<string, any>>({})

function handleSearch() {
  emit('search', { ...searchForm })
}

function handleReset() {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
  emit('search', {})
}
</script>

<style scoped>
.search-form {
  margin-bottom: 20px;
}
</style>