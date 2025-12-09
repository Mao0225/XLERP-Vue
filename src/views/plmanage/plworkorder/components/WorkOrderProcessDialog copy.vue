<template>
  <CustomDialog
    :visible="dialogVisible"
    title="工单生产进度详情"
    width="900px"
    height="70vh"
    :close-on-click-modal="false"
    :is-full-screen="isFullscreen"
    @update:visible="handleVisibleUpdate"
    @update:is-full-screen="isFullscreen = $event"
    @close="handleClose"
  >
    <div class="dialog-content">
      
      <div class="process-section" v-loading="loading" element-loading-text="正在加载工序信息...">
        <div class="section-title">
          <span>工序流程 (点击工序查看详情)</span>
          <!-- 【修改】按钮仅在生产工序(type=1)下显示，或根据需求调整 -->
          <el-button 
            type="primary" 
            class="add-report-btn"
            icon="Plus" 
            @click="openReportDialog"
          >
            新增报工
          </el-button>
        </div>
        
        <div v-if="processList.length > 0" class="process-steps">
          <div
            v-for="(item, index) in processList"
            :key="item.id || index"
            class="process-card"
            :class="{ 'is-active': currentProcessCode === item.processCode }"
            @click="handleProcessClick(item)"
          >
            <div class="p-name">{{ index + 1 }}. {{ item.processName }}</div>
            <div class="p-info">
              <span class="label">编码:</span> {{ item.processCode }}
            </div>
            <!-- 显示类型标签，方便区分 -->
            <div class="p-type" style="font-size: 10px; margin-bottom: 4px;">
              <el-tag v-if="item.processType == '1'" size="mini">生产流程</el-tag>
              <el-tag type="warning" v-if="item.processType == '2'" size="mini">检验流程</el-tag>
              <el-tag type="success" v-if="item.processType == '3'" size="mini">入库流程</el-tag>
            </div>
            <div class="p-stat">
              <span class="label">已完成:</span>
              <div class="qty-group">
                <span class="qty">{{ item.completedQty || 0 }}</span>
                <span class="total">/{{ props.formData.amount }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="!loading" class="empty-text">暂无工序信息</div>
      </div>

      <div class="report-section">
        <div class="section-title">
          <span v-if="currentProcessName" style="color: #409EFF">【{{ currentProcessName }}】</span>
          <span> 记录明细</span>
        </div>

        <el-table 
          v-loading="detailLoading"
          element-loading-text="正在加载记录..."
          :data="reportList" 
          border 
          style="width: 100%; flex: 1;" 
          height="100%"
          :header-cell-style="{ 'background-color': '#f5f7fa', 'color': '#333' }"
        >
          <!-- ================= 生产工序 (Type 1) 列定义 ================= -->
          <template v-if="currentProcessType == 1">
            <el-table-column prop="processName" label="工序名称" width="120" align="center" />
            <el-table-column prop="processCode" label="工序编号" width="100" align="center" />
            <el-table-column prop="amount" label="报工数量" width="100" align="center">
                <template #default="scope">
                <span style="color: #67C23A; font-weight: bold">{{ scope.row.amount }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="writer" label="报工人员" width="120" align="center" />
            <el-table-column prop="workshopName" label="车间" width="120" align="center" />
            <el-table-column prop="createdTime" label="报工时间" min-width="160" align="center" />
          </template>

          <!-- ================= 检验/入库工序 (Type 2 or 3) 列定义 ================= -->
          <template v-else-if="currentProcessType == 2 || currentProcessType == 3">
            <el-table-column prop="orderNo" label="单号" width="140" align="center" show-overflow-tooltip />
            
            <el-table-column prop="status" label="当前状态" width="120" align="center">
                <template #default="scope">
                    <el-tag :type="getStatusInfo(scope.row.status).type" effect="light">
                        {{ getStatusInfo(scope.row.status).label }}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="amount" label="数量" width="100" align="center">
                <template #default="scope">
                <span style="color: #E6A23C; font-weight: bold">{{ scope.row.amount }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="reporter" label="报检人" width="110" align="center" />
            <el-table-column prop="inspector" label="检验员" width="110" align="center">
                 <template #default="scope">{{ scope.row.inspector || '-' }}</template>
            </el-table-column>

                        <el-table-column prop="inspectReviewer" label="检验审核员" width="110" align="center">
                 <template #default="scope">{{ scope.row.inspectReviewer || '-' }}</template>
            </el-table-column>
            <el-table-column prop="inspectFinishTime" label="检验完成时间"  align="center"></el-table-column>
                        <el-table-column prop="stockInPerson" label="入库审核人"  align="center">
                 <template #default="scope">{{ scope.row.inspector || '-' }}</template>
            </el-table-column>
            <el-table-column prop="inStockFinishTime" label="入库时间"  align="center"></el-table-column>

            <el-table-column prop="createTime" label="创建时间" width="160" align="center" />
            <el-table-column label="操作" width="120" align="center"> 
                           <template #default="scope">
              <el-button type="primary" @click="handleDetail(scope.row)">详情</el-button>
            </template>
            </el-table-column>
            <!-- 操作列查看详情按钮 -->

          </template>
          
          <template #empty>
            <div class="empty-tip">该工序暂无相关记录</div>
          </template>
        </el-table>
      </div>

    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleVisibleUpdate(false)">关 闭</el-button>
      </div>
    </template>

    <!-- 报工弹窗 (只在 Type 1 时调用，逻辑保持不变) -->
    <el-dialog
      v-model="reportDialogVisible"
      title="新增工序报工"
      width="550px"
      append-to-body
      :close-on-click-modal="false"
      class="report-custom-dialog"
      @close="resetReportForm"
    >
        <!-- ... 弹窗内容保持不变，省略 ... -->
         <el-form 
        ref="reportFormRef" 
        :model="reportForm" 
        :rules="reportRules" 
        label-width="90px"
        class="styled-form"
      >
        <div class="info-block">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="工单号" style="margin-bottom: 0;">
                <span class="info-text">{{ props.formData.woNo }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="订单号" style="margin-bottom: 0;">
                <span class="info-text">{{ props.formData.ipoNo || '-' }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="form-divider">填写报工信息</div>

        <el-form-item label="选择工序" prop="processCode">
          <el-select 
            v-model="reportForm.processCode" 
            placeholder="请选择工序" 
            style="width: 100%"
            @change="handleReportProcessChange"
          >
            <template #prefix><el-icon><Operation /></el-icon></template>
            <!-- 过滤下拉框，只允许选择生产工序 -->
            <el-option
              v-for="item in processList.filter(p => p.processType == 1)"
              :key="item.processCode"
              :label="item.processName"
              :value="item.processCode"
            >
              <span style="float: left">{{ item.processName }}</span>
              <span style="float: right; color: #8492a6; font-size: 12px">{{ item.processCode }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-row :gutter="20">
            <el-col :span="12">
                <el-form-item label="工序编号">
                    <el-input v-model="reportForm.processCode" disabled placeholder="自动显示">
                        <template #prefix><el-icon><CollectionTag /></el-icon></template>
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="报工数量" prop="amount">
                  <el-input-number 
                    v-model="reportForm.amount" 
                    :min="1" 
                    style="width: 100%" 
                    controls-position="right"
                    placeholder="请输入"
                  />
                </el-form-item>
            </el-col>
        </el-row>

        <el-form-item label="报工人员" prop="writer">
          <el-input v-model="reportForm.writer" placeholder="请输入报工人员姓名">
            <template #prefix><el-icon><User /></el-icon></template>
          </el-input>
        </el-form-item>

        <el-form-item label="生产车间" prop="workshopName">
          <el-input v-model="reportForm.workshopName" placeholder="请输入车间名称">
            <template #prefix><el-icon><House /></el-icon></template>
          </el-input>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="reportDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitReport" :loading="submitLoading">确 定 提 交</el-button>
        </div>
      </template>
    </el-dialog>

        <InspDataReadonly
  v-model="showReadDialog"
  :order-data="currentOrder"
  />

  </CustomDialog>


</template>

<script setup>
import { ref, watch, computed, reactive, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { Operation, CollectionTag, User, House, Plus } from '@element-plus/icons-vue';
import { getPlReportWorkOrderListByWoNo, createPlReportWorkOrder } from '@/api/plmanage/plreportworkorder';
import { getWorkOrderComplete } from '@/api/plmanage/plworkorder'; 
import CustomDialog from '@/components/common/CustomDialog.vue';
import InspDataReadonly from './inspDataFormReadonly.vue'


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
const showReadDialog = ref(false);
const currentOrder = ref(false);

const processList = ref([]);      
const reportList = ref([]);       
const currentProcessCode = ref(null); 
const currentProcessName = ref('');
// 【新增】当前工序类型：1-生产，2-检验/入库
const currentProcessType = ref(1); 

// --- 报工相关 State ---
const reportDialogVisible = ref(false);
const submitLoading = ref(false);
const reportFormRef = ref(null);

const reportForm = reactive({
  processCode: '',
  processName: '',
  amount: undefined,
  writer: '',
  workshopName: ''
});

const reportRules = {
  processCode: [{ required: true, message: '请选择工序', trigger: 'change' }],
  amount: [{ required: true, message: '请输入报工数量', trigger: 'blur' }],
  writer: [{ required: true, message: '请输入报工人员', trigger: 'blur' }],
  workshopName: [{ required: true, message: '请输入车间名称', trigger: 'blur' }]
};

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

// --- 【新增】状态字典映射 ---
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

//---- 打开检验数据弹窗 -- 
const handleDetail = (row) => { 
  showReadDialog.value = true;
  currentOrder.value = row;
};

// --- 【新增】获取状态显示信息 ---
const getStatusInfo = (statusCode) => {
    // 确保 statusCode 是字符串处理，防止数字/字符串不匹配
    const key = String(statusCode);
    return statusMap[key] || { label: '未知状态', type: 'info' };
};

// --- Methods ---
const initData = async () => {
  loading.value = true;
  processList.value = [];
  try {
    const res = await getWorkOrderComplete({ woNo: props.formData.woNo, itemId: props.formData.itemId });
    if (res.code === 200 && res.data && res.data.list) {
      processList.value = res.data.list;
      // 默认选中第一个
      if (!currentProcessCode.value && processList.value.length > 0) {
        handleProcessClick(processList.value[0]);
      } else if (currentProcessCode.value) {
        // 如果有缓存的选中项，刷新时保持选中
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
  // 【新增】保存当前的工序类型
  currentProcessType.value = item.processType;
  
  detailLoading.value = true;
  reportList.value = []; 
  try {
    // 后端接口：根据 processType 不同，返回的 orderList 结构不同
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
  currentProcessType.value = 1; // 重置
};

const handleVisibleUpdate = (val) => {
  emit('update:visible', val);
  if (!val) emit('close');
};

const handleClose = () => {
  handleVisibleUpdate(false);
};

// --- 报工逻辑 (仅针对 Type 1) ---
const openReportDialog = () => {
  if (currentProcessType.value != 1) {
    ElMessage.warning('当前工序类型不支持手动报工');
    return;
  }
  reportDialogVisible.value = true;
  if (currentProcessCode.value) {
    nextTick(() => {
        reportForm.processCode = currentProcessCode.value;
        handleReportProcessChange(currentProcessCode.value);
    });
  }
};

const handleReportProcessChange = (val) => {
  const selectedProcess = processList.value.find(item => item.processCode === val);
  reportForm.processName = selectedProcess ? selectedProcess.processName : '';
};

const resetReportForm = () => {
  if (reportFormRef.value) reportFormRef.value.resetFields();
  reportForm.processName = '';
  reportForm.amount = undefined;
};

const submitReport = async () => {
  if (!reportFormRef.value) return;
  
  await reportFormRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true;
      try {
        const params = {
          woNo: props.formData.woNo,
          ipoNo: props.formData.ipoNo, 
          itemId: props.formData.itemId,
          processCode: reportForm.processCode,
          processName: reportForm.processName,
          amount: reportForm.amount,
          writer: reportForm.writer,
          workshopName: reportForm.workshopName
        };

        const res = await createPlReportWorkOrder(params);
        if (res.code === 200) {
          ElMessage.success('报工成功');
          reportDialogVisible.value = false;
          // 重新加载数据
          const currentItem = processList.value.find(p => p.processCode === currentProcessCode.value);
          if (currentItem) {
              handleProcessClick(currentItem);
              // 可能还需要刷新上面的总进度，这里简单起见只刷新列表
          } else {
              initData();
          }
        } else {
          ElMessage.error(res.msg || '报工失败');
        }
      } catch (error) {
        console.error(error);
        ElMessage.error('系统异常，请稍后重试');
      } finally {
        submitLoading.value = false;
      }
    }
  });
};
</script>

<style scoped lang="scss">
/* ... 保留原有样式 ... */
.dialog-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin: 15px 0 10px 0;
  border-left: 4px solid #409EFF;
  padding-left: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between; 
}

.add-report-btn {
  margin-left: auto;
  background: linear-gradient(135deg, #409EFF 0%, #36a3f7 100%);
  border: none;
  font-weight: bold;
  letter-spacing: 1px;
  padding: 8px 18px;
  box-shadow: 0 4px 10px rgba(64, 158, 255, 0.3);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(64, 158, 255, 0.4);
    background: linear-gradient(135deg, #66b1ff 0%, #5cb6ff 100%);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 5px rgba(64, 158, 255, 0.3);
  }
}

.process-section {
  min-height: 120px;
  margin-bottom: 10px;
}

.process-steps {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.process-card {
  width: 150px;
  background: #fdfdfd;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
    border-color: #c6e2ff;
  }

  &.is-active {
    background: #ecf5ff;
    border-color: #409EFF;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);

    &::after {
      content: '';
      position: absolute;
      bottom: -10px; 
      left: 50%;
      transform: translateX(-50%);
      border-width: 10px 10px 0;
      border-style: solid;
      border-color: #409EFF transparent transparent;
      z-index: 10;
    }
  }

  .p-name {
    font-weight: bold;
    color: #303133;
    margin-bottom: 4px; /* 微调 */
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .p-info {
    font-size: 12px;
    color: #909399;
    margin-bottom: 4px;
  }

  .p-stat {
    font-size: 12px;
    color: #606266;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 0;
  
    .qty-group {
      display: flex;
      align-items: baseline; 
      gap: 2px;
    }
  
    .qty {
      color: #67C23A; 
      font-weight: bold;
      font-size: 16px;
    }
  
    .total {
      color: #606266;
      font-size: 12px;
    }
    
    .label {
      flex-shrink: 0;
    }
  }
}

.empty-text {
  color: #909399;
  font-size: 14px;
  text-align: center;
  padding: 20px;
}

.report-section {
  flex: 1; 
  display: flex;
  flex-direction: column;
  min-height: 0; 
  padding-bottom: 10px;
}

.empty-tip {
  text-align: center;
  padding: 30px 0;
  color: #999;
}

.info-block {
  background-color: #f5f7fa;
  border-radius: 4px;
  padding: 10px 15px;
  margin-bottom: 15px;
  border-left: 3px solid #67C23A; 
  
  .info-text {
    font-weight: bold;
    color: #303133;
    font-size: 14px;
  }
}

.form-divider {
  font-size: 13px;
  color: #909399;
  margin: 15px 0;
  display: flex;
  align-items: center;
  
  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e4e7ed;
  }
  &::before { margin-right: 10px; }
  &::after { margin-left: 10px; }
}
</style>