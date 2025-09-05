<template>
  <div class="compact-form-container">
    <!-- 入库主要信息 -->
    <div class="form-section">
      <div class="section-title">入库主要信息</div>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="单据号">
            <span>{{ form.orderno }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="收发日期">
            <span>{{ form.receivedate }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="送货单位">
            <span>{{ form.deliverunit }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="仓库">
            <span>{{ form.store }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="业务类型">
            <span>{{ flagLabel }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同编号">
            <span>{{ form.contractNo }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="期间">
            <span>{{ form.term }}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </div>

    <!-- 物料列表 -->
    <div class="form-section">
      <div class="section-title">物料列表</div>
      <el-table :data="form.materials || []" border style="width: 100%">
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column prop="woNo" label="生产工单号" width="120" />
        <el-table-column prop="ipoNo" label="生产订单号" width="120" />
        <el-table-column prop="scheduleCode" label="排产计划号" width="120" />
        <el-table-column prop="materialno" label="物料编号" width="120" />
        <el-table-column prop="materialname" label="物料名称" width="150" />
        <el-table-column prop="spec" label="规格型号" width="120" />
        <el-table-column prop="unit" label="计量单位" width="100" />
        <el-table-column prop="quantity" label="数量" width="100" />
        <el-table-column prop="price" label="计划单价" width="100" />
        <el-table-column prop="totalmoney" label="计划总金额" width="100" />
        <el-table-column prop="realprice" label="销售单价" width="100" />
        <el-table-column prop="realTotalMoney" label="销售总金额" width="100" />
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Define component props
const props = defineProps({
  formData: {
    type: Object,
    default: () => ({
      orderno: '',
      receivedate: '',
      deliverunit: '',
      store: '',
      flag: '',
      contractNo: '',
      term: '',
      materials: []
    })
  }
});

// Reactive form data
const form = ref(props.formData);

// Map flag value to label for display
const flagOptions = ref([
  { value: 1, label: '采购入库' },
  { value: 2, label: '调拨入库' },
  { value: 3, label: '其他入库' }
]);

const flagLabel = computed(() => {
  const option = flagOptions.value.find(item => item.value === form.value.flag);
  return option ? option.label : form.value.flag;
});
</script>

<style scoped>
.compact-form-container {
  max-width: 1000px;
  padding: 16px;
  background: #fff;
}

.form-section {
  margin-bottom: 20px;
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background: #fafafa;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e4e7ed;
}

.el-form-item {
  margin-bottom: 12px;
}

.el-form-item__label {
  font-size: 13px;
  color: #606266;
}

@media (max-width: 768px) {
  .compact-form-container {
    padding: 12px;
  }
  
  .form-section {
    padding: 12px;
  }
}
</style>