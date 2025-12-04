<template>
  <CustomDialog 
    :visible="dialogVisible" 
    title="根据合同制定通知" 
    :is-full-screen="isFullscreen" 
    :header-height="60" width="90%"
    @update:visible="dialogVisible = $event"
    @update:is-full-screen="isFullscreen = $event">
    <div class="dialog-body">
      <!-- 合同基本信息（保持不变） -->
      <el-card shadow="never" class="section-card">
        <template #header>
          <div class="section-header">
            <span class="title">合同基本信息</span>
          </div>
        </template>
        <!-- ...原有描述列表代码保持不变... -->
        <el-descriptions :column="4" border size="small" class="info-desc">
          <el-descriptions-item label="厂内合同号"><strong>{{ form.no || '-' }}</strong></el-descriptions-item>
          <el-descriptions-item label="器材合同号">{{ form.equipno || '-' }}</el-descriptions-item>
          <el-descriptions-item label="国网经法合同号">{{ form.ecpno || '-' }}</el-descriptions-item>
          <el-descriptions-item label="工程名称">{{ form.name || '-' }}</el-descriptions-item>
          <el-descriptions-item label="电网编号">{{ form.gridno || '-' }}</el-descriptions-item>
          <el-descriptions-item label="电压等级(KV)">{{ form.pressurestage || 0 }}</el-descriptions-item>
          <el-descriptions-item label="所属期间">{{ form.term || '-' }}</el-descriptions-item>
          <el-descriptions-item label="签订时间">{{ form.signdate || '-' }}</el-descriptions-item>
          <el-descriptions-item label="采购方总部编码">{{ form.purchaserHqCode || '-' }}</el-descriptions-item>
          <el-descriptions-item label="供应商编码">{{ form.supplierCode || '-' }}</el-descriptions-item>
          <el-descriptions-item label="供应商名称">{{ form.supplierName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="客户">{{ form.customerName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="销售员">{{ form.salesmanName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="客户代理人">{{ form.agent || '-' }}</el-descriptions-item>
          <el-descriptions-item label="法定代表人">{{ form.legalrepresent || '-' }}</el-descriptions-item>
          <el-descriptions-item label="接货人">{{ form.receiver || '-' }}</el-descriptions-item>
          <el-descriptions-item label="客户电话">{{ form.telephone || '-' }}</el-descriptions-item>
          <el-descriptions-item label="客户传真">{{ form.fax || '-' }}</el-descriptions-item>
          <el-descriptions-item label="税务号">{{ form.taxnum || '-' }}</el-descriptions-item>
          <el-descriptions-item label="银行账号">{{ form.bankcode || '-' }}</el-descriptions-item>
          <el-descriptions-item label="运输方式">{{ form.transtype || '-' }}</el-descriptions-item>
          <el-descriptions-item label="交提货方式">{{ form.picktype || '-' }}</el-descriptions-item>
          <el-descriptions-item label="接货地点">{{ form.destination || '-' }}</el-descriptions-item>
          <el-descriptions-item label="开户银行">{{ form.bank || '-' }}</el-descriptions-item>
          <el-descriptions-item label="包装费承担">{{ casingCostMap[form.casingcost] || '-' }}</el-descriptions-item>
          <el-descriptions-item label="运费承担">{{ transCostMap[form.transcost] || '-' }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="4"><div class="textarea-display">{{ form.memo || '-' }}</div></el-descriptions-item>
          <el-descriptions-item label="其他条款" :span="4"><div class="textarea-display">{{ form.other || '-' }}</div></el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 合同产品信息 -->
      <el-card shadow="never" class="section-card mt-4">
        <template #header>
          <div class="section-header" >
            <span class="title">合同产品信息</span>
            <el-button 
              type="primary" 
              :disabled="selectedRows.length === 0" 
              @click="openAuditDialog"
            >
              通知提交审核
            </el-button>
          </div>
        </template>

        <div class="summary-info">
          <span>总金额: ¥{{ totalAmount.toFixed(2) }}</span>
          <span style="margin-left: 20px;">总重量: {{ totalWeight.toFixed(2) }}kg</span>
        </div>

        <el-table
          :data="materialList"
          border
          stripe
          size="small"
          style="width: 100%"
          :row-key="row => row.id"
          v-loading="materialLoading"
          class="insp-table"
          :row-class-name="tableRowClassName"
          @selection-change="handleSelectionChange"
        >
          <!-- 新增：多选列，只有状态为20的可选 -->
          <el-table-column type="selection" :selectable="checkSelectable" width="45" fixed="left" align="center" />
          
          <el-table-column type="index" label="序号" width="50" fixed="left" />
          
          <!-- 状态列 -->
          <el-table-column label="通知状态" width="110" align="center" fixed="left">
            <template #default="{ row }">
              <el-tag :type="getStatusTagType(row.noticestatus)" size="small" effect="dark">
                {{ getStatusText(row.noticestatus) }}
              </el-tag>
            </template>
          </el-table-column>

          <!-- 物料信息组 -->
          <el-table-column label="物料信息" :colspan="6">
            <template #header>
              <div class="group-header">物料信息</div>
            </template>
            <el-table-column prop="itemNo" label="产品编号" width="150" />
            <el-table-column prop="itemName" label="产品名称" width="100" />
            <el-table-column prop="itemSpec" label="规格型号" width="150" />
            <el-table-column prop="itemnum" label="数量" width="80" />
            <el-table-column prop="itemunit" label="单位" width="80" />
            <el-table-column prop="itemmemo" label="产品备注" width="100" />
          </el-table-column>

          <!-- 图纸信息组 -->
          <el-table-column label="图纸信息" :colspan="1">
            <template #header>
              <div class="group-header">图纸信息</div>
            </template>
            <el-table-column prop="tuzhiNo" label="图纸编号" width="100" />
            <el-table-column prop="tuzhiName" label="图纸名称" show-overflow-tooltip width="150" />
          </el-table-column>

          <!-- 通知信息组 -->
          <el-table-column label="通知信息" :colspan="6">
            <template #header>
              <div class="group-header">通知信息</div>
            </template>
            <el-table-column prop="noticeid" label="通知编号" width="100" />
            <el-table-column prop="noticename" label="通知名称" show-overflow-tooltip width="150" />
            <el-table-column prop="noticeinstead" label="通知替代型号" width="100" />
            <el-table-column prop="noticecomment" label="通知备注" width="100" />
            <el-table-column prop="noticeauther" label="通知作者" width="100" />
            <el-table-column prop="noticebuilddate" label="通知制定时间" width="150" />
          </el-table-column>

          <!-- 操作列 -->
          <el-table-column label="操作" width="200" fixed="right">
            <template #header>
              <div class="group-header">操作</div>
            </template>
            <template #default="{ row, $index }">
              <el-button type="primary" size="small" @click="openMaterialList(row)">查看材料</el-button>
              <el-button v-if="row.noticestatus == 10" type="warning" size="small" @click="openSetNotice(row)">制定通知</el-button>
              <el-button v-if="row.noticestatus == 10" type="success" size="small" @click="updateStatus(row.id,20)">确定通知</el-button>
              <el-button v-if="row.noticestatus == 20" type="danger" size="small" @click="updateStatus(row.id,10)">撤销确认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 弹窗底部按钮 -->
    <template #footer>
      <div class="footer-bar">
        <!-- 新增：批量提交审核按钮 -->
        <el-button @click="handleCancel">关闭</el-button>
      </div>
    </template>
  </CustomDialog>

  <!-- 子弹窗 -->
  <MaterialDecomposeDialog v-model:visible="materialDialogVisible" :item-id="selectedItemId" :item-quantity="selectedQuantity" />
  <setNotice v-model:visible="noticeDialogVisible" :item-id="selectedItemId" />

  <!-- 新增：提交审核信息填写弹窗 -->
  <el-dialog
    v-model="auditDialogVisible"
    title="提交审核确认"
    width="500px"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-form :model="auditForm" label-width="120px" style="margin-top: 20px;">
      <el-form-item label="本次通知编号">
        <el-input v-model="auditForm.noticeNo" placeholder="请输入通知编号" />
      </el-form-item>
      <el-form-item label="本次通知名称">
        <el-input v-model="auditForm.noticeName" placeholder="请输入通知名称" />
      </el-form-item>
      <div style="margin-left: 120px; font-size: 12px; color: #909399; margin-bottom: 10px;">
        已选择 {{ selectedRows.length }} 条“已确定”的通知进行提交
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="auditDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="auditLoading" @click="submitAudit">确认提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getContractItemList, getContractItemTotal } from '@/api/contract/bascontract';
import CustomDialog from '@/components/common/CustomDialog.vue';
import { useTermStore } from '@/store/term.js';
import { useUserStore } from '@/store/user.js';
import { updateNoticeStatusById, updateBatchNotice } from '@/api/tongzhi/tongzhi'; // 确保引入 updateBatchNotice
import MaterialDecomposeDialog from '../components/MaterialDecomposeDialog.vue';
import setNotice from './setNotice.vue';

// ... (store获取代码保持不变) ...
const termStore = useTermStore();
const currentTerm = termStore.term;
const userStore = useUserStore();
const userId = computed(() => userStore.userId);

// Props 和 Emits
const props = defineProps({
  visible: { type: Boolean, default: false },
  initialData: { type: Object, default: () => ({}) }
});
const emit = defineEmits(['update:visible']);

// 基础状态
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => { emit('update:visible', value); }
});
const isFullscreen = ref(true);
const materialLoading = ref(false);
const totalAmount = ref(0);
const totalWeight = ref(0);
const materialDialogVisible = ref(false); 
const selectedItemId = ref(null);
const selectedQuantity = ref(null);
const noticeDialogVisible = ref(false);

// 新增：提交审核相关状态
const selectedRows = ref([]); // 存储选中的行
const auditDialogVisible = ref(false);
const auditLoading = ref(false);
const auditForm = reactive({
  noticeNo: '',
  noticeName: ''
});

// ... (tableRowClassName 和 statusMap 逻辑保持不变) ...
const tableRowClassName = ({ row }) => {
  if (!row.noticeauther || row.noticeauther.trim() == 'N/A') {
    return 'warning-row';
  }
  return '';
};

const statusMap = {
  10: { text: '草稿', type: 'info' },
  20: { text: '确认', type: 'primary' },
  30: { text: '待审核', type: 'warning' },
  31: { text: '审核通过', type: 'success' },
  32: { text: '审核拒绝', type: 'danger' },
  40: { text: '已提料', type: 'success' }
}

const getStatusText = (status) => statusMap[status]?.text || '-';
const getStatusTagType = (status) => statusMap[status]?.type || '';

// 新增：检查行是否可选（只有 status 为 20 才能选）
const checkSelectable = (row) => {
  return row.noticestatus === 20;
};

// 新增：处理表格选择变化
const handleSelectionChange = (selection) => {
  selectedRows.value = selection;
};

// ... (openMaterialList, openSetNotice, updateStatus 等方法保持不变) ...
const openMaterialList = (item) => {
  selectedItemId.value = item.itemid;
  selectedQuantity.value = item.itemnum;
  materialDialogVisible.value = true;
};
const openSetNotice = (item) => {
  selectedItemId.value = item.id;
  noticeDialogVisible.value = true;
};

const updateStatus = async (id, status) => {
  try {
    await ElMessageBox.confirm(
      `确定要${status === 20 ? '确定' : '撤销'}此通知吗？`,
      '操作确认',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', center: true }
    );
    await updateNoticeStatusById({ id, status });
    ElMessage.success(`成功${status === 20 ? '确定' : '撤销'}此通知！`);
    loadMaterialList();
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('操作失败！');
  }
};

// ================= 新增：批量提交审核逻辑 =================

// 打开审核确认弹窗
const openAuditDialog = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请至少选择一条“已确认”状态的通知');
    return;
  }
  
  // 自动填入默认值
  // 编号：厂内合同号 + "-1"
  auditForm.noticeNo = form.no ? `${form.no}-1` : '';
  // 名称：合同名称
  auditForm.noticeName = form.name || '';
  
  auditDialogVisible.value = true;
};

// 提交审核
const submitAudit = async () => {
  if (!auditForm.noticeNo || !auditForm.noticeName) {
    ElMessage.warning('请填写通知编号和名称');
    return;
  }

  auditLoading.value = true;
  try {
    // 提取 id 数组并转为字符串 "367,368"
    const ids = selectedRows.value.map(row => row.id).join(',');
    
    const params = {
      ids: ids,
      noticeNo: auditForm.noticeNo,   // 具体字段名需根据后端updateBatchNotice定义调整
      noticeName: auditForm.noticeName // 具体字段名需根据后端updateBatchNotice定义调整
    };

    // 调用批量更新接口
    const res = await updateBatchNotice(params);
    
    if (res.success) { // 假设接口返回 { success: true }
      ElMessage.success('提交审核成功');
      auditDialogVisible.value = false;
      // 刷新列表
      loadMaterialList();
      // 清空选中
      selectedRows.value = [];
    } else {
      ElMessage.error(res.msg || '提交失败');
    }
  } catch (error) {
    console.error('批量提交审核异常:', error);
    ElMessage.error('系统异常，提交失败');
  } finally {
    auditLoading.value = false;
  }
};

// ================= 结束新增逻辑 =================

// 表单数据初始化
const getInitialFormData = () => ({
  no: '',
  userid: '',
  ecpno: '',
  equipno: '',
  purchaserHqCode: '',
  supplierCode: '1000014491',
  supplierName: '中国电建集团四平线路器材有限公司',
  term: currentTerm,
  salesmanid: null,
  salesmanName: '',
  agent: '',
  other: `提出异议期限：
结算方式及付款期限：
备品、配件、工具供应办法：
违约责任：
因本合同发生纠纷调解不成是，应在（）人民法院进行诉讼
其他违约事项：`,
  casingcost: 1,
  transcost: 1,
  destination: '',
  bank: '',
  checktype: '',
  postalcode: '',
  fax: '',
  bankcode: '',
  pressurestage: 0,
  receiver: '',
  transtype: '',
  picktype: '',
  telephone: '',
  itemsenddate: '',
  contractSum: 0,
  name: '',
  customerid: null,
  customerName: '',
  legalrepresent: '',
  taxnum: '',
  signdate: '',
  status: 10,
  memo: '',
  gridno: '',
  ...props.initialData
});

const form = reactive(getInitialFormData());
const materialList = ref([]);
const casingCostMap = { 1: '供方', 2: '需方', 3: '各半', 4: '其他' };
const transCostMap = { 1: '供方', 2: '需方', 3: '各半', 4: '其他' };

const handleCancel = () => {
  dialogVisible.value = false;
  emit('update:visible', false);
};

const loadMaterialList = async () => {
  if (!form.no) return;
  materialLoading.value = true;
  try {
    const response = await getContractItemList({ contractNo: form.no });
    if (response.success) {
      materialList.value = response.data?.itemList || [];
      await getContractTotal();
    } else {
      ElMessage.error(response.msg || '加载物料列表失败');
      materialList.value = [];
    }
  } catch (error) {
    ElMessage.error('加载物料列表失败');
    materialList.value = [];
  } finally {
    materialLoading.value = false;
  }
};

const getContractTotal = async () => {
  try {
    const res = await getContractItemTotal({ contractNo: form.no });
    if (res.success) {
      totalAmount.value = res.data.sumData.totalItemRealSum || 0;
      totalWeight.value = res.data.sumData.totalGrossWeight || 0;
    }
  } catch (error) {
    console.error('获取合同总计失败:', error);
  }
};

watch(dialogVisible, (newVal) => {
  if (newVal) {
    Object.assign(form, getInitialFormData());
    materialList.value = [];
    selectedRows.value = []; // 清空选中状态
    totalAmount.value = 0;
    totalWeight.value = 0;
    loadMaterialList();
  }
});

watch(() => props.initialData, (newVal) => {
  if (newVal && Object.keys(newVal).length > 0) {
    Object.assign(form, getInitialFormData());
    loadMaterialList();
  }
}, { immediate: true });
</script>

<style scoped>
/* 保持原有 CSS 不变 */
:deep(.el-table .warning-row) {
  color: #f56c6c !important;
  font-weight: 600;
  background-color: #fef0f0 !important;
}
:deep(.el-table .warning-row:hover > td) {
  background-color: #fde2e2 !important;
}
.group-header {
  font-weight: 600;
  font-size: 15px;
  color: #000000;
  padding: 8px 0;
  text-align: center;
}
:deep(.el-table th > .cell) {
  text-align: center;
}
:deep(.el-dialog) {
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}
:deep(.el-dialog__body) {
  padding: 0;
  background: #f5f6fa;
  flex: 1;
  overflow-y: auto;
}
.dialog-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.section-card {
  background: #fff;
  border-radius: 8px;
}
.section-header {
  display: flex;
  align-items: center; /* 垂直居中对齐 */
  justify-content: space-between; /* 两端对齐 */
}
.section-header .title {
  font-weight: 600;
  font-size: 16px;
  color: #303133;
}
.info-desc {
  background: #fafafa;
  font-size: 12px;
}
:deep(.el-descriptions) {
  --el-descriptions-item-padding: 8px 12px;
}
:deep(.el-descriptions__label) {
  font-weight: 500;
  color: #606266;
  width: 100px !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
:deep(.el-descriptions__content) {
  color: #303133;
  line-height: 1.5;
}
.textarea-display {
  display: block;
  font-size: 12px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
  padding: 4px 0;
}
.insp-table {
  border-radius: 6px;
  overflow: hidden;
}
:deep(.el-table) {
  font-size: 12px;
}
:deep(.el-table th) {
  background-color: #fafafa;
  padding: 8px 0;
}
:deep(.el-table td) {
  padding: 8px 0;
}
.summary-info {
  float: right;
  font-size: 12px;
  color: #606266;
  margin-bottom: 8px;
}
.footer-bar {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 10px 20px;
  border-top: 1px solid #e4e7ed;
  background-color: #fff;
  position: sticky;
  bottom: 0;
  z-index: 10;
}
.dialog-body::-webkit-scrollbar {
  display: none;
}
.dialog-body {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
@media (max-width: 1440px) {
  :deep(.el-descriptions) {
    --el-descriptions-column: 3 !important;
  }
}
@media (max-width: 1200px) {
  :deep(.el-dialog) {
    width: 98% !important;
  }
}
@media (max-width: 768px) {
  :deep(.el-descriptions) {
    --el-descriptions-column: 2 !important;
  }
  :deep(.el-descriptions__label) {
    width: 90px !important;
  }
  .dialog-body {
    padding: 10px;
  }
}
@media (max-width: 480px) {
  :deep(.el-descriptions) {
    --el-descriptions-column: 1 !important;
  }
}
</style>