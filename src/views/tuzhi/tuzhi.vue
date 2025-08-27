
<template>
  <div class="tuzhi-management">
    <div class="action-bar">
      <el-input
        v-model="queryParams.tuzhimingcheng"
        placeholder="请输入图纸名称搜索"
        style="width: 200px; margin-right: 10px;"
        clearable
        @clear="getTuzhiList"
        @keyup.enter="getTuzhiList"
      />
      <el-button type="primary" @click="getTuzhiList">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon><Refresh /></el-icon> 刷新
      </el-button>
      <el-button type="primary" style="margin-left: auto;" @click="handleAdd">新增图纸</el-button>
    </div>

    <el-table :data="tuzhiList" border v-loading="loading" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="tuzhibianhao" label="图纸编号" />
      <el-table-column prop="tuzhimingcheng" label="图纸名称" />
      <el-table-column prop="tuzhizuozhe" label="图纸作者" />
      <el-table-column prop="chuangzuoriqi" label="创作日期" />
      <el-table-column prop="tuzhimiaoshu" label="图纸描述" />
      <el-table-column label="图纸文件">
        <template #default="{ row }">
          <div v-for="(file, index) in JSON.parse(row.tuzhiurl || '[]')" :key="index">
            <span class="file-link" @click="downloadFile(file.url, file.name)">{{ file.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="memo" label="备注" />
      <el-table-column prop="writer" label="录入者" />
      <el-table-column label="操作" width="300">
        <template #default="{ row }">
          <el-button type="success" size="small" @click="handleCailiao(row)">材料管理</el-button>
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
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

    <!-- 图纸表单对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="图纸编号" prop="tuzhibianhao">
          <el-input v-model="form.tuzhibianhao" placeholder="请输入图纸编号" />
        </el-form-item>
        <el-form-item label="图纸名称" prop="tuzhimingcheng">
          <el-input v-model="form.tuzhimingcheng" placeholder="请输入图纸名称" />
        </el-form-item>
        <el-form-item label="图纸作者" prop="tuzhizuozhe">
          <el-input v-model="form.tuzhizuozhe" placeholder="请输入图纸作者" @blur="autoFillAuthor" />
        </el-form-item>
        <el-form-item label="创作日期" prop="chuangzuoriqi">
          <el-date-picker
            v-model="form.chuangzuoriqi"
            type="date"
            placeholder="请选择创作日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="图纸描述" prop="tuzhimiaoshu">
          <el-input v-model="form.tuzhimiaoshu" placeholder="请输入图纸描述" />
        </el-form-item>
        <el-form-item label="备注" prop="memo">
          <el-input v-model="form.memo" type="textarea" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="图纸文件" prop="tuzhiurl">
          <el-upload
            ref="tuzhiUpload"
            :auto-upload="false"
            :on-change="handleTuzhiChange"
            :on-remove="handleTuzhiRemove"
            :limit="10"
            accept=".pdf,.jpg,.jpeg,.png"
            :file-list="tuzhiFileList"
            list-type="text"
          >
            <el-button type="primary">上传图纸</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="录入者" prop="writer">
          <el-input v-model="form.writer" placeholder="自动填充" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancelForm">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 材料管理对话框 -->
    <el-dialog
      title="图纸材料管理"
      v-model="cailiaoDialogVisible"
      width="80%"
      @closed="handleCailiaoDialogClosed"
    >
      <tuzhicailiao
        :id="currentTuzhiId"
        :tuzhibianhao="currentTuzhiBianhao"
      ></tuzhicailiao>
      <template #footer>
        <el-button @click="cailiaoDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getTuzhis, getTuzhiById, createTuzhi, updateTuzhi, deleteTuzhi } from '@/api/tuzhi/tuzhi'
import { uploadFile } from '@/api/file/file'
import { baseURL } from '@/utils/request'
import Tuzhicailiao from './tuzhicailiao.vue'
import { Refresh } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'

// 引入用户store
const userStore = useUserStore()

// 查询参数
const queryParams = reactive({
  pageNumber: 1,
  pageSize: 10,
  tuzhimingcheng: ''
})

// 用户信息
const userInfo = computed(() => ({
  username: userStore.descr || '未知'
}))

// 图纸列表数据
const tuzhiList = ref([])
const total = ref(0)
const loading = ref(false)

// 弹窗表单相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const dialogTitle = computed(() => dialogType.value === 'add' ? '新增图纸' : '编辑图纸')
const formRef = ref(null)
const tuzhiUpload = ref(null)
const tuzhiFileList = ref([])
const form = reactive({
  id: undefined,
  tuzhibianhao: '',
  tuzhimingcheng: '',
  tuzhizuozhe: '',
  chuangzuoriqi: '',
  tuzhimiaoshu: '',
  memo: '',
  flag: 0,
  type: 0,
  writer: '',
  tuzhiurl: '[]'
})

// 材料管理对话框相关
const cailiaoDialogVisible = ref(false)
const currentTuzhiId = ref(null)
const currentTuzhiBianhao = ref('')

// 表单验证规则
const rules = {
  tuzhibianhao: [
    { required: true, message: '请输入图纸编号', trigger: 'blur' },
    { max: 100, message: '长度不能超过100个字符', trigger: 'blur' }
  ],
  tuzhimingcheng: [
    { required: true, message: '请输入图纸名称', trigger: 'blur' },
    { max: 100, message: '长度不能超过100个字符', trigger: 'blur' }
  ],
  tuzhizuozhe: [
    { required: true, message: '请输入图纸作者', trigger: 'blur' },
    { max: 100, message: '长度不能超过100个字符', trigger: 'blur' }
  ],
  chuangzuoriqi: [
    { required: true, message: '请选择创作日期', trigger: 'change' }
  ],
  tuzhimiaoshu: [
    { required: true, message: '请输入图纸描述', trigger: 'blur' },
    { max: 100, message: '长度不能超过100个字符', trigger: 'blur' }
  ],
  memo: [
    { max: 100, message: '长度不能超过100个字符', trigger: 'blur' }
  ]
}

// 获取图纸列表
const getTuzhiList = async () => {
  loading.value = true
  try {
    const res = await getTuzhis(queryParams)
    tuzhiList.value = res.data.page.list
    total.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取图纸列表失败', error)
    ElMessage.error('获取图纸列表失败')
  } finally {
    loading.value = false
  }
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getTuzhiList()
}

// 处理当前页变化
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getTuzhiList()
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  if (tuzhiUpload.value) {
    tuzhiUpload.value.clearFiles()
  }
  tuzhiFileList.value = []
  Object.assign(form, {
    id: undefined,
    tuzhibianhao: '',
    tuzhimingcheng: '',
    tuzhizuozhe: userInfo.value.username,
    chuangzuoriqi: '',
    tuzhimiaoshu: '',
    memo: '',
    flag: 0,
    type: 0,
    writer: userInfo.value.username,
    tuzhiurl: '[]'
  })
}

// 处理图纸上传
const handleTuzhiChange = async (file, fileList) => {
  const formData = new FormData()
  formData.append('file', file.raw)
  formData.append('folder', 'tuzhi')

  try {
    const res = await uploadFile(formData)
    if (res.success && res.data && res.data.url) {
      tuzhiFileList.value = fileList.map(item => ({
        name: item.name,
        url: item.url || (item.raw && res.data.url)
      }))
      form.tuzhiurl = JSON.stringify(tuzhiFileList.value)
      ElMessage.success(`${file.name} 上传成功`)
    } else {
      throw new Error(res.msg || '图纸上传失败')
    }
  } catch (error) {
    console.error('图纸上传失败', error)
    ElMessage.error(`${file.name} 上传失败`)
    tuzhiFileList.value = tuzhiFileList.value.filter(item => item.name !== file.name)
  }
}

// 处理文件移除
const handleTuzhiRemove = (file, fileList) => {
  tuzhiFileList.value = fileList.map(item => ({
    name: item.name,
    url: item.url
  }))
  form.tuzhiurl = JSON.stringify(tuzhiFileList.value)
  ElMessage.success(`${file.name} 已移除`)
}

// 新增图纸
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  tuzhiFileList.value = []
  form.writer = userInfo.value.username
  form.chuangzuoriqi = new Date().toISOString().split('T')[0]
}

