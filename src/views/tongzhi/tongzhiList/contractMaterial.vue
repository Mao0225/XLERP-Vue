<template>
  <!-- 物料清单弹窗 -->
  <el-dialog
    v-model="isDialogOpen"
    :title="`合同原材料清单（按物料编号合并） - ${props.contractName}`"
    width="90%"
    max-height="80vh"
    :close-on-click-modal="false"
    @open="fetchMaterialList"
  >
    <!-- 加载中 -->
    <el-skeleton v-if="loading" :rows="10" :columns="8" animation="wave" />

    <!-- 无数据 - 显示生成按钮 -->
    <div v-else-if="materialLeafList.length === 0" class="no-data">
      <el-empty description="该合同暂无备料单数据">
        <el-button 
          type="primary" 
          :loading="generating"
          @click="handleGenerateMaterialList"
        >
          生成备料单
        </el-button>
      </el-empty>
    </div>

    <!-- 表格 + 操作按钮 -->
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
        <el-table-column label="总用量" prop="quantity" width="120" align="center">
          <template #default="scope">{{ formatQuantity(scope.row.quantity) }}</template>
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

        <!-- 备注 - 区分已保存和未保存状态 -->
        <el-table-column label="备注" width="220" align="center">
          <template #default="scope">
            <div v-if="!isGenerated" class="memo-cell">
              <el-input
                v-model="scope.row.memo"
                placeholder="请输入备注"
                clearable
                size="small"
              />
            </div>
            <div v-else class="memo-cell">
              <el-input
                v-if="scope.row.isEditing"
                v-model="scope.row.tempMemo"
                placeholder="请输入备注"
                clearable
                size="small"
              />
              <span v-else class="memo-text">{{ scope.row.memo || '-' }}</span>
            </div>
          </template>
        </el-table-column>

        <!-- 操作列 - 仅已保存时显示 -->
        <el-table-column v-if="isGenerated" label="操作" width="180" align="center" fixed="right">
          <template #default="scope">
            <div v-if="!scope.row.isEditing">
              <el-button
                type="primary"
                size="small"
                link
                @click="handleEditMemo(scope.row)"
              >
                修改备注
              </el-button>
            </div>
            <div v-else class="action-buttons">
              <el-button
                type="success"
                size="small"
                :loading="scope.row.saving"
                @click="handleSaveMemo(scope.row)"
              >
                保存
              </el-button>
              <el-button
                size="small"
                @click="handleCancelEdit(scope.row)"
              >
                取消
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 操作按钮区域 -->
      <div class="button-wrapper">
        <!-- 未保存状态：显示一键保存按钮 -->
        <template v-if="!isGenerated">
          <el-button
            type="primary"
            :loading="batchSaving"
            @click="handleBatchSave"
            size="default"
          >
            一键保存备料计划单
          </el-button>
        </template>

        <!-- 已保存状态：显示重新生成按钮 -->
        <template v-else>
          <el-button
            type="warning"
            :loading="regenerating"
            @click="handleRegenerate"
            size="default"
          >
            重新生成备料单
          </el-button>
        </template>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 接口引入
import { 
  saveContractMaterial, 
  getContractMaterialList, 
  generateContractMaterialList,
  updateContractMaterial,
  deleteMaterialByContractNo
} from '@/api/contract/bascontractmaterial';

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
const generating = ref(false); // 生成备料单加载状态
const batchSaving = ref(false); // 批量保存加载状态
const regenerating = ref(false); // 重新生成加载状态
const materialLeafList = ref([]); // 表格数据
const isGenerated = ref(false); // 是否已生成过备料单（有已保存数据）

// ==================== 弹窗状态同步 ====================
watch(() => isDialogOpen.value, (val) => {
  emit('update:visible', val);
});

watch(() => props.visible, (val) => {
  isDialogOpen.value = val;
});

// ==================== 数据处理工具函数 ====================
/**
 * 解析JSON字符串（处理后端返回的数组字符串）
 */
