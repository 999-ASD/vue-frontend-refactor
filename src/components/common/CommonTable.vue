<template>
  <el-table
    :data="tableData"
    :border="border"
    :stripe="stripe"
    :loading="loading"
    :pagination-props="paginationProps"
    class="common-table"
  >
    <template v-for="column in columns" :key="column.prop">
      <el-table-column
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :align="column.align || 'center'"
        :fixed="column.fixed"
      >
        <template #default="scope">
          <slot :name="`custom-${column.prop}`" :row="scope.row">
            <template v-if="column.type === 'status'">
              <el-tag :type="getStatusType(scope.row[column.prop])">
                {{ scope.row[column.prop] }}
              </el-tag>
            </template>
            <template v-else-if="column.type === 'action'">
              <slot name="actions" :row="scope.row" />
            </template>
            <template v-else>
              {{ scope.row[column.prop] }}
            </template>
          </slot>
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>

<script setup lang="ts">
interface TableColumn {
  prop: string
  label: string
  width?: string | number
  align?: 'left' | 'center' | 'right'
  fixed?: boolean
  type?: 'status' | 'action' | string
}

interface PaginationProps {
  pageSize?: number
  total?: number
}

defineProps<{
  tableData: any[]
  columns: TableColumn[]
  border?: boolean
  stripe?: boolean
  loading?: boolean
  paginationProps?: PaginationProps
}>()

function getStatusType(status: string): string {
  const statusMap: Record<string, string> = {
    '待就诊': 'warning',
    '已就诊': 'success',
    '已退号': 'danger',
    'waiting': 'info',
    'calling': 'warning',
    'called': 'success',
    'skipped': 'danger',
    'pending': 'warning',
    'dispensed': 'success',
    'completed': 'info'
  }
  return statusMap[status] || 'info'
}
</script>

<style scoped>
.common-table {
  width: 100%;
}
</style>