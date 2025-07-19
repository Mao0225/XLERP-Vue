<template>
  <el-dialog
    title="查看备料计划"
    :model-value="visible"
    width="80%"
    @closed="handleClose"
    @update:model-value="updateVisible"
  >
    <div class="beiliaodan-container">


      <el-table 
        :data="beiliaoList" 
        border 
        size="small" 
        style="width: 100%"
        :span-method="objectSpanMethod"
        class="beiliao-table"
      >
        <!-- 订货产品信息组 -->
        <el-table-column prop="itemno" label="订货产品编码" width="120">
          <template #default="{ row }">
            {{ row.itemno || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="spec" label="订货产品型号" width="120">
          <template #default="{ row }">
            {{ row.spec || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="订货产品名称" min-width="150">
          <template #default="{ row }">
            {{ row.name || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="productUnit" label="订货产品单位" width="80">
          <template #default="{ row }">
            {{ row.productUnit || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="dinghuotaoshu" label="合同订货套数" width="80">
          <template #default="{ row }">
            {{ row.dinghuotaoshu || 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="dinghuotaoshupaichan" label="排产计划生产套数" width="80">
          <template #default="{ row }">
            {{ row.dinghuotaoshupaichan || 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="noticedrawno" label="图纸编号" width="120">
          <template #default="{ row }">
            {{ row.noticedrawno || '-' }}
          </template>
        </el-table-column>
        
        <!-- 子材料信息组 -->
        <el-table-column prop="sxclitemno" label="子材料编码" width="120">
          <template #default="{ row }">
            {{ row.sxclitemno || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="sxclname" label="子材料名称" min-width="150">
          <template #default="{ row }">
            {{ row.sxclname || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="materialUnit" label="材料单位" width="80">
          <template #default="{ row }">
            {{ row.materialUnit || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="sxclshuliang" label="所需材料数量" width="100">
          <template #default="{ row }">
            <span :class="{ 'text-red': row.sxclshuliang === 0 }">
              {{ row.sxclshuliang }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="sxcltihuoshuliang" label="子材料数量" width="100">
          <template #default="{ row }">
            <span :class="{ 'text-red': row.sxcltihuoshuliang === 0 }">
              {{ row.sxcltihuoshuliang }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="sxclshijishuliang" label="实际备货数量" width="100">
          <template #default="{ row }">
            <span :class="{ 'text-red': row.sxclshijishuliang === 0 }">
              {{ row.sxclshijishuliang }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="sxclcaizhi" label="材质" width="100">
          <template #default="{ row }">
            {{ row.sxclcaizhi || '-' }}
          </template>
        </el-table-column>
        
        <!-- 管理信息组 -->
        <el-table-column prop="zhidingbumen" label="制定部门" width="100">
          <template #default="{ row }">
            {{ row.zhidingbumen || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="zhidingriqi" label="制定日期" width="100">
          <template #default="{ row }">
            {{ formatDate(row.zhidingriqi) || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="tiliaoshijian" label="提料时间" width="100">
          <template #default="{ row }">
            {{ formatDate(row.tiliaoshijian) || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="jiaohuoshijian" label="交货时间" width="100">
          <template #default="{ row }">
            {{ formatDate(row.jiaohuoshijian) || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="memo" label="备注" min-width="120">
          <template #default="{ row }">
            {{ row.memo || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="bianzhiren" label="编制人" width="80">
          <template #default="{ row }">
            {{ row.bianzhiren || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="jiaoyanren" label="校验人" width="80">
          <template #default="{ row }">
            {{ row.jiaoyanren || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="shenheren" label="审核人" width="80">
          <template #default="{ row }">
            {{ row.shenheren || '-' }}
          </template>
        </el-table-column>
      </el-table>
      

    </div>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { ElMessage, ElLoading } from 'element-plus';
import { getPlpaichanjihuaBeleiPlan } from '@/api/plmanage/plpaichanjihua';

// 定义组件的 props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  contractno: {
    type: String,
    required: true
  },
  gdItemId: {
    type: [String, Number],
    required: true
  }
});

// 定义事件发射器
const emit = defineEmits(['update:visible', 'update:gdItemId', 'cancel']);

// 响应式数据
const beiliaoList = ref([]);
const spanArr = ref([]);
const rawApiData = ref(null);

// 字段映射配置 - 根据实际API返回字段调整
const fieldMapping = {
  // 如果API返回的字段名不同，在这里配置映射关系
  productUnit: 'unit',        // 订货产品单位
  materialUnit: 'sxclunit',   // 子材料单位，如果API返回的是其他字段名
  // 可以根据需要添加更多映射
};

// 数据处理函数 - 统一处理字段映射和空值
const processApiData = (apiData) => {
  if (!apiData || !Array.isArray(apiData)) {
    console.warn('API数据格式不正确:', apiData);
    return [];
  }

  return apiData.map(item => {
    // 创建处理后的数据对象，处理所有null值
    const processedItem = {};
    
    // 遍历所有字段，将null转换为空字符串或适当的默认值
    Object.entries(item).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        // 数量字段设为0，其他字段设为空字符串
        if (['sxclshijishuliang', 'sxclshuliang', 'sxcltihuoshuliang', 'dinghuotaoshu'].includes(key)) {
          processedItem[key] = 0;
        } else {
          processedItem[key] = '';
        }
      } else {
        processedItem[key] = value;
      }
    });
    
    // 应用字段映射
    Object.entries(fieldMapping).forEach(([targetField, sourceField]) => {
      if (processedItem[sourceField] !== undefined) {
        processedItem[targetField] = processedItem[sourceField];
      }
    });

    // 特殊字段处理和默认值设置
    processedItem.productUnit = processedItem.unit || '套';
    processedItem.materialUnit = processedItem.sxclunit || processedItem.sxcldanwei || processedItem.unit || '套';
    
    // 修复字段名映射问题
    processedItem.sxclname = processedItem.sxclname || processedItem.sxclitemname || '';
    
    // 确保数量字段为数字类型
    ['sxclshijishuliang', 'sxclshuliang', 'sxcltihuoshuliang', 'dinghuotaoshu'].forEach(field => {
      const value = processedItem[field];
      if (typeof value === 'string' && value !== '') {
        processedItem[field] = Number(value) || 0;
      }
    });

    return processedItem;
  });
};

// 日期格式化函数
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  
  // 如果是时间戳
  if (typeof dateStr === 'number') {
    return new Date(dateStr).toLocaleDateString();
  }
  
  // 如果是日期字符串
  if (typeof dateStr === 'string') {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString();
  }
  
  return dateStr;
};

// 处理 visible 的双向绑定
const updateVisible = (value) => {
  console.log('更新 visible:', value);
  emit('update:visible', value);
};

// 处理表格行合并逻辑
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  // 只有前6列（订货产品信息）需要合并
  if (columnIndex < 6) {
    const rowspan = spanArr.value[rowIndex];
    
    // 如果当前行的合并行数为0，说明这一行被合并到上面的行了
    if (rowspan === 0) {
      return {
        rowspan: 0,  // 不显示这个单元格
        colspan: 1
      };
    } else {
      return {
        rowspan: rowspan,  // 显示合并的行数
        colspan: 1
      };
    }
  }
  
  // 第7列及以后的列（子材料信息）不合并，每行都正常显示
  return { 
    rowspan: 1, 
    colspan: 1 
  };
};

// 计算行合并规则
const calculateSpan = () => {
  console.log('计算行合并规则, 数据长度:', beiliaoList.value.length);
  spanArr.value = [];
  
  if (!beiliaoList.value || beiliaoList.value.length === 0) {
    return;
  }
  
  // 初始化所有行的合并数为1（默认不合并）
  beiliaoList.value.forEach(() => {
    spanArr.value.push(1);
  });
  
  let i = 0;
  while (i < beiliaoList.value.length) {
    let rowspan = 1;
    const currentRow = beiliaoList.value[i];
    
    // 向下查找具有相同订货产品信息的行
    for (let j = i + 1; j < beiliaoList.value.length; j++) {
      const nextRow = beiliaoList.value[j];
      
      // 判断是否为相同的订货产品组（前6列的内容）
      const isSameGroup = 
        String(currentRow.itemno || '') === String(nextRow.itemno || '') &&
        String(currentRow.spec || '') === String(nextRow.spec || '') &&
        String(currentRow.name || '') === String(nextRow.name || '') &&
        String(currentRow.productUnit || '') === String(nextRow.productUnit || '') &&
        String(currentRow.dinghuotaoshu || '') === String(nextRow.dinghuotaoshu || '') &&
        String(currentRow.noticedrawno || '') === String(nextRow.noticedrawno || '');
      
      if (isSameGroup) {
        rowspan++;
        // 将被合并的行标记为0（表示这一行的前6列不显示）
        spanArr.value[j] = 0;
      } else {
        // 遇到不同的组就停止
        break;
      }
    }
    
    // 设置当前组第一行的合并行数
    spanArr.value[i] = rowspan;
    console.log(`行 ${i} 设置合并行数: ${rowspan}, 组内包含行: ${i} 到 ${i + rowspan - 1}`);
    
    // 跳到下一个不同的组
    i += rowspan;
  }
  
  console.log('最终合并规则 spanArr:', spanArr.value);
  console.log('合并后预览:');
  spanArr.value.forEach((span, index) => {
    if (span > 0) {
      console.log(`  第${index}行: 合并${span}行 - ${beiliaoList.value[index]?.itemno} ${beiliaoList.value[index]?.spec}`);
    } else {
      console.log(`  第${index}行: 被合并 - ${beiliaoList.value[index]?.itemno} ${beiliaoList.value[index]?.spec}`);
    }
  });
};

// 处理对话框关闭事件
const handleClose = () => {
  emit('update:gdItemId', '');
  emit('cancel');
};

// 数据验证函数
const validateData = (data) => {
  const issues = [];
  
  data.forEach((item, index) => {
    // 检查必要字段是否存在
    const requiredFields = ['itemno', 'spec', 'name', 'sxclitemno', 'sxclname'];
    requiredFields.forEach(field => {
      if (!item[field]) {
        issues.push(`第${index + 1}行缺少字段: ${field}`);
      }
    });
    
    // 检查数量字段是否为数字
    const numberFields = ['dinghuotaoshu', 'sxclshuliang', 'sxcltihuoshuliang', 'sxclshijishuliang'];
    numberFields.forEach(field => {
      if (item[field] !== undefined && isNaN(Number(item[field]))) {
        issues.push(`第${index + 1}行字段${field}不是有效数字: ${item[field]}`);
      }
    });
  });
  
  if (issues.length > 0) {
    console.warn('数据验证发现问题:', issues);
    ElMessage.warning(`数据验证发现 ${issues.length} 个问题，请检查控制台`);
  }
  
  return issues;
};

// 加载备料计划数据
const loadBeiliaoData = async () => {
  if (!props.gdItemId) {
    console.log('无效的 gdItemId:', props.gdItemId);
    ElMessage.error('无效的工单ID');
    return;
  }

  let loading = null;
  try {
    loading = ElLoading.service({
      lock: true,
      text: '加载数据中...',
      background: 'rgba(0, 0, 0, 0.7)'
    });

    console.log('开始加载备料计划数据，gdItemId:', props.gdItemId);
    const res = await getPlpaichanjihuaBeleiPlan(props.gdItemId);
    
    // 保存原始API数据用于调试
    rawApiData.value = res;
    console.log('API响应:', res);
    
    if (res.success) {
      const apiData = res.data.List || [];
      console.log('原始数据条数:', apiData.length);
      
      if (apiData.length === 0) {
        ElMessage.warning('未获取到备料计划数据');
        beiliaoList.value = [];
        return;
      }

      // 处理数据
      const processedData = processApiData(apiData);
      console.log('处理后数据条数:', processedData.length);
      
      // 数据验证
      validateData(processedData);

      // 排序数据
      processedData.sort((a, b) => {
        // 按订货产品信息分组排序
        const fields = ['itemno', 'spec', 'name', 'productUnit', 'noticedrawno'];
        for (const field of fields) {
          const aVal = String(a[field] || '');
          const bVal = String(b[field] || '');
          if (aVal !== bVal) {
            return aVal.localeCompare(bVal);
          }
        }
        
        // 数量字段按数值排序
        const aDinghua = Number(a.dinghuotaoshu) || 0;
        const bDinghua = Number(b.dinghuotaoshu) || 0;
        return aDinghua - bDinghua;
      });

      beiliaoList.value = processedData;
      console.log('最终表格数据:', beiliaoList.value);
      
      // 计算行合并
      calculateSpan();
      
      ElMessage.success(`成功加载 ${beiliaoList.value.length} 条备料计划数据`);
    } else {
      console.error('API请求失败:', res.msg);
      ElMessage.error(res.msg || '获取备料计划失败');
      beiliaoList.value = [];
    }
  } catch (error) {
    console.error('获取备料计划失败:', error);
    ElMessage.error('获取备料计划失败: ' + error.message);
    beiliaoList.value = [];
  } finally {
    loading?.close();
  }
};

// 监听 visible 变化
watch(() => props.visible, (newVal) => {
  console.log('visible 变化:', newVal);
  if (newVal) {
    loadBeiliaoData();
  }
});

// 监听数据变化（用于调试）
watch(beiliaoList, (newVal) => {
  console.log('beiliaoList 数据更新，条数:', newVal.length);
}, { deep: true });
</script>

<style scoped>
.beiliaodan-container {
  padding: 12px;
}

/* 表格样式优化 */
.beiliao-table :deep(.el-table--border),
.beiliao-table :deep(.el-table--group) {
  border: 2px solid #dcdfe6 !important;
}

.beiliao-table :deep(.el-table__header-wrapper th) {
  background-color: #f5f7fa;
  font-weight: bold;
  border-right: 1px solid #dcdfe6 !important;
  border-bottom: 2px solid #dcdfe6 !important;
  text-align: center;
}

.beiliao-table :deep(.el-table__body-wrapper td) {
  border-right: 1px solid #ebeef5 !important;
  border-bottom: 1px solid #ebeef5 !important;
  text-align: center;
}

/* 订货产品信息列（前6列）的样式 */
.beiliao-table :deep(.el-table__body tr td:nth-child(-n+6)) {
  background-color: #fafafa;
  font-weight: 500;
}

/* 子材料信息列（第7列开始）的样式 */
.beiliao-table :deep(.el-table__body tr td:nth-child(n+7)) {
  background-color: #ffffff;
}

/* 合并单元格的边框加强 */
.beiliao-table :deep(.el-table__body tr td[rowspan]) {
  border-right: 2px solid #409eff !important;
}

/* 空值和异常数据样式 */
.text-red {
  color: #f56c6c;
  font-weight: bold;
}



pre {
  font-size: 12px;
  max-height: 300px;
  overflow-y: auto;
}
</style>