<template>
  <el-dialog v-model="dialogVisible" title="物料列表" width="80%" :close-on-click-modal="false">
    <!-- 合同信息 -->
    <el-card shadow="never" class="contract-info-card">
      <el-row :gutter="12">
        <el-col :span="6">
          <el-form-item label="合同号">
            <el-input v-model="contractInfo.no" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="合同名称">
            <el-input v-model="contractInfo.name" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="国网经法合同号">
            <el-input v-model="contractInfo.ecpno" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="器材合同号">
            <el-input v-model="contractInfo.equipno" readonly />
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>

    <!-- 搜索区域 -->
   <el-form :model="materialSearchForm" inline class="search-form">
  <el-form-item label="物料名称">
    <el-input v-model="materialSearchForm.keyword" placeholder="请输入物料名称" clearable @clear="loadMaterialList" @keyup.enter="loadMaterialList" />
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="loadMaterialList">搜索</el-button>

  </el-form-item>
  <el-form-item class="summary-info">
    <span>总金额: ¥{{ totalAmount.toFixed(2) }}</span>
    <span style="margin-left: 20px;">总重量: {{ totalWeight.toFixed(2) }}kg</span>
  </el-form-item>
</el-form>

    <!-- 物料列表 -->
    <el-table
      :data="materialList"
      border
      size="small"
      style="width: 100%"
      :row-key="row => row.id"
      v-loading="materialLoading"
    >
    <!-- 在 <el-table> 内添加序号列 -->
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

  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { getContractItemPage,getContractItemTotal } from '@/api/contract/bascontract';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  contractInfo: {
    type: Object,
    default: () => ({
      no: '',
      name: '',
      ecpno: '',
      equipno: '',
      status: 10
    })
  }
});

const emit = defineEmits(['update:visible']);

const dialogVisible = ref(false);
const materialLoading = ref(false);
const materialList = ref([]);
const materialSearchForm = reactive({
  keyword: ''
});
const materialPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});



// 同步 dialogVisible
watch(
  () => props.visible,
  (newVal) => {
    dialogVisible.value = newVal;
    if (newVal && props.contractInfo.no) {
      loadMaterialList();
    }
  }
);

watch(dialogVisible, (newVal) => {
  emit('update:visible', newVal);
});

// 加载物料列表
const loadMaterialList = async () => {
  if (!props.contractInfo.no) return;

  materialLoading.value = true;
  try {
    const params = {
      pageNumber: materialPagination.currentPage,
      pageSize: materialPagination.pageSize,
      contractNo: props.contractInfo.no,
      itemName: materialSearchForm.keyword
    };

    const response = await getContractItemPage(params);
    if (response.success) {
      const itemData = response.data.itemList;
      materialList.value = itemData.list || [];
      materialPagination.total = itemData.totalRow || 0;
      
      // 确保加载列表后更新总金额和总重量
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


const totalAmount = ref(0);

const totalWeight= ref(0);

// 获取合同总金额和总重量
const getContractTotal = async () => { 
  try {
    const res = await getContractItemTotal({ contractNo: props.contractInfo.no });
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


</script>

<style scoped>
.contract-info-card {
  margin-bottom: 12px;
}

.summary-info {
  float: right;
  font-size: 13px;
  color: #606266;
}

.contract-info-card :deep(.el-card__body) {
  padding: 12px;
}

.search-form {
  margin-bottom: 12px;
}

:deep(.el-form-item) {
  margin-bottom: 12px;
}

:deep(.el-form-item__label) {
  font-size: 12px;
}

:deep(.el-input--small) {
  font-size: 12px;
}

:deep(.el-table) {
  font-size: 12px;
}

:deep(.el-table th) {
  background-color: #fafafa;
}

.pagination {
  margin-top: 12px;
  text-align: right;
}
</style>