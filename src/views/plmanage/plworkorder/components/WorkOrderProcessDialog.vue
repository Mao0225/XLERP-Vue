<template>
  <CustomDialog
    :visible="dialogVisible"
    title="工单生产进度详情"
    width="950px" 
    height="75vh"
    :close-on-click-modal="false"
    :is-full-screen="isFullscreen"
    @update:visible="handleVisibleUpdate"
    @update:is-full-screen="isFullscreen = $event"
    @close="handleClose"
  >
    <div class="dialog-content">
      
      <div class="process-section" v-loading="loading" element-loading-text="正在加载工序信息...">
        
        <div class="section-header">
          <div class="header-left">
            <span class="title-bar"></span>
            <span class="title-text">工序流程</span>
            <span class="sub-text">点击下方卡片查看详情，选中后可执行操作</span>
          </div>
          
          <div class="header-actions">
            <transition name="fade" mode="out-in">
              <el-button 
                v-if="currentProcessType == 1"
                type="primary" 
                class="action-btn btn-production"
                icon="Plus" 
                round
                @click="openReportDialog"
              >
                新增生产报工
              </el-button>
              
              <el-button 
                 v-else-if="currentProcessType == 2"
                 type="warning" 
                 class="action-btn btn-inspection"
                 icon="Tickets" 
                 round
                 @click="openInspDialog"
               >
                 发起质量报检
               </el-button>
             </transition>
          </div>
        </div>
        
        <div v-if="processList.length > 0" class="process-steps">
          <div
            v-for="(item, index) in processList"
            :key="item.id || index"
            class="process-card"
            :class="{ 
              'is-active': currentProcessCode === item.processCode,
              'status-prod': item.processType == '1',
              'status-insp': item.processType == '2'
            }"
            @click="handleProcessClick(item)"
          >
            <div class="step-badge">{{ index + 1 }}</div>
            
            <div class="p-name">{{ item.processName }}</div>
            <div class="p-type-tag">
              <span v-if="item.processType == '1'" class="mini-tag tag-blue">生产</span>
              <span v-if="item.processType == '2'" class="mini-tag tag-orange">检验</span>
              <span v-if="item.processType == '3'" class="mini-tag tag-green">入库</span>
            </div>
            
            <div class="p-progress">
              <el-progress 
                :percentage="Math.min((item.completedQty / (props.formData.amount || 1)) * 100, 100)" 
                :show-text="false"
                :color="item.processType == '2' ? '#E6A23C' : '#409EFF'"
                :stroke-width="4"
              />
              <div class="p-stat-text">
                <span :class="{'text-blue': item.processType == '1', 'text-orange': item.processType == '2'}">
                  {{ item.completedQty || 0 }}
                </span>
                <span class="text-gray">/{{ props.formData.amount }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="!loading" class="empty-text">暂无工序信息</div>
      </div>

      <div class="report-section">
        <div class="section-header small-header">
           <div class="header-left">
             <span class="title-bar bar-gray"></span>
             <span class="title-text">
               <span v-if="currentProcessName" class="highlight-text">【{{ currentProcessName }}】</span>
               记录明细
             </span>
           </div>
        </div>

        <el-table 
          v-loading="detailLoading"
          element-loading-text="正在加载记录..."
          :data="reportList" 
          border 
          style="width: 100%; flex: 1;" 
          height="100%"
          :header-cell-style="{ 'background-color': '#f5f7fa', 'color': '#606266', 'font-weight': 'bold' }"
          highlight-current-row
        >
          <template v-if="currentProcessType == 1">
            <el-table-column prop="processName" label="工序名称" width="120" align="center" />
            <el-table-column prop="processCode" label="工序编号" width="100" align="center" />
            <el-table-column prop="amount" label="报工数量" width="100" align="center">
                <template #default="scope">
                <span style="color: #409EFF; font-weight: bold; font-size: 15px;">{{ scope.row.amount }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="writer" label="报工人员" width="120" align="center" />
            <el-table-column prop="workshopName" label="车间" width="120" align="center" />
            <el-table-column prop="createdTime" label="报工时间" min-width="160" align="center" />
          </template>

          <template v-else-if="currentProcessType == 2 || currentProcessType == 3">
            <el-table-column prop="orderNo" label="单号" width="200" align="center" show-overflow-tooltip />
            <el-table-column prop="status" label="当前状态" width="120" align="center">
                <template #default="scope">
                    <el-tag :type="getStatusInfo(scope.row.status).type" effect="dark" size="small" style="border-radius: 12px;">
                        {{ getStatusInfo(scope.row.status).label }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="amount" label="数量" width="100" align="center">
                <template #default="scope">
                <span style="color: #E6A23C; font-weight: bold; font-size: 15px;">{{ scope.row.amount }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="reporter" label="报检人" width="110" align="center" />
            <el-table-column prop="inspector" label="检验员" width="110" align="center">
                 <template #default="scope">{{ scope.row.inspector || '-' }}</template>
            </el-table-column>
            <el-table-column prop="inspectReviewer" label="检验审核人" width="110" align="center">
                 <template #default="scope">{{ scope.row.inspectReviewer || '-' }}</template>
            </el-table-column>
                        <el-table-column prop="stockInPerson" label="库保员" width="110" align="center">
                 <template #default="scope">{{ scope.row.stockInPerson || '-' }}</template>
            </el-table-column>
                        <el-table-column prop="reportApplyTime" label="报检时间" width="160" align="center" />

            <el-table-column prop="inspectFinishTime" label="检验完成时间"  align="center" width="160"></el-table-column>
            <el-table-column prop="inStockFinishTime" label="入库完成时间"  align="center" width="160"></el-table-column>

            <el-table-column label="操作" width="100" align="center" fixed="right"> 
               <template #default="scope">
                  <el-button link type="primary" @click="handleDetail(scope.row)">详情</el-button>
               </template>
            </el-table-column>
          </template>
          
          <template #empty>
            <el-empty description="该工序暂无相关记录" :image-size="100"></el-empty>
          </template>
        </el-table>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleVisibleUpdate(false)">关 闭</el-button>
      </div>
    </template>
    
    <ReportWorkDialog v-model="reportDialogVisible" :form-data="currentOrder" :process-list="processList" :default-process-code="currentProcessCode" @success="handleReportSuccess" />
    <ReportInspectionDialog v-model="inspDialogVisible" :form-data="currentOrder" @success="handleReportSuccess" :new-code = "newCode" />
    <InspDataReadonly v-model="showReadDialog" :order-data="currentOrder" />

  </CustomDialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { getPlReportWorkOrderListByWoNo } from '@/api/plmanage/plreportworkorder';
import { getWorkOrderComplete } from '@/api/plmanage/plworkorder'; 
import CustomDialog from '@/components/common/CustomDialog.vue';
import { Plus, Tickets } from '@element-plus/icons-vue';

// 引入拆分出去的组件
import ReportWorkDialog from './ReportWorkDialog.vue';
import ReportInspectionDialog from './ReportInspectionDialog.vue';
import InspDataReadonly from './inspDataFormReadonly.vue';
import { getNewNoNyName } from '@/api/system/basno'
	

const newCode = ref('');
	// 生成报工单编码
	const generateScheduleCode = async () => {
	  try {
	    const res = await getNewNoNyName('woInsp');
	    
	    if (res?.code === 200) {
	      console.log("获取编码成功", res.data.fullNoNyName);
	      return res.data.fullNoNyName;
	    }
	    
	    ElMessage.error(res?.msg || '获取编码失败');
	    return '';
	    
	  } catch (error) {
	    console.error('生成报检单号编码出错:', error);
	    ElMessage.error('请求编码服务时发生错误');
	    return '';
	  }
	};


// --- Props & Emits ---
const props = defineProps({
  visible: { type: Boolean, default: false },
  formData: { type: Object, required: true, default: () => ({}) },
});

const emit = defineEmits(['update:visible', 'close']);

// --- State ---
const isFullscreen = ref(false);
const loading = ref(false);       
const detailLoading = ref(false); 
const processList = ref([]);      
const reportList = ref([]);       
const currentProcessCode = ref(null); 
const currentProcessName = ref('');
const currentProcessType = ref(1); 

// 弹窗状态
const reportDialogVisible = ref(false);
const inspDialogVisible = ref(false);
const showReadDialog = ref(false);
const currentOrder = ref({});

// --- Computed & Watchers ---
const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => handleVisibleUpdate(val)
});

watch(() => props.visible, (val) => {
  if (val) {
    if (props.formData) {
      initData();
    } else {
      ElMessage.warning('缺少工单号或物料ID');
    }
  } else {
    setTimeout(() => clearData(), 300);
  }
});

// --- Methods ---
const statusMap = {
    '0':  { label: '草稿', type: 'info' },
    '10': { label: '发起报检', type: 'primary' },
    '20': { label: '检验中', type: 'warning' },
    '21': { label: '检验完成', type: 'success' },
    '22': { label: '检验合格', type: 'success' },
    '23': { label: '检验不合格', type: 'danger' },
    '30': { label: '入库中', type: 'warning' },
    '31': { label: '入库完成', type: 'success' }
};

const getStatusInfo = (statusCode) => {
    const key = String(statusCode);
    return statusMap[key] || { label: '未知状态', type: 'info' };
};

const initData = async () => {
  loading.value = true;
  processList.value = [];
  try {
    const res = await getWorkOrderComplete({ woNo: props.formData.woNo, itemId: props.formData.itemId });
    if (res.code === 200 && res.data && res.data.list) {
      processList.value = res.data.list;
      if (!currentProcessCode.value && processList.value.length > 0) {
        handleProcessClick(processList.value[0]);
      } else if (currentProcessCode.value) {
        const currentItem = processList.value.find(p => p.processCode === currentProcessCode.value);
        if (currentItem) handleProcessClick(currentItem);
        else if (processList.value.length > 0) handleProcessClick(processList.value[0]);
      }
    } else {
      ElMessage.warning(res.msg || '未查询到工序信息');
    }
  } catch (error) {
    console.error(error);
    ElMessage.error('获取工序进度失败');
  } finally {
    loading.value = false;
  }
};

const handleProcessClick = async (item) => {
  currentProcessCode.value = item.processCode;
  currentProcessName.value = item.processName;
  currentProcessType.value = item.processType;
  
  detailLoading.value = true;
  reportList.value = []; 
  try {
    const res = await getPlReportWorkOrderListByWoNo({
      woNo: props.formData.woNo,
      processCode: item.processCode,
      processType: item.processType
    });
    if (res.code === 200 && res.data && res.data.orderList) {
      reportList.value = res.data.orderList;
    }
  } catch (error) {
    console.error(error);
    ElMessage.error('获取记录失败');
  } finally {
    detailLoading.value = false;
  }
};

const clearData = () => {
  processList.value = [];
  reportList.value = [];
  currentProcessCode.value = null;
  currentProcessName.value = '';
  currentProcessType.value = 1; 
};

const handleVisibleUpdate = (val) => {
  emit('update:visible', val);
  if (!val) emit('close');
};

const handleClose = () => {
  handleVisibleUpdate(false);
};

const handleDetail = (row) => { 
  showReadDialog.value = true;
  currentOrder.value = row;
};

// --- 操作弹窗逻辑 ---
const openReportDialog = () => {
  if (currentProcessType.value != 1) {
    ElMessage.warning('当前工序类型不支持手动报工');
    return;
  }
  reportDialogVisible.value = true;
};

const openInspDialog = async () => {
    currentOrder.value = props.formData;
    console.log('currentOrder', currentOrder.value);
    newCode.value = await generateScheduleCode();
  inspDialogVisible.value = true;
};

// 子组件提交成功后的回调
const handleReportSuccess = () => {
  // 刷新当前选中的工序详情
  const currentItem = processList.value.find(p => p.processCode === currentProcessCode.value);
  if (currentItem) {
      handleProcessClick(currentItem);
      // 可选：如果报工影响了总进度，可能需要重新initData刷新左侧数字
      // initData(); 
  } else {
      initData();
  }
};
</script>
<style scoped lang="scss">
.dialog-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 15px;
  background-color: #fbfbfb; /* 给整个内容区一个极淡的背景，突显卡片 */
}

/* ================= 头部布局与按钮样式 ================= */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0 15px 0;
  padding-bottom: 5px;
  
  &.small-header {
    margin: 10px 0;
  }

  .header-left {
    display: flex;
    align-items: center;
    
    .title-bar {
      width: 4px;
      height: 18px;
      background: #409EFF;
      border-radius: 2px;
      margin-right: 8px;
      &.bar-gray { background: #909399; }
    }
    
    .title-text {
      font-size: 16px;
      font-weight: 700;
      color: #303133;
      
      .highlight-text {
        color: #409EFF;
      }
    }
    
    .sub-text {
      font-size: 12px;
      color: #909399;
      margin-left: 10px;
      font-weight: normal;
    }
  }

  .header-actions {
    min-width: 140px; /* 预留宽度防止抖动 */
    display: flex;
    justify-content: flex-end;
  }
}

/* 核心按钮样式优化 */
.action-btn {
  font-weight: 600;
  letter-spacing: 1px;
  border: none;
  padding: 10px 24px;
  height: auto;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;

  /* 生产按钮：蓝色渐变 */
  &.btn-production {
    background: linear-gradient(135deg, #409EFF 0%, #0078d4 100%);
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.35);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(64, 158, 255, 0.5);
      background: linear-gradient(135deg, #66b1ff 0%, #208ee6 100%);
    }
  }

  /* 检验按钮：橙色渐变 */
  &.btn-inspection {
    background: linear-gradient(135deg, #FF9900 0%, #ff6f00 100%);
    box-shadow: 0 4px 12px rgba(255, 153, 0, 0.35);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(255, 153, 0, 0.5);
      background: linear-gradient(135deg, #ffad33 0%, #ff8800 100%);
    }
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  }
}

/* ================= 工序卡片样式 ================= */
.process-section {
  min-height: 130px;
  margin-bottom: 15px;
}

.process-steps {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  padding: 2px; /* 防止阴影被切 */
}

.process-card {
  width: 160px;
  background: #fff;
  border: 1px solid #EBEEF5;
  border-radius: 8px;
  padding: 12px 14px;
  cursor: pointer;
  position: relative;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    border-color: #b3d8ff;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    transform: translateY(-3px);
  }

  /* 选中状态 */
  &.is-active {
    background: #f0f9eb; /* 默认极浅的底色 */
    border-color: #409EFF;
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.25);
    
    &.status-prod { background: #ecf5ff; } /* 生产选中蓝底 */
    &.status-insp { background: #fdf6ec; border-color: #E6A23C; } /* 检验选中橙底 */

    /* 选中时下方的小三角指示器 */
    &::after {
      content: '';
      position: absolute;
      bottom: -8px; 
      left: 50%;
      transform: translateX(-50%);
      border-width: 8px 8px 0;
      border-style: solid;
      border-color: inherit; /* 跟随边框颜色 */
      border-left-color: transparent;
      border-right-color: transparent;
    }
  }

  .step-badge {
    position: absolute;
    top: -6px;
    right: -6px;
    background: #909399;
    color: #fff;
    font-size: 10px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  &.is-active .step-badge {
    background: #409EFF; /* 选中变蓝 */
  }
  &.is-active.status-insp .step-badge {
    background: #E6A23C; /* 检验变橙 */
  }

  .p-name {
    font-weight: 700;
    color: #303133;
    font-size: 14px;
    margin-bottom: 8px;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; /* 最多显示两行 */
    overflow: hidden;
  }

  .p-type-tag {
    margin-bottom: 8px;
    .mini-tag {
      font-size: 10px;
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 500;
      
      &.tag-blue { background: #ecf5ff; color: #409EFF; border: 1px solid #d9ecff; }
      &.tag-orange { background: #fdf6ec; color: #E6A23C; border: 1px solid #faecd8; }
      &.tag-green { background: #f0f9eb; color: #67C23A; border: 1px solid #e1f3d8; }
    }
  }

  .p-progress {
    margin-top: auto; /* 推到底部 */
    .p-stat-text {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 12px;
      margin-top: 4px;
      
      .text-blue { color: #409EFF; font-weight: bold; font-size: 14px; }
      .text-orange { color: #E6A23C; font-weight: bold; font-size: 14px; }
      .text-gray { color: #909399; transform: scale(0.9); transform-origin: right bottom;}
    }
  }
}

.report-section {
  flex: 1; 
  display: flex;
  flex-direction: column;
  min-height: 0; 
  padding-bottom: 10px;
  background: #fff;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05); /* 表格区域加个淡淡的阴影 */
}

.empty-text {
  color: #909399;
  font-size: 14px;
  text-align: center;
  padding: 30px;
  background: #fff;
  border-radius: 6px;
  border: 1px dashed #dcdfe6;
}

/* Vue Transition 动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>