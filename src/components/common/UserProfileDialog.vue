<template>
  <el-dialog
    title="用户信息"
    v-model="dialogVisible"
    width="500px"
    :before-close="handleClose"
  >
    <el-tabs v-model="activeTab" type="card">
      <el-tab-pane label="基本信息" name="profile">
        <el-form
          :model="form"
          :rules="rules"
          ref="profileForm"
          label-width="80px"
          class="profile-form"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="姓名" prop="descr">
            <el-input v-model="form.descr" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="头像" prop="avatar">
            <el-upload
              class="avatar-uploader"
              :action="uploadAction"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :http-request="handleAvatarUpload"
            >
              <img v-if="avatarPreview" :src="avatarPreview" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="修改密码" name="password">
        <el-form
          :model="passwordFormData"
          :rules="passwordRules"
          ref="passwordForm"
          label-width="80px"
          class="password-form"
        >
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input
              v-model="passwordFormData.oldPassword"
              type="password"
              placeholder="请输入旧密码"
              show-password
            />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input
              v-model="passwordFormData.newPassword"
              type="password"
              placeholder="请输入新密码"
              show-password
            />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="passwordFormData.confirmPassword"
              type="password"
              placeholder="请确认新密码"
              show-password
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'
import { getUserById, updateUser, changePassword} from '@/api/system/user'
import { uploadAvatar } from '@/api/file/file'
const userStore = useUserStore()
const dialogVisible = ref(false)
const activeTab = ref('profile')
const profileForm = ref(null)
const passwordForm = ref(null)
const baseUrl = 'http://127.0.0.1:8099'

const form = ref({
  id: null,
  username: '',
  descr: '',
  phone: '',
  avatar: ''
})

// 修改变量名为 passwordFormData 避免与 ref 冲突
const passwordFormData = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  descr: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
  ]
}

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入旧密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordFormData.value.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const avatarPreview = computed(() => form.value.avatar ? baseUrl + form.value.avatar : '')

const open = async () => {
  try {
    const userId = userStore.userId
    if (!userId) {
      ElMessage.error('用户ID不存在')
      return
    }
    console.log('获取用户信息', userId)
    const res = await getUserById({id: userId})
    if (res.success && res.data && res.data.user) {
      form.value = {
        id: res.data.user.id,
        username: res.data.user.username,
        descr: res.data.user.descr || '',
        phone: res.data.user.phone || '',
        avatar: res.data.user.avatar || ''
      }
      dialogVisible.value = true
    } else {
      throw new Error(res.msg || '获取用户信息失败')
    }
  } catch (error) {
    ElMessage.error(error.message || '获取用户信息失败')
  }
}

const handleClose = () => {
    dialogVisible.value = false
    resetForm()
}

const resetForm = () => {
  form.value = {
    id: null,
    username: '',
    descr: '',
    phone: '',
    avatar: ''
  }
  passwordFormData.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  profileForm.value?.resetFields()
  passwordForm.value?.resetFields()
  activeTab.value = 'profile'
}

const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

const handleAvatarUpload = async ({ file }) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const res = await uploadAvatar(formData)
    if (res.success && res.data && res.data.url) {
      form.value.avatar = res.data.url
      ElMessage.success('头像上传成功')
    } else {
      throw new Error(res.msg || '头像上传失败')
    }
  } catch (error) {
    ElMessage.error(error.message || '头像上传失败')
  }
}

const handleSubmit = () => {
  if (activeTab.value === 'profile') {
    profileForm.value.validate(async (valid) => {
      if (valid) {
        try {
          const res = await updateUser(form.value)
          if (res.success) {
            ElMessage.success('用户信息更新成功')
            userStore.setUserInfo({
              username: form.value.username,
              avatar: form.value.avatar
            })
            dialogVisible.value = false
            resetForm()
          } else {
            throw new Error(res.msg || '更新用户信息失败')
          }
        } catch (error) {
          ElMessage.error(error.message || '更新用户信息失败')
        }
      }
    })
  } else {
    passwordForm.value.validate(async (valid) => {
      if (valid) {
        try {
          const res = await changePassword({
            userId: String(form.value.id), // 显式转换为字符串
            oldPassword: passwordFormData.value.oldPassword,
            newPassword: passwordFormData.value.newPassword
          })
          if (res.success) {
            ElMessage.success('密码修改成功')
            dialogVisible.value = false
            userStore.logout()
            // resetForm()
          } else {
            throw new Error(res.msg || '密码修改失败')
          }
        } catch (error) {
          ElMessage.error(error.message || '密码修改失败')
        }
      }
    })
  }
}

defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  display: block;
  border-radius: 50%;
}

.avatar-uploader :deep(.el-upload) {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}

.profile-form,
.password-form {
  padding: 0 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>