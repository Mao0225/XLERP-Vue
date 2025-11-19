<template>
  <div class="material-management">
    <!-- 顶部筛选区 -->
    <el-card class="filter-card" shadow="never">
      <div class="filter-row">
        <!-- 物料编号 -->
        <div class="filter-item">
          <span class="filter-label">物料编号：</span>
          <el-input v-model="filters.materialCode" placeholder="请输入物料编号" clearable style="width: 200px"
            @clear="getMaterialListData" @keyup.enter="getMaterialListData" />
        </div>

        <!-- 规格型号 -->
        <div class="filter-item">
          <span class="filter-label">规格型号：</span>
          <el-input v-model="filters.materialSpec" placeholder="请输入规格型号" clearable style="width: 200px"
            @clear="getMaterialListData" @keyup.enter="getMaterialListData" />
        </div>

        <!-- 物料名称 -->
        <div class="filter-item">
          <span class="filter-label">物料名称：</span>
          <el-input v-model="filters.materialName" placeholder="请输入物料名称" clearable style="width: 200px"
            @clear="getMaterialListData" @keyup.enter="getMaterialListData" />
        </div>

        <!-- 出入库类型（关键修复点） -->
        <div class="filter-item">
          <span class="filter-label">出入库类型：</span>
          <el-select
            v-model="filters.type"
            placeholder="请选择出入库类型"
            clearable
            style="width: 200px"
            @change="getMaterialListData"
          >
            <!-- 用空字符串代表“全部”，彻底杜绝 null 报错 -->
            <el-option label="全部" value="" />
            <el-option label="入库" :value="1" />
            <el-option label="出库" :value="2" />
          </el-select>
        </div>
      </div>

      <div class="filter-actions">
        <el-button type="primary" @click="getMaterialListData">
          <el-icon><Search /></el-icon> 查询
        </el-button>
        <el-button @click="handleReset">
          <el-icon><Refresh /></el-icon> 重置
        </el-button>
      </div>
    </el-card>

    <!-- 表格区域（保持不变） -->
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>原材料出入库记录</span>
        </div>
      </template>

      <el-table :data="materialList" v-loading="loading" height="650" border>
        <el-table-column type="index" label="序号" width="70" align="center" />

        <!-- 状态列 -->
        <!-- <el-table-column label="状态" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)" size="small">
              <el-icon style="margin-right: 4px">
                <component :is="getStatusIcon(row.status)" />
              </el-icon>
              {{ getStatusText(row.status, row.type) }}
            </el-tag>
          </template>
        </el-table-column> -->

        <!-- 类型列 -->
        <el-table-column label="类型" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.type === 1 ? 'success' : 'danger'" size="small">
              {{ row.type === 1 ? '入库' : '出库' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="inspOrderNo" label="检验单号" width="150" show-overflow-tooltip />
        <el-table-column prop="contractNo" label="合同编号" width="150" show-overflow-tooltip />
        <el-table-column prop="contractName" label="合同名称" width="200" show-overflow-tooltip />
        <el-table-column prop="supplierName" label="供应商" width="160" show-overflow-tooltip />
        <el-table-column prop="warehouse" label="仓库" width="120" show-overflow-tooltip />
        <el-table-column prop="materialCode" label="物料编号" width="160" show-overflow-tooltip />
        <el-table-column prop="materialName" label="物料名称" width="180" show-overflow-tooltip />
        <el-table-column prop="materialSpec" label="规格型号" width="160" show-overflow-tooltip />
        <el-table-column prop="materialUnit" label="单位" width="80" align="center" />
        <el-table-column prop="batchNo" label="炉批号" width="120" show-overflow-tooltip />
        <el-table-column prop="actualQuantity" label="实际数量" width="110" align="right" />
        <el-table-column prop="planQuantity" label="计划数量" width="110" align="right" />
        <el-table-column prop="actualWeight" label="实际重量(kg)" width="130" align="right">
          <template #default="{ row }">
            {{ row.actualWeight != null ? Number(row.actualWeight).toFixed(3) : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="planWeight" label="计划重量(kg)" width="130" align="right">
          <template #default="{ row }">
            {{ row.planWeight != null ? Number(row.planWeight).toFixed(3) : '-' }}
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
        <el-table-column prop="operateTime" label="录入时间" width="165">
          <template #default="{ row }">
            {{ row.operateTime }}
          </template>
        </el-table-column>
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
import { Search, Refresh, Clock, CircleCheckFilled, CircleCheck } from '@element-plus/icons-vue'
import { getPlMatInoutList } from '@/api/plstoreinout/matinout.js'
import { useTermStore } from '@/store/term.js'

const loading = ref(false)
const materialList = ref([])
const total = ref(0)

const termStore = useTermStore()
const currentTerm = computed(() => termStore.currentTerm)

const filters = reactive({
  pageNumber: 1,
  pageSize: 20,
  term: currentTerm.value || '',
  materialCode: '',
  materialSpec: '',
  materialName: '',
  type: '', // 关键：用空字符串 '' 表示“全部”，而不是 null
})

// 获取数据
const getMaterialListData = async () => {
  loading.value = true
  try {
    const params = {
      pageNumber: filters.pageNumber,
      pageSize: filters.pageSize,
      term: filters.term || undefined,
      materialCode: filters.materialCode || undefined,
      materialSpec: filters.materialSpec || undefined,
      materialName: filters.materialName || undefined,
      // 关键修复：空字符串转成 undefined 给后端（后端不传即为全部）
      type: filters.type === '' ? undefined : Number(filters.type),
    }

    const res = await getPlMatInoutList(params)
    if (res.code === 200) {
      materialList.value = res.data.page.list || []
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
    getMaterialListData()
  },
  { immediate: true }
)

// 分页
const handleSizeChange = (val) => {
  filters.pageSize = val
  filters.pageNumber = 1
  getMaterialListData()
}
const handleCurrentChange = (val) => {
  filters.pageNumber = val
  getMaterialListData()
}

// 重置
const handleReset = () => {
  filters.materialCode = ''
  filters.materialSpec = ''
  filters.materialName = ''
  filters.type = ''   // 重置为 ''
  filters.pageNumber = 1
  getMaterialListData()
  ElMessage.success('筛选条件已重置')
}

// 状态展示
const getStatusTagType = (status) => {
  const map = { '10': 'info', '20': 'warning', '30': 'success' }
  return map[status] || 'info'
}
const getStatusIcon = (status) => {
  const map = { '10': 'Clock', '20': 'CircleCheckFilled', '30': 'CircleCheck' }
  return map[status] || 'Clock'
}
const getStatusText = (status, type) => {
  if (status === '30') return type === 1 ? '已入库' : '已出库'
  const map = { '10': '录入', '20': '待审核' }
  return map[status] || '未知'
}

onMounted(() => {
  if (!termStore.terms.length) termStore.fetchTerms()
  getMaterialListData()
})
</script>

<!-- 样式部分保持原样 -->
<style scoped>
.material-management { padding: 20px; background: #f5f5f5; min-height: 100vh; }
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