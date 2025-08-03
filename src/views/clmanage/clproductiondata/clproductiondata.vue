<template>
  <div class="clproductiondata-management">
    <div class="action-bar">
      <el-input v-model="queryParams.productname" placeholder="请输入产品名称" style="width: 180px; margin-right: 10px;" clearable @clear="getClProductionDataList" @keyup.enter="getClProductionDataList" />
      <el-input v-model="queryParams.productmodel" placeholder="请输入产品型号" style="width: 180px; margin-right: 10px;" clearable @clear="getClProductionDataList" @keyup.enter="getClProductionDataList" />
      <el-button type="primary" @click="getClProductionDataList">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon>
          <Refresh />
        </el-icon> 刷新
      </el-button>
      <el-button type="primary" style="margin-left: auto;" @click="handleAdd">新增生产数据</el-button>
    </div>

    <el-table :data="clProductionDataList" border v-loading="loading" style="width: 100%">
      <el-table-column label="序号" width="80">
        <template #default="scope">
          {{ (queryParams.pageNumber - 1) * queryParams.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="productname" label="产品名称" />
      <el-table-column prop="productmodel" label="产品型号" />
      <el-table-column prop="productionbatch" label="生产批号" />
      <el-table-column prop="processingmethod" label="加工方式" />
      <el-table-column prop="processingquantity" label="加工件数" />
      <el-table-column prop="productioncompletiontime" label="生产完成时间" />
      <el-table-column prop="schedulingplanno" label="排产计划编号" />
      <el-table-column prop="contractNo" label="销售合同编号" />
      <el-table-column prop="woNo" label="生产工单编号" />
      <el-table-column prop="ipoNo" label="生产订单编号" />
      <el-table-column prop="writer" label="记录人" />
      <el-table-column prop="writeTime" label="记录时间" />
      <el-table-column prop="isdelete" label="是否删除" />
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="flag" label="标志" />
      <el-table-column prop="type" label="类型" />
      <el-table-column prop="memo" label="备注" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
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

    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="800px"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="产品名称" prop="productname">
              <el-select v-model="form.productname" placeholder="请选择产品名称">
                <el-option v-for="item in productOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="产品型号" prop="productmodel">
              <el-input v-model="form.productmodel" placeholder="请输入产品型号" />
            </el-form-item>
            <el-form-item label="生产批号" prop="productionbatch">
              <el-input v-model="form.productionbatch" placeholder="请输入生产批号" />
            </el-form-item>
            <el-form-item label="加工方式" prop="processingmethod">
              <el-select v-model="form.processingmethod" placeholder="请选择加工方式">
                <el-option label="悬垂线夹" value="悬垂线夹" />
                <el-option label="间隔棒" value="间隔棒" />
              </el-select>
            </el-form-item>
            <el-form-item label="加工件数" prop="processingquantity">
              <el-row :gutter="5" style="display: flex; align-items: center;">
                <el-col :span="20">
                  <el-input v-model.number="form.processingquantity" placeholder="请输入加工件数" type="number" />
                </el-col>
                <el-col :span="4" style="line-height: 40px;">
                  PCS
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="生产完成时间" prop="productioncompletiontime">
              <el-date-picker
                v-model="form.productioncompletiontime"
                placeholder="请选择生产完成时间"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="datetime"
              />
            </el-form-item>
            <el-form-item label="排产计划编号" prop="schedulingplanno">
              <el-input v-model="form.schedulingplanno" placeholder="请输入排产计划编号" />
              <el-button type="primary" size="small" @click="openSchedulingPlanSelect">选择</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="销售合同编号" prop="contractNo">
              <el-input v-model="form.contractNo" placeholder="请输入销售合同编号" readonly />
              <el-button type="primary" size="small" @click="openContractSelect">选择</el-button>
            </el-form-item>
            <el-form-item label="生产工单编号" prop="woNo">
              <el-input v-model="form.woNo" placeholder="请输入生产工单编号" readonly />
              <el-button type="primary" size="small" @click="openWorkOrderSelect">选择</el-button>
            </el-form-item>
            <el-form-item label="生产订单编号" prop="ipoNo">
              <el-input v-model="form.ipoNo" placeholder="请输入生产订单编号" readonly />
              <el-button type="primary" size="small" @click="openProductionOrderSelect">选择</el-button>
            </el-form-item>
            <el-form-item label="记录人" prop="writer">
              <el-input v-model="form.writer" placeholder="请输入记录人" />
            </el-form-item>
            <el-form-item label="记录时间" prop="writeTime">
              <el-date-picker
                v-model="form.writeTime"
                placeholder="请选择记录时间"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="datetime"
              />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择状态">
                <el-option label="正常" value="正常" />
                <el-option label="异常" value="异常" />
              </el-select>
            </el-form-item>
            <el-form-item label="标志" prop="flag">
              <el-input v-model="form.flag" placeholder="请输入标志" />
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-input v-model="form.type" placeholder="请输入类型" />
            </el-form-item>
            <el-form-item label="备注" prop="memo">
              <el-input v-model="form.memo" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 销售合同选择弹窗 -->
    <el-dialog
      title="选择销售合同"
      v-model="contractDialogVisible"
      width="800px"
    >
      <el-input 
        v-model="contractQuery.contractNo" 
        placeholder="请输入合同编号查询" 
        style="width: 200px; margin-bottom: 10px;"
        clearable 
        @clear="getContractListData" 
        @keyup.enter="getContractListData" 
      />
      <el-input 
        v-model="contractQuery.projectName" 
        placeholder="请输入工程名称查询" 
        style="width: 200px; margin-bottom: 10px;"
        clearable 
        @clear="getContractListData" 
        @keyup.enter="getContractListData" 
      />
      <el-table :data="contractList" border v-loading="contractLoading" style="width: 100%">
        <el-table-column prop="no" label="厂内合同号" width="120" />
        <el-table-column prop="gridno" label="电网编号" width="120" />
        <el-table-column prop="ecpno" label="国网经法合同号" width="120" />
        <el-table-column prop="equipno" label="器材合同号" width="120" />
        <el-table-column prop="name" label="工程名称" />
        <el-table-column prop="customerName" label="客户名称" />
        <el-table-column prop="signDate" label="签定时间" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="selectContract(row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container" style="margin-top: 10px;">
        <el-pagination
          v-model:current-page="contractQuery.pageNumber"
          v-model:page-size="contractQuery.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="contractTotal"
          @size-change="handleContractSizeChange"
          @current-change="handleContractCurrentChange"
        />
      </div>
      <template #footer>
        <el-button @click="contractDialogVisible = false">取消</el-button>
      </template>
    </el-dialog>

    <!-- 生产订单选择弹窗 -->
    <el-dialog
      title="选择生产订单"
      v-model="productionOrderDialogVisible"
      width="800px"
    >
      <el-input 
        v-model="productionOrderQuery.ipoNo" 
        placeholder="请输入生产订单号查询" 
        style="width: 200px; margin-bottom: 10px;"
        clearable 
        @clear="getProductionOrderList" 
        @keyup.enter="getProductionOrderList" 
      />
      <el-table :data="productionOrderList" border v-loading="productionOrderLoading" style="width: 100%">
        <el-table-column prop="ipoNo" label="生产订单号" />
        <el-table-column prop="contractNo" label="合同编号" />
        <el-table-column prop="contractName" label="合同名称" />
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
        <el-table-column prop="ipoStatus" label="订单状态">
          <template #default="{ row }">
            {{ getStatusLabel(row.ipoStatus) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="selectProductionOrder(row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container" style="margin-top: 10px;">
        <el-pagination
          v-model:current-page="productionOrderQuery.pageNumber"
          v-model:page-size="productionOrderQuery.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="productionOrderTotal"
          @size-change="handleProductionOrderSizeChange"
          @current-change="handleProductionOrderCurrentChange"
        />
      </div>
      <template #footer>
        <el-button @click="productionOrderDialogVisible = false">取消</el-button>
      </template>
    </el-dialog>

    <!-- 生产工单选择弹窗 -->
    <el-dialog
      title="选择生产工单"
      v-model="workOrderDialogVisible"
      width="800px"
    >
      <el-input 
        v-model="workOrderQuery.woNo" 
        placeholder="请输入生产工单编号查询" 
        style="width: 200px; margin-bottom: 10px;"
        clearable 
        @clear="getWorkOrderList" 
        @keyup.enter="getWorkOrderList" 
      />
      <el-table :data="workOrderList" border v-loading="workOrderLoading" style="width: 100%">
        <el-table-column prop="woNo" label="工单编号" />
        <el-table-column prop="productName" label="产品名称" />
        <el-table-column prop="orderDate" label="工单日期" />
        <el-table-column prop="ipoNo" label="关联生产订单号" />
        <el-table-column prop="workOrderStatus" label="工单状态">
          <template #default="{ row }">
            {{ getWorkOrderStatusLabel(row.workOrderStatus) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="selectWorkOrder(row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container" style="margin-top: 10px;">
        <el-pagination
          v-model:current-page="workOrderQuery.pageNumber"
          v-model:page-size="workOrderQuery.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="workOrderTotal"
          @size-change="handleWorkOrderSizeChange"
          @current-change="handleWorkOrderCurrentChange"
        />
      </div>
      <template #footer>
        <el-button @click="workOrderDialogVisible = false">取消</el-button>
      </template>
    </el-dialog>

    <!-- 排产计划选择弹窗 -->
    <el-dialog
      title="选择排产计划"
      v-model="schedulingPlanDialogVisible"
      width="600px"
    >
      <el-table :data="schedulingPlanList" border style="width: 100%">
        <el-table-column prop="schedulingplanno" label="排产计划编号" />
        <el-table-column prop="productName" label="产品名称" />
        <el-table-column prop="planDate" label="计划日期" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="selectSchedulingPlan(row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="schedulingPlanDialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import { getClProductionDataIds, getClProductionDataIdById, createClProductionData, updateClProductionData, deleteClProductionData } from '@/api/clmanage/clproductiondata'
// 引入生产订单和生产工单相关API
import { getPlshengchandingdanList } from '@/api/plmanage/plshengchandingdan'
import { getPlshengchangongdanList } from '@/api/plmanage/plshengchangongdan'
// 引入合同相关API
import { getContractList } from '@/api/contract/bascontract.js'
import { useTermStore } from '@/store/term.js'

const termStore = useTermStore()
const currentTerm = computed(() => termStore.currentTerm)

const queryParams = reactive({
  productname: '',
  productmodel: '',
  pageNumber: 1,
  pageSize: 10
})

const clProductionDataList = ref([])
const total = ref(0)
const loading = ref(false)

const dialogVisible = ref(false)
const dialogType = ref('add')
const dialogTitle = computed(() => dialogType.value === 'add' ? '新增生产数据' : '编辑生产数据')
const formRef = ref(null)
const form = reactive({
  id: undefined,
  productname: '',
  productmodel: '',
  productionbatch: '',
  processingmethod: '',
  processingquantity: null,
  productioncompletiontime: '',
  schedulingplanno: '',
  contractNo: '',
  woNo: '',
  ipoNo: '',
  writer: '',
  writeTime: '',
  isdelete: 0,
  status: '',
  flag: '',
  type: '',
  memo: ''
})

const productOptions = [
  '悬垂线夹',
  '耐张线夹（压缩型）',
  '耐张线夹（预绞式）',
  '防振锤',
  '间隔棒',
  '均压环和屏蔽环',
  '连接金具（绝缘子串金具）',
  '接续金具（压缩型）',
  '接续金具（预绞式）',
  '接续金具（并沟线夹和设备线夹）'
]

const rules = {
  productname: [
    { required: true, message: '请选择产品名称', trigger: 'change' },
  ],
  productmodel: [
    { required: true, message: '请输入产品型号', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  productionbatch: [
    { required: true, message: '请输入生产批号', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  processingmethod: [
    { required: true, message: '请选择加工方式', trigger: 'change' },
  ],
  processingquantity: [
    { required: true, type: 'number', message: '请输入有效的加工件数', trigger: ['blur', 'change'] }
  ],
  productioncompletiontime: [
    { required: true, message: '请选择生产完成时间', trigger: 'change' }
  ],
  schedulingplanno: [
    { required: true, message: '请输入排产计划编号', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  contractNo: [
    { required: true, message: '请选择销售合同编号', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  woNo: [
    { required: true, message: '请选择生产工单编号', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  ipoNo: [
    { required: true, message: '请选择生产订单编号', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  writer: [
    { required: true, message: '请输入记录人', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur'}
  ],
  writeTime: [
    { required: true, message: '请选择记录时间', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' },
  ],
  flag: [
    { required: true, message: '请输入标志', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请输入类型', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  memo: [
    { max: 100, message: '长度不能超过100个字符', trigger: 'blur' }
  ]
}

// 合同选择弹窗相关
const contractDialogVisible = ref(false)
const contractList = ref([])
const contractTotal = ref(0)
const contractLoading = ref(false)
const contractQuery = reactive({
  pageNumber: 1,
  pageSize: 10,
  term: currentTerm.value || '',
  contractNo: '',
  projectName: ''
})

// 生产订单选择弹窗相关
const productionOrderDialogVisible = ref(false)
const productionOrderList = ref([])
const productionOrderTotal = ref(0)
const productionOrderLoading = ref(false)
const productionOrderQuery = reactive({
  ipoNo: '',
  pageNumber: 1,
  pageSize: 10
})

// 订单状态选项
const statusOptions = [
  { id: 1, value: '待处理' },
  { id: 2, value: '处理中' },
  { id: 3, value: '已完成' },
  { id: 4, value: '已取消' },
  { id: 5, value: '已过期' }
]

// 生产工单选择弹窗相关
const workOrderDialogVisible = ref(false)
const workOrderList = ref([])
const workOrderTotal = ref(0)
const workOrderLoading = ref(false)
const workOrderQuery = reactive({
  woNo: '',
  pageNumber: 1,
  pageSize: 10
})

// 排产计划选择弹窗相关
const schedulingPlanDialogVisible = ref(false)
const schedulingPlanList = ref([])

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
}

// 获取状态标签
const getStatusLabel = (status) => {
  const item = statusOptions.find(option => option.id === status)
  return item ? item.value : '未知状态'
}

// 获取工单状态标签
const getWorkOrderStatusLabel = (status) => {
  const item = statusOptions.find(option => option.id === status)
  return item ? item.value : '未知状态'
}

// 合同状态相关方法
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

// 打开销售合同选择弹窗
const openContractSelect = async () => {
  // 确保期数数据已加载
  if (!termStore.terms.length) {
    await termStore.fetchTerms()
  }
  // 重置查询参数
  contractQuery.contractNo = ''
  contractQuery.projectName = ''
  contractQuery.pageNumber = 1
  contractQuery.term = currentTerm.value || ''
  // 获取合同列表数据
  await getContractListData()
  contractDialogVisible.value = true
}

// 获取销售合同列表数据
const getContractListData = async () => {
  contractLoading.value = true
  try {
    const res = await getContractList(contractQuery)
    contractList.value = res.data.page.list
    contractTotal.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取合同列表失败', error)
    ElMessage.error('获取合同列表失败')
  } finally {
    contractLoading.value = false
  }
}

// 处理合同分页大小变化
const handleContractSizeChange = (size) => {
  contractQuery.pageSize = size
  getContractListData()
}

// 处理合同当前页变化
const handleContractCurrentChange = (page) => {
  contractQuery.pageNumber = page
  getContractListData()
}

// 选择销售合同
const selectContract = (row) => {
  form.contractNo = row.no
  contractDialogVisible.value = false
}

// 获取生产订单列表
const getProductionOrderList = async () => {
  productionOrderLoading.value = true
  try {
    const res = await getPlshengchandingdanList(productionOrderQuery)
    productionOrderList.value = res.data.page.list
    productionOrderTotal.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取生产订单列表失败', error)
    ElMessage.error('获取生产订单列表失败')
  } finally {
    productionOrderLoading.value = false
  }
}

// 处理生产订单分页大小变化
const handleProductionOrderSizeChange = (size) => {
  productionOrderQuery.pageSize = size
  getProductionOrderList()
}

// 处理生产订单当前页变化
const handleProductionOrderCurrentChange = (page) => {
  productionOrderQuery.pageNumber = page
  getProductionOrderList()
}

// 打开生产订单选择弹窗
const openProductionOrderSelect = async () => {
  // 重置查询参数
  productionOrderQuery.ipoNo = ''
  productionOrderQuery.pageNumber = 1
  // 获取生产订单列表数据
  await getProductionOrderList()
  productionOrderDialogVisible.value = true
}

// 选择生产订单
const selectProductionOrder = (row) => {
  form.ipoNo = row.ipoNo
  // 自动填充相关字段
  form.contractNo = row.contractNo || form.contractNo
  productionOrderDialogVisible.value = false
}

// 获取生产工单列表
const getWorkOrderList = async () => {
  workOrderLoading.value = true
  try {
    // 调用生产工单API获取真实数据
    const res = await getPlshengchangongdanList(workOrderQuery)
    workOrderList.value = res.data.page.list
    workOrderTotal.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取生产工单列表失败', error)
    ElMessage.error('获取生产工单列表失败')
  } finally {
    workOrderLoading.value = false
  }
}

// 处理生产工单分页大小变化
const handleWorkOrderSizeChange = (size) => {
  workOrderQuery.pageSize = size
  getWorkOrderList()
}

// 处理生产工单当前页变化
const handleWorkOrderCurrentChange = (page) => {
  workOrderQuery.pageNumber = page
  getWorkOrderList()
}

// 打开生产工单选择弹窗
const openWorkOrderSelect = async () => {
  // 重置查询参数
  workOrderQuery.woNo = ''
  workOrderQuery.pageNumber = 1
  // 获取生产工单列表数据
  await getWorkOrderList()
  workOrderDialogVisible.value = true
}

// 选择生产工单
const selectWorkOrder = (row) => {
  form.woNo = row.woNo
  // 自动填充相关字段
  if (row.ipoNo) form.ipoNo = row.ipoNo
  if (row.productName) form.productname = row.productName
  workOrderDialogVisible.value = false
}

// 打开排产计划选择弹窗
const openSchedulingPlanSelect = async () => {
  try {
    // 模拟数据，实际项目中替换为接口请求
    schedulingPlanList.value = [
      { schedulingplanno: 'SCH2023001', productName: '悬垂线夹', planDate: '2023-01-25' },
      { schedulingplanno: 'SCH2023002', productName: '间隔棒', planDate: '2023-03-02' },
      { schedulingplanno: 'SCH2023003', productName: '防振锤', planDate: '2023-03-20' }
    ]
    schedulingPlanDialogVisible.value = true
  } catch (error) {
    console.error('获取排产计划列表失败', error)
    ElMessage.error('获取排产计划列表失败')
  }
}

// 选择排产计划
const selectSchedulingPlan = (row) => {
  form.schedulingplanno = row.schedulingplanno
  schedulingPlanDialogVisible.value = false
}

// 获取列表数据
const getClProductionDataList = async () => {
  loading.value = true
  try {
    const res = await getClProductionDataIds(queryParams)
    clProductionDataList.value = res.data.page.list
    total.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取生产数据列表失败', error)
    if (error.response) {
      ElMessage.error(`获取生产数据列表失败: ${error.response.status} ${error.response.statusText}`)
    } else {
      ElMessage.error('获取生产数据列表失败: 网络连接异常')
    }
  } finally {
    loading.value = false
  }
}

// 分页处理
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getClProductionDataList()
}
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getClProductionDataList()
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  Object.assign(form, {
    id: undefined,
    productname: '',
    productmodel: '',
    productionbatch: '',
    processingmethod: '',
    processingquantity: null,
    productioncompletiontime: '',
    schedulingplanno: '',
    contractNo: '',
    woNo: '',
    ipoNo: '',
    writer: '',
    writeTime: '',
    isdelete: 0,
    status: '',
    flag: '',
    type: '',
    memo: ''
  })
}

// 刷新
const handleRefresh = () => {
  Object.assign(queryParams, {
    productname: '',
    productmodel: '',
    pageNumber: 1
  })
  getClProductionDataList()
}

// 新增
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
}

// 编辑
const handleEdit = async (row) => {
  dialogType.value = 'edit'
  try {
    const res = await getClProductionDataIdById({ id: row.id })
    Object.assign(form, res.data.clProductionData)
    dialogVisible.value = true
  } catch (error) {
    console.error('获取生产数据详情失败', error)
    ElMessage.error('获取生产数据详情失败')
  }
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除生产数据 "${row.productname}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteClProductionData({ id: row.id })
      ElMessage.success('删除成功')
      getClProductionDataList()
    } catch (error) {
      console.error('删除失败', error)
      if (error.response) {
        ElMessage.error(`删除失败: ${error.response.status} ${error.response.statusText}`)
      } else {
        ElMessage.error('删除失败: 网络连接异常')
      }
    }
  }).catch(() => {})
}

// 提交表单
const submitForm = () => {
  if (!formRef.value) return
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (dialogType.value === 'add') {
          form.isdelete = 0
          await createClProductionData(form)
          ElMessage.success('新增成功')
          handleRefresh()
        } else {
          await updateClProductionData(form)
          ElMessage.success('修改成功')
          getClProductionDataList()
        }
        dialogVisible.value = false
      } catch (error) {
        console.error('保存失败', error)
        if (error.response) {
          ElMessage.error(`保存失败: ${error.response.status} ${error.response.statusText}`)
        } else if (error.message.includes('CORS')) {
          ElMessage.error('跨域请求被阻止，请确保后端已配置CORS')
        } else {
          ElMessage.error('保存失败: 网络连接异常')
        }
      }
    }
  })
}

// 页面初始化
onMounted(() => {
  getClProductionDataList()
  // 加载期数数据
  if (!termStore.terms.length) {
    termStore.fetchTerms()
  }
})
</script>

<style scoped>
.clproductiondata-management {
  padding: 20px;
}
.action-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>