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
    
    <!-- 
      修改点：
      1. 添加 v-loading="loading" 实现表格内部等待动画
      2. 添加 element-loading 配置提升体验
    -->
    <el-table
      v-loading="loading"
      element-loading-text="正在加载备料计划..."
      element-loading-background="rgba(255, 255, 255, 0.8)"
      :data="tableData"
      border
      :span-method="objectSpanMethod"
      style="width: 100%; margin-top: 16px; min-height: 200px;" 
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
      
      <!-- 空数据插槽 (当加载完成且无数据时显示) -->
      <template #empty>
        <div v-if="!loading" class="empty-tip">暂无备料计划数据</div>
      </template>
    </el-table>
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
const rawData = ref([]); 
const tableData = ref([]); 
const spanArr = ref([]); 

// 监听父组件visible变化
watch(
  () => props.visible,
  (newVal) => {
    dialogVisible.value = newVal;
    if (newVal) {
      // 修改点：每次打开弹窗时，先清空数据，并开启loading
      clearData(); 
      loading.value = true;
      
      if (props.contractNo) {
        fetchData(); 
      } else {
        loading.value = false; // 如果没有合同号，直接结束loading
      }
    }
  },
  { immediate: true }
);

// 修改点：独立的清空数据方法
const clearData = () => {
  tableData.value = [];
  rawData.value = [];
  spanArr.value = [];
};

// 加载备料计划数据
const fetchData = async () => {
  // 注意：这里不需要再设置 loading.value = true，因为 watch 中已经设置了
  try {
    const res = await getContractMaterialPlan({ contractNo: props.contractNo });
    if (res.success && res.data?.record) {
      rawData.value = res.data.record;
      formatTableData(); // 格式化表格数据
    } else {
      // 如果接口返回成功但无数据，保持 tableData 为空即可
      ElMessage.warning(res.message || '未获取到备料计划数据');
    }
  } catch (error) {
    ElMessage.error('获取备料计划异常');
    console.error('备料计划查询失败：', error);
  } finally {
    // 无论成功失败，最终关闭加载动画
    loading.value = false;
  }
};

/**
 * 格式化表格数据
 */
const formatTableData = () => {
  const result = [];
  const spanTemp = [];

  rawData.value.forEach((mainProduct) => {
    const { child = [], ...mainProps } = mainProduct; 
    const materialCount = child.length; 

    // 1. 主产品行
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

    // 2. 原材料行
    child.forEach((material) => {
      const materialRow = {
        ...mainProps, 
        ...material, 
      };
      result.push(materialRow);
    });

    // 3. 计算合并行
    spanTemp.push(materialCount + 1);
  });

  calculateSpanArr(spanTemp);
  tableData.value = result;
};

/**
 * 计算合并行跨度
 */
const calculateSpanArr = (spanTemp) => {
  const arr = [];
  spanTemp.forEach((val) => {
    // 主产品行
    for (let i = 0; i < 6; i++) {
      arr.push({ rowspan: val, colspan: 1 });
    }
    for (let i = 0; i < 6; i++) {
      arr.push({ rowspan: 0, colspan: 0 });
    }

    // 原材料行
    for (let i = 1; i < val; i++) {
      for (let j = 0; j < 6; j++) {
        arr.push({ rowspan: 0, colspan: 0 });
      }
      for (let j = 0; j < 6; j++) {
        arr.push({ rowspan: 1, colspan: 1 });
      }
    }
  });
  spanArr.value = arr;
};

/**
 * 表格合并行方法
 */
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  // 如果没有数据或正在加载，不进行合并计算，防止报错
  if (tableData.value.length === 0 || spanArr.value.length === 0) {
    return { rowspan: 1, colspan: 1 };
  }
  const index = rowIndex * 12 + columnIndex;
  return spanArr.value[index] || { rowspan: 1, colspan: 1 };
};

onMounted(() => {
  if (dialogVisible.value && props.contractNo) {
    // 这里如果 mounted 时弹窗是开着的，也执行一次清空+加载逻辑
    // 但通常由 watch 接管，这里保留是为了保险
    if(tableData.value.length === 0) {
        loading.value = true;
        fetchData();
    }
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

::v-deep(.el-table) {
  --el-table-header-text-color: #333;
  --el-table-row-hover-bg-color: #fafafa;

  .el-table__header th {
    border-bottom: 1px solid #e5e7eb;
  }

  .el-table__body td {
    border-bottom: 1px solid #f0f2f5;
  }

  .el-table__row:first-child,
  .el-table__row:nth-child(n + 1):not(.el-table__row:nth-child(n + 1) ~ .el-table__row) {
    background-color: #f9fafb;
  }
}
</style>