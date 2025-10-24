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

    <!-- 排产计划表格 -->
    <el-card class="material-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">
            排产计划明细 ({{ materialList.length }} 项)
          </span>
          <span class="header-button">
  <!-- 新增：选中未录入 + 选中录入 -->
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
       <el-table-column 
        label="已分配数量" 
        width="100" 
        align="right"
      >
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
              <el-button type="primary" size="small" @click="createProductionOrder(row.scheduleCode)">
                制定生产订单
              </el-button>
            </template>
            <template v-else>
              <span class="unready-text">排产计划未制定完成</span>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <BatchCreateOrderDialog
      :visible="batchDialogVisible"
      :selected-rows="batchSelectedRows"
      :ipoBatchNo="newCode"
      @update:visible="batchDialogVisible = $event"
      @success="loadPlanItems"
    />

    <editOrderList
      :visible="editDialogVisible"
      :schedule-code="selectedScheduleCode"
      @update:visible="handleEditDialogClose"
    />

  </CustomDialog>
</template>

<script setup>
import { ref, reactive, watch, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { getPlSchedulePlanItemList } from '@/api/plmanage/plscheduleplan'
import { useUserStore } from '@/store/user'
import CustomDialog from '@/components/common/CustomDialog.vue'
import BatchCreateOrderDialog from './BatchCreateOrderDialog.vue'
import { getNewNoNyName } from '@/api/system/basno'
import  editOrderList from './editOrderList.vue'




const editDialogVisible = ref(false)
const selectedScheduleCode = ref('')

	// 生成批量添加的批次号
	const generateScheduleCode = async () => {
	  try {
	    const res = await getNewNoNyName('scdd-batch');
	    
	    if (res?.code === 200) {
	      console.log("获取编码成功", res.data.fullNoNyName);
	      return res.data.fullNoNyName;
	    }
	    
	    ElMessage.error(res?.msg || '获取编码失败');
	    return '';
	    
	  } catch (error) {
	    console.error('生成批次号出错:', error);
	    ElMessage.error('请求编码服务时发生错误');
	    return '';
	  }
	};


const newCode = ref('')
const userStore = useUserStore()
const emit = defineEmits(['update:visible', 'success'])

const props = defineProps({
  visible: { type: Boolean, default: false },
  contractInfo: { type: Object, default: null }
})


const handleEditDialogClose = (val) => {
  editDialogVisible.value = val
  if (!val) {
    nextTick(() => {
      loadPlanItems() // 确保 DOM 稳定后再刷新
    })
  }
}


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

/* ==================== 状态 ==================== */
const isFullscreen = ref(true)
const batchDialogVisible = ref(false)
const batchSelectedRows = ref([])
const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})
const materialList = ref([])
const tableRef = ref(null)
const isLoading = ref(false)

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

/* ==================== 数据加载 ==================== */
watch(dialogVisible, async (val) => {
  if (val && props.contractInfo?.no) {
    await loadPlanItems()
  } else {
    materialList.value = []
  }
}, { immediate: true })

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
          allocatedAmount:item.allocatedAmount || 0,
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


/* ==================== 批量选择 ==================== */
const selectedRows = ref([])

/* 判断行是否可被选中：只有 status === '20'（确认）才允许 */
const isRowSelectable = (row, index) => {
  return row.status === '20'
}

const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

/* ==================== 批量制定生产订单 ==================== */
const openBatchDialog = async () => {
  batchSelectedRows.value = [...selectedRows.value] // 深拷贝避免污染原数据
  newCode.value =  await generateScheduleCode()
  batchDialogVisible.value = true
}

/* ==================== 状态相关 ==================== */
const isConfirmed = (row) => row && row.status === '20'

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

const tableRowClassName = ({ row }) => {
  return row && row.status !== '20' ? 'editable-row' : ''
}

/* ==================== 制定生产订单 ==================== */
const createProductionOrder = (scheduleCode) => {
  selectedScheduleCode.value = scheduleCode
  editDialogVisible.value = true
}
</script>

<style scoped>
.editable-row .cell { color: #f56c6c !important; }
.confirmed-text { color: #67c23a !important; }
.unready-text { color: #909399; font-size: 13px; }


.contract-card {
  margin-bottom: 10px;
}

/* 控制 el-descriptions 内的布局 */
.contract-descriptions ::v-deep(.el-descriptions__label) {
  width: 120px; /* 固定 label 宽度，保证一排对齐 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
}

/* 控制内容的显示省略 */
.readonly-text {
  display: inline-block;
  max-width: 220px; /* 控制内容列宽度，可按需求调整 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}

/* 增加细微对齐感 */
.ellipsis {
  cursor: pointer;
  color: #333;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  pointer-events: auto;
}
.loading-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}
.loading-text {
  font-size: 14px;
  color: #666;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.header-button {
  display: flex;
  gap: 8px;
}

/* 可选：视觉上提示不可选行 */
.editable-row .el-checkbox__input.is-disabled {
  opacity: 0.5;
}

.warning-text {
  color: #f56c6c !important;
  font-weight: 600;
}

.normal-text {
  color: inherit;
}

</style>