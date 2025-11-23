<template>
  <CustomDialog
    :visible="dialogVisible"
    title="根据合同制定通知"
    :is-full-screen="isFullscreen"
    :header-height="60"
    width="90%"
    @update:visible="dialogVisible = $event"
    @update:is-full-screen="isFullscreen = $event"
  >
    <div class="dialog-title">合同产品备料计划</div>
    <!-- 嵌套表格：主产品 + 原材料 -->
    <el-table
      :data="tableData"
      border
      :span-method="objectSpanMethod"
      style="width: 100%; margin-top: 16px"
      :header-cell-style="{ 'background-color': '#f5f7fa', 'font-weight': 500 }"
    >
      <!-- 主产品列 -->
      <el-table-column label="主产品编号" prop="itemNo" width="140" align="center" />
      <el-table-column label="主产品名称" prop="itemName" width="200" align="center" />
      <el-table-column label="规格型号" prop="itemSpec" width="160" align="center" />
      <el-table-column label="图纸号" prop="tuzhiNo" width="140" align="center" />
      <el-table-column label="合同数量" prop="itemNum" width="120" align="center">
        <template #default="scope">
          {{ scope.row.itemNum ? scope.row.itemNum.toFixed(2) : '0.00' }}
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="itemMemo" align="center" />

      <!-- 原材料列 -->
      <el-table-column label="物料编号" prop="no" width="140" align="center" />
      <el-table-column label="物料名称" prop="name" width="200" align="center" />
      <el-table-column label="物料规格" prop="spec" width="160" align="center" />
      <el-table-column label="物料分类" prop="inclass" width="180" align="center" />
      <el-table-column label="单位" prop="unit" width="80" align="center" />
      <el-table-column label="需用数量" prop="actualQuantity" width="120" align="center">
        <template #default="scope">
          {{ scope.row.actualQuantity ? scope.row.actualQuantity.toFixed(2) : '0.00' }}
        </template>
      </el-table-column>
    </el-table>

    <!-- 加载状态 -->
    <el-loading v-if="loading" target=".el-table" text="加载中..." />
    <!-- 空数据提示 -->
    <div v-if="!loading && tableData.length === 0" class="empty-tip">暂无备料计划数据</div>
  </CustomDialog>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { getContractMaterialPlan } from '@/api/tongzhi/tongzhi';
import CustomDialog from '@/components/common/CustomDialog.vue';

// 接收父组件参数
const props = defineProps({
  contractNo: {
    type: String,
    default: '',
    required: true,
  },
  visible: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['update:visible']);

// 组件内部状态
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => {
    emit('update:visible', value);
  }
});
const isFullscreen = ref(true);
const loading = ref(false);
const rawData = ref([]); // 原始接口返回数据（主产品数组）
const tableData = ref([]); // 处理后的表格渲染数据（主产品+原材料平级数组）
const spanArr = ref([]); // 合并行计算结果

// 监听父组件visible变化，控制弹窗显示/隐藏
watch(
  () => props.visible,
  (newVal) => {
    dialogVisible.value = newVal;
    if (newVal && props.contractNo) {
      fetchData(); // 弹窗显示时加载数据
    }
  },
  { immediate: true }
);


// 加载备料计划数据
const fetchData = async () => {
  if (!props.contractNo) {
    ElMessage.warning('合同编号不能为空');
    return;
  }

  loading.value = true;
  try {
    const res = await getContractMaterialPlan({ contractNo:props.contractNo });
    if (res.success && res.data?.record) {
      rawData.value = res.data.record;
      formatTableData(); // 格式化表格数据
    } else {
      ElMessage.warning('获取备料计划失败');
      rawData.value = [];
      tableData.value = [];
      spanArr.value = [];
    }
  } catch (error) {
    ElMessage.error('获取备料计划异常');
    console.error('备料计划查询失败：', error);
  } finally {
    loading.value = false;
  }
};

