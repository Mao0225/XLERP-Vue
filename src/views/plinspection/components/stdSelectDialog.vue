<!-- src/views/plinspection/inspStandard/Selector.vue -->
<template>
  <el-dialog
    v-model="visible"
    title="选择检验标准"
    width="1000px"
    :close-on-click-modal="false"
    :destroy-on-close="true"
  >
    <div class="action-bar">
      <el-input
        v-model="query.standardNo"
        placeholder="标准编号"
        style="width: 180px; margin-right: 10px;"
        clearable
        @clear="getList"
        @keyup.enter="getList"
      />
      <el-input
        v-model="query.materials"
        placeholder="适用材料"
        style="width: 180px; margin-right: 10px;"
        clearable
        @clear="getList"
        @keyup.enter="getList"
      />
      <el-button type="primary" @click="getList">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon><Refresh /></el-icon> 刷新
      </el-button>
    </div>

    <el-table
      ref="tableRef"
      :data="list"
      border
      v-loading="loading"
      row-key="id"
      @row-click="handleRowClick"
      highlight-current-row
    >
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="standardNo" label="标准编号" width="160" />
      <el-table-column prop="materials" label="适用材料" width="180" />
      <el-table-column prop="matNo" label="材料牌号" width="140" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="memo" label="备注" show-overflow-tooltip />
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="query.pageNumber"
        v-model:page-size="query.pageSize"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
        :total="total"
        @size-change="getList"
        @current-change="getList"
      />
    </div>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="!currentRow" @click="handleConfirm">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getInspStandardPage, getInspStandardAndItem } from '@/api/plinspection/inspStd'
import { Refresh } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const visible = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})

const query = reactive({
  standardNo: '',
  materials: '',
  pageNumber: 1,
  pageSize: 10
})
const list = ref([])
const total = ref(0)
const loading = ref(false)
const currentRow = ref(null)  // 当前选中的行（单选）
const tableRef = ref(null)

const getList = async () => {
  loading.value = true
  try {
    const res = await getInspStandardPage(query)
    list.value = res.data.page?.list || []
    total.value = res.data.page?.totalRow || 0
    // 重置选择
    currentRow.value = null
    tableRef.value?.setCurrentRow()
  } catch (err) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const handleRefresh = () => {
  query.standardNo = ''
  query.materials = ''
  query.pageNumber = 1
  getList()
}

// 点击行选中
const handleRowClick = (row) => {
  currentRow.value = row
  tableRef.value?.setCurrentRow(row)
}

// 确认选择
const handleConfirm = async () => {
  if (!currentRow.value) {
    ElMessage.warning('请选择一条标准')
    return
  }

  try {
    loading.value = true
    const res = await getInspStandardAndItem({ stdId: currentRow.value.id })
    emit('confirm', res.data.record)
    visible.value = false
  } catch (err) {
    ElMessage.error('获取标准详情失败')
  } finally {
    loading.value = false
  }
}

// 弹窗打开时加载数据
watch(visible, (val) => {
  if (val) {
    getList()
  }
})
</script>

<style scoped>
.action-bar { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 20px; }
.pagination { margin-top: 20px; text-align: right; }

/* 高亮当前行 */
:deep(.el-table__row.current-row > td) {
  background-color: #f5f7fa !important;
}
</style>