const parseJson = (str) => {
  if (!str || typeof str !== 'string') return [];
  try {
    return JSON.parse(str.replace(/"/g, '"').replace(/'/g, '"'));
  } catch (e) {
    // console.error('解析JSON失败：', str, e);
    return [];
  }
};

/**
 * 格式化数量（保留2位小数）
 */
const formatQuantity = (quantity) => {
  if (quantity === null || quantity === undefined || quantity === '') return '0.00';
  const num = typeof quantity === 'object' 
    ? Number(quantity.toString()) 
    : Number(quantity);
  return isNaN(num) ? '0.00' : num.toFixed(2);
};

// ==================== 获取已保存的备料单列表 ====================
const fetchMaterialList = async () => {
  if (!props.contractNo) return;
  loading.value = true;
  try {
    // 查询是否已有保存的备料单数据
    const savedRes = await getContractMaterialList({ contractNo: props.contractNo });
    if (savedRes.success && Array.isArray(savedRes.data?.record) && savedRes.data.record.length > 0) {
      // 标记为已生成
      isGenerated.value = true;
      // 处理已保存数据
      materialLeafList.value = savedRes.data.record.map(item => ({
        id: item.id, // 备料单记录ID
        itemId: item.itemId, // 物料ID
        no: item.itemNo || '-', // 物料编号
        name: item.itemName || '-', // 物料名称
        spec: item.itemSpec || '-', // 规格型号
        unit: item.unit || '-', // 计量单位
        quantity: item.planQuantity || item.actualQuantity || 0, // 用量
        inclass: item.inclass || '-', // 物料分类
        contractItemIds: parseJson(item.contractItemIds), // 关联主产品ID数组
        itemNames: parseJson(item.contractItemNames), // 关联主产品名称数组
        memo: item.memo || '', // 备注
        tempMemo: item.memo || '', // 临时备注（用于编辑）
        isEditing: false, // 是否正在编辑
        saving: false // 保存中状态
      }));
    } else {
      // 无已保存数据
      materialLeafList.value = [];
      isGenerated.value = false;
    }
  } catch (err) {
    // console.error('获取备料单列表失败：', err);
    ElMessage.error('加载数据失败，请重试');
    materialLeafList.value = [];
    isGenerated.value = false;
  } finally {
    loading.value = false;
  }
};

// ==================== 生成备料单（初次生成） ====================
const handleGenerateMaterialList = async () => {
  generating.value = true;
  try {
    const generateRes = await generateContractMaterialList({ contractNo: props.contractNo });
    // console.log('生成备料单接口返回：', generateRes); // 调试日志
    
    if (generateRes.success && Array.isArray(generateRes.data?.record) && generateRes.data.record.length > 0) {
      // 处理生成数据 - 兼容多种字段命名
      materialLeafList.value = generateRes.data.record.map(item => ({
        itemId: item.itemId || item.id || item.materialId, // 兼容不同的ID字段名
        no: item.no || item.itemNo || '-',
        name: item.name || item.itemName || '-',
        spec: item.spec || item.itemSpec || '-',
        unit: item.unit || '-',
        quantity: item.actualQuantity || item.quantity || item.planQuantity || 0,
        inclass: item.inclass || item.material || '-',
        contractItemIds: item.contractItemIds || [],
        itemNames: item.itemNames || item.contractItemNames || [],
        memo: '',
        saving: false
      }));
      
      // 过滤掉无效数据
      const validCount = materialLeafList.value.filter(row => row.itemId).length;
      // console.log('生成数据条数：', materialLeafList.value.length, '有效数据条数：', validCount);
      
      isGenerated.value = false; // 标记为未保存状态
      ElMessage.success(`备料单生成成功（${validCount}条有效数据），请确认后点击保存`);
    } else {
      ElMessage.warning('未生成任何备料数据，请检查合同配置');
    }
  } catch (err) {
    // console.error('生成备料单失败：', err);
    ElMessage.error('生成失败，请重试');
  } finally {
    generating.value = false;
  }
};