/**
 * 格式化表格数据：将主产品和原材料平级化，便于合并行渲染
 * 逻辑：1个主产品 + N个原材料 → 生成 N+1 行数据，主产品行携带原材料信息（为空），原材料行携带主产品信息（复用）
 */
const formatTableData = () => {
  const result = [];
  const spanTemp = [];

  rawData.value.forEach((mainProduct) => {
    const { child = [], ...mainProps } = mainProduct; // 分离主产品属性和原材料数组
    const materialCount = child.length; // 原材料数量

    // 1. 主产品行：主产品属性完整，原材料属性为空
    const mainRow = {
      ...mainProps,
      no: '',
      name: '',
      spec: '',
      inclass: '',
      unit: '',
      actualQuantity: null,
    };
    result.push(mainRow);

    // 2. 原材料行：复用主产品属性，填充原材料属性
    child.forEach((material) => {
      const materialRow = {
        ...mainProps, // 主产品属性复用（用于合并行）
        ...material, // 原材料属性
      };
      result.push(materialRow);
    });

    // 3. 计算合并行：主产品列合并 materialCount + 1 行
    spanTemp.push(materialCount + 1);
  });

  // 计算合并行的跨度数组（Element Plus 要求格式）
  calculateSpanArr(spanTemp);
  tableData.value = result;
};

/**
 * 修复：计算合并行跨度（给所有主产品列设置合并规则）
 * @param {Array} spanTemp - 每个主产品对应的总行数（主产品行+原材料行）
 */
const calculateSpanArr = (spanTemp) => {
  const arr = [];
  spanTemp.forEach((val) => {
    // 主产品行：前6列都合并 val 行（主产品行+原材料行总数）
    for (let i = 0; i < 6; i++) {
      arr.push({ rowspan: val, colspan: 1 });
    }
    // 主产品行的原材料列：隐藏（合并 0 行）
    for (let i = 0; i < 6; i++) {
      arr.push({ rowspan: 0, colspan: 0 });
    }

    // 原材料行：前6列（主产品列）隐藏（合并 0 行），循环 val-1 次（原材料行数）
    for (let i = 1; i < val; i++) {
      // 原材料行的主产品列：隐藏
      for (let j = 0; j < 6; j++) {
        arr.push({ rowspan: 0, colspan: 0 });
      }
      // 原材料行的原材料列：不合并（默认 1 行 1 列）
      for (let j = 0; j < 6; j++) {
        arr.push({ rowspan: 1, colspan: 1 });
      }
    }
  });
  spanArr.value = arr;
};

/**
 * 修复：表格合并行方法（直接从 spanArr 取对应位置的规则）
 */
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  // 计算当前单元格在 spanArr 中的索引：rowIndex（行号） * 总列数（12） + columnIndex（列号）
  const index = rowIndex * 12 + columnIndex;
  return spanArr.value[index] || { rowspan: 1, colspan: 1 };
};

// 初始化时如果弹窗已显示且有合同编号，直接加载数据
onMounted(() => {
  if (dialogVisible.value && props.contractNo) {
    fetchData();
  }
});
</script>

<style scoped lang="scss">
.dialog-title {
  font-size: 16px;
  font-weight: 500;
  color: #1989fa;
  margin-bottom: 8px;
  border-left: 3px solid #1989fa;
  padding-left: 8px;
}

.empty-tip {
  text-align: center;
  padding: 40px 0;
  color: #999;
  font-size: 14px;
}

// 表格样式优化
::v-deep(.el-table) {
  --el-table-header-text-color: #333;
  --el-table-row-hover-bg-color: #fafafa;

  .el-table__header th {
    border-bottom: 1px solid #e5e7eb;
  }

  .el-table__body td {
    border-bottom: 1px solid #f0f2f5;
  }

  // 主产品行样式（可选，突出显示主产品）
  .el-table__row:first-child,
  .el-table__row:nth-child(n + 1):not(.el-table__row:nth-child(n + 1) ~ .el-table__row) {
    background-color: #f9fafb;
  }
}
</style>