<template>
  <el-dialog
    v-model="dialogVisible"
    title="合同物料选择器"
    width="80%"
    :before-close="handleClose"
    destroy-on-close
  >
    <div class="contract-material-selector">
      <!-- 第一部分：合同搜索框 -->
      <div class="search-section">
        <el-form :model="contractSearchForm" :inline="true" class="search-form">
          <el-form-item label="合同编号">
            <el-input
              v-model="contractSearchForm.contractNo"
              placeholder="请输入合同编号"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="合同名称">
            <el-input
              v-model="contractSearchForm.contractName"
              placeholder="请输入合同名称"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchContracts" :loading="contractLoading">
              搜索
            </el-button>
            <el-button @click="resetContractSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 第二部分：左右布局 -->
      <div class="content-section">
        <!-- 左边：合同列表 -->
        <div class="contract-list">
          <div class="list-header">
            <h3>合同列表</h3>
          </div>
          
          <el-table
            :data="contractList"
            v-loading="contractLoading"
            highlight-current-row
            @current-change="handleContractSelect"
            style="width: 100%"
            height="400"
          >
            <el-table-column prop="no" label="合同编号" width="150" />
            <el-table-column prop="name" label="合同名称" show-overflow-tooltip />
          </el-table>
          
          <!-- 合同列表分页 -->
          <div class="pagination-wrapper">
            <el-pagination
              v-model:current-page="contractPagination.currentPage"
              v-model:page-size="contractPagination.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="contractPagination.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleContractSizeChange"
              @current-change="handleContractCurrentChange"
            />
          </div>
        </div>

        <!-- 右边：物料列表 -->
        <div class="material-list">
          <div class="list-header">
            <h3>物料列表</h3>
            <!-- 物料搜索框 -->
            <el-form :model="materialSearchForm" :inline="true" class="material-search">
              <el-form-item>
                <el-input
                  v-model="materialSearchForm.keyword"
                  placeholder="请输入物料编号或名称"
                  clearable
                  style="width: 200px"
                  @keyup.enter="searchMaterials"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchMaterials" :loading="materialLoading">
                  搜索
                </el-button>
              </el-form-item>
            </el-form>
          </div>

          <el-table
            :data="materialList"
            v-loading="materialLoading"
            style="width: 100%"
            height="400"
          >
            <el-table-column prop="itemNo" label="物料编号" width="120" />
            <el-table-column prop="itemName" label="物料名称" width="150" show-overflow-tooltip />
            <el-table-column prop="itemSpec" label="规格型号" width="120" show-overflow-tooltip />
            <el-table-column prop="itemnum" label="数量" width="80" />
            <el-table-column prop="itemunit" label="单位" width="80" />
            <el-table-column label="操作" width="80" fixed="right">
              <template #default="scope">
                <div v-if="scope.row.scheduleCode">
                  已制定: {{ scope.row.scheduleCode }}
                </div>
                <el-button v-else type="primary" size="small" @click="selectMaterial(scope.row)">
                  选择
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 物料列表分页 -->
          <div class="pagination-wrapper">
            <el-pagination
              v-model:current-page="materialPagination.currentPage"
              v-model:page-size="materialPagination.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="materialPagination.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleMaterialSizeChange"
              @current-change="handleMaterialCurrentChange"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getConfirmContract, getContractItemPage } from '@/api/contract/bascontract'

// 组件属性定义
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

// 事件定义
const emit = defineEmits(['update:visible', 'select'])

// 对话框显示控制
const dialogVisible = ref(props.visible)

// 监听props.visible的变化
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal
  if (newVal) {
    // 每次打开对话框时重置数据并加载合同列表
    resetData()
    searchContracts()
  }
})

// 监听dialogVisible的变化，同步给父组件
watch(dialogVisible, (newVal) => {
  emit('update:visible', newVal)
})

// 合同搜索表单
const contractSearchForm = reactive({
  contractNo: '',
  contractName: ''
})

// 物料搜索表单
const materialSearchForm = reactive({
  keyword: ''
})

// 合同列表数据
const contractList = ref([])
const contractLoading = ref(false)
const contractPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 物料列表数据
const materialList = ref([])
const materialLoading = ref(false)
const materialPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 当前选中的合同
const currentContract = ref(null)

