<template>
  <div class="basitem-management">
    <!-- 操作栏（联动版分类筛选） -->
    <div class="action-bar">
      <!-- 只有一级分类选择，且限定了范围 -->
      <el-select 
        v-model="queryParams.firstClassId" 
        placeholder="请选择一级分类" 
        style="width: 180px; margin-right: 10px;"
        @change="handleFirstClassChange" 
      >
        <el-option 
          v-for="item in firstClassOptions" 
          :key="item.id" 
          :label="item.classname" 
          :value="item.id"
        />
      </el-select>
      
      <el-select 
        v-model="queryParams.secondClassId" 
        placeholder="请选择二级分类" 
        style="width: 180px; margin-right: 10px;"
        clearable
        @change="getBasItemList"
        :disabled="!queryParams.firstClassId"
      >
        <el-option 
          v-for="item in filteredSecondClassOptions"
          :key="item.id" 
          :label="item.classname" 
          :value="item.id"
        />
      </el-select>

      <el-input v-model="queryParams.itemNo" placeholder="请输入物料编号查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getBasItemList" @keyup.enter="getBasItemList" />
      <el-input v-model="queryParams.itemName" placeholder="请输入物料名称查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getBasItemList" @keyup.enter="getBasItemList" />
      <el-input v-model="queryParams.spec" placeholder="请输入规格型号查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getBasItemList" @keyup.enter="getBasItemList" />
      
      <el-button type="primary" @click="getBasItemList">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon>
          <Refresh />
        </el-icon> 刷新
      </el-button>
    </div>

    <!-- 物料列表 -->
    <el-table :data="basItemList" border v-loading="loading" style="width: 100%" cell-class-name="table-cell">
      <el-table-column label="序号" width="60" align="center">
        <template #default="scope">
          {{ (queryParams.pageNumber - 1) * queryParams.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      
      <el-table-column prop="no" width="120" show-overflow-tooltip label="物料编号" />
      <el-table-column prop="name" width="120" show-overflow-tooltip label="物料名称" />
      <el-table-column prop="inclass" width="200" show-overflow-tooltip label="所属分类" />
      <el-table-column prop="unit" width="80" show-overflow-tooltip label="单位" />
      <el-table-column prop="spec" width="120" show-overflow-tooltip label="规格型号" />
      
      <el-table-column prop="material" width="100" show-overflow-tooltip label="材质">
        <template #default="scope">{{ scope.row.material || '-' }}</template>
      </el-table-column>
      <el-table-column prop="standard" width="150" show-overflow-tooltip label="零件图号/执行标准">
        <template #default="scope">{{ scope.row.standard || '-' }}</template>
      </el-table-column>
      <el-table-column prop="tuzhiNo" width="120" show-overflow-tooltip label="图号">
        <template #default="scope">{{ scope.row.tuzhiNo || '-' }}</template>
      </el-table-column>
      <el-table-column prop="description" min-width="150" show-overflow-tooltip label="物料描述">
        <template #default="scope">{{ scope.row.description || '-' }}</template>
      </el-table-column>

      <!-- 操作列修改 -->
      <el-table-column label="操作" width="150" fixed="right" align="center">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleRouteManage(row)">工艺路线管理</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="queryParams.pageNumber"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 工艺路线管理弹窗 -->
    <RouteDialog 
      v-model="routeDialogVisible"
      :item-id="currentRouteItemId"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getBasItems } from '@/api/item/basitem'
import { getBasItemClassTreeList } from '@/api/item/basitemclass'
import { Refresh } from '@element-plus/icons-vue'
import RouteDialog from './RouteDialog.vue' // 确保路径正确，可能需要调整为 ./RouteDialog.vue

// 响应式数据
const queryParams = reactive({
  itemNo: '',
  itemName: '',
  spec: '',
  firstClassId: '', 
  secondClassId: '',
  pageNumber: 1,
  pageSize: 10
})

const basItemList = ref([])
const total = ref(0)
const loading = ref(false)
const firstClassOptions = ref([]) // 仅包含产成品和半成品
const allSecondClassOptions = ref([]) 

// 弹窗相关
const routeDialogVisible = ref(false)
const currentRouteItemId = ref(null)

// 计算属性：根据选中的一级分类，过滤对应的二级分类
const filteredSecondClassOptions = computed(() => {
  if (!queryParams.firstClassId) return []
  return allSecondClassOptions.value.filter(item => item.parentId === queryParams.firstClassId)
})

// 加载分类树并初始化筛选逻辑
const loadClassOptions = async () => {
  try {
    const res = await getBasItemClassTreeList('')
    const classTree = res.data.list || []
    const firstClass = []
    const secondClass = []

    const traverseTree = (tree, parentId = 0) => {
      tree.forEach(node => {
        const { itemClass } = node
        if (itemClass.type === 1) {
          firstClass.push({ id: itemClass.id, classname: itemClass.classname })
          if (node.children && node.children.length) {
            traverseTree(node.children, itemClass.id)
          }
        } else if (itemClass.type === 2) {
          secondClass.push({ 
            id: itemClass.id, 
            classname: itemClass.classname,
            parentId: parentId 
          })
          if (node.children && node.children.length) {
            traverseTree(node.children, itemClass.id)
          }
        }
      })
    }

    traverseTree(classTree)
    
    // 过滤逻辑：只保留“产成品”或“半成品”
    const validNames = ['产成品', '半成品']
    firstClassOptions.value = firstClass.filter(item => 
      validNames.some(valid => item.classname.includes(valid))
    )
    allSecondClassOptions.value = secondClass

    // 默认选中“产成品”并查询
    const defaultClass = firstClassOptions.value.find(item => item.classname.includes('产成品'))
    if (defaultClass) {
      queryParams.firstClassId = defaultClass.id
    } else if (firstClassOptions.value.length > 0) {
      // 如果没有找到产成品，默认选第一个符合条件的（例如半成品）
      queryParams.firstClassId = firstClassOptions.value[0].id
    }

    // 加载初始列表
    getBasItemList()

  } catch (error) {
    console.error('加载分类选项失败', error)
    ElMessage.error('加载分类筛选选项失败')
  }
}

const handleFirstClassChange = () => {
  queryParams.secondClassId = ''
  getBasItemList()
}

const getBasItemList = async () => {
  loading.value = true
  try {
    const res = await getBasItems(queryParams)
    basItemList.value = res.data.page.list
    total.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取物料列表失败', error)
    ElMessage.error('获取物料列表失败')
  } finally {
    loading.value = false
  }
}

const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getBasItemList()
}

const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getBasItemList()
}

// 刷新重置逻辑：保留一级分类默认值（产成品）
const handleRefresh = () => {
  queryParams.itemNo = ''
  queryParams.itemName = ''
  queryParams.spec = ''
  queryParams.secondClassId = ''
  queryParams.pageNumber = 1
  
  // 尝试重置为产成品，如果不存在则不清空 firstClassId 或保持当前
  const defaultClass = firstClassOptions.value.find(item => item.classname.includes('产成品'))
  if (defaultClass) {
    queryParams.firstClassId = defaultClass.id
  }
  
  getBasItemList()
}

// 点击工艺路线管理
const handleRouteManage = (row) => {
  currentRouteItemId.value = row.id
  routeDialogVisible.value = true
}

onMounted(() => {
  loadClassOptions()
})
</script>

<style scoped>
.basitem-management {
  padding: 20px;
}
.action-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
.table-cell .el-table__cell-content {
  color: #666;
}
.table-cell .el-table__cell-content:empty::after,
.table-cell .el-table__cell-content:contains("-") {
  color: #999;
  font-style: normal;
}
</style>