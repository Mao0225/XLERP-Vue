<template>
  <el-dialog
    v-model="dialogVisible"
    title="选择生产工单进行报工"
    width="1100px"
    :before-close="handleClose"
    destroy-on-close
  >
    <!-- 搜索区域 -->
    <div class="search-section">
      <el-form :model="filters" inline>
        <el-form-item label="合同号：">
          <el-input 
            v-model="filters.contractNo" 
            placeholder="请输入合同号" 
            clearable 
            style="width: 200px;"
          />
        </el-form-item>
        <el-form-item label="合同名称：">
          <el-input 
            v-model="filters.contractName" 
            placeholder="请输入合同名称" 
            clearable 
            style="width: 200px;"
          />
        </el-form-item>
        <el-form-item label="生产工单号：">
          <el-input 
            v-model="filters.woNo" 
            placeholder="请输入生产工单号" 
            clearable 
            style="width: 200px;"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格区域 -->
    <el-table 
      :data="tableData" 
      v-loading="loading"
      height="450"
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="index" label="序号" width="60" />
      

      <el-table-column 
        prop="woNo" 
        label="生产工单号" 
        width="150" 
        show-overflow-tooltip
      />
            <el-table-column 
        prop="materialsCode" 
        label="物料编码" 
        width="150" 
        show-overflow-tooltip
      />
      <el-table-column 
        prop="materialsName" 
        label="物料名称" 
        width="100" 
        show-overflow-tooltip
      />
      <el-table-column 
        prop="modelSpec" 
        label="规格型号" 
        width="130" 
        show-overflow-tooltip
      />
      <el-table-column 
        label="生产数量" 
        width="120" 
        align="center"
      >
        <template #default="{ row }">
          {{ row.amount }} {{ row.unit }}
        </template>
      </el-table-column>
      <el-table-column 
        label="计划开始日期" 
        width="120" 
        align="center"
      >
        <template #default="{ row }">
          {{ row.planStartDate }}
        </template>
      </el-table-column>
      <el-table-column 
        label="计划完成日期" 
        width="120" 
        align="center"
      >
        <template #default="{ row }">
          {{ row.planFinishDate }}
        </template>
      </el-table-column>
      <el-table-column 
        label="操作" 
        width="100" 
        fixed="right"
      >
        <template #default="{ row }">
          <el-button 
            type="primary" 
            size="small" 
            @click="openAddDialog(row)"
          >
            制定报工单
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="pagination.current"
        v-model:page-size="pagination.size"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
      </span>
    </template>

        <!-- 弹窗组件 -->
    <addOrder
      :visible="addDialogVisible"
      :new-code="newCode"
      :workOrder = selectedRows
      @update:visible="addDialogVisible = $event"
      @success="handleAddSuccess"
    />
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh, CircleCheck, Clock } from '@element-plus/icons-vue'
import { getConfirmOrderList } from '@/api/plmanage/plworkorder'
import addOrder from './addOrder.vue'
import { getNewNoNyName } from '@/api/system/basno';

// Props定义
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },

})

// Emits定义
const emits = defineEmits(['update:visible', 'select'])

// 响应式数据
const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emits('update:visible', val)
})

const loading = ref(false)
const tableData = ref([])
const selectedRows = ref([])

// 搜索条件
const filters = reactive({
  contractNo: '',
  contractName: '',
  woNo: '',
})

// 分页
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})
const newCode = ref('');

// 生成新编码
const generateNewCode = async () => {
  try {
    const res = await getNewNoNyName('bgd');
    if (res?.code === 200) {
      return res.data.fullNoNyName;
    }
    ElMessage.error(res?.msg || '获取编码失败');
    return '';
  } catch (error) {
    console.error('生成编码出错:', error);
    ElMessage.error('请求编码服务时发生错误');
    return '';
  }
};


const addDialogVisible = ref(false);

