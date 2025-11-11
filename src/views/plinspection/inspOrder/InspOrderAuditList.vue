<template>
  <div class="insp-list">
    <div class="action-bar">
      <el-input v-model="query.orderNo" placeholder="检验单号" style="width:180px;margin-right:10px" clearable @clear="getList" @keyup.enter="getList" />
      <el-input v-model="query.batchNo" placeholder="炉批号" style="width:180px;margin-right:10px" clearable @clear="getList" @keyup.enter="getList" />
      <el-button type="primary" @click="getList">搜索</el-button>
    </div>

    <el-table :data="list" border v-loading="loading">
      <el-table-column type="index" label="序号" width="70" />
            <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)">{{ getStatusLabel(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="orderNo" label="检验单号" width="160" />
      <el-table-column prop="itemName" label="物料名称" width="100" />
      <el-table-column prop="itemCode" label="物料编码" width="100" />
      <el-table-column prop="itemSpec" label="物料型号" width="120" />
      <el-table-column prop="batchNo" label="炉批号" width="130" />
      <el-table-column prop="batchNumber" label="批次号" width="130" />
      <el-table-column prop="reporter" label="报检人" width="100" />
      
      <el-table-column prop="actualMaterial" label="到货材质" width="120" />
      <el-table-column prop="actualSpec" label="到货型号" width="120" />


      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button v-if="row.status == 10" size="small" type="primary" @click="updateStatus(row, 11)">审核通过</el-button>
          <el-button v-if="row.status == 10" size="small" type="danger" @click="updateStatus(row, 12, true)">审核拒绝</el-button>
          <el-button  type="primary" size="small" @click="openInfoForm(row)">查看信息</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination v-model:current-page="query.pageNumber" v-model:page-size="query.pageSize" :page-sizes="[10,20,50]" layout="total, sizes, prev, pager, next" :total="total" @size-change="getList" @current-change="getList" />
    </div>
  </div>
  <InspDataReadonly
  v-model="showReadDialog"
  :order-data="currentOrder"
  />
</template>

<script setup>
import { onMounted,ref } from 'vue'
import { useInspOrder } from './useInspOrder'
  import InspDataReadonly from './inspDataFormReadonly.vue'

const { query, list, total, loading, getList, updateStatus } = useInspOrder(10)
	const showReadDialog = ref(false)

const currentOrder = ref(null)
const openInfoForm = (row) => {
    // 此处实现获取检验结果的逻辑，示例：
  showReadDialog.value = true
  currentOrder.value = row
}
// 基础状态配置
const baseStatusOptions = [
  { label: '报检待审核', value: 10 },
  { label: '审核不通过', value: 12 }
]
// 状态标签映射（未配置的状态默认显示"审核通过"）
const statusMap = Object.fromEntries(baseStatusOptions.map(s => [s.value, s.label]))
// 获取状态文本：未匹配到的状态都显示"审核通过"
const getStatusLabel = s => statusMap[s] || '审核通过'
// 获取标签类型：未匹配到的状态都使用success类型
const getStatusTagType = s => {
  const typeMap = {
    10: 'warning',  // 报检待审核-警告色
    12: 'danger'    // 审核不通过-危险色
  }
  return typeMap[s] || 'success'  // 其他状态默认成功色
}

onMounted(getList)
</script>

<style scoped>
.insp-list { padding: 20px; }
.action-bar { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 20px; }
.pagination { margin-top: 20px; text-align: right; }
</style>