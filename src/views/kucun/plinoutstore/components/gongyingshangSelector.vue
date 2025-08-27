<template>
  <el-dialog
    title="选择供应商"
    v-model="visible"
    width="70%"
    @closed="handleClose"
  >
    <div class="search-bar">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="queryParams.descr"
            placeholder="请输入供应商名称查询"
            clearable
            @clear="getBasOrgList"
            @keyup.enter="getBasOrgList"
          />
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="queryParams.no"
            placeholder="请输入供应商编号查询"
            clearable
            @clear="getBasOrgList"
            @keyup.enter="getBasOrgList"
          />
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="getBasOrgList">搜索</el-button>
          <el-button type="warning" @click="handleRefresh">刷新</el-button>
        </el-col>
      </el-row>
    </div>

    <el-table
      :data="basOrgList"
      border
      v-loading="loading"
      style="width: 100%; margin-top: 20px;"
      @row-click="handleRowClick"
    >
      <!-- <el-table-column prop="id" label="ID" /> -->
      <el-table-column prop="no" label="供应商编号" />
      <el-table-column prop="descr" label="供应商名称" />
      <el-table-column prop="contactname" label="联系人" />
      <el-table-column prop="phone" label="联系电话" width="120" />
      <el-table-column prop="email" label="邮箱" width="150" />
      <!-- <el-table-column prop="type" label="供应商类型" width="100">
        <template #default="{ row }">
          {{ getTypeLabel(row.type) }}
        </template>
      </el-table-column> -->
      <el-table-column prop="area" label="所属区域" width="100" />
      <el-table-column prop="city" label="城市" width="80" />
      <!-- <el-table-column prop="status" label="状态" width="80">
        <template #default="{ row }">
          {{ row.status === 0 ? '正常' : '停用' }}
        </template>
      </el-table-column> -->
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="selectSupplier(row)">
            选择
          </el-button>
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
import { getBasOrgs } from '@/api/system/basorg'
import { getBasDepartmentOptions } from '@/api/system/department'
// Supplier type options
const typeLabelOptions = [
  { id: 1, value: '供应商' },
  { id: 2, value: '运输商' },
  { id: 3, value: '客户' },
  { id: 99, value: '其他' }
]

// Get supplier type label
const getTypeLabel = (type) => {
  const item = typeLabelOptions.find(option => option.id === type)
  return item ? item.value : '未知'
}



// Props for dialog visibility and selection callback
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  onSelect: {
    type: Function,
    default: () => {}
  }
})

// Emits for updating dialog visibility and notifying selection
const emit = defineEmits(['update:modelValue', 'select'])

// Control dialog visibility
const visible = ref(false)

// Sync dialog visibility with parent
watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    getBasOrgList()
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

// Query parameters (retained from original)
const queryParams = reactive({
  no: '',
  descr: '',
  type: 1, // Default to supplier type
  pageNumber: 1,
  pageSize: 10
})

// Supplier list and pagination data
const basOrgList = ref([])
const total = ref(0)
const loading = ref(false)

// Fetch supplier list (unchanged from original)
const getBasOrgList = async () => {
  loading.value = true
  try {
    const res = await getBasOrgs(queryParams)
    basOrgList.value = res.data.page.list
    total.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取供应商列表失败', error)
    ElMessage.error('获取供应商列表失败')
  } finally {
    loading.value = false
  }
}

// Handle pagination size change (unchanged from original)
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getBasOrgList()
}

// Handle page change (unchanged from original)
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getBasOrgList()
}

// Handle refresh (adapted from original)
const handleRefresh = () => {
  queryParams.no = ''
  queryParams.descr = ''
  queryParams.pageNumber = 1
  getBasOrgList()
}

// Handle row click to select supplier
const handleRowClick = (row) => {
  selectSupplier(row)
}

// Select supplier and close dialog
const selectSupplier = (supplier) => {
  emit('select', supplier)
  props.onSelect(supplier)
  visible.value = false
}

// Handle dialog close
const handleClose = () => {
  handleRefresh()
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
