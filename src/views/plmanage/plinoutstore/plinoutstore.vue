<template>
  <div class="plinoutstore-management">
    <div class="action-bar">
      <el-input v-model="queryParams.materialno" placeholder="物料编号" style="width: 180px; margin-right: 10px;" 
               clearable @clear="getPlinoutstoreList" @keyup.enter="getPlinoutstoreList" />
      <el-input v-model="queryParams.materialname" placeholder="物料名称" style="width: 180px; margin-right: 10px;"
               clearable @clear="getPlinoutstoreList" @keyup.enter="getPlinoutstoreList" />
      <el-input v-model="queryParams.orderno" placeholder="单据号" style="width: 180px; margin-right: 10px;"
               clearable @clear="getPlinoutstoreList" @keyup.enter="getPlinoutstoreList" />
      
      <el-select v-model="queryParams.isin" placeholder="出入库类型" style="width: 150px; margin-right: 10px;">
        <el-option label="全部" value="" />
        <el-option label="入库" :value="1" />
        <el-option label="出库" :value="2" />
      </el-select>
      
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        value-format="YYYY-MM-DD"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width: 300px; margin-right: 10px;"
      />
      
      <el-button type="primary" @click="getPlinoutstoreList">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon><Refresh /></el-icon> 刷新
      </el-button>
      
      <el-button type="primary" style="margin-left: auto;" @click="handleAdd">新增记录</el-button>
    </div>
    
    <el-table :data="plinoutstoreList" border v-loading="loading" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="materialno" label="物料编号" width="120" />
      <el-table-column prop="materialname" label="物料名称" width="150" />
      <el-table-column prop="spec" label="规格型号" width="120" />
      <el-table-column prop="unit" label="单位" width="80" />
      <el-table-column prop="quantity" label="数量" width="100" align="right">
        <template #default="{row}">{{ row.quantity.toFixed(2) }}</template>
      </el-table-column>
      <el-table-column prop="price" label="单价" width="100" align="right">
        <template #default="{row}">{{ row.price.toFixed(2) }}</template>
      </el-table-column>
      <el-table-column prop="totalmoney" label="金额" width="120" align="right">
        <template #default="{row}">{{ row.totalmoney.toFixed(2) }}</template>
      </el-table-column>
      <el-table-column prop="orderno" label="单据号" width="150" />
      <el-table-column prop="store" label="仓库" width="120" />
      <el-table-column prop="isin" label="类型" width="80">
        <template #default="{row}">{{ row.isin === 1 ? '入库' : '出库' }}</template>
      </el-table-column>
      <el-table-column prop="receivedate" label="收发日期" width="120" />
      <el-table-column prop="contactno" label="合同号" width="150" />
      <el-table-column prop="projectname" label="工程名称" width="180" show-overflow-tooltip />
      <el-table-column label="操作" width="140" fixed="right">
        <template #default="{row}">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
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
    
    <!-- 编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="900px"
      @closed="resetForm"
    >
      <PlinoutstoreForm
        ref="formRef"
        :form-data="form"
        @submit="submitForm"
        @cancel="dialogVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PlinoutstoreForm from './component/plinoutstoreForm.vue'
import { 
  getPlinoutstoreList, 
  getPlinoutstoreById, 
  createPlinoutstore, 
  updatePlinoutstore, 
  deletePlinoutstore 
} from '@/api/plmanage/plinoutstore'

// 查询参数
const queryParams = reactive({
  materialno: '',
  materialname: '',
  orderno: '',
  isin: '',
  pageNumber: 1,
  pageSize: 10
})

// 日期范围
const dateRange = ref([])

// 出入库记录列表
const plinoutstoreList = ref([])
const total = ref(0)
const loading = ref(false)

// 弹窗表单相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const dialogTitle = computed(() => dialogType.value === 'add' ? '新增出入库记录' : '编辑出入库记录')
const formRef = ref(null)
const form = reactive({
  id: undefined,
  materialno: '',
  materialname: '',
  spec: '',
  unit: '',
  quantity: 0,
  price: 0,
  totalmoney: 0,
  deliverunit: '',
  receiveunit: '',
  store: '',
  handleperson: '',
  receivedate: '',
  orderno: '',
  isin: 1,
  flag: '',
  status: 0,
  type: '',
  memo: '',
  term: '',
  childorderno: '',
  orderstatus: '',
  username: '',
  contactno: '',
  projectname: '',
  lingliaoperson: '',
  leibie: '',
  tuhao: '',
  jianchaunit: '',
  weight: 0,
  fapiao: 0,
  pandian: 0,
  qingling: 0,
  nowprice: 0,
  transportway: '',
  fuzeren: '',
  gouhuounitname: ''
})

