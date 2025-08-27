<template>
  <div class="user-management">
    <div class="action-bar">
      <el-input
        v-model="queryParams.username"
        placeholder="请输入用户名搜索"
        style="width: 200px; margin-right: 10px;"
        clearable
        @clear="getUserList"
        @keyup.enter="getUserList"
      />
      <el-button type="primary" @click="getUserList">搜索</el-button>
            <el-button type="warning" @click="handleRefresh">
        <el-icon>
          <Refresh />
        </el-icon> 刷新
      </el-button>
      <el-button type="primary" style="margin-left: auto;" @click="handleAdd">新增用户</el-button>
    </div>
    
    <el-table :data="userList" border v-loading="loading" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" />
      <!-- <el-table-column prop="id" label="ID" width="80" /> -->
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="descr" label="姓名" />
      <el-table-column prop="departmentName" label="部门" />
      <el-table-column prop="category" label="岗位" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="memo" label="备注" />
      <el-table-column label="头像" width="100">
        <template #default="{ row }">
          <el-image
            v-if="row.avatar"
            :src="baseURL + row.avatar"
            style="width: 40px; height: 40px; border-radius: 50%;"
            fit="cover"
          />
          <span v-else>无头像</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          {{ row.status === 0 ? '正常' : '已删除' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="success" size="small" @click="handlePermission(row)">权限设置</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

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

    <!-- 用户表单对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="dialogType === 'add'">
          <el-input v-model="form.password" placeholder="请输入密码" type="password" />
        </el-form-item>
        <el-form-item label="姓名" prop="descr">
          <el-input v-model="form.descr" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="部门" prop="departmentid">
          <el-select v-model="form.departmentid" placeholder="请选择部门">
            <el-option
              v-for="item in departmentOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="岗位" prop="category">
          <el-input v-model="form.category" placeholder="请输入岗位名称" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="正常" :value="0" />
            <el-option label="删除" :value="-1" />
          </el-select>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <div class="avatar-upload">
            <el-upload
              ref="avatarUpload"
              :auto-upload="false"
              :on-change="handleAvatarChange"
              :on-remove="handleAvatarRemove"
              :limit="1"
              accept="image/*"
              :file-list="avatarFileList"
            >
              <el-button type="primary">上传头像</el-button>
            </el-upload>
            <el-image
              v-if="avatarPreview"
              :src="avatarPreview"
              style="width: 100px; height: 100px; margin-top: 10px; border-radius: 8px;"
              fit="cover"
            />
            <span v-else class="no-avatar">暂无头像</span>
          </div>
        </el-form-item>
        <el-form-item label="备注" prop="memo">
          <el-input v-model="form.memo" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancelForm">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 权限设置对话框 -->
    <el-dialog
      title="权限设置"
      v-model="permissionDialogVisible"
      width="600px"
      @closed="handlePermissionDialogClosed"
      destroy-on-close
    >
      <div v-if="currentUser.id">
        <p>为用户 <strong>{{ currentUser.username }}</strong> 设置菜单权限：</p>
        
        <el-tree
          ref="menuTreeRef"
          :data="menuTreeData"
          show-checkbox
          node-key="id"
          :props="{ label: 'title', children: 'children' }"
          v-loading="menuTreeLoading"
          :key="treeKey"
          @check="handleNodeCheck"
          :default-expand-all="true"
          :check-strictly="true"
        />
      </div>
      <template #footer>
        <el-button @click="permissionDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '@/api/system/user'
import { 
  addMenuToUser, 
  removeMenuFromUser, 
  getUserMenu, 
  getMenuTree
} from '@/api/system/menu'
import { getBasDepartmentOptions } from '@/api/system/department'
import { uploadAvatar} from '@/api/file/file'
import { baseURL } from '@/utils/request';


// 查询参数
const queryParams = reactive({
  pageNumber: 1,
  pageSize: 10,
  username: ''
})

// 用户列表数据
const userList = ref([])
const total = ref(0)
const loading = ref(false)

// 部门选项
const departmentOptions = ref([])

// 菜单树数据
const menuTreeData = ref([])
const menuTreeRef = ref(null)
const menuTreeLoading = ref(false)
const treeKey = ref(0)
const nodeUpdateLoading = ref(false)

// 弹窗表单相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const dialogTitle = computed(() => dialogType.value === 'add' ? '新增用户' : '编辑用户')
const formRef = ref(null)
const avatarUpload = ref(null)
const avatarFileList = ref([])
const avatarPreview = ref('')
const originalAvatar = ref('') // 保存原始头像用于取消操作
const form = reactive({
  id: undefined,
  username: '',
  password: '',
  departmentid: null,
  status: 0,
  flag: null,
  memo: '',
  rule: '',
  type: '',
  descr: '',
  phone: '',
  category: '',
  fax: '',
  avatar: ''
})

// 权限设置相关
const permissionDialogVisible = ref(false)
const currentUser = reactive({
  id: undefined,
  username: ''
})
const currentUserMenus = ref([])

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { max: 255, message: '长度不能超过255个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { max: 255, message: '长度不能超过255个字符', trigger: 'blur' }
  ],
  descr: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { max: 255, message: '长度不能超过255个字符', trigger: 'blur' }
  ],
  departmentid: [
    { required: true, message: '请选择部门', trigger: 'change' }
  ],
  category: [
    { max: 255, message: '长度不能超过255个字符', trigger: 'blur' }
  ],
  phone: [
    { max: 255, message: '长度不能超过255个字符', trigger: 'blur' },
    { pattern: /^[0-9-+\s]*$/, message: '请输入有效的手机号', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ],
  memo: [
    { max: 255, message: '长度不能超过255个字符', trigger: 'blur' }
  ]
}

// 获取用户列表
const getUserList = async () => {
  loading.value = true
  try {
    const res = await getUsers(queryParams)
    userList.value = res.data.page.list.map(user => {
    

      // 查找匹配的部门
      const matchedDepartment = departmentOptions.value.find(d => {
        // 打印每次比较的 id 和 departmentid
        return d.code == user.departmentid;
      });

      // 打印查找结果
      // console.log(`匹配结果: ${matchedDepartment ? `找到部门: ${matchedDepartment.name}` : '未找到匹配部门'}`);

      return {
        ...user,
        departmentName: matchedDepartment?.name || '未知'
      };
    });
    total.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取用户列表失败', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 获取部门选项
const fetchDepartmentOptions = async () => {
  try {
    const res = await getBasDepartmentOptions()
    console.log('获取部门选项', res.data.options)
    if (res.success && res.data.options) {
      departmentOptions.value = res.data.options
      console.log('departmentOptions.value', departmentOptions.value)
    }
  } catch (error) {
    console.error('获取部门选项失败', error)
    ElMessage.error('获取部门选项失败')
  }
}

// 获取完整菜单树
const fetchMenuTree = async () => {
  menuTreeLoading.value = true
  try {
    const res = await getMenuTree()
    if (res.success && res.data.menuTree) {
      menuTreeData.value = res.data.menuTree
    } else {
      ElMessage.error('获取菜单树失败')
    }
  } catch (error) {
    console.error('获取菜单树失败', error)
    ElMessage.error('获取菜单树失败')
  } finally {
    menuTreeLoading.value = false
  }
}

// 获取用户的菜单权限并设置选中状态
const getUserMenus = async (userId) => {
  try {
    const res = await getUserMenu({ userId })
    await nextTick()
    if (!menuTreeRef.value) {
      console.error('菜单树组件未找到')
      ElMessage.error('菜单树组件未找到')
      return
    }
    menuTreeRef.value.setCheckedKeys([])
    if (res.success && res.data && res.data.list && Array.isArray(res.data.list)) {
      const menuIds = res.data.list
        .map(item => item.menuid)
        .filter(id => id !== undefined && id !== null)
      currentUserMenus.value = [...menuIds]
      if (menuIds.length > 0) {
        menuTreeRef.value.setCheckedKeys(menuIds)
      }
    } else {
      currentUserMenus.value = []
    }
  } catch (error) {
    console.error('获取用户菜单权限失败', error)
    ElMessage.error('获取用户菜单权限失败')
  }
}

// 获取节点的父节点ID
const getParentNodeId = (nodes, targetId, parentId = null) => {
  for (const node of nodes) {
    if (node.id === targetId) {
      return parentId
    }
    if (node.children && node.children.length) {
      const found = getParentNodeId(node.children, targetId, node.id)
      if (found) return found
    }
  }
  return null
}

// 获取所有子节点ID
const getAllChildIds = (node) => {
  const ids = []
  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      ids.push(child.id)
      ids.push(...getAllChildIds(child))
    })
  }
  return ids
}

