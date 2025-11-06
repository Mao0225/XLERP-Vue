<template>
  <div class="insp-list">
    <div class="action-bar">
      <el-input v-model="query.orderNo" placeholder="检验单号" style="width:180px;margin-right:10px" clearable @clear="getList" @keyup.enter="getList" />
      <el-button type="primary" @click="getList">搜索</el-button>
    </div>

    <el-table :data="list" border v-loading="loading">
      <el-table-column type="index" label="序号" width="70" />
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
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)">{{ getStatusLabel(row.status) }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="280" fixed="right"> <!-- 加宽操作列以容纳三个按钮 -->
        <template #default="{ row }">
          <!-- 状态20（检验中）显示原有两个按钮 -->
          <el-button v-if="row.status == 20" size="small" type="success" @click="updateStatus(row, 21)">提交审核</el-button>          
          <!-- <el-button v-if="row.status == 20" size="small" type="warning" @click="editInspectionResult(row)">编辑检验结果</el-button> -->
          <el-button  size="small" type="warning" @click="editInspectionResult(row)">编辑检验结果</el-button>

          <!-- 其他所有状态（包括默认的检验完成、及其他未定义状态）显示查看检验结果按钮 -->
          <el-button size="small" type="primary" @click="getInspectionResult(row)">查看检验结果</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination v-model:current-page="query.pageNumber" v-model:page-size="query.pageSize" :page-sizes="[10,20,50]" layout="total, sizes, prev, pager, next" :total="total" @size-change="getList" @current-change="getList" />
    </div>
  </div>

  <InspectionDialog
  v-model="showDialog"
  :order-data="currentOrder"
  />

  <InspDataReadonly
  v-model="showReadDialog"
  :order-data="currentOrder"
  />

</template>

<script setup>
import { onMounted,ref} from 'vue'
import { useInspOrder } from './useInspOrder'
import InspectionDialog from './inspDataForm.vue'
import InspDataReadonly from './inspDataFormReadonly.vue'
const { query, list, total, loading, getList, updateStatus } = useInspOrder(20)

// 明确状态配置（仅保留特殊状态）
const baseStatusOptions = [
  { label: '检验中', value: 20 } // 21及其他状态默认显示"检验完成"
]
// 状态标签映射：未匹配到的状态默认显示"检验完成"
const statusMap = Object.fromEntries(baseStatusOptions.map(s => [s.value, s.label]))
const getStatusLabel = s => statusMap[s] || '检验完成'

const showDialog = ref(false)


// 标签类型映射：未匹配到的状态默认使用"info"类型
const getStatusTagType = s => {
  const typeMap = {
    20: 'primary' // 检验中-primary类型
  }
  return typeMap[s] || 'success' // 其他状态默认info类型（与检验完成、查看按钮样式一致）
}

/**
 * 编辑检验结果方法
 */
const editInspectionResult = (row) => {
  // 此处实现编辑检验结果的逻辑，示例：
  showDialog.value = true
  currentOrder.value = row
}

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

onMounted(getList)
</script>

<style scoped>
.insp-list { padding: 20px; }
.action-bar { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 20px; }
.pagination { margin-top: 20px; text-align: right; }
/* 按钮间距调整 */
::v-deep .el-button--small { margin-right: 8px; }
</style>