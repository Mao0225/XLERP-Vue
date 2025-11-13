<template>
  <!-- 物料清单弹窗 -->
  <el-dialog
    v-model="isDialogOpen"
    :title="`合同原材料清单（按物料编号合并） - ${props.contractName}`"
    width="90%"
    max-height="80vh"
    :close-on-click-modal="false"
    @open="fetchMaterialLeafList"
  >
    <!-- 加载中 -->
    <el-skeleton v-if="loading" :rows="10" :columns="8" animation="wave" />

    <!-- 无数据 -->
    <div v-else-if="materialLeafList.length === 0" class="no-data">
      <el-empty description="该合同暂无关联原材料数据" />
    </div>

    <!-- 表格 + 备注 + 批量保存 -->
    <div v-else class="material-table-container">
      <el-table
        :data="materialLeafList"
        border
        stripe
        style="width: 100%"
        max-height="60vh"
        :header-cell-style="{ 'background-color': '#f8f9fa' }"
      >
        <!-- 物料编号 -->
        <el-table-column label="物料编号" prop="no" width="120" align="center">
          <template #default="scope">{{ scope.row.no || '-' }}</template>
        </el-table-column>

        <!-- 物料名称 -->
        <el-table-column label="物料名称" prop="name" min-width="180">
          <template #default="scope">{{ scope.row.name || '-' }}</template>
        </el-table-column>

        <!-- 规格型号 -->
        <el-table-column label="规格型号" prop="spec" min-width="150">
          <template #default="scope">{{ scope.row.spec || '-' }}</template>
        </el-table-column>

        <!-- 计量单位 -->
        <el-table-column label="计量单位" prop="unit" width="100" align="center">
          <template #default="scope">{{ scope.row.unit || '-' }}</template>
        </el-table-column>

        <!-- 总用量 -->
        <el-table-column label="总用量" prop="actualQuantity" width="120" align="center">
          <template #default="scope">{{ formatQuantity(scope.row.actualQuantity) }}</template>
        </el-table-column>

        <!-- 物料分类 -->
        <el-table-column label="物料分类" prop="inclass" width="150" align="center">
          <template #default="scope">{{ scope.row.inclass || '-' }}</template>
        </el-table-column>

        <!-- 关联主产品 -->
        <el-table-column label="关联主产品" min-width="180" align="center">
          <template #default="scope">
            <el-tooltip
              :content="scope.row.itemNames?.join(', ') || ''"
              placement="top"
              effect="dark"
              :disabled="!scope.row.itemNames || scope.row.itemNames.length <= 1"
            >
              <span class="product-names text-ellipsis">
                {{ scope.row.itemNames?.join(', ') || '-' }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>

        <!-- 备注输入框 -->
        <el-table-column label="备注" width="220" align="center">
          <template #default="scope">
            <el-input
              v-model="scope.row.memo"
              placeholder="请输入备注"
              clearable
              size="small"
              :disabled="scope.row.saving"
            />
          </template>
        </el-table-column>

        <!-- 单独保存按钮 -->
        <!-- <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
            <el-button
              type="success"
              size="mini"
              :loading="scope.row.saving"
              @click="handleSingleSave(scope.row, scope.$index)"
              icon="Check"
            >
              保存
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>

      <!-- 一键逐条保存所有按钮 -->
      <div class="batch-save-wrapper">
        <el-button
          type="primary"
          :loading="batchSaving"
          @click="handleBatchSaveOneByOne"
          size="default"
        >
          一键逐条保存所有
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Check } from '@element-plus/icons-vue';

// 接口引入
import { getContractMaterialList } from '@/api/contract/bascontract';
import { saveContractMaterial } from '@/api/contract/bascontractmaterial'; // 单个保存接口

import { useUserStore } from '@/store/user';
const userStore = useUserStore();

// ==================== Props ====================
const props = defineProps({
  contractNo: { 
    type: String, 
    required: true, 
    default: '' 
  },
  visible: { 
    type: Boolean, 
    required: true, 
    default: false 
  },
  contractName: { 
    type: String, 
    required: true, 
    default: '' 
  }
});

const emit = defineEmits(['update:visible']);

// ==================== 状态 ====================
const isDialogOpen = ref(props.visible);
const loading = ref(false);
const batchSaving = ref(false); // 批量逐条保存总加载状态
const materialLeafList = ref([]); // 每行数据：包含memo（备注）、saving（保存中状态）

// ==================== 弹窗状态同步 ====================
watch(() => isDialogOpen.value, (val) => {
  emit('update:visible', val);
});

watch(() => props.visible, (val) => {
  isDialogOpen.value = val;
});

// ==================== 获取原材料清单 ====================
const fetchMaterialLeafList = async () => {
  if (!props.contractNo) return;
  loading.value = true;
  try {
    const res = await getContractMaterialList({ contractNo: props.contractNo });
    if (res.success && Array.isArray(res.data?.itemList)) {
      // 初始化每行数据：添加saving（保存中）、memo（备注）字段
      materialLeafList.value = res.data.itemList.map(item => ({
        ...item,
        memo: item.memo || '', // 回显已有备注
        saving: false // 初始化为未保存状态
      }));
    } else {
      materialLeafList.value = [];
    }
  } catch (err) {
    console.error('获取原材料清单失败：', err);
    ElMessage.error('加载数据失败，请重试');
    materialLeafList.value = [];
  } finally {
    loading.value = false;
  }
};

