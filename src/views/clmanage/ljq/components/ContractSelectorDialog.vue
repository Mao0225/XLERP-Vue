<template>
  <el-dialog
    title="选择合同编号"
    v-model="visible"
    width="80%"
    @closed="handleClose"
  >
    <div class="search-bar">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="searchForm.contractNo"
            placeholder="请输入合同编号"
            @keyup.enter="handleSearch"
          />
        </el-col>
        <el-col :span="8">
          <el-input
            v-model="searchForm.woNo"
            placeholder="请输入生产工单号"
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
      :data="contractList"
      border
      v-loading="loading"
      style="width: 100%; margin-top: 20px;"
      @row-click="handleRowClick"
      highlight-current-row
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="contractNo" label="合同编号" width="180" />
      <el-table-column prop="woNo" label="生产工单号" width="180" />
      <el-table-column prop="ipoNo" label="生产订单号" width="180"/>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click.stop="selectContract(row)">选择</el-button>
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
  contractNo: '',
  woNo: '',
  ipoNo: ''
})

const queryParams = reactive({
  pageNumber: 1,
  pageSize: 10,
  contractNo: '',
  woNo: '',
  ipoNo: ''
})

const contractList = ref([])
const total = ref(0)
const loading = ref(false)

const getList = async () => {
  loading.value = true
  try {
    queryParams.contractNo = searchForm.contractNo
    queryParams.woNo = searchForm.woNo
    queryParams.ipoNo = searchForm.ipoNo
    const res = await getPlshengchangongdanList(queryParams)
    contractList.value = res.data.page.list
    total.value = res.data.page.totalRow
  } catch (e) {
    ElMessage.error('获取合同列表失败')
    contractList.value = []
  } finally {
    loading.value = false
  }
}
const handleSearch = () => {
  queryParams.pageNumber = 1
  getList()
}
const resetSearch = () => {
  searchForm.contractNo = ''
  searchForm.woNo = ''
  searchForm.ipoNo = ''
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
const selectContract = (row) => {
  emit('select', row)
  visible.value = false
}
const handleRowClick = (row) => {
  selectContract(row)
}
const handleClose = () => {
  searchForm.contractNo = ''
  searchForm.woNo = ''
  queryParams.pageNumber = 1
}
</script>

<style scoped>
/* 与 WoSelectorDialog 相同的样式 */
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