<!-- BasItemSelectorDialog.vue -->
<template>
  <el-dialog
    v-model="visible"
    :title="props.title || '选择物料'"
    width="960px"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @open="handleOpen"
  >
    <!-- 搜索栏 -->
    <div class="selector-action-bar">
      <el-select
        v-model="query.firstClassId"
        placeholder="一级分类"
        clearable
        style="width: 160px; margin-right: 8px;"
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
        v-model="query.secondClassId"
        placeholder="二级分类"
        clearable
        style="width: 160px; margin-right: 8px;"
        :disabled="!query.firstClassId"
        @change="loadList"
      >
        <el-option
          v-for="item in filteredSecondClassOptions"
          :key="item.id"
          :label="item.classname"
          :value="item.id"
        />
      </el-select>

      <el-input
        v-model="query.itemNo"
        placeholder="物料编号"
        clearable
        style="width: 160px; margin-right: 8px;"
        @clear="loadList"
        @keyup.enter="loadList"
      />

      <el-input
        v-model="query.itemName"
        placeholder="物料名称"
        clearable
        style="width: 160px; margin-right: 8px;"
        @clear="loadList"
        @keyup.enter="loadList"
      />

      <el-button type="primary" @click="loadList">搜索</el-button>
    </div>

    <!-- 表格 -->
    <el-table
      ref="tableRef"
      :data="tableData"
      border
      height="420"
      v-loading="loading"
      @selection-change="handleSelectionChange"
      style="margin-top: 12px;"
    >
      <!-- 多选列：支持 :selectable 控制是否可选 -->
      <el-table-column
        v-if="props.multiple"
        type="selection"
        width="55"
        fixed="left"
        :selectable="isRowSelectable"
      />

      <!-- 单选列：使用 radio + disabled -->
      <el-table-column v-else type="radio" width="55" fixed="left">
        <template #default="{ row }">
          <el-radio
            v-model="singleSelectedId"
            :label="row.id"
            :disabled="alreadySelectedIds.includes(row.id)"
            @change="() => handleSingleSelect(row)"
          />
        </template>
      </el-table-column>

      <el-table-column prop="no" label="物料编号" width="120" />
      <el-table-column prop="name" label="物料名称" min-width="160" show-overflow-tooltip />
      <el-table-column prop="spec" label="规格型号" width="120" />
      <el-table-column prop="unit" label="单位" width="80" />
      <el-table-column prop="inclass" label="所属分类" width="180" show-overflow-tooltip />
    </el-table>

    <!-- 分页 -->
    <div class="selector-pagination">
      <el-pagination
        v-model:current-page="query.pageNumber"
        v-model:page-size="query.pageSize"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
        :total="total"
        @size-change="loadList"
        @current-change="loadList"
      />
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { getBasItems } from '@/api/item/basitem'
import { getBasItemClassTreeList } from '@/api/item/basitemclass'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  title: { type: String, default: '' },
  // 外部传入：已选中的 id 数组（多选）或 id（单选）
  alreadySelectedIds: {
    type: [Array, Number, String],
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

/* ---------- 控制显隐 ---------- */
const visible = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})

/* ---------- 搜索参数 ---------- */
const query = reactive({
  itemNo: '',
  itemName: '',
  firstClassId: '',
  secondClassId: '',
  pageNumber: 1,
  pageSize: 10
})

/* ---------- 表格数据 ---------- */
const tableData = ref([])
const total = ref(0)
const loading = ref(false)
const tableRef = ref(null)

/* ---------- 分类选项 ---------- */
const firstClassOptions = ref([])
const allSecondClassOptions = ref([])

const filteredSecondClassOptions = computed(() => {
  if (!query.firstClassId) return []
  return allSecondClassOptions.value.filter(i => i.parentId === query.firstClassId)
})

/* ---------- 选中状态 ---------- */
const selectedRows = ref([])
const singleSelectedId = ref(null)

/* ---------- 标准化已选 ID 列表 ---------- */
const alreadySelectedIds = computed(() => {
  const ids = props.alreadySelectedIds
  return Array.isArray(ids) ? ids : ids ? [ids] : []
})

/* ---------- 是否可选（多选） ---------- */
const isRowSelectable = (row) => {
  return !alreadySelectedIds.value.includes(row.id)
}

