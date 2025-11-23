<!-- BasItemSelector.vue -->
<template>
  <el-dialog
    title="选择物料"
    :model-value="props.modelValue"
    width="70%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @update:model-value="emit('update:modelValue', $event)"
    destroy-on-close
  >
    <div class="basitem-selector">
      <!-- 操作栏（筛选） -->
      <div class="action-bar">
        <el-select
          v-model="queryParams.firstClassId"
          placeholder="一级分类"
          style="width: 160px; margin-right: 10px;"
          clearable
          @change="handleFirstClassChange"
          @clear="handleFirstClassClear"
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
          placeholder="二级分类"
          style="width: 160px; margin-right: 10px;"
          clearable
          :disabled="!queryParams.firstClassId"
          @change="getBasItemList"
        >
          <el-option
            v-for="item in filteredSecondClassOptions"
            :key="item.id"
            :label="item.classname"
            :value="item.id"
          />
        </el-select>

        <el-input
          v-model="queryParams.itemNo"
          placeholder="物料编号"
          clearable
          style="width: 180px; margin-right: 10px;"
          @clear="getBasItemList"
          @keyup.enter="getBasItemList"
        />
        <el-input
          v-model="queryParams.itemName"
          placeholder="物料名称"
          clearable
          style="width: 180px; margin-right: 10px;"
          @clear="getBasItemList"
          @keyup.enter="getBasItemList"
        />
                <el-input
          v-model="queryParams.spec"
          placeholder="规格型号"
          clearable
          style="width: 180px; margin-right: 10px;"
          @clear="getBasItemList"
          @keyup.enter="getBasItemList"
        />
        

        <el-button type="primary" @click="getBasItemList">搜索</el-button>
        <el-button @click="handleRefresh">
          <el-icon><Refresh /></el-icon> 重置
        </el-button>
      </div>

      <!-- 物料表格 -->
      <el-table
        :data="basItemList"
        border
        v-loading="loading"
        height="500"
        highlight-current-row
        @row-click="handleRowClick"
        style="margin-top: 16px;"
      >
        <el-table-column label="序号" width="70" align="center">
          <template #default="scope">
            {{ (queryParams.pageNumber - 1) * queryParams.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>

        <el-table-column prop="no" label="物料编号" width="130" show-overflow-tooltip />
        <el-table-column prop="name" label="物料名称" width="180" show-overflow-tooltip />
        <el-table-column prop="inclass" label="所属分类" width="220" show-overflow-tooltip />
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column prop="spec" label="规格型号" width="140" show-overflow-tooltip />
        <el-table-column prop="material" label="材质" width="100">
          <template #default="scope">{{ scope.row.material || '-' }}</template>
        </el-table-column>
        <el-table-column prop="standard" label="执行标准" width="160">
          <template #default="scope">{{ scope.row.standard || '-' }}</template>
        </el-table-column>

        <!-- 操作列：选择按钮 -->
        <el-table-column label="操作" width="100" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click.stop="selectProduct(row)">
              选择
            </el-button>
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
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <el-button @click="emit('update:modelValue', false)">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getBasItems } from '@/api/item/basitem'
import { getBasItemClassTreeList } from '@/api/item/basitemclass'
import { Refresh } from '@element-plus/icons-vue'

// ==================== Props & Emits ====================
const props = defineProps({
  modelValue: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue', 'select'])

// ==================== 响应式数据 ====================
const queryParams = reactive({
  itemNo: '',
  itemName: '',
  firstClassId: '',
  spec: '',
  secondClassId: '',
  pageNumber: 1,
  pageSize: 20
})

const basItemList = ref([])
const total = ref(0)
const loading = ref(false)

const firstClassOptions = ref([])
const allSecondClassOptions = ref([])

const filteredSecondClassOptions = computed(() => {
  if (!queryParams.firstClassId) return []
  return allSecondClassOptions.value.filter(item => item.parentId === queryParams.firstClassId)
})

// ==================== 方法 ====================
// 加载分类
const loadClassOptions = async () => {
  try {
    const res = await getBasItemClassTreeList('')
    const classTree = res.data.list || []

    const first = []
    const second = []

    const traverse = (nodes, parentId = 0) => {
      nodes.forEach(node => {
        const { itemClass } = node
        if (itemClass.type === 1) {
          first.push({ id: itemClass.id, classname: itemClass.classname })
          if (node.children?.length) traverse(node.children, itemClass.id)
        } else if (itemClass.type === 2) {
          second.push({
            id: itemClass.id,
            classname: itemClass.classname,
            parentId
          })
          if (node.children?.length) traverse(node.children, itemClass.id)
        }
      })
    }

    traverse(classTree)
    firstClassOptions.value = first
    allSecondClassOptions.value = second
  } catch (e) {
    console.error(e)
    ElMessage.error('加载分类失败')
  }
}

// 获取列表
const getBasItemList = async () => {
  loading.value = true
  try {
    const res = await getBasItems(queryParams)
    basItemList.value = res.data.page.list || []
    total.value = res.data.page.totalRow || 0
  } catch (e) {
    console.error(e)
    ElMessage.error('获取物料列表失败')
  } finally {
    loading.value = false
  }
}

// 一级分类变化
const handleFirstClassChange = () => {
  queryParams.secondClassId = ''
  queryParams.pageNumber = 1
  getBasItemList()
}
const handleFirstClassClear = () => {
  queryParams.secondClassId = ''
  queryParams.pageNumber = 1
  getBasItemList()
}

// 重置
const handleRefresh = () => {
  Object.assign(queryParams, {
    itemNo: '',
    itemName: '',
    spec: '',
    firstClassId: '',
    secondClassId: '',
    pageNumber: 1,
    pageSize: 20
  })
  getBasItemList()
}

// 分页
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  queryParams.pageNumber = 1
  getBasItemList()
}
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getBasItemList()
}

// 点击行快速选择
const handleRowClick = (row) => {
  selectProduct(row)
}

// 核心：选择并关闭
const selectProduct = (row) => {
  emit('select', row)           // 把选中行抛给父组件
  emit('update:modelValue', false)  // 关闭弹窗
}

// 弹窗打开时重新加载（可选，也可以在父组件打开时手动调用 refresh）
watch(() => props.modelValue, (val) => {
  if (val) {
    queryParams.pageNumber = 1
    loadClassOptions()
    getBasItemList()
  }
})

// ==================== 生命周期 ====================
onMounted(() => {
  // 首次打开时不加载，等弹窗真的显示再加载（上面 watch 已处理）
})
</script>

<style scoped>
.basitem-selector {
  padding: 0 20px 20px;
}
.action-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  padding-bottom: 16px;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>