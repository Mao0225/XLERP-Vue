<template>
  <div class="insp-list">
    <div class="action-bar">
      <el-input v-model="query.orderNo" placeholder="检验单号" style="width:180px;margin-right:10px" clearable
        @clear="getList" @keyup.enter="getList" />
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
      <el-table-column prop="contractNo" label="合同编号" width="120" />
      <el-table-column prop="contractName" label="合同名称" width="120" />
      <el-table-column prop="itemName" label="物料名称" width="150" />
      <el-table-column prop="itemCode" label="物料编码" width="150" show-overflow-tooltip />
      <el-table-column prop="itemSpec" label="物料型号" width="120" />
      <el-table-column prop="amount" label="数量" width="100" align="center">
        <template #default="scope">
          <span style="color: #E6A23C; font-weight: bold">{{ scope.row.amount }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="reporter" label="报检人" width="110" align="center" />
      <el-table-column prop="inspector" label="检验员" width="110" align="center">
        <template #default="scope">{{ scope.row.inspector || '-' }}</template>
      </el-table-column>

      <el-table-column prop="inspectReviewer" label="检验审核员" width="110" align="center">
        <template #default="scope">{{ scope.row.inspectReviewer || '-' }}</template>
      </el-table-column>
      <el-table-column prop="inspectFinishTime" label="检验完成时间" width="160" align="center"></el-table-column>
      <el-table-column prop="stockInPerson" label="库保员" align="center">
        <template #default="scope">{{ scope.row.inspector || '-' }}</template>
      </el-table-column>
      <el-table-column prop="inStockFinishTime" label="入库时间" width="160" align="center"></el-table-column>

      <el-table-column prop="createTime" label="创建时间" width="160"  align="center" />


      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button v-if="row.status == 30" size="small" type="success" @click="openInStockForm(row)">确认入库</el-button>
          <el-button v-if="row.status == 30" size="small" type="danger"
            @click="updateStatus(row, 32, true)">入库拒绝</el-button>
          <el-button type="primary" size="small" @click="openInfoForm(row)">查看信息</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination v-model:current-page="query.pageNumber" v-model:page-size="query.pageSize" :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next" :total="total" @size-change="getList" @current-change="getList" />
    </div>
  </div>

  <InspDataReadonly v-model="showReadDialog" :order-data="currentOrder" />
  <InStockForm v-model:visible="showInStockDialog" :form-data="currentOrder" @success="handleSuccess"
    @close="showInStockDialog = false" />

</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useInspOrder } from '../useInspWorkOrder'
import InspDataReadonly from '../inspDataFormReadonly.vue'
import InStockForm from './inStockForm.vue'
const { query, list, total, loading, getList, updateStatus } = useInspOrder(30)

const statusOptions = [{ label: '入库中', value: 30 }, { label: '已入库', value: 31 }, { label: '入库拒绝', value: 32 }]
const statusMap = Object.fromEntries(statusOptions.map(s => [s.value, s.label]))
const getStatusLabel = s => statusMap[s] || '-'
const getStatusTagType = s => ({ 30: 'primary', 31: 'success', 32: 'danger' }[s] || 'info')

const showReadDialog = ref(false)
const showInStockDialog = ref(false)
const currentOrder = ref(null)
const handleSuccess = () => {

  updateStatus(currentOrder.value, 31)
  showInStockDialog.value = false
  getList()
}

const openInStockForm = (row) => {
  currentOrder.value = row
  showInStockDialog.value = true
}
const openInfoForm = (row) => {
  // 此处实现获取检验结果的逻辑，示例：
  showReadDialog.value = true
  currentOrder.value = row
}
onMounted(getList)
</script>

<style scoped>
.insp-list {
  padding: 20px;
}

.action-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>