// 处理节点选中状态变化
const handleNodeCheck = async (data, checkedInfo) => {
  if (!currentUser.id || nodeUpdateLoading.value) return
  const nodeId = data.id
  const checkedKeys = checkedInfo.checkedKeys
  const currentMenus = [...currentUserMenus.value]
  let addedMenuIds = checkedKeys.filter(id => !currentMenus.includes(id))
  let removedMenuIds = currentMenus.filter(id => !checkedKeys.includes(id))
  const parentId = getParentNodeId(menuTreeData.value, nodeId)
  if (parentId && addedMenuIds.includes(nodeId) && !currentMenus.includes(parentId)) {
    addedMenuIds.push(parentId)
  }
  const parentRemoved = removedMenuIds.find(id => {
    const node = findNodeById(menuTreeData.value, id)
    return node && node.children && node.children.length > 0
  })
  if (parentRemoved) {
    const parentNode = findNodeById(menuTreeData.value, parentRemoved)
    if (parentNode) {
      const childIds = getAllChildIds(parentNode)
      const selectedChildIds = childIds.filter(id => currentMenus.includes(id))
      removedMenuIds = [...new Set([...removedMenuIds, ...selectedChildIds])]
    }
  }
  if (addedMenuIds.length === 0 && removedMenuIds.length === 0) {
    return
  }
  nodeUpdateLoading.value = true
  try {
    for (const menuId of addedMenuIds) {
      const res = await addMenuToUser({ 
        userId: currentUser.id, 
        menuId: menuId 
      })
      if (res.success) {
        if (!currentUserMenus.value.includes(menuId)) {
          currentUserMenus.value.push(menuId)
        }
        const menuNode = findNodeById(menuTreeData.value, menuId)
        const menuName = menuNode ? menuNode.title : menuId
        ElMessage.success(`已添加"${menuName}"权限`)
      } else {
        ElMessage.error(res.message || '添加权限失败')
      }
    }
    for (const menuId of removedMenuIds) {
      const parentId = getParentNodeId(menuTreeData.value, menuId)
      let additionalRemovals = []
      if (parentId && currentMenus.includes(parentId) && !removedMenuIds.includes(parentId)) {
        const parentNode = findNodeById(menuTreeData.value, parentId)
        if (parentNode) {
          const childIds = getAllChildIds(parentNode)
          const remainingChildren = childIds.filter(id => checkedKeys.includes(id) && id !== menuId)
          if (remainingChildren.length === 0) {
            additionalRemovals.push(parentId)
          }
        }
      }
      const res = await removeMenuFromUser({ 
        userId: currentUser.id, 
        menuId: menuId 
      })
      if (res.success) {
        const index = currentUserMenus.value.indexOf(menuId)
        if (index > -1) {
          currentUserMenus.value.splice(index, 1)
        }
        const menuNode = findNodeById(menuTreeData.value, menuId)
        const menuName = menuNode ? menuNode.title : menuId
        ElMessage.success(`已移除"${menuName}"权限`)
      } else {
        ElMessage.error(res.message || '移除权限失败')
      }
      for (const additionalId of additionalRemovals) {
        if (!currentUserMenus.value.includes(additionalId)) continue
        const resAdditional = await removeMenuFromUser({ 
          userId: currentUser.id, 
          menuId: additionalId 
        })
        if (resAdditional.success) {
          const index = currentUserMenus.value.indexOf(additionalId)
          if (index > -1) {
            currentUserMenus.value.splice(index, 1)
          }
          const menuNode = findNodeById(menuTreeData.value, additionalId)
          const menuName = menuNode ? menuNode.title : additionalId
          ElMessage.success(`已移除"${menuName}"权限`)
        } else {
          ElMessage.error(resAdditional.message || '移除父菜单权限失败')
        }
      }
    }
    await getUserMenus(currentUser.id)
  } catch (error) {
    console.error('更新权限失败', error)
    ElMessage.error('更新权限失败: ' + (error.message || '未知错误'))
    await getUserMenus(currentUser.id)
  } finally {
    nodeUpdateLoading.value = false
  }
}

