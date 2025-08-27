<template>
  <div class="menu-management">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="title">菜单管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增菜单
          </el-button>
        </div>
      </template>
      
      <!-- 使用表格树形显示菜单列表 -->
      <el-table
        :data="menuList"
        border
        v-loading="loading"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        style="width: 100%"
        :header-cell-style="{ backgroundColor: '#f5f7fa', color: '#606266' }"
      >
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="title" label="菜单名称" min-width="120" />
        <el-table-column prop="path" label="路径" min-width="150" />
        <el-table-column prop="component" label="组件路径" min-width="150" />
        <el-table-column prop="writer" label="创建人" width="100" align="center"/>
        <el-table-column prop="layout" label="布局" width="100" align="center">

          <template #default="{ row }">
            <el-tag v-if="row.layout">{{ row.layout }}</el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="icon" label="图标" width="100" align="center">
          <template #default="{ row }">
            <el-icon v-if="row.icon">
              <component :is="row.icon.replace('el-icon-', '')" />
            </el-icon>
            <template v-else>
              <div :class="`i-svg:${row.icon}`" />
            </template>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>


    </el-card>

    <!-- 菜单表单对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="550px"
      @closed="resetForm"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" status-icon>
        <el-form-item label="上级菜单" prop="parentid">
          <el-tree-select
            v-model="form.parentid"
            :data="menuTreeData"
            :props="{ label: 'title', children: 'children', value: 'id' }"
            placeholder="请选择上级菜单，不选择则为顶级菜单"
            check-strictly
            style="width: 100%"
            clearable
          />
        </el-form-item>
        <el-form-item label="菜单标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入菜单标题" />
        </el-form-item>
        <el-form-item label="菜单路径" prop="path">
          <el-input v-model="form.path" placeholder="请输入菜单路径，例如：/system/user" />
        </el-form-item>
        <el-form-item label="组件路径" prop="component">
          <el-input v-model="form.component" placeholder="请输入组件路径，例如：system/user" />
          <div class="form-tip">组件路径为相对于@/views的路径，不需要带.vue后缀</div>
        </el-form-item>
        <el-form-item label="布局类型" prop="layout">
          <el-select v-model="form.layout" placeholder="请选择布局类型" style="width: 100%">
            <el-option label="默认布局" value="default" />
            <el-option label="简单布局" value="simple" />
            <el-option label="无布局" value="none" />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <IconSelect v-model="form.icon" />
        </el-form-item>
        <el-form-item label="创建人" prop="writer">
          <el-input v-model="form.writer" placeholder="请输入菜单创建人" /> 
        </el-form-item>
        <!-- <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="999" controls-position="right" style="width: 100%" />
        </el-form-item> -->
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitLoading">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMenus, getMenuById, createMenu, updateMenu, deleteMenu } from '@/api/system/menu'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import IconSelect from '@/components/common/IconSelect.vue';

// 查询参数
const queryParams = reactive({

})

// 菜单列表数据
const menuList = ref([])
const menuTreeData = ref([]) // 用于树形选择器
const total = ref(0)
const loading = ref(false)
const submitLoading = ref(false)

// 常用Element Plus图标列表
const iconList = [
  'Setting', 'Menu', 'User', 'Role', 'House', 'Location', 
  'Document', 'Folder', 'Edit', 'Delete', 'Search', 'Share',
  'Bell', 'Calendar', 'Chat', 'Clock', 'Place', 'Star'
]

// 弹窗表单相关
const dialogVisible = ref(false)
const dialogType = ref('add') // 'add' 或 'edit'
const dialogTitle = computed(() => dialogType.value === 'add' ? '新增菜单' : '编辑菜单')
const formRef = ref(null)
const form = reactive({
  id: undefined,
  title: '',
  path: '',
  component: '',  // 添加组件路径字段
  layout: 'default', // 添加布局类型字段，默认为default
  icon: '',
  writer: '',
  parentid: undefined, // 不选择时为undefined，提交时会处理为0
//   sort: 0 // 新增排序字段
})

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入菜单标题', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  path: [
    { required: true, message: '请输入菜单路径', trigger: 'blur' }
  ],
  component: [
    { required: true, message: '请输入组件路径', trigger: 'blur' }
  ],
  layout: [
    { required: true, message: '请选择布局类型', trigger: 'change' }
  ]
}

