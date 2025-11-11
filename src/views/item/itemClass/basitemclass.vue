<template>
  <div class="item-class-management">
    <div class="action-bar">
      <el-input
        v-model="query.params"
        placeholder="请输入编码或者名称搜索"
        style="width: 180px; margin-right: 10px;"
        clearable
        @clear="getList"
        @keyup.enter="getList"
      />
      <el-button type="primary" @click="getList">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon><Refresh /></el-icon> 刷新
      </el-button>

      <el-button type="primary" style="margin-left: auto;" @click="openAdd(null)">
        新增分类
      </el-button>
    </div>

    <el-table 
      :data="treeData" 
      border 
      v-loading="loading" 
      row-key="itemClass.id" 
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="itemClass.classcode" label="分类编码" width="160" />
      <el-table-column prop="itemClass.classname" label="分类名称" width="200" />
      <el-table-column prop="itemClass.type" label="级别" width="100">
        <template #default="{ row }">
          <el-tag size="small" :type="typeMap[row.itemClass.type]?.type">
            {{ typeMap[row.itemClass.type]?.label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="itemClass.status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.itemClass.status == '1' ? 'success' : 'danger'">
            {{ row.itemClass.status == '1' ? '可用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="itemClass.memo" label="备注" show-overflow-tooltip />
      <el-table-column label="操作" width="280" fixed="right">
        <template #default="{ row }">
          <!-- 仅一二级分类显示「添加子分类」按钮（适配嵌套的 type） -->
          <el-button 
            v-if="[1, 2].includes(row.itemClass.type)" 
            type="success" 
            size="small" 
            @click="openAdd(row)"
            style="margin-right: 5px;"
          >
            添加子分类
          </el-button>
          <el-button type="primary" size="small" @click="openEdit(row)" style="margin-right: 5px;">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/添加子分类弹窗 -->
    <AddDialog v-model="showAdd" :parent-id="addParentId" :default-type="addDefaultType" @success="getList" />

    <!-- 编辑弹窗 -->
    <EditDialog
      v-model="showEdit"
      :row="editRow"
      @success="getList"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  // 关键修改：替换为后端树形接口（getBasItemClassTreeList）
  getBasItemClassTreeList,
  deleteBasItemClass
} from '@/api/item/basitemclass'
import AddDialog from './add.vue'
import EditDialog from './edit.vue'
import { Refresh } from '@element-plus/icons-vue'

const query = reactive({
  params: '',
})

// 关键修改：删掉 list 变量（无需存储扁平数据）
const treeData = ref([])
const loading = ref(false)
const showAdd = ref(false)
const showEdit = ref(false)
const editRow = ref(null)
const addParentId = ref(null)
const addDefaultType = ref(1)

// 分类级别映射（保持不变）
const typeMap = {
  1: { label: '一级', type: 'success' },
  2: { label: '二级', type: 'info' },
  3: { label: '三级', type: 'warning' }
}

const getList = async () => {
  loading.value = true
  try {
    // 关键修改：调用后端树形接口，直接接收树形数据
    const res = await getBasItemClassTreeList(query.params)
    // 无需 buildTree，直接赋值（后端返回的就是完整树形）
    treeData.value = res.data.list || [] 
  } catch (err) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

// 以下方法仅适配嵌套DTO格式，逻辑不变
const handleRefresh = () => {
  query.params = ''
  getList()
}

const handleDelete = (row) => {
  // 适配嵌套DTO：取 row.itemClass.id 和 row.itemClass.classname
  ElMessageBox.confirm(`确认删除分类 "${row.itemClass.classname}" 吗？`, '提示', { type: 'warning' })
    .then(async () => {
      await deleteBasItemClass({ id: row.itemClass.id })
      ElMessage.success('删除成功')
      getList()
    })
    .catch(() => {})
}

const openEdit = (row) => {
  // 适配嵌套DTO：传递完整的 itemClass 作为编辑行数据
  editRow.value = { ...row.itemClass }
  showEdit.value = true
}

const openAdd = (parentRow) => {
  if (parentRow) {
    // 适配嵌套DTO：取 parentRow.itemClass.id 和 type
    addParentId.value = parentRow.itemClass.id
    addDefaultType.value = parentRow.itemClass.type + 1
  } else {
    addParentId.value = null
    addDefaultType.value = 1
  }
  showAdd.value = true
}

// 监听弹窗关闭，重置状态（保持不变）
watch(showEdit, (val) => {
  if (!val) editRow.value = null
})

watch(showAdd, (val) => {
  if (!val) {
    addParentId.value = null
    addDefaultType.value = 1
  }
})

// 关键修改：删掉 buildTree 方法（后端已构建完成）

onMounted(getList)
</script>

<style scoped>
.item-class-management { padding: 20px; }
.action-bar { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 20px; }
</style>