// 在树结构中递归查找节点
const findNodeById = (nodes, id) => {
  for (const node of nodes) {
    if (node.id === id) {
      return node
    }
    if (node.children && node.children.length) {
      const found = findNodeById(node.children, id)
      if (found) return found
    }
  }
  return null
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getUserList()
}

// 处理当前页变化
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getUserList()
}


// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  if (avatarUpload.value) {
    avatarUpload.value.clearFiles()
  }
  avatarFileList.value = []
  avatarPreview.value = ''
  originalAvatar.value = ''
  Object.assign(form, {
    id: undefined,
    username: '',
    password: '',
    departmentid: null,
    status: 0,
    flag: null,
    memo: '',
    rule: '',
    type: '',
    descr: '',
    phone: '',
    category: '',
    fax: '',
    avatar: ''
  })
}

// 处理头像上传
const handleAvatarChange = async (file) => {
  const isImage = file.raw.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isImage) {
    ElMessage.error('请上传图片文件!')
    avatarUpload.value.clearFiles()
    return
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过2MB!')
    avatarUpload.value.clearFiles()
    return
  }
  

  const formData = new FormData()
  formData.append('file', file.raw)
  
  try {
    const res = await uploadAvatar(formData)
    if (res.success && res.data && res.data.url) {
      avatarFileList.value = [{ name: file.name, url: baseURL + res.data.url }]
      avatarPreview.value = baseURL + res.data.url
      form.avatar = res.data.url // Store the server-returned URL
      ElMessage.success('头像上传成功')
    } else {
      throw new Error(res.msg || '头像上传失败')
    }
  } catch (error) {
    console.error('头像上传失败', error)
    ElMessage.error('头像上传失败')
    avatarFileList.value = []
    avatarPreview.value = dialogType.value === 'edit' ? (originalAvatar.value ? baseURL + originalAvatar.value : '') : ''
    form.avatar = dialogType.value === 'edit' ? originalAvatar.value : ''
    avatarUpload.value.clearFiles()
  }
}
// 处理头像移除
const handleAvatarRemove = () => {
  avatarFileList.value = []
  avatarPreview.value = ''
  form.avatar = dialogType.value === 'edit' ? originalAvatar.value : ''
}