/* ---------- 加载分类树 ---------- */
const loadClassOptions = async () => {
  try {
    const { data } = await getBasItemClassTreeList('')
    const first = [], second = []

    const traverse = (nodes, parentId = 0) => {
      nodes.forEach(node => {
        const { itemClass } = node
        if (itemClass.type === 1) {
          first.push({ id: itemClass.id, classname: itemClass.classname })
          if (node.children?.length) traverse(node.children, itemClass.id)
        } else if (itemClass.type === 2) {
          second.push({ id: itemClass.id, classname: itemClass.classname, parentId })
          if (node.children?.length) traverse(node.children, itemClass.id)
        }
      })
    }

    traverse(data?.list || [])
    firstClassOptions.value = first
    allSecondClassOptions.value = second
  } catch (e) {
    console.error(e)
    ElMessage.error('加载分类失败')
  }
}

/* ---------- 加载物料列表 ---------- */
const loadList = async () => {
  loading.value = true
  try {
    const { data } = await getBasItems(query)
    tableData.value = data.page.list || []
    total.value = data.page.totalRow || 0

    // 加载完数据后，自动回显 + 禁用已选
    await nextTick()
    applySelectionAndDisable()
  } catch (e) {
    console.error(e)
    ElMessage.error('加载物料失败')
  } finally {
    loading.value = false
  }
}

/* ---------- 应用回显与禁用 ---------- */
const applySelectionAndDisable = () => {
  if (!tableRef.value) return

  // 清空所有选择
  tableRef.value.clearSelection()

  // 回显：仅勾选「当前页中」且「未被外部禁用」的项
  const toSelect = tableData.value.filter(row =>
    props.alreadySelectedIds.includes?.(row.id) || // 外部传入的已选项
    (Array.isArray(props.alreadySelectedIds) ? props.alreadySelectedIds.includes(row.id) : false)
  )

  toSelect.forEach(row => {
    // 只有「未被禁用」的才能勾选（但实际我们不允许勾选已选）
    // 这里我们只为「回显」而勾选，但 :selectable 会阻止用户操作
    tableRef.value.toggleRowSelection(row, true)
  })
}

/* ---------- 分类联动 ---------- */
const handleFirstClassChange = () => {
  query.secondClassId = ''
  resetPageAndLoad()
}
const handleFirstClassClear = () => {
  query.secondClassId = ''
  resetPageAndLoad()
}
const resetPageAndLoad = () => {
  query.pageNumber = 1
  loadList()
}

/* ---------- 选中处理 ---------- */
const handleSelectionChange = (rows) => {
  selectedRows.value = rows.filter(row => !alreadySelectedIds.value.includes(row.id))
}
const handleSingleSelect = (row) => {
  if (!alreadySelectedIds.value.includes(row.id)) {
    selectedRows.value = [row]
  }
}

/* ---------- 确定按钮 ---------- */
const handleConfirm = () => {
  const newSelected = selectedRows.value.filter(r => !alreadySelectedIds.value.includes(r.id))
  if (!newSelected.length && !selectedRows.value.some(r => alreadySelectedIds.value.includes(r.id))) {
    ElMessage.warning('请至少选择一条未选中的记录')
    return
  }
  emit('confirm', newSelected)
  visible.value = false
}

/* ---------- 打开弹窗时初始化 ---------- */
const handleOpen = () => {
  // 重置查询
  Object.assign(query, {
    itemNo: '',
    itemName: '',
    firstClassId: '',
    secondClassId: '',
    pageNumber: 1,
    pageSize: 10
  })
  selectedRows.value = []
  singleSelectedId.value = null

  loadClassOptions()
  loadList()
}

/* ---------- 监听 alreadySelectedIds 变化（支持动态更新） ---------- */
watch(() => props.alreadySelectedIds, () => {
  if (visible.value) {
    applySelectionAndDisable()
  }
}, { deep: true })
</script>

<style scoped>
.selector-action-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}
.selector-pagination {
  margin-top: 12px;
  text-align: right;
}

/* 可选：已禁用行变灰 */
:deep(.el-table__row.disabled-row) {
  background-color: #f5f7fa !important;
  color: #c0c4cc;
}
</style>