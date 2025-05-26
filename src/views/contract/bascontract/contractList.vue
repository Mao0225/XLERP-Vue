<template>
  <div class="contract-management">
    <div class="action-bar">
      <el-input v-model="queryParams.contractNo" placeholder="请输入合同编号查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getContractListData" @keyup.enter="getContractListData" />
      <el-input v-model="queryParams.projectName" placeholder="请输入合同名称查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getContractListData" @keyup.enter="getContractListData" />
      <el-button type="primary" @click="getContractListData">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon>
          <Refresh />
        </el-icon> 刷新
      </el-button>

      <el-button type="primary" style="margin-left: auto;" @click="handleAdd">新增合同</el-button>
    </div>

    <el-table :data="contractList" border v-loading="loading" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="no" label="合同号" width="120" />
      <el-table-column prop="gridno" label="电网编号" width="120" />
      <el-table-column prop="name" label="工程名称" />
      <el-table-column prop="salesmanName" label="销售员" width="100" />
      <el-table-column prop="customerName" label="客户名称" />
      <el-table-column prop="contractSum" label="合同金额" width="120">
        <template #default="{ row }">
          ¥{{ (row.contractSum?.toFixed(2)) ?? '0.00' }}
        </template>
      </el-table-column>
      <el-table-column prop="signDate" label="签定时间" width="120" />
      <el-table-column prop="term" label="期间" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          <el-button v-if="row.status === 10" type="success" size="small" @click="handleConfirm(row)">
            确认
          </el-button>
          <el-button v-if="row.status === 20" type="warning" size="small" @click="handleUnconfirm(row)">
            反确认
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="showContractForm" :title="isEdit ? '编辑合同' : '新增合同'" width="80%" top="5vh" destroy-on-close
      :before-close="handleBeforeClose">
      <ContractForm v-if="showContractForm" :contractNo="currentContractNo" @close="handleCloseContractForm" />
    </el-dialog>

    <div class="pagination-container">
      <el-pagination v-model:current-page="queryParams.pageNumber" v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getContractList, deleteBasContract, updateBasContractStatus } from '@/api/contract/bascontract.js'
import ContractForm from './ContractForm.vue'
import { useTermStore } from '@/store/term.js'
import { Refresh } from '@element-plus/icons-vue'

const termStore = useTermStore()
const currentTerm = computed(() => termStore.currentTerm)

const queryParams = reactive({
  pageNumber: 1,
  pageSize: 10,
  term: currentTerm.value || '',
  contractNo: '',
  projectName: ''
})

const contractList = ref([])
const total = ref(0)
const loading = ref(false)

const getContractListData = async () => {
  loading.value = true
  try {
    console.log('getContractListData: queryParams', queryParams)
    const res = await getContractList(queryParams)
    contractList.value = res.data.page.list
    total.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取合同列表失败', error)
    ElMessage.error('获取合同列表失败')
  } finally {
    loading.value = false
  }
}

watch(() => termStore.currentTerm, (newTerm) => {
  console.log('watch: currentTerm changed', newTerm)
  queryParams.term = newTerm || ''
  getContractListData()
}, { immediate: true })

const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getContractListData()
}

const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getContractListData()
}

const showContractForm = ref(false)
const currentContractNo = ref('')
const isEdit = ref(false)

const handleAdd = () => {
  isEdit.value = false
  currentContractNo.value = ''
  showContractForm.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  currentContractNo.value = row.no
  showContractForm.value = true
}

const handleCloseContractForm = (success = false) => {
  showContractForm.value = false
  if (success) {
    getContractListData()
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除合同"${row.no}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteBasContract({ contractId: row.id })
      ElMessage.success('删除成功')
      getContractListData()
    } catch (error) {
      console.error('删除合同失败', error)
      ElMessage.error('删除合同失败')
    }
  }).catch(() => { })
}

const handleConfirm = (row) => {
  ElMessageBox.confirm(`确认合同"${row.no}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await updateBasContractStatus({ contractId: row.id, status: 20 })
      ElMessage.success('确认成功')
      getContractListData()
    } catch (error) {
      console.error('确认合同失败', error)
      ElMessage.error('确认合同失败')
    }
  }).catch(() => { })
}

const handleUnconfirm = (row) => {
  ElMessageBox.confirm(`反确认合同"${row.no}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await updateBasContractStatus({ contractId: row.id, status: 10 })
      ElMessage.success('反确认成功')
      getContractListData()
    } catch (error) {
      console.error('反确认合同失败', error)
      ElMessage.error('反确认合同失败')
    }
  }).catch(() => { })
}

const handleRefresh = () => {
  queryParams.contractNo = ''
  queryParams.projectName = ''
  queryParams.pageNumber = 1
  getContractListData()
}

const getStatusType = (status) => {
  const statusMap = {
    10: 'info',
    20: 'success',
    30: 'warning',
    40: 'danger',
    50: 'danger',
    60: 'primary'
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status) => {
  const statusMap = {
    10: '录入',
    20: '确认',
    30: '下计划',
    40: '生产中',
    50: '发货',
    60: '完成'
  }
  return statusMap[status] || '未知'
}

const handleBeforeClose = (done) => {
  ElMessageBox.confirm('确定要关闭吗？未保存的内容可能会丢失', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    getContractListData()
    done()
  }).catch(() => { })
}

onMounted(() => {
  if (!termStore.terms.length) {
    termStore.fetchTerms()
  }
  getContractListData()
})
</script>

<style scoped>
.contract-management {
  padding: 20px;
}

.action-bar {
  display: flex;
  margin-bottom: 20px;
}

.action-bar .el-button+.el-button {
  margin-left: 10px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>