// ==================== 一键保存备料计划单 ====================
const handleBatchSave = async () => {
  // console.log('开始保存，当前数据：', materialLeafList.value); // 调试日志
  
  const validList = materialLeafList.value.filter(row => {
    const hasItemId = row.itemId && row.itemId !== '' && row.itemId !== '-';
    const hasQuantity = row.quantity !== null && row.quantity !== undefined && row.quantity > 0;
    // console.log('验证行数据：', { 
    //   name: row.name, 
    //   itemId: row.itemId, 
    //   hasItemId, 
    //   quantity: row.quantity, 
    //   hasQuantity 
    // });
    return hasItemId && hasQuantity;
  });

  // console.log('有效数据条数：', validList.length);

  if (validList.length === 0) {
    ElMessage.warning('没有可保存的备料数据（需包含有效物料ID和用量）');
    return;
  }

  ElMessageBox.confirm(
    `确定保存 ${validList.length} 条备料计划数据？`,
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
      for (let i = 0; i < validList.length; i++) {
        const row = validList[i];
        const index = materialLeafList.value.findIndex(item => item.itemId === row.itemId);
        if (index === -1) continue;

        materialLeafList.value[index].saving = true;

        const payload = {
          planQuantity: row.quantity,
          contractItemIds: row.contractItemIds || [],
          contractItemNames: row.itemNames || [],
          itemId: row.itemId,
          contractNo: props.contractNo,
          contractName: props.contractName,
          writer: userStore.realName || '未知用户',
          memo: (row.memo || '').trim()
        };

        // console.log(`保存第 ${i + 1} 条数据：`, payload); // 调试日志

        try {
          const res = await saveContractMaterial(payload);
          if (res.success) {
            successCount++;
          } else {
            throw new Error(res.message || '保存失败');
          }
        } catch (err) {
          failList.push({ 
            name: row.name || row.no,
            msg: err.message 
          });
        } finally {
          materialLeafList.value[index].saving = false;
        }
      }

      if (failList.length === 0) {
        ElMessage.success(`✅ 所有 ${validList.length} 条备料计划保存成功！`);
        // 保存成功后重新加载数据
        await fetchMaterialList();
      } else {
        ElMessage.warning(`⚠️ 保存完成：成功 ${successCount} 条，失败 ${failList.length} 条`);
      }
    } catch (err) {
      // console.error('批量保存异常：', err);
      ElMessage.error('保存过程中发生错误');
    } finally {
      batchSaving.value = false;
    }
  }).catch(() => {});
};

// ==================== 编辑备注 ====================
const handleEditMemo = (row) => {
  row.isEditing = true;
  row.tempMemo = row.memo;
};

// ==================== 取消编辑备注 ====================
const handleCancelEdit = (row) => {
  row.isEditing = false;
  row.tempMemo = row.memo;
};

// ==================== 保存单条备注 ====================
const handleSaveMemo = async (row) => {
  if (!row.id) {
    ElMessage.error('缺少备料单ID，无法保存');
    return;
  }

  row.saving = true;
  try {
    const payload = {
      id: row.id,
      planQuantity: row.quantity,
      contractItemIds: row.contractItemIds || [],
      contractItemNames: row.itemNames || [],
      itemId: row.itemId,
      contractNo: props.contractNo,
      contractName: props.contractName,
      writer: userStore.realName || '未知用户',
      memo: (row.tempMemo || '').trim()
    };

    const res = await updateContractMaterial(payload);
    if (res.success) {
      row.memo = row.tempMemo;
      row.isEditing = false;
      ElMessage.success('备注保存成功');
    } else {
      throw new Error(res.message || '保存失败');
    }
  } catch (err) {
    // console.error('保存备注失败：', err);
    ElMessage.error(`保存失败：${err.message}`);
  } finally {
    row.saving = false;
  }
};