// 搜索合同
const searchContracts = () => {
  contractPagination.currentPage = 1
  loadContractList()
}

// 重置合同搜索
const resetContractSearch = () => {
  contractSearchForm.contractNo = ''
  contractSearchForm.contractName = ''
  searchContracts()
}

// 加载合同列表
const loadContractList = async () => {
  contractLoading.value = true
  try {
    const params = {
      pageNumber: contractPagination.currentPage,
      pageSize: contractPagination.pageSize,
      contractNo: contractSearchForm.contractNo,
      projectName: contractSearchForm.contractName
    }
    
    const response = await getConfirmContract(params)
    if (response.success) {
      const pageData = response.data.page
      contractList.value = pageData.list || []
      contractPagination.total = pageData.totalRow || 0
    } else {
      ElMessage.error(response.msg || '加载合同列表失败')
    }
    
    // 清空物料列表
    materialList.value = []
    materialPagination.total = 0
    currentContract.value = null
  } catch (error) {
    ElMessage.error('加载合同列表失败')
  } finally {
    contractLoading.value = false
  }
}

// 合同选择处理
const handleContractSelect = (contract) => {
  if (contract) {
    currentContract.value = contract
    // 重置物料搜索和分页
    materialSearchForm.keyword = ''
    materialPagination.currentPage = 1
    loadMaterialList()
  }
}

// 搜索物料
const searchMaterials = () => {
  if (!currentContract.value) {
    ElMessage.warning('请先选择合同')
    return
  }
  materialPagination.currentPage = 1
  loadMaterialList()
}

// 加载物料列表
const loadMaterialList = async () => {
  if (!currentContract.value) return
  
  materialLoading.value = true
  try {
    const params = {
      pageNumber: materialPagination.currentPage,
      pageSize: materialPagination.pageSize,
      contractNo: currentContract.value.no,
      itemName: materialSearchForm.keyword
    }
    
    const response = await getContractItemPage(params)
    if (response.success) {
      const itemData = response.data.itemList
      materialList.value = itemData.list || []
      materialPagination.total = itemData.totalRow || 0
    } else {
      ElMessage.error(response.msg || '加载物料列表失败')
    }
  } catch (error) {
    ElMessage.error('加载物料列表失败')
  } finally {
    materialLoading.value = false
  }
}

// 选择物料
const selectMaterial = (material) => {
  // 调用父组件的选择方法
//   emit('select', {
//     contract: currentContract.value,
//     material: material
//   })
  emit('select', material)
  ElMessage.success('物料选择成功')
  handleClose()
}

// 合同列表分页处理
const handleContractSizeChange = (size) => {
  contractPagination.pageSize = size
  contractPagination.currentPage = 1
  loadContractList()
}

const handleContractCurrentChange = (page) => {
  contractPagination.currentPage = page
  loadContractList()
}

// 物料列表分页处理
const handleMaterialSizeChange = (size) => {
  materialPagination.pageSize = size
  materialPagination.currentPage = 1
  loadMaterialList()
}

const handleMaterialCurrentChange = (page) => {
  materialPagination.currentPage = page
  loadMaterialList()
}

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false
  // 重置数据
  resetData()
}

// 重置数据
const resetData = () => {
  contractSearchForm.contractNo = ''
  contractSearchForm.contractName = ''
  materialSearchForm.keyword = ''
  contractList.value = []
  materialList.value = []
  currentContract.value = null
  contractPagination.currentPage = 1
  contractPagination.total = 0
  materialPagination.currentPage = 1
  materialPagination.total = 0
}
</script>

<style scoped>
.contract-material-selector {
  padding: 20px;
}

.search-section {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 6px;
}

.search-form {
  margin: 0;
}

.content-section {
  display: flex;
  gap: 20px;
  height: 500px;
}

.contract-list,
.material-list {
  flex: 1;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.list-header h3 {
  margin: 0;
  color: #303133;
  font-size: 16px;
}

.material-search {
  margin: 0;
}

.pagination-wrapper {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .content-section {
    flex-direction: column;
    height: auto;
  }
  
  .contract-list,
  .material-list {
    flex: none;
  }
}
</style>
