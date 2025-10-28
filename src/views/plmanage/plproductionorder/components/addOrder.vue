<template>
  <CustomDialog
    :visible="dialogVisible"
    title="制定生产订单"
    :close-on-click-modal="false"
    width="95%"
    :is-full-screen="isFullscreen"
    @update:is-full-screen="isFullscreen = $event"
    @update:visible="dialogVisible = $event"
    class="schedule-plan-dialog"
  >

    <!-- 加载转圈动画 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <el-spinner type="line" size="48" />
        <p class="loading-text">正在加载排产数据...</p>
      </div>
    </div>

    <!-- 合同信息 -->
    <el-card v-if="contractInfo" class="contract-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">合同信息</span>
        </div>
      </template>

      <el-descriptions
        :column="3"
        border
        size="small"
        class="contract-descriptions"
      >
        <el-descriptions-item
          v-for="item in contractFields"
          :key="item.field"
          :label="item.label"
          :span="1"
        >
          <el-tooltip
            v-if="contractInfo[item.field]"
            :content="contractInfo[item.field]"
            placement="top"
            effect="dark"
          >
            <span class="readonly-text ellipsis">{{ contractInfo[item.field] }}</span>
          </el-tooltip>
          <span v-else class="readonly-text">—</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- ==================== Tab 栏：排产计划 + 生产订单批次 ==================== -->
    <el-tabs v-model="activeTab" class="plan-tabs" @tab-change="handleTabChange">
      <!-- ---------- 排产计划 ---------- -->
      <el-tab-pane label="排产计划明细" name="plan">
        <el-card class="material-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">
                排产计划明细 ({{ materialList.length }} 项)
              </span>
              <span class="header-button">
                <el-button
                  type="primary"
                  size="small"
                  :disabled="selectedRows.length === 0"
                  @click="openBatchDialog"
                >
                  批量制定生产订单
                </el-button>
              </span>
            </div>
          </template>

          <el-table
            :data="materialList"
            border
            style="width: 100%"
            max-height="700px"
            :row-class-name="tableRowClassName"
            ref="tableRef"
            @selection-change="handleSelectionChange"
          >
            <!-- 单选框列 -->
            <el-table-column
              type="selection"
              width="55"
              align="center"
              :selectable="isRowSelectable"
            />
            <!-- 状态 -->
            <el-table-column label="状态" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)" size="small" effect="dark">
                  {{ getStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>

            <!-- 排产计划编码 -->
            <el-table-column label="排产计划编码" width="160">
              <template #default="{ row }">
                <span :class="{ 'confirmed-text': isConfirmed(row) }">
                  {{ row.scheduleCode || '-' }}
                </span>
              </template>
            </el-table-column>

            <!-- 计划开始 -->
            <el-table-column label="计划开始" width="120">
              <template #default="{ row }">
                <span :class="{ 'confirmed-text': isConfirmed(row) }">
                  {{ row.planStartDate || '-' }}
                </span>
              </template>
            </el-table-column>

            <!-- 计划完成 -->
            <el-table-column label="计划完成" width="120">
              <template #default="{ row }">
                <span :class="{ 'confirmed-text': isConfirmed(row) }">
                  {{ row.planFinishDate || '-' }}
                </span>
              </template>
            </el-table-column>

            <!-- 最晚交付 -->
            <el-table-column label="最晚交付" width="120">
              <template #default="{ row }">
                <span :class="{ 'confirmed-text': isConfirmed(row) }">
                  {{ row.dueDate || '-' }}
                </span>
              </template>
            </el-table-column>

            <!-- 计划工期 -->
            <el-table-column label="计划工期(天)" width="100" align="center">
              <template #default="{ row }">
                {{ row.planPeriod ?? '-' }}
              </template>
            </el-table-column>

            <!-- 物料信息 -->
            <el-table-column prop="itemNo" label="物料编号" show-overflow-tooltip />
            <el-table-column prop="itemName" label="物料名称" show-overflow-tooltip />
            <el-table-column prop="itemSpec" label="规格型号" show-overflow-tooltip />
            <el-table-column prop="itemnum" label="数量" width="80" align="center" />
            <el-table-column label="已分配数量" width="100" align="right">
              <template #default="{ row }">
                <span
                  :class="{
                    'warning-text': row.allocatedAmount < row.itemnum,
                    'normal-text': row.allocatedAmount >= row.itemnum
                  }"
                >
                  {{ row.allocatedAmount || 0 }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="itemunit" label="单位" width="70" align="center" />
            <el-table-column prop="itemweight" label="单重(kg)" width="90" align="right" />
            <el-table-column label="总重(kg)" width="100" align="right">
              <template #default="{ row }">
                {{ row.itemweight && row.itemnum ? (row.itemweight * row.itemnum).toFixed(2) : '-' }}
              </template>
            </el-table-column>

            <!-- 操作 -->
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="{ row }">
                <template v-if="row.status === '20'">
                  <el-button type="primary" size="small" @click="createProductionOrder(row)">
                    编辑生产订单
                  </el-button>
                </template>
                <template v-else>
                  <span class="unready-text">排产计划未制定完成</span>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- ---------- 生产订单批次列表 ---------- -->
      <el-tab-pane label="生产订单批次列表" name="batch">
        <el-card class="material-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">生产订单批次列表</span>
              <div class="filter-actions">
                <el-input
                  v-model="batchFilters.batchNo"
                  placeholder="批次号"
                  clearable
                  style="width: 180px; margin-right: 8px;"
                  @clear="getBatchList"
                  @keyup.enter="getBatchList"
                />
                <el-button type="primary" @click="getBatchList">
                  <el-icon><Search /></el-icon> 查询
                </el-button>
                <el-button @click="resetBatchFilter">
                  <el-icon><Refresh /></el-icon> 重置
                </el-button>
              </div>
            </div>
          </template>

          <el-table
            :data="batchList"
            v-loading="batchLoading"
            border
            style="width: 100%"
            height="560"
          >
            <el-table-column type="index" label="序号" width="80" />
            <el-table-column prop="ipoBatchNo" label="批次号" width="180" show-overflow-tooltip />
            <el-table-column prop="contractNo" label="合同号" width="120" show-overflow-tooltip />
            <el-table-column prop="contractName" label="合同名称" min-width="220" show-overflow-tooltip />
            <el-table-column prop="materialsNames" label="物料名称列表" min-width="180" show-overflow-tooltip />
            <el-table-column label="状态统计" width="220">
              <template #default="{ row }">
                <el-tag type="warning" size="small" class="mr-5">录入中 {{ row.status10Count }}</el-tag>
                <el-tag type="info" size="small" class="mr-5">已确认 {{ row.status20Count }}</el-tag>
                <el-tag type="success" size="small">已完成 {{ row.status30Count }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="writer" label="创建人" width="100" />
            <el-table-column prop="createdTime" label="创建时间" width="160" />
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="{ row }">
                  <el-button type="primary" size="small" @click="editProductionOrder(row.ipoBatchNo)">
                    编辑生产订单
                  </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 批次分页 -->
          <div class="pagination-container">
            <el-pagination
              v-model:current-page="batchFilters.pageNumber"
              v-model:page-size="batchFilters.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next"
              :total="batchTotal"
              @size-change="handleBatchSizeChange"
              @current-change="handleBatchCurrentChange"
            />
          </div>
        </el-card>
      </el-tab-pane>


      <!-- 新增：生产订单总览 -->
      <el-tab-pane label="生产订单总览" name="overview">
        <el-card class="material-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">生产订单总览</span>
            </div>
          </template>

          <!-- 复用 editOrderListByPlan 的表格结构（只读/编辑） -->
          <OrderOverviewTable
            ref="overviewTableRef"
            :data="overviewData"
            :loading="overviewLoading"
            :schedule-plan-info="contractInfo"
            @refresh="loadOverviewData"
          />
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 批量制定生产订单弹窗 -->
    <BatchCreateOrderDialog
      :visible="batchDialogVisible"
      :selected-rows="batchSelectedRows"
      :ipoBatchNo="newCode"
      @update:visible="batchDialogVisible = $event"
      @success="loadPlanItems"
    />

    <!-- 单行编辑弹窗 -->
    <editOrderList
      :visible="editDialogVisible"
      :schedule-code="selectedScheduleCode"
      :ipo-batch-no="selectedBatchNo"
      @update:visible="handleEditDialogClose"
    />

    <!-- 单行编辑弹窗 -->
     <editOrderListByPlan
      :visible="editDialogPlanVisible"
      :schedule-code="selectedScheduleCode"
      @update:visible="handleEditPlanDialogClose"
    />

  </CustomDialog>
</template>

<script setup>
import { ref, reactive, watch, computed, nextTick, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import {
  getPlSchedulePlanItemList
} from '@/api/plmanage/plscheduleplan'
import {
    getListAll,
  getBatchNoList
} from '@/api/plmanage/plproductionorder'
import { getNewNoNyName } from '@/api/system/basno'
import { useUserStore } from '@/store/user'
import CustomDialog from '@/components/common/CustomDialog.vue'
import BatchCreateOrderDialog from './BatchCreateOrderDialog.vue'
import editOrderList from './editOrderList.vue'
import editOrderListByPlan from './editOrderListByPlan.vue'

const userStore = useUserStore()
const emit = defineEmits(['update:visible', 'success'])

const props = defineProps({
  visible: { type: Boolean, default: false },
  contractInfo: { type: Object, default: null },
  newCode: { type: String, default: '' }
})

/* ==================== 基础 ==================== */
const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})
const isFullscreen = ref(true)
const isLoading = ref(false)
/* ==================== 合同信息 ==================== */
/* ==================== 合同字段 ==================== */
const contractFields = [
  { field: 'no', label: '厂内合同号' },
  { field: 'equipno', label: '器材合同号' },
  { field: 'ecpno', label: '国网经法合同号' },
  { field: 'name', label: '工程名称' },
  { field: 'gridno', label: '电网编号' },
  { field: 'pressurestage', label: '电压等级(KV)' },
  { field: 'purchaserHqCode', label: '采购方总部编码' },
  { field: 'supplierCode', label: '供应商编码' },
  { field: 'supplierName', label: '供应商名称' },
  { field: 'salesmanName', label: '销售员' },
  { field: 'customerName', label: '客户' },
  { field: 'agent', label: '客户代理人' },
  { field: 'legalrepresent', label: '法定代表人' },
  { field: 'taxnum', label: '税务号' },
  { field: 'signdate', label: '签订时间' },
  { field: 'telephone', label: '客户电话' },
  { field: 'fax', label: '客户传真' },
  { field: 'receiver', label: '接货人' },
  { field: 'transtype', label: '运输方式' },
  { field: 'picktype', label: '交提货方式' },
  { field: 'destination', label: '接货地点' },
  { field: 'casingcost', label: '包装费承担' },
  { field: 'transcost', label: '运费承担' },
  { field: 'term', label: '所属期间' },
  { field: 'bank', label: '开户银行' },
  { field: 'bankcode', label: '银行账号' },
  { field: 'other', label: '其他条款' },
  { field: 'memo', label: '备注' }
]
/* ==================== Tab 控制 ==================== */
const activeTab = ref('plan') // 默认显示排产计划

/* ==================== 排产计划 ==================== */
const materialList = ref([])
const tableRef = ref(null)
const selectedRows = ref([])
const batchDialogVisible = ref(false)
const batchSelectedRows = ref([])
const editDialogVisible = ref(false)
const editDialogPlanVisible = ref(false)
const selectedScheduleCode = ref('')
const selectedBatchNo = ref('')
/* 判断行是否可选中（仅 status=20） */
const isRowSelectable = (row) => row.status === '20'

const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

/* 批量打开弹窗 */
const openBatchDialog = async () => {
  batchSelectedRows.value = [...selectedRows.value]
  newCode.value = await generateScheduleCode()
  batchDialogVisible.value = true
}


/* 生成批次号 */
const generateScheduleCode = async () => {
  try {
    const res = await getNewNoNyName('scdd-batch')
    if (res?.code === 200) return res.data.fullNoNyName
    ElMessage.error(res?.msg || '获取编码失败')
    return ''
  } catch (error) {
    console.error('生成批次号出错:', error)
    ElMessage.error('请求编码服务时发生错误')
    return ''
  }
}
const newCode = ref('')

/* 状态映射 */
const isConfirmed = (row) => row?.status === '20'
const getStatusText = (status) => {
  if (status == null) return '未录入'
  if (status === '10') return '录入'
  if (status === '20') return '确认'
  return '未知'
}
const getStatusType = (status) => {
  if (status == null) return 'danger'
  if (status === '10') return 'primary'
  if (status === '20') return 'success'
  return 'info'
}
const tableRowClassName = ({ row }) => row?.status !== '20' ? 'editable-row' : ''

watch(dialogVisible, async (val) => {
  if (val) {
    // 每次打开弹窗，重置为排产计划明细
    activeTab.value = 'plan'
    
    if (props.contractInfo?.no) {
      await loadPlanItems()
    }
  } else {
    materialList.value = []
    overviewData.value = []
  }
}, { immediate: true })


/* ==================== 基础字段 ==================== */
const defaultFields = {
  purchaserHqCode: '',
  supplierCode: '1000014491',
  supplierName: '中国电建集团四平线路器材有限公司',
  provCoCode: '',
  provCoName: '',
  categoryCode: '60',
  subclassCode: '60004',
  dataSource: '供应商侧',
  dataSourceCreateTime: new Date().toISOString(),
  ownerId: '',
  openId: '',
  writer: userStore.realName,
  actualPeriod: null,
  remark: ''
}

const loadPlanItems = async () => {
  isLoading.value = true
  try {
    const res = await getPlSchedulePlanItemList({ contractNo: props.contractInfo.no })
    if (res.code === 200 && Array.isArray(res.data?.itemList)) {
      materialList.value = res.data.itemList
        .filter(item => item && item.itemNo)
        .map(item => ({
          ...defaultFields,
          poItemId: item.contractItemId || null,
          itemName: item.itemName || '',
          itemNo: item.itemNo || '',
          itemSpec: item.itemSpec || '',
          itemnum: item.itemnum || 0,
          allocatedAmount: item.allocatedAmount || 0,
          itemunit: item.itemunit || '',
          itemweight: item.itemweight || 0,
          itemgrossweight: item.itemgrossweight || 0,
          itemRealPrice: item.itemRealPrice || 0,
          itemRealSum: item.itemRealSum || 0,
          itemmemo: item.itemmemo || '',
          scheduleCode: item.scheduleCode || '',
          planPeriod: item.planPeriod ? Number(item.planPeriod) : null,
          actualPeriod: item.actualPeriod ? Number(item.actualPeriod) : null,
          dueDate: item.dueDate ? item.dueDate.split(' ')[0] : '',
          planStartDate: item.planStartDate ? item.planStartDate.split(' ')[0] : '',
          planFinishDate: item.planFinishDate ? item.planFinishDate.split(' ')[0] : '',
          actualStartDate: item.actualStartDate ? item.actualStartDate.split(' ')[0] : '',
          actualFinishDate: item.actualFinishDate ? item.actualFinishDate.split(' ')[0] : '',
          remark: item.remark || '',
          id: item.id || null,
          status: item.status ?? null
        }))
    } else {
      materialList.value = []
    }
  } catch (err) {
    console.error(err)
    ElMessage.error('加载排产计划失败')
    materialList.value = []
  } finally {
    isLoading.value = false
  }
}

/* 排产计划单行制定生产订单 */
const createProductionOrder = (schedule) => {
  selectedScheduleCode.value = schedule.scheduleCode
  console.log("选中的排产计划信息:",schedule)
  editDialogPlanVisible.value = true
}

/* 编辑统一批次号的生产订单 */
const editProductionOrder = (ipoBatchNo) => { 
  selectedBatchNo.value = ipoBatchNo
  editDialogVisible.value = true
}
const handleEditDialogClose = (val) => {
  editDialogVisible.value = val
  if (!val) {
    nextTick(() => getBatchList())
  }
}

//处理排产计划关联的生产订单列表关闭
const handleEditPlanDialogClose = (val) => {
  editDialogPlanVisible.value = val
  if (!val) {
    nextTick(() => loadPlanItems())
  }
}


/* ==================== 生产订单总览 ==================== */
import OrderOverviewTable from './OrderOverviewTable.vue'   // 新建的文件，稍后给出

const overviewData = ref([])          // 表格数据
const overviewLoading = ref(false)   // 加载状态
const overviewTableRef = ref(null)   // 子组件实例

// 切换 Tab 时加载概览数据
const handleTabChange = (tabName) => {
  if (tabName === 'batch') {
    getBatchList()
  } else if (tabName === 'overview') {
    loadOverviewData()
  }
}

// 加载概览数据（只传 contractNo）
const loadOverviewData = async () => {
  if (!props.contractInfo?.no) return
  overviewLoading.value = true
  try {
    const res = await getListAll({ contractNo: props.contractInfo.no })
    if (res.code === 200 && Array.isArray(res.data?.page)) {
      overviewData.value = res.data.page.map(item => ({
        ...item,
        // 与 editOrderListByPlan 保持字段一致
        itemNo: item.materialsCode || item.itemNo,
        itemName: item.materialsName || item.itemName,
        itemSpec: item.productModel || item.itemSpec,
        amount: item.amount,
        workshopName: item.workshopName,
        planStartDate: item.planStartDate?.split(' ')[0],
        planFinishDate: item.planFinishDate?.split(' ')[0],
        status: item.status ?? '10',
        _editing: false,
        _isNew: false,
        _saving: false,
        _confirming: false,
        _unconfirming: false,
        _completing: false
      }))
    } else {
      overviewData.value = []
    }
  } catch (e) {
    console.error(e)
    ElMessage.error('加载生产订单总览失败')
  } finally {
    overviewLoading.value = false
  }
}

// “添加” 按钮 → 交给子组件处理（子组件内部会生成 ipoBatchNo）
const handleAddOverviewRow = () => {
  overviewTableRef.value?.handleAddRow()
}




/* ==================== 生产订单批次列表 ==================== */
const batchLoading = ref(false)
const batchList = ref([])
const batchTotal = ref(0)

const batchFilters = reactive({
  pageNumber: 1,
  pageSize: 10,
  batchNo: '',
  contractNo: computed(() => props.contractInfo?.no || '')
})

const getBatchList = async () => {
  batchLoading.value = true
  try {
    const params = {
      pageNumber: batchFilters.pageNumber,
      pageSize: batchFilters.pageSize,
      ipoBatchNo: batchFilters.batchNo || undefined,
      contractNo: batchFilters.contractNo || undefined
    }
    const res = await getBatchNoList(params)
    batchList.value = res.data.page.list
    batchTotal.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取批次列表失败', error)
    ElMessage.error('获取批次列表失败')
  } finally {
    batchLoading.value = false
  }
}

/* 批次分页 */
const handleBatchSizeChange = (size) => {
  batchFilters.pageSize = size
  batchFilters.pageNumber = 1
  getBatchList()
}
const handleBatchCurrentChange = (page) => {
  batchFilters.pageNumber = page
  getBatchList()
}

/* 重置批次搜索 */
const resetBatchFilter = () => {
  batchFilters.batchNo = ''
  batchFilters.pageNumber = 1
  getBatchList()
}



</script>

<style scoped>
/* ---------- 公共 ---------- */
.editable-row .cell { color: #f56c6c !important; }
.confirmed-text { color: #67c23a !important; }
.unready-text { color: #909399; font-size: 13px; }

.contract-card { margin-bottom: 10px; }

.contract-descriptions ::v-deep(.el-descriptions__label) {
  width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
}
.readonly-text { max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ellipsis { cursor: pointer; color: #333; }

.loading-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,.8); display: flex; justify-content: center; align-items: center; z-index: 10; }
.loading-content { display: flex; flex-direction: column; gap: 16px; align-items: center; }
.loading-text { font-size: 14px; color: #666; }

.card-header { display: flex; justify-content: space-between; align-items: center; width: 100%; }
.header-button { display: flex; gap: 8px; }

.warning-text { color: #f56c6c !important; font-weight: 600; }
.normal-text { color: inherit; }

/* ---------- Tab 样式 ---------- */
.plan-tabs {
  margin-top: 12px;
}

/* 批次列表搜索栏 */
.filter-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 分页 */
.pagination-container {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  padding: 0 16px 16px;
}

.mr-5 { margin-right: 5px; }
</style>