// 获取菜单列表
const getMenuList = async () => {
  loading.value = true
  try {
    const res = await getMenus() // 修改为调用新的接口
    if (res.code === 200) {
      const allMenus = res.data.list // 注意数据结构变化
      menuList.value = buildTree(allMenus, 0)
      // 更新树形选择器的数据
      menuTreeData.value = [
        { id: 0, title: '顶级菜单', children: buildTree([...allMenus], 0) }
      ]
    } else {
      ElMessage.error(res.message || '获取菜单列表失败')
    }
  } catch (error) {
    console.error('获取菜单列表失败', error)
    ElMessage.error('获取菜单列表失败')
  } finally {
    loading.value = false
  }
}

// 构建菜单树
const buildTree = (menus, parentId) => {
  return menus
    .filter(menu => menu.parentid === parentId)
    // .sort((a, b) => (a.sort || 0) - (b.sort || 0)) // 按排序字段排序
    .map(menu => {
      const children = buildTree(menus, menu.id)
      return {
        ...menu,
        children: children.length ? children : undefined
      }
    })
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  form.id = undefined
  form.title = ''
  form.path = ''
  form.component = ''
  form.layout = 'default'
  form.icon = ''
  form.parentid = undefined
  form.writer = ''
//   form.sort = 0
}

// 新增菜单
const handleAdd = () => {
  dialogType.value = 'add'
  resetForm()
  dialogVisible.value = true
}

// 编辑菜单
const handleEdit = async (row) => {
  dialogType.value = 'edit'
  resetForm()
  try {
    const res = await getMenuById({ id: row.id })
    if (res.success) {
      Object.assign(form, res.data.menu)
      // 确保编辑时layout有值
      if (!form.layout) {
        form.layout = 'default'
      }
    } else {
      ElMessage.error(res.message || '获取菜单详情失败')
      return
    }
  } catch (error) {
    console.error('获取菜单详情失败', error)
    ElMessage.error('获取菜单详情失败')
    return
  }
  dialogVisible.value = true
}

// 删除菜单
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除菜单"${row.title}"吗？删除后其子菜单也将被删除！`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true
  }).then(async () => {
    try {
      const res = await deleteMenu({ id: row.id })
      if (res.success) {
        ElMessage.success('删除成功')
        getMenuList()
      } else {
        ElMessage.error(res.message || '删除失败')
      }
    } catch (error) {
      console.error('删除菜单失败', error)
      ElMessage.error('删除菜单失败')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 提交表单
// 提交表单
const submitForm = () => {
  if (!formRef.value) return
  
  formRef.value.validate(async (valid) => {
    if (valid) {
      // 准备提交数据
      const submitData = { 
        ...form,
        parentid: form.parentid === undefined ? 0 : form.parentid,
        // 移除 icon 字段的 el-icon- 前缀（如果存在）
        icon: form.icon?.replace(/^el-icon-/, '') || ''
      }
      
      submitLoading.value = true
      try {
        let res
        if (dialogType.value === 'add') {
          res = await createMenu(submitData)
        } else {
          res = await updateMenu(submitData)
        }
        
        if (res.success) {
          ElMessage.success(dialogType.value === 'add' ? '新增成功' : '修改成功')
          dialogVisible.value = false
          getMenuList()
        } else {
          ElMessage.error(res.message || '保存失败')
        }
      } catch (error) {
        console.error('保存菜单失败', error)
        ElMessage.error('保存菜单失败')
      } finally {
        submitLoading.value = false
      }
    }
  })
}

// 页面初始化
onMounted(() => {
  getMenuList()
})
</script>



<style scoped>
.menu-management {
  padding: 20px;
}

.box-card {
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

.icon-option {
  display: flex;
  align-items: center;
}

.dialog-footer {
  padding-top: 10px;
  text-align: right;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .menu-management {
    padding: 10px;
  }
  
  .el-dialog {
    width: 95% !important;
  }
}
</style>