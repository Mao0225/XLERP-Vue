<template>
  <div class="finish-product-management">
    <el-card class="filter-card" shadow="never">
      <div class="filter-row">
        <div class="filter-item">
          <span class="filter-label">产品编号：</span>
          <el-input v-model="filters.itemCode" placeholder="请输入产品编号" clearable style="width: 200px"
            @clear="getListData" @keyup.enter="getListData" />
        </div>

        <div class="filter-item">
          <span class="filter-label">规格型号：</span>
          <el-input v-model="filters.itemSpec" placeholder="请输入规格型号" clearable style="width: 200px"
            @clear="getListData" @keyup.enter="getListData" />
        </div>

        <div class="filter-item">
          <span class="filter-label">产品名称：</span>
          <el-input v-model="filters.itemName" placeholder="请输入产品名称" clearable style="width: 200px"
            @clear="getListData" @keyup.enter="getListData" />
        </div>

        <div class="filter-item">
          <span class="filter-label">生产工单：</span>
          <el-input v-model="filters.woNo" placeholder="请输入工单号" clearable style="width: 200px"
            @clear="getListData" @keyup.enter="getListData" />
        </div>

        <div class="filter-item">
          <span class="filter-label">出入库类型：</span>
          <el-select
            v-model="filters.type"
            placeholder="请选择类型"
            clearable
            style="width: 200px"
            @change="getListData"
          >
            <el-option label="全部" value="" />
            <el-option label="入库" :value="1" />
            <el-option label="出库" :value="2" />
          </el-select>
        </div>
      </div>

      <div class="filter-actions">
        <el-button type="primary" @click="getListData">
          <el-icon><Search /></el-icon> 查询
        </el-button>
        <el-button @click="handleReset">
          <el-icon><Refresh /></el-icon> 重置
        </el-button>
      </div>
    </el-card>

    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>产成品出入库记录</span>
        </div>
      </template>

      <el-table :data="tableList" v-loading="loading" height="650" border>
        <el-table-column type="index" label="序号" width="60" align="center" />

        <el-table-column label="类型" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.type === 1 ? 'success' : 'danger'" size="small">
              {{ row.type === 1 ? '入库' : '出库' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="inspOrderNo" label="检验单号" width="150" show-overflow-tooltip />
        <el-table-column prop="woNo" label="生产工单号" width="150" show-overflow-tooltip />
        <el-table-column prop="contractNo" label="合同编号" width="140" show-overflow-tooltip />
        <el-table-column prop="contractName" label="合同名称" width="180" show-overflow-tooltip />
        <el-table-column prop="deliveryUnit" label="送货单位" width="160" show-overflow-tooltip />
        <el-table-column prop="warehouse" label="仓库" width="120" show-overflow-tooltip />
        
        <el-table-column prop="itemCode" label="产品编号" width="150" show-overflow-tooltip />
        <el-table-column prop="itemName" label="产品名称" width="160" show-overflow-tooltip />
        <el-table-column prop="itemSpec" label="规格型号" width="150" show-overflow-tooltip />
        <el-table-column prop="inclass" label="物料类别" width="120" show-overflow-tooltip />
        
        <el-table-column prop="itemUnit" label="单位" width="70" align="center" />
        
        <el-table-column prop="actualQuantity" label="数量" width="110" align="right">
          <template #default="{ row }">
             <span :style="{ color: row.actualQuantity < 0 ? 'red' : 'inherit' }">
               {{ row.actualQuantity }}
             </span>
          </template>
        </el-table-column>

        <el-table-column prop="actualWeight" label="实际重量" width="140" align="right">
          <template #default="{ row }">
            <span :style="{ color: row.actualWeight < 0 ? 'red' : 'inherit' }">
              {{ row.actualWeight != null ? Number(row.actualWeight).toFixed(3) : '-' }}
            </span>
            <span v-if="row.weightUnit" style="margin-left:4px; font-size:12px; color:#999">{{ row.weightUnit }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="price" label="单价(元)" width="120" align="right">
          <template #default="{ row }">
            {{ row.price != null ? Number(row.price).toFixed(4) : '-' }}
          </template>
        </el-table-column>

        <el-table-column prop="totalPrice" label="金额(元)" width="130" align="right">
          <template #default="{ row }">
            {{ row.totalPrice != null ? Number(row.totalPrice).toFixed(2) : '-' }}
          </template>
        </el-table-column>

        <el-table-column prop="writer" label="录入人" width="100" show-overflow-tooltip />
        <el-table-column prop="operateTime" label="操作时间" width="165" />
        <el-table-column prop="memo" label="备注" width="180" show-overflow-tooltip />
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="filters.pageNumber"
          v-model:page-size="filters.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
//
import { getFinishInoutPage } from '@/api/plstoreinout/finishInout' 
import { useTermStore } from '@/store/term.js'

const loading = ref(false)
const tableList = ref([])
const total = ref(0)

const termStore = useTermStore()
const currentTerm = computed(() => termStore.currentTerm)

const filters = reactive({
  pageNumber: 1,
  pageSize: 20,
  term: currentTerm.value || '',
  itemCode: '',  // 对应新字段 itemCode
  itemSpec: '',  // 对应新字段 itemSpec
  itemName: '',  // 对应新字段 itemName
  woNo: '',      // 对应新字段 woNo
  type: '',      // '' 代表全部
})

// 获取数据
const getListData = async () => {
  loading.value = true
  try {
    const params = {
      pageNumber: filters.pageNumber,
      pageSize: filters.pageSize,
      term: filters.term || undefined,
      itemCode: filters.itemCode || undefined,
      itemSpec: filters.itemSpec || undefined,
      itemName: filters.itemName || undefined,
      woNo: filters.woNo || undefined,
      // 类型处理：空字符串转 undefined
      type: filters.type === '' ? undefined : Number(filters.type),
    }

    const res = await getFinishInoutPage(params)
    if (res.code === 200) {
      tableList.value = res.data.page.list || []
      total.value = res.data.page.totalRow || 0
    } else {
      ElMessage.error(res.msg || '查询失败')
    }
  } catch (err) {
    console.error(err)
    ElMessage.error('网络错误')
  } finally {
    loading.value = false
  }
}

// 期间切换自动刷新
watch(
  () => termStore.currentTerm,
  (newVal) => {
    filters.term = newVal || ''
    filters.pageNumber = 1
    getListData()
  },
  { immediate: true }
)

// 分页
const handleSizeChange = (val) => {
  filters.pageSize = val
  filters.pageNumber = 1
  getListData()
}
const handleCurrentChange = (val) => {
  filters.pageNumber = val
  getListData()
}

// 重置
const handleReset = () => {
  filters.itemCode = ''
  filters.itemSpec = ''
  filters.itemName = ''
  filters.woNo = ''
  filters.type = ''
  filters.pageNumber = 1
  getListData()
  ElMessage.success('筛选条件已重置')
}

onMounted(() => {
  if (!termStore.terms.length) termStore.fetchTerms()
  getListData()
})
</script>

<style scoped>
.finish-product-management { padding: 20px; background: #f5f5f5; min-height: 100vh; }
.filter-card { margin-bottom: 20px; }
.filter-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-bottom: 16px; }
.filter-item { display: flex; align-items: center; gap: 8px; }
.filter-label { white-space: nowrap; min-width: 80px; color: #606266; font-size: 13px; }
.filter-actions { padding-top: 16px; border-top: 1px solid #ebeef5; display: flex; gap: 12px; }
.card-header { font-weight: 500; }
.pagination-container { margin-top: 20px; display: flex; justify-content: flex-end; }
@media (max-width: 768px) {
  .filter-row { grid-template-columns: 1fr; }
  .filter-item { flex-direction: column; align-items: flex-start; }
  .filter-label { min-width: auto; }
}
</style>