// 新增用户
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  avatarPreview.value = ''
  avatarFileList.value = []
}

// 编辑用户
const handleEdit = async (row) => {
  dialogType.value = 'edit'
  try {
    const res = await getUserById({ id: row.id })
    Object.assign(form, res.data.user)
    originalAvatar.value = form.avatar || '' // Save original avatar
    if (form.avatar) {
      avatarPreview.value = baseURL + form.avatar
      avatarFileList.value = [{ name: 'avatar', url: baseURL + form.avatar }]
    } else {
      avatarPreview.value = ''
      avatarFileList.value = []
    }
    dialogVisible.value = true
  } catch (error) {
    console.error('获取用户信息失败', error)
    ElMessage.error('获取用户信息失败')
  }
}

// 取消表单
const cancelForm = () => {
  dialogVisible.value = false
  if (dialogType.value === 'edit') {
    // Restore original avatar on cancel
    form.avatar = originalAvatar.value
    avatarPreview.value = originalAvatar.value ? baseURL + originalAvatar.value : ''
    avatarFileList.value = originalAvatar.value 
      ? [{ name: 'avatar', url: baseURL + originalAvatar.value }]
      : []
  }
  resetForm()
}

// 删除用户
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除用户"${row.username}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteUser({ id: row.id })
      ElMessage.success('删除成功')
      getUserList()
    } catch (error) {
      console.error('删除用户失败', error)
      ElMessage.error('删除用户失败')
    }
  }).catch(() => {})
}

// 提交表单
const submitForm = () => {
  if (!formRef.value) return
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const formData = { ...form }
        // Remove the raw file from formData if it exists
        if (formData.avatar && typeof formData.avatar !== 'string') {
          delete formData.avatar
        }
        
        if (dialogType.value === 'add') {
          await createUser(formData)
          ElMessage.success('新增成功')
        } else {
          await updateUser(formData)
          ElMessage.success('修改成功')
        }
        dialogVisible.value = false
        resetForm()
        getUserList()
      } catch (error) {
        console.error('保存用户失败', error)
        ElMessage.error('保存用户失败')
      }
    }
  })
}

// 处理权限设置
const handlePermission = async (row) => {
  currentUser.id = row.id
  currentUser.username = row.username
  treeKey.value++
  if (menuTreeData.value.length === 0) {
    await fetchMenuTree()
  }
  permissionDialogVisible.value = true
  await nextTick()
  await getUserMenus(row.id)
}

// 权限对话框关闭时的处理
const handlePermissionDialogClosed = () => {
  currentUser.id = undefined
  currentUser.username = ''
  currentUserMenus.value = []
  if (menuTreeRef.value) {
    menuTreeRef.value.setCheckedKeys([])
  }
}

const handleRefresh = () => {
  queryParams.username = ''
  queryParams.pageNumber = 1
  getUserList()
}
// 页面初始化
onMounted(() => {
  fetchDepartmentOptions()
  getUserList()
  fetchMenuTree()
})
</script>

<style scoped>
.user-management {
  padding: 20px;
}
.action-bar {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.no-avatar {
  margin-top: 10px;
  color: #999;
}
</style>