<template>
  <el-dialog
    title="选择供应商"
    v-model="visible"
    width="60%"
    @closed="handleClose"
  >
    <div class="search-bar">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input
            v-model="searchForm.descr"
            placeholder="请输入供应商名称"
            @keyup.enter="handleSearch"
          />
        </el-col>
        <el-col :span="12">
          <el-input
            v-model="searchForm.no"
            placeholder="请输入供应商编号"
            @keyup.enter="handleSearch"
          />
        </el-col>
        <el-col :span="12">
          <el-input
            v-model="searchForm.contactname"
            placeholder="请输入供应商联系人"
            @keyup.enter="handleSearch"
          />
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 10px;">
        <el-col :span="24">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-col>
      </el-row>
    </div>

    <el-table
      :data="supplierList"
      border
      v-loading="loading"
      style="width: 100%; margin-top: 20px;"
      @row-click="handleRowClick"
      highlight-current-row
    >
      <el-table-column prop="no" label="供应商编号" width="120" />
      <el-table-column prop="descr" label="供应商名称" />
      <el-table-column prop="contactname" label="供应商联系人" />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click.stop="selectSupplier(row)">选择</el-button>
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

const props = defineProps({
  modelValue: Boolean,
})
const emit = defineEmits(['update:modelValue', 'select'])

const visible = ref(false)
watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    getSupplierList()
  }
})
watch(visible, (val) => emit('update:modelValue', val))

const searchForm = reactive({
  descr: '',
  no: '',
  contactname: ''
})

const queryParams = reactive({
  pageNumber: 1,
  pageSize: 10,
  descr: '',
  no: '',
  contactname: '',
  type: 1 // 只要type为1的供应商
})

const supplierList = ref([])
const total = ref(0)
const loading = ref(false)

const getSupplierList = async () => {
  loading.value = true
  try {
    queryParams.descr = searchForm.descr
    queryParams.no = searchForm.no
    queryParams.contactname = searchForm.contactname
    const res = await getBasOrgs(queryParams)
    supplierList.value = res.data.page.list
    total.value = res.data.page.totalRow
  } catch (error) {
    ElMessage.error('获取供应商列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  queryParams.pageNumber = 1
  getSupplierList()
}

const resetSearch = () => {
  searchForm.descr = ''
  searchForm.no = ''
  searchForm.contactname = ''
  queryParams.pageNumber = 1
  getSupplierList()
}

const handleSizeChange = (size) => {
  queryParams.pageSize = size
  queryParams.pageNumber = 1
  getSupplierList()
}
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getSupplierList()
}

const handleRowClick = (row) => {
  selectSupplier(row)
}

const selectSupplier = (supplier) => {
  emit('select', supplier.descr)
  visible.value = false
}

const handleClose = () => {
  searchForm.descr = ''
  searchForm.no = ''
  searchForm.contactname = ''
  queryParams.pageNumber = 1
}
</script>

<style scoped>
.search-bar {
  margin-bottom: 10px;
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