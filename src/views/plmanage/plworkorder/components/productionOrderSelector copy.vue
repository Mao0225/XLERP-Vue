<template>
  <CustomDialog
    :visible="dialogVisible"
                title="选择生产订单"
                width="1300px"
                height="80vh"
                :close-on-click-modal="false"
                :is-full-screen="isFullscreen"
                @update:visible="dialogVisible = $event"
                @update:is-full-screen="isFullscreen = $event"
                @close="handleClose">

    <!-- 搜索区域 -->
    <div class="search-section">
      <el-form :model="filters" inline>
        <el-form-item label="生产订单编号：">
          <el-input v-model="filters.ipoNo" placeholder="请输入生产订单编号" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="合同名称：">
          <el-input v-model="filters.contractName" placeholder="请输入合同名称" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="合同编号：">
          <el-input v-model="filters.contractNo" placeholder="请输入合同编号" clearable style="width: 200px" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon> 搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon> 重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格区域 -->
    <el-table :data="tableData"
              v-loading="loading"
              height="400"
              stripe
              @selection-change="handleSelectionChange">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="ipoNo" label="生产订单号" width="150" show-overflow-tooltip />
      <el-table-column prop="contractNo" label="合同编号" width="140" show-overflow-tooltip />
      <el-table-column prop="contractName" label="合同名称" width="200" show-overflow-tooltip />
      <el-table-column prop="itemName" label="产品名称" width="180" show-overflow-tooltip />
      <el-table-column prop="itemSpec" label="产品型号" width="120" show-overflow-tooltip />
      <el-table-column prop="materialsCode" label="物料编码" width="140" show-overflow-tooltip />
      <el-table-column prop="materialsDesc" label="物料描述" width="200" show-overflow-tooltip />
      <el-table-column prop="materialsUnit" label="物料单位" width="100" align="center" />
      <el-table-column prop="amount" label="订单生产数量" width="130" align="center" />
      <el-table-column prop="allocatedAmount" label="已分配数量" width="120" align="center" />

      <el-table-column label="操作" width="100" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="openAddDialog(row)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->


    <!-- 底部按钮 -->
    <template #footer>

      <div class="dialog-footer">
                  <div class="pagination-container">
      <el-pagination v-model:current-page="pagination.current"
                     v-model:page-size="pagination.size"
                     :page-sizes="[10, 20, 50, 100]"
                     layout="total, sizes, prev, pager, next"
                     :total="pagination.total"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange" />
    </div>
      </div>
    </template>

    <!-- 子弹窗：新增生产订单 -->
    <addOrder :visible="addDialogVisible"
              :newCode="newCode"
              :producOrder="selectedRows"
              @update:visible="addDialogVisible = $event"
              @success="handleAddSuccess" />
  </CustomDialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import { getConfirmOrderList } from '@/api/plmanage/plproductionorder'
import { getNewNoNyName } from '@/api/system/basno'
import addOrder from './addOrder.vue' 

import CustomDialog from '@/components/common/CustomDialog.vue'  

const props = defineProps({
  visible: { type: Boolean, default: false }
})

const emits = defineEmits(['update:visible', 'select','close'])

const dialogVisible = computed({
  get: () => props.visible,
  set: val => emits('update:visible', val)
})

const isFullscreen = ref(false)   // CustomDialog 必需

const loading = ref(false)
const tableData = ref([])
const selectedRows = ref([])

const filters = reactive({
  ipoNo: '',
  contractName: '',
  contractNo: ''
})

const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

const addDialogVisible = ref(false)
const newCode = ref('')

// 获取列表
const fetchData = async () => {
  try {
    loading.value = true
    const params = {
      pageNumber: pagination.current,
      pageSize: pagination.size,
      ipoNo: filters.ipoNo || undefined,
      contractNo: filters.contractNo || undefined,
      contractName: filters.contractName || undefined,
    }

    const res = await getConfirmOrderList(params)

    if (res.code === 200 && res.success) {
      tableData.value = res.data.page.list.map(item => ({
        id: item.id,
        ...item,
        planStartDate: item.planStartDate ? item.planStartDate.split(' ')[0] : '',
        planFinishDate: item.planFinishDate ? item.planFinishDate.split(' ')[0] : '',
      }))
      pagination.total = res.data.page.totalRow
    } else {
      throw new Error(res.msg || '请求失败')
    }
  } catch (err) {
    ElMessage.error(err.message || '加载数据失败')
    tableData.value = []
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  fetchData()
}

// 重置
const handleReset = () => {
  filters.ipoNo = ''
  filters.contractNo = ''
  filters.contractName = ''
  pagination.current = 1
  fetchData()
}

// 分页
const handleSizeChange = val => {
  pagination.size = val
  pagination.current = 1
  fetchData()
}

const handleCurrentChange = val => {
  pagination.current = val
  fetchData()
}

const handleSelectionChange = selection => {
  selectedRows.value = selection
}

// 生成新工单号
const generateNewCode = async () => {
  try {
    const res = await getNewNoNyName('scgd')
    if (res?.code === 200) return res.data.fullNoNyName
    throw new Error(res?.msg || '生成编码失败')
  } catch {
    ElMessage.error('生成工单号失败')
    return ''
  }
}

// 打开新增弹窗
const openAddDialog = async row => {
  newCode.value = await generateNewCode()
  selectedRows.value = row
  addDialogVisible.value = true
}

const handleAddSuccess = () => {
  addDialogVisible.value = false
  ElMessage.success('操作成功')
  fetchData()
}

// 关闭主弹窗
const handleClose = () => {
  dialogVisible.value = false
  selectedRows.value = []
  emits('close')
}

// 弹窗打开时自动加载数据
watch(dialogVisible, newVal => {
  if (newVal) {
    fetchData()
  } else {
    // 重置搜索条件
    Object.assign(filters, { ipoNo: '', contractNo: '', contractName: '' })
    pagination.current = 1
  }
})
</script>

<style scoped>
.search-section {
  margin-bottom: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>