<template>
  <CustomDialog 
    :visible="dialogVisible"
    title="查看合同及产品"
    :is-full-screen="isFullscreen"
    :header-height="60"
    width="90%"
    @update:visible="dialogVisible = $event"
    @update:is-full-screen="isFullscreen = $event"
  >
    <div class="contract-form">
      <el-form :model="form" label-width="120px" size="small">
        <!-- 合同基本信息 -->
        <el-card class="form-card" shadow="never">
          <template #header>
            <span class="card-title">合同基本信息</span>
          </template>
          
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="厂内合同号">
                <span>{{ form.no || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="器材合同号">
                <span>{{ form.equipno || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="国网经法合同号">
                <span>{{ form.ecpno || '-' }}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="工程名称">
                <span>{{ form.name || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="电网编号">
                <span>{{ form.gridno || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="电压等级(KV)">
                <span>{{ form.pressurestage || 0 }}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="采购方总部编码">
                <span>{{ form.purchaserHqCode || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商编码">
                <span>{{ form.supplierCode || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商名称">
                <span>{{ form.supplierName || '-' }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

        <!-- 客户与销售信息 -->
        <el-card class="form-card" shadow="never">
          <template #header>
            <span class="card-title">客户与销售信息</span>
          </template>
          
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="销售员">
                <span>{{ form.salesmanName || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户">
                <span>{{ form.customerName || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户代理人">
                <span>{{ form.agent || '-' }}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="法定代表人">
                <span>{{ form.legalrepresent || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="税务号">
                <span>{{ form.taxnum || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="签订时间">
                <span>{{ form.signdate || '-' }}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="客户电话">
                <span>{{ form.telephone || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户传真">
                <span>{{ form.fax || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="接货人">
                <span>{{ form.receiver || '-' }}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="运输方式">
                <span>{{ form.transtype || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="交提货方式">
                <span>{{ form.picktype || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="接货地点">
                <span>{{ form.destination || '-' }}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="包装费承担">
                <span>{{ casingCostMap[form.casingcost] || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="运费承担">
                <span>{{ transCostMap[form.transcost] || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所属期间">
                <span>{{ form.term || '-' }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

        <!-- 银行与财务信息 -->
        <el-card class="form-card" shadow="never">
          <template #header>
            <span class="card-title">银行与财务信息</span>
          </template>
          
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="开户银行">
                <span>{{ form.bank || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="银行账号">
                <span>{{ form.bankcode || '-' }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

        <!-- 其他信息 -->
        <el-card class="form-card" shadow="never">
          <template #header>
            <span class="card-title">其他信息</span>
          </template>
          
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="其他条款">
                <span class="textarea-display">{{ form.other || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注">
                <span class="textarea-display">{{ form.memo || '-' }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

        <!-- 合同产品信息 -->
        <el-card class="form-card" shadow="never">
          <template #header>
            <span class="card-title">合同产品信息</span>
          </template>

          <!-- 汇总信息 -->
          <div class="summary-info">
            <span>总金额: ¥{{ totalAmount.toFixed(2) }}</span>
            <span style="margin-left: 20px;">总重量: {{ totalWeight.toFixed(2) }}kg</span>
          </div>

          <!-- 物料列表 -->
          <el-table
            :data="materialList"
            border
            size="small"
            style="width: 100%"
            :row-key="row => row.id"
            v-loading="materialLoading"
          >
            <el-table-column label="序号" width="60">
              <template #default="{ $index }">
                {{ (materialPagination.currentPage - 1) * materialPagination.pageSize + $index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="itemNo" label="产品编号" width="100" />
            <el-table-column prop="itemName" label="产品名称" min-width="80" />
            <el-table-column prop="itemSpec" label="规格型号" min-width="80" />
            <el-table-column prop="poItemNo" label="采购行项目号" width="100" />
            <el-table-column prop="poItemId" label="采购行项目ID" min-width="80" />
            <el-table-column prop="poItemCode" label="国网物料编码" min-width="80" />
            <el-table-column prop="itemnum" label="数量" min-width="80" />
            <el-table-column prop="itemunit" label="单位" min-width="80" />
            <el-table-column prop="itemRealPrice" label="销售单价" min-width="80" />
            <el-table-column prop="itemRealSum" label="销售总金额" min-width="80" />
            <el-table-column prop="itemweight" label="单重(kg)" min-width="80" />
            <el-table-column prop="itemgrossweight" label="总重(kg)" min-width="80" />
            <el-table-column prop="itemmemo" label="备注" min-width="80" />
          </el-table>

          <!-- 分页 -->
          <el-pagination
            v-model:current-page="materialPagination.currentPage"
            v-model:page-size="materialPagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="materialPagination.total"
            @size-change="loadMaterialList"
            @current-change="loadMaterialList"
            class="pagination"
          />
        </el-card>
      </el-form>
    </div>

    <!-- 弹窗底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">关闭</el-button>
      </div>
    </template>
  </CustomDialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { getContractItemPage, getContractItemTotal } from '@/api/contract/bascontract';
import CustomDialog from '@/components/common/CustomDialog.vue';
import { useTermStore } from '@/store/term.js';
import { useUserStore } from '@/store/user.js';

// 获取当前的期数term
const termStore = useTermStore();
const currentTerm = termStore.term;

// 获取userId
const userStore = useUserStore();
const userId = computed(() => userStore.userId);

// Props 和 Emits
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  initialData: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:visible']);

// 弹窗显示控制
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => {
    emit('update:visible', value);
  }
});

// 组件状态
const isFullscreen = ref(false);
const materialLoading = ref(false);
const totalAmount = ref(0);
const totalWeight = ref(0);

// 初始表单数据
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
  ...props.initialData // Merge initialData to populate form
});

// 表单数据
const form = reactive(getInitialFormData());

// 物料搜索表单
const materialSearchForm = reactive({
  keyword: ''
});

// 物料分页
const materialPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

// 物料列表
const materialList = ref([]);

// 费用承担映射
const casingCostMap = {
  1: '供方',
  2: '需方',
  3: '各半',
  4: '其他'
};

const transCostMap = {
  1: '供方',
  2: '需方',
  3: '各半',
  4: '其他'
};

// 取消操作
const handleCancel = () => {
  dialogVisible.value = false;
  emit('update:visible', false);
};

// 加载物料列表
const loadMaterialList = async () => {
  if (!form.no) return;

  materialLoading.value = true;
  try {
    const params = {
      pageNumber: materialPagination.currentPage,
      pageSize: materialPagination.pageSize,
      contractNo: form.no,
      itemName: materialSearchForm.keyword
    };

    const response = await getContractItemPage(params);
    if (response.success) {
      const itemData = response.data.itemList;
      materialList.value = itemData.list || [];
      materialPagination.total = itemData.totalRow || 0;
      await getContractTotal();
    } else {
      ElMessage.error(response.msg || '加载物料列表失败');
    }
  } catch (error) {
    ElMessage.error('加载物料列表失败');
  } finally {
    materialLoading.value = false;
  }
};

// 获取合同总金额和总重量
const getContractTotal = async () => {
  try {
    const res = await getContractItemTotal({ contractNo: form.no });
    if (res.success) {
      totalAmount.value = res.data.sumData.totalItemRealSum || 0;
      totalWeight.value = res.data.sumData.totalGrossWeight || 0;
    } else {
      console.error('获取合同总计失败:', res.msg);
    }
  } catch (error) {
    console.error('获取合同总计失败:', error);
    ElMessage.error('获取合同总计失败');
  }
};

// 监听弹窗显示状态
watch(dialogVisible, (newVal) => {
  if (newVal) {
    Object.assign(form, getInitialFormData());
    materialList.value = [];
    materialPagination.currentPage = 1;
    materialPagination.total = 0;
    totalAmount.value = 0;
    totalWeight.value = 0;
    loadMaterialList();
  }
});

// 监听initialData变化
watch(() => props.initialData, (newVal) => {
  if (newVal && Object.keys(newVal).length > 0) {
    Object.assign(form, getInitialFormData());
    loadMaterialList();
  }
}, { immediate: true });
</script>

<style scoped>
.contract-form {
  max-height: 80vh;
  overflow-y: auto;
  padding: 0 8px;
}

.form-card {
  margin-bottom: 6px;
  border-radius: 4px;
}

.form-card :deep(.el-card__header) {
  padding: 6px 10px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ebeef5;
}

.form-card :deep(.el-card__body) {
  padding: 8px;
}

.card-title {
  font-weight: 600;
  color: #303133;
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.summary-info {
  float: right;
  font-size: 12px;
  color: #606266;
  margin-bottom: 8px;
}

:deep(.el-form-item) {
  margin-bottom: 8px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
  font-size: 12px;
  line-height: 28px;
}

.textarea-display {
  display: block;
  font-size: 12px;
  line-height: 1.5;
  white-space: pre-wrap;
}

:deep(.el-table) {
  font-size: 12px;
}

:deep(.el-table th) {
  background-color: #fafafa;
}

.pagination {
  margin-top: 8px;
  text-align: right;
}

.contract-form::-webkit-scrollbar {
  display: none;
}

.contract-form {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@media (max-width: 1200px) {
  :deep(.el-dialog) {
    width: 98% !important;
  }
  :deep(.el-form-item__label) {
    font-size: 11px;
  }
  .textarea-display {
    font-size: 11px;
  }
}

@media (max-width: 768px) {
  .contract-form {
    padding: 0 5px;
  }
  
  .form-card :deep(.el-card__body) {
    padding: 6px;
  }
  
  :deep(.el-col) {
    margin-bottom: 4px;
  }

  :deep(.el-form-item__label) {
    font-size: 10px;
  }

  .textarea-display {
    font-size: 10px;
  }
}
</style>