// 弹窗操作
const openAddDialog = async (row) => {
  newCode.value = await generateNewCode();
  selectedRows.value = row;
  addDialogVisible.value = true;
};
const handleAddSuccess = () => {
  addDialogVisible.value = false;
  ElMessage.success('报工单添加成功');
  fetchData();
};



// 获取数据
const fetchData = async () => {
  try {
    loading.value = true
    const params = {
      pageNumber: pagination.current,
      pageSize: pagination.size,
      contractNo: filters.contractNo || undefined,
      contractName: filters.contractName || undefined,
      woNo: filters.woNo || undefined,
    }

    // 过滤空值参数
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
    )

    const res = await getConfirmOrderList(filteredParams)

    if (res.code === 200 && res.success) {
      tableData.value = res.data.page.list.map(item => ({
        id: item.id,
        purchaserHqCode: item.purchaserHqCode,
        supplierCode: item.supplierCode,
        supplierName: item.supplierName,
        woNo: item.woNo,
        categoryCode: item.categoryCode,
        materialsCode: item.materialsCode,
        materialsName: item.materialsName,
        materialsDescription: item.materialsDescription || '无',
        materialsBatch: item.materialsBatch || '无',
        amount: item.amount,
        unit: item.unit,
        planStartDate: item.planStartDate ? item.planStartDate.split(' ')[0] : '',
        planFinishDate: item.planFinishDate ? item.planFinishDate.split(' ')[0] : '',
        actualStartDate: item.actualStartDate ? item.actualStartDate.split(' ')[0] : '',
        actualFinishDate: item.actualFinishDate ? item.actualFinishDate.split(' ')[0] : '',
        woStatus: item.woStatus || '未开始',
        entityCode: item.entityCode || '无',
        processRouteNo: item.processRouteNo || '无',
        voltageLevel: item.voltageLevel || '无',
        modelSpec: item.modelSpec || '无',
        writer: item.writer || '未知',
        // 保留完整数据以便选择时传递
        ...item
      }))
      
      pagination.total = res.data.page.totalRow
    } else {
      throw new Error(res.msg || '获取数据失败')
    }
  } catch (error) {
    ElMessage.error(error.message || '获取数据失败')
    tableData.value = []
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  pagination.current = 1
  fetchData()
}

// 处理重置
const handleReset = () => {
  Object.assign(filters, {
    contractNo: '',
    contractName: '',
    woNo: '',
  })
  pagination.current = 1
  selectedRows.value = []
  fetchData()
}

// 处理分页
const handleSizeChange = (val) => {
  pagination.size = val
  pagination.current = 1
  fetchData()
}

const handleCurrentChange = (val) => {
  pagination.current = val
  fetchData()
}

// 处理选择变化
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 处理单行选择
const handleSelect = (row) => {
  emits('select', row)
  handleClose()
}

// 关闭弹窗
const handleClose = () => {
  dialogVisible.value = false
  selectedRows.value = []
}

// 监听弹窗显示状态
watch(dialogVisible, (newVal) => {
  if (newVal) {
    // 弹窗打开时加载数据
    fetchData()
  } else {
    // 弹窗关闭时重置数据
    Object.assign(filters, {
      contractNo: '',
      contractName: '',
      woNo: '',
    })
    pagination.current = 1
  }
})


</script>

<style scoped>
.search-section {
  margin-bottom: 16px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.search-section .el-form-item {
  margin-bottom: 0;
}

.pagination-container {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 表格样式优化 */
:deep(.el-table .el-table__row:hover > td) {
  background-color: #f5f7fa;
}

:deep(.el-table .current-row > td) {
  background-color: #ecf5ff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-section .el-form {
    display: block;
  }
  
  .search-section .el-form-item {
    display: block;
    margin-bottom: 12px;
  }
  
  .search-section .el-form-item:last-child {
    margin-bottom: 0;
  }
  
  .search-section .el-input,
  .search-section .el-select {
    width: 100% !important;
  }
}
</style>