// ==================== 数量格式化（保留2位小数） ====================
const formatQuantity = (quantity) => {
  if (quantity === null || quantity === undefined || quantity === '') return '0.00';
  // 处理BigDecimal/字符串类型转换
  const num = typeof quantity === 'object' 
    ? Number(quantity.toString()) 
    : Number(quantity);
  return isNaN(num) ? '0.00' : num.toFixed(2);
};

// ==================== 单条保存 ====================
const handleSingleSave = async (row, index) => {
  // 基础数据校验
  if (!row.id || row.actualQuantity === null || row.actualQuantity === undefined) {
    ElMessage.warning(`【${row.name || row.no || '未知物料'}】缺少物料ID或用量，无法保存`);
    return;
  }

  // 构建保存参数（与后端单个保存接口字段对应）
  const payload = {
    planQuantity: row.actualQuantity,
    contractItemIds: row.contractItemIds || [],
    contractItemNames: row.itemNames || [],
    itemId: row.id,
    contractNo: props.contractNo,
    contractName: props.contractName,
    writer: userStore.realName || '未知用户',
    memo: (row.memo || '').trim()
  };

  // 设置当前行保存中状态
  materialLeafList.value[index].saving = true;

  try {
    // 调用单个保存接口
    const res = await saveContractMaterial(payload);
    if (res.success) {
      ElMessage.success(`【${row.name || row.no}】保存成功`);
    } else {
      throw new Error(res.message || '保存失败');
    }
  } catch (err) {
    console.error(`单条保存失败：物料${row.name || row.no}`, err);
    ElMessage.error(`【${row.name || row.no}】保存失败：${err.message}`);
  } finally {
    // 重置保存中状态
    materialLeafList.value[index].saving = false;
  }
};

// ==================== 一键逐条保存所有 ====================
const handleBatchSaveOneByOne = async () => {
  // 筛选有效数据（必须有物料ID和用量）
  const validList = materialLeafList.value.filter(row => 
    row.id && row.actualQuantity !== null && row.actualQuantity !== undefined
  );

  if (validList.length === 0) {
    ElMessage.warning('没有可保存的原材料数据（需包含有效物料ID和用量）');
    return;
  }

  // 确认保存
  ElMessageBox.confirm(
    `确定逐条保存 ${validList.length} 条原材料信息？`,
    '确认保存',
    { 
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    }
  ).then(async () => {
    batchSaving.value = true;
    let successCount = 0;
    const failList = [];

    try {
      // 串行逐条保存（避免并发请求压力）
      for (let i = 0; i < validList.length; i++) {
        const row = validList[i];
        const index = materialLeafList.value.findIndex(item => item.id === row.id);
        if (index === -1) continue;

        // 设置当前行保存中状态
        materialLeafList.value[index].saving = true;

        // 构建保存参数
        const payload = {
          planQuantity: row.actualQuantity,
          contractItemIds: row.contractItemIds || [],
          contractItemNames: row.itemNames || [],
          itemId: row.id,
          contractNo: props.contractNo,
          contractName: props.contractName,
          writer: userStore.realName || '未知用户',
          memo: (row.memo || '').trim()
        };

        try {
          const res = await saveContractMaterial(payload);
          if (res.success) {
            successCount++;
            ElMessage.success(`第 ${i + 1} 条【${row.name || row.no}】保存成功`);
          } else {
            throw new Error(res.message || '保存失败');
          }
        } catch (err) {
          failList.push({ 
            name: row.name || row.no || `第 ${i + 1} 条物料`,
            msg: err.message 
          });
          ElMessage.error(`第 ${i + 1} 条【${row.name || row.no}】保存失败：${err.message}`);
        } finally {
          // 重置当前行保存中状态
          materialLeafList.value[index].saving = false;
        }
      }

      // 保存完成后汇总结果
      if (failList.length === 0) {
        ElMessage.success(`✅ 所有 ${validList.length} 条数据保存成功！`);
        isDialogOpen.value = false; // 全部成功后关闭弹窗
      } else {
        ElMessage.warning(`⚠️ 汇总结果：成功 ${successCount} 条，失败 ${failList.length} 条\n失败物料：${failList.map(item => item.name).join(', ')}`);
      }
    } catch (err) {
      console.error('批量逐条保存异常：', err);
      ElMessage.error('保存过程中发生系统错误，请重试');
    } finally {
      batchSaving.value = false;
    }
  }).catch(() => {
    // 取消保存，不做处理
  });
};
</script>

<style scoped lang="scss">
.material-table-container {
  width: 100%;
  overflow-x: auto;
}

.batch-save-wrapper {
  margin-top: 16px;
  text-align: right;
}

.no-data {
  padding: 40px 0;
  text-align: center;
}

.text-ellipsis {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 表格hover样式优化 */
::v-deep(.el-table__row:hover) {
  background-color: #fafafa !important;
}

/* 操作列按钮样式微调 */
::v-deep(.el-button--mini) {
  padding: 4px 8px;
}
</style>