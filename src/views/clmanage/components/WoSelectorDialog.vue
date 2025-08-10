<template>
  <el-dialog
    title="选择生产工单"
    v-model="visible"
    width="80%"
    @closed="handleClose"
  >
    <div class="search-bar">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="searchForm.woNo"
            placeholder="请输入生产工单号"
            @keyup.enter="handleSearch"
          />
        </el-col>
        <el-col :span="8">
          <el-input 
            v-model="searchForm.contractNo"
            placeholder="请输入合同编号"
            @keyup.enter="handleSearch"
          />
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-col>
      </el-row>
    </div>

    <el-table
      :data="woList"
      border
      v-loading="loading"
      style="width: 100%; margin-top: 20px;"
      @row-click="handleRowClick"
      highlight-current-row
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="woNo" label="生产工单号" width="180" />
      <el-table-column prop="contractNo" label="合同编号" width="150" />
      <el-table-column prop="ipoNo" label="生产订单号" width="180"/>
      <el-table-column prop="planStartDate" label="计划开始日期">
        <template #default="{ row }">
          {{ formatDate(row.planStartDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="planFinishDate" label="计划完成日期">
        <template #default="{ row }">
          {{ formatDate(row.planFinishDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="writer" label="录入人"/>
      <el-table-column prop="writetime" label="录入时间"/>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click.stop="selectWo(row)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="queryParams.pageNumber"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getPlshengchangongdanList } from '@/api/plmanage/plshengchangongdan'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue', 'select'])

const visible = ref(false)
watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) getList()
})
watch(visible, (val) => emit('update:modelValue', val))

const searchForm = reactive({
  woNo: '',
  contractNo: ''
})

const queryParams = reactive({
  pageNumber: 1,
  pageSize: 10,
  woNo: '',
  contractNo: ''
})

const woList = ref([])
const total = ref(0)
const loading = ref(false)

function formatDate(date) {
  if (!date) return ''
  const d = new Date(date)
  const pad = (n) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
}

const getList = async () => {
  loading.value = true
  try {
    queryParams.woNo = searchForm.woNo
    queryParams.contractNo = searchForm.contractNo
    const res = await getPlshengchangongdanList(queryParams)
    woList.value = res.data.page.list
    total.value = res.data.page.totalRow
  } catch (e) {
    ElMessage.error('获取生产工单列表失败')
    woList.value = []
  } finally {
    loading.value = false
  }
}
const handleSearch = () => {
  queryParams.pageNumber = 1
  getList()
}
const resetSearch = () => {
  searchForm.woNo = ''
  searchForm.contractNo = ''
  queryParams.pageNumber = 1
  getList()
}
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getList()
}
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getList()
}
const selectWo = (row) => {
  emit('select', row)
  visible.value = false
}
const handleRowClick = (row) => {
  selectWo(row)
}
const handleClose = () => {
  searchForm.woNo = ''
  searchForm.contractNo = ''
  queryParams.pageNumber = 1
}
</script>

<style scoped>
.search-bar {
  margin-bottom: 20px;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
:deep(.el-table__row) {
  cursor: pointer;
}
:deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}
</style>