// ==================== 重新生成备料单 ====================
const handleRegenerate = async () => {
  // console.log('重新生成 - 当前数据：', materialLeafList.value); // 调试日志
  
  ElMessageBox.confirm(
    '重新生成将删除当前所有备料单数据，确定继续？',
    '警告',
    { 
      type: 'warning',
      confirmButtonText: '确认删除并重新生成',
      cancelButtonText: '取消'
    }
  ).then(async () => {
    regenerating.value = true;
    try {
      // 1. 检查是否有已保存的备料单数据
      const hasData = materialLeafList.value.some(row => row.id);
      // console.log('是否有已保存数据：', hasData); // 调试日志
      
      if (hasData) {
        // 2. 批量删除该合同下的所有备料单（调用后端批量删除接口）
        // console.log('开始批量删除，合同编号：', props.contractNo); // 调试日志
        
        try {
          const deleteRes = await deleteMaterialByContractNo({ contractNo: props.contractNo });
          // console.log('批量删除结果：', deleteRes); // 调试日志
          
          if (!deleteRes.success) {
            // 删除失败，中止流程
            ElMessage.error({
              message: `❌ 删除旧备料单失败：${deleteRes.message || '未知错误'}\n无法继续生成，请稍后重试`,
              duration: 5000,
              showClose: true
            });
            regenerating.value = false;
            return; // 终止后续流程
          }
          
          // 删除成功
          ElMessage.success('✅ 已成功删除所有旧备料单数据');
        } catch (deleteErr) {
          // 删除接口调用异常
          // console.error('批量删除接口调用失败：', deleteErr);
          ElMessage.error({
            message: `❌ 删除失败：${deleteErr.message || '网络错误'}\n无法继续生成，请检查网络或稍后重试`,
            duration: 5000,
            showClose: true
          });
          regenerating.value = false;
          return; // 终止后续流程
        }
      } else {
        // console.log('无已保存数据，跳过删除步骤');
      }

      // 3. 重新生成备料单（只有删除成功或无需删除时才执行）
      // console.log('开始重新生成备料单，合同编号：', props.contractNo); // 调试日志
      const generateRes = await generateContractMaterialList({ contractNo: props.contractNo });
      // console.log('重新生成接口返回：', generateRes); // 调试日志
      
      if (generateRes.success && Array.isArray(generateRes.data?.record) && generateRes.data.record.length > 0) {
        materialLeafList.value = generateRes.data.record.map(item => ({
          itemId: item.itemId || item.id || item.materialId,
          no: item.no || item.itemNo || '-',
          name: item.name || item.itemName || '-',
          spec: item.spec || item.itemSpec || '-',
          unit: item.unit || '-',
          quantity: item.actualQuantity || item.quantity || item.planQuantity || 0,
          inclass: item.inclass || item.material || '-',
          contractItemIds: item.contractItemIds || [],
          itemNames: item.itemNames || item.contractItemNames || [],
          memo: '',
          saving: false
        }));
        isGenerated.value = false; // 标记为未保存状态
        
        const validCount = materialLeafList.value.filter(row => row.itemId).length;
        ElMessage.success(`🎉 备料单重新生成成功（${validCount}条有效数据），请确认后保存`);
      } else {
        ElMessage.warning('重新生成失败，未生成任何数据');
        // 重新加载（可能为空）
        await fetchMaterialList();
      }
    } catch (err) {
      console.error('重新生成备料单失败：', err);
      ElMessage.error(`重新生成失败：${err.message || '未知错误'}，请重试`);
    } finally {
      regenerating.value = false;
    }
  }).catch(() => {
    console.log('用户取消重新生成'); // 调试日志
  });
};
</script>

<style scoped lang="scss">
.material-table-container {
  width: 100%;
  overflow-x: auto;
}

.button-wrapper {
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

.memo-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.memo-text {
  color: #606266;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

/* 表格hover样式优化 */
::v-deep(.el-table__row:hover) {
  background-color: #fafafa !important;
}

/* 输入框禁用样式优化 */
::v-deep(.el-input.is-disabled .el-input__inner) {
  background-color: #f9f9f9;
  color: #666;
}
</style>