// 获取出入库记录列表
const getPlinoutstoreListpage = async () => {
  loading.value = true
  try {
    // 处理日期范围参数
    const params = {
      ...queryParams,
      startDate: dateRange.value?.[0] || '',
      endDate: dateRange.value?.[1] || ''
    }
    
    const res = await getPlinoutstoreList(params)
    plinoutstoreList.value = res.data.page.list
    total.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取出入库记录失败', error)
    ElMessage.error('获取出入库记录失败')
  } finally {
    loading.value = false
  }
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getPlinoutstoreListpage()
}

// 处理当前页变化
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getPlinoutstoreListpage()
}

// 刷新
const handleRefresh = () => {
  queryParams.materialno = ''
  queryParams.materialname = ''
  queryParams.orderno = ''
  queryParams.isin = ''
  dateRange.value = []
  queryParams.pageNumber = 1
  getPlinoutstoreListpage()
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetForm()
  }
  Object.assign(form, {
    id: undefined,
    materialno: '',
    materialname: '',
    spec: '',
    unit: '',
    quantity: 0,
    price: 0,
    totalmoney: 0,
    deliverunit: '',
    receiveunit: '',
    store: '',
    handleperson: '',
    receivedate: '',
    orderno: '',
    isin: 1,
    flag: '',
    status: 0,
    type: '',
    memo: '',
    term: '',
    childorderno: '',
    orderstatus: '',
    username: '',
    contactno: '',
    projectname: '',
    lingliaoperson: '',
    leibie: '',
    tuhao: '',
    jianchaunit: '',
    weight: 0,
    fapiao: 0,
    pandian: 0,
    qingling: 0,
    nowprice: 0,
    transportway: '',
    fuzeren: '',
    gouhuounitname: ''
  })
}

// 新增记录
const handleAdd = () => {
  dialogType.value = 'add'
  form.receivedate = new Date().toISOString().split('T')[0] // 默认当天
  dialogVisible.value = true
}

// 编辑记录
// 定义异步函数 handleEdit，用于处理编辑操作，接收 row 参数（当前行数据）
const handleEdit = async (row) => {
  // 设置对话框类型为 'edit'（编辑模式）
  dialogType.value = 'edit'
  
  try {
    // 异步调用 API 方法 getPlinoutstoreById，传入当前行的 id 获取详情数据
    const res = await getPlinoutstoreById({ id: row.id })
    
    // 将接口返回的数据(res.data.plinoutstore)合并到表单对象 form 中
    Object.assign(form, res.data.plinoutstore)
    
    // 显示对话框
    dialogVisible.value = true
    
  } catch (error) {
    // 捕获并处理错误
    console.error('获取记录详情失败', error)  // 打印错误日志
    ElMessage.error('获取记录详情失败')      // 显示错误提示消息
  }
}

// 删除记录
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除记录"${row.orderno}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deletePlinoutstore({ id: row.id })
      ElMessage.success('删除成功')
      getPlinoutstoreListpage()
    } catch (error) {
      console.error('删除记录失败', error)
      ElMessage.error('删除记录失败')
    }
  }).catch(() => {})
}

// 提交表单
const submitForm = async (formData) => {
  try {
    if (dialogType.value === 'add') {
      await createPlinoutstore(formData)
      ElMessage.success('新增成功')
    } else {
      await updatePlinoutstore(formData)
      ElMessage.success('修改成功')
    }
    dialogVisible.value = false
    getPlinoutstoreListpage()
  } catch (error) {
    console.error('保存记录失败', error)
    ElMessage.error('保存记录失败')
  }
}

// 页面初始化
onMounted(() => {
  getPlinoutstoreListpage()
})
</script>

<style scoped>
.plinoutstore-management {
  padding: 20px;
}
.action-bar {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>