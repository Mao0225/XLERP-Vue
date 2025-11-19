<template>
  <div class="insp-list">
    <div class="action-bar">
      <el-input v-model="query.orderNo" placeholder="检验单号" style="width:180px;margin-right:10px" clearable @clear="getList" @keyup.enter="getList" />
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
      <el-table-column prop="inspector" label="检验人" width="100" />
      <el-table-column prop="inspectReviewer" label="审核人" width="100" />


      <el-table-column label="操作" width="230" fixed="right">
        <template #default="{ row }">
          <!-- 状态21（待审核）显示审核操作按钮 -->
          <el-button v-if="row.status == 21" size="small" type="success" @click="updateStatus(row, 22)">通过</el-button>
          <el-button v-if="row.status == 21" size="small" type="danger" @click="updateStatus(row, 23, true)">不通过</el-button>
          
          <el-button  size="small" type="primary" @click="getInspectionResult(row)">查看</el-button>
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
import { onMounted,ref} from 'vue'
import { useInspOrder } from '../useInspOrder'

import InspDataReadonly from '../inspDataFormReadonly.vue'



// 如需路由跳转，导入路由（根据项目实际配置调整）
// import { useRouter } from 'vue-router'
// const router = useRouter()

const { query, list, total, loading, getList, updateStatus } = useInspOrder(21)

const showReadDialog = ref(false)
const currentOrder = ref(null)
/**
 * 获取检验结果方法
 */
const getInspectionResult = async (row) => {
  // 此处实现获取检验结果的逻辑，示例：
  showReadDialog.value = true
  currentOrder.value = row
}

// 明确状态配置（修正后：21=待审核、22=审核通过、23=审核不通过）
const baseStatusOptions = [
  { label: '待审核', value: 21 },
  { label: '审核不通过', value: 23 }
]
// 状态标签映射：未匹配到的状态默认显示"审核通过"
const statusMap = Object.fromEntries(baseStatusOptions.map(s => [s.value, s.label]))
const getStatusLabel = s => statusMap[s] || '审核通过'

// 标签类型映射（符合状态语义：待审核=warning、通过=success、不通过=danger）
const getStatusTagType = s => {
  const typeMap = {
    21: 'warning',  // 待审核-警告色（黄色）
    23: 'danger'    // 审核不通过-危险色（红色）
  }
  return typeMap[s] || 'success' // 其他状态默认成功色（绿色，与审核通过匹配）
}

onMounted(getList)
</script>

<style scoped>
.insp-list { padding: 20px; }
.action-bar { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 20px; }
.pagination { margin-top: 20px; text-align: right; }
/* 按钮间距优化 */
::v-deep .el-button--small { margin-right: 8px; }
</style>