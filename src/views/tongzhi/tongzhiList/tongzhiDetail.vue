<template>
  <CustomDialog 
    :visible="dialogVisible" 
    title="本次通知产品信息" 
    :is-full-screen="isFullscreen" 
    :header-height="60" width="90%"
    @update:visible="dialogVisible = $event"
    @update:is-full-screen="isFullscreen = $event">
    <div class="dialog-body">
      <!-- 合同基本信息 -->
      <el-card shadow="never" class="section-card">
        <template #header>
          <div class="section-header">
            <span class="title">合同基本信息</span>
          </div>
        </template>
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
          <div class="section-header">
            <span class="title">合同产品信息</span>
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
        >
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

          <!-- 操作列 - 仅保留查看材料 -->
          <el-table-column label="操作" width="100" fixed="right">
            <template #header>
              <div class="group-header">操作</div>
            </template>
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="openMaterialList(row)">查看材料</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 弹窗底部按钮 -->
    <template #footer>
      <div class="footer-bar">
        <el-button @click="handleCancel">关闭</el-button>
      </div>
    </template>
  </CustomDialog>

  <!-- 仅保留查看材料子弹窗 -->
  <MaterialDecomposeDialog v-model:visible="materialDialogVisible" :item-id="selectedItemId" :item-quantity="selectedQuantity" />
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { getContractItemList, getContractItemTotal } from '@/api/contract/bascontract';
import CustomDialog from '@/components/common/CustomDialog.vue';
import { useTermStore } from '@/store/term.js';
import MaterialDecomposeDialog from '../components/MaterialDecomposeDialog.vue';

// store获取
const termStore = useTermStore();
const currentTerm = termStore.term;

// Props 和 Emits
const props = defineProps({
  visible: { type: Boolean, default: false },
  initialData: { type: Object, default: () => ({}) },
  noticeid: { type: [Number, String], required: true }
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

// 表格行样式
const tableRowClassName = ({ row }) => {
  if (!row.noticeauther || row.noticeauther.trim() == 'N/A') {
    return 'warning-row';
  }
  return '';
};

// 状态映射
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

// 查看材料
const openMaterialList = (item) => {
  selectedItemId.value = item.itemid;
  selectedQuantity.value = item.itemnum;
  materialDialogVisible.value = true;
};

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

// 加载物料列表
const loadMaterialList = async () => {
  if (!form.no) return;
  materialLoading.value = true;
  try {
    const response = await getContractItemList({ contractNo: form.no,noticeid:props.noticeid });
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

// 获取合同总计
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

// 监听弹窗显示状态
watch(dialogVisible, (newVal) => {
  if (newVal) {
    Object.assign(form, getInitialFormData());
    materialList.value = [];
    totalAmount.value = 0;
    totalWeight.value = 0;
    loadMaterialList();
  }
});

// 监听初始数据变化
watch(() => props.initialData, (newVal) => {
  if (newVal && Object.keys(newVal).length > 0) {
    Object.assign(form, getInitialFormData());
    loadMaterialList();
  }
}, { immediate: true });
</script>

<style scoped>
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
  align-items: center;
  justify-content: space-between;
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