// 编辑图纸
const handleEdit = async (row) => {
  dialogType.value = 'edit'
  try {
    const res = await getTuzhiById({ id: row.id })
    Object.assign(form, res.data.tuzhi)
    
    // 确保tuzhiurl是JSON格式
    try {
      JSON.parse(form.tuzhiurl)
    } catch (e) {
      if (form.tuzhiurl) {
        const urls = form.tuzhiurl.split('-')
        form.tuzhiurl = JSON.stringify(urls.map(url => ({ name: url.split('/').pop(), url: baseURL + url })))
      } else {
        form.tuzhiurl = '[]'
      }
    }
    
    tuzhiFileList.value = JSON.parse(form.tuzhiurl).map(file => ({
      name: file.name,
      url: file.url
    }))
    dialogVisible.value = true
  } catch (error) {
    console.error('获取图纸信息失败', error)
    ElMessage.error('获取图纸信息失败')
  }
}

// 取消表单
const cancelForm = () => {
  dialogVisible.value = false
  resetForm()
}

// 删除图纸
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除图纸"${row.tuzhimingcheng}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteTuzhi({ id: row.id })
      ElMessage.success('删除成功')
      getTuzhiList()
    } catch (error) {
      console.error('删除图纸失败', error)
      ElMessage.error('删除图纸失败')
    }
  }).catch(() => {})
}

// 下载文件
const downloadFile = (url, filename) => {
  // 拼接 baseURL，确保 URL 是完整的
  const fullUrl = url.startsWith('http') ? url : baseURL + url
  const fileExtension = filename.split('.').pop().toLowerCase()
  const viewableTypes = ['jpg', 'jpeg', 'png', 'pdf']
  
  if (viewableTypes.includes(fileExtension)) {
    window.open(fullUrl, '_blank')
  } else {
    const link = document.createElement('a')
    link.href = fullUrl
    link.download = filename
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    setTimeout(() => {
      document.body.removeChild(link)
    }, 100)
  }
}

// 自动填充作者
const autoFillAuthor = () => {
  if (!form.tuzhizuozhe || form.tuzhizuozhe.trim() === '' || form.tuzhizuozhe.trim().toLowerCase() === 'n/a') {
    form.tuzhizuozhe = userInfo.value.username
  }
}

// 提交表单
const submitForm = () => {
  if (!formRef.value) return
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const submitForm = { ...form }
        if (dialogType.value === 'add') {
          if (!submitForm.writer) {
            submitForm.writer = userInfo.value.username
          }
          await createTuzhi(submitForm)
          ElMessage.success('新增成功')
        } else {
          await updateTuzhi(submitForm)
          ElMessage.success('修改成功')
        }
        dialogVisible.value = false
        resetForm()
        getTuzhiList()
      } catch (error) {
        console.error('保存图纸失败', error)
        ElMessage.error('保存图纸失败')
      }
    }
  })
}

// 打开材料管理对话框
const handleCailiao = (row) => {
  currentTuzhiId.value = row.id
  currentTuzhiBianhao.value = row.tuzhibianhao
  cailiaoDialogVisible.value = true
}

// 材料管理对话框关闭时的回调
const handleCailiaoDialogClosed = () => {
  getTuzhiList()
}

const handleRefresh = () => {
  queryParams.tuzhimingcheng = ''
  queryParams.pageNumber = 1
  getTuzhiList()
}

// 页面初始化
onMounted(() => {
  getTuzhiList()
})
</script>

<style scoped>
.tuzhi-management {
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
.file-link {
  color: #409eff;
  cursor: pointer;
  text-decoration: none;
}
.file-link:hover {
  text-decoration: underline;
}
</style>
