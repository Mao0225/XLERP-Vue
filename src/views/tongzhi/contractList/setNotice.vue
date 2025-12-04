<template>
  <!-- 弹窗 -->
  <el-dialog
    v-model="dialogVisible"
    title="通知信息"
    width="60%" 
    :close-on-click-modal="false"
    :before-close="handleClose"
    :loading="loading"
    class="custom-notice-dialog"
  >
    <!-- 物料信息（只读） -->
    <div class="section">
      <h4 class="section-title">
        <i class="el-icon-box section-icon"></i> 物料信息
      </h4>
      <div class="info-card">
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">产品编号：</span>
            <span class="info-value" :title="form.itemNo">{{ form.itemNo || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">产品名称：</span>
            <span class="info-value" :title="form.itemName">{{ form.itemName || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">规格型号：</span>
            <span class="info-value" :title="form.itemSpec">{{ form.itemSpec || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">数量：</span>
            <span class="info-value">{{ form.itemnum || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">单位：</span>
            <span class="info-value">{{ form.itemunit || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">产品备注：</span>
            <span class="info-value" :title="form.itemmemo">{{ form.itemmemo || '-' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 图纸信息（只读） -->
    <div class="section">
      <h4 class="section-title">
        <i class="el-icon-document section-icon"></i> 图纸信息
      </h4>
      <div class="info-card">
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">图纸编号：</span>
            <span class="info-value" :title="form.tuzhiNo">{{ form.tuzhiNo || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">图纸名称：</span>
            <span class="info-value" :title="form.tuzhiName">{{ form.tuzhiName || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">图纸备注：</span>
            <span class="info-value" :title="form.tuzhizuozhe">{{ form.tuzhizuozhe || '-' }}</span>
          </div>
          <div class="info-item info-item-full">
            <span class="info-label">图纸文件：</span>
            <div class="info-value file-list">
              <template v-if="JSON.parse(form.tuzhiurl || '[]').length">
                <div v-for="(file, index) in JSON.parse(form.tuzhiurl || '[]')" :key="index">
                  <span class="file-link" @click="downloadFile(file.url, file.name)">
                    <i class="el-icon-file"></i> {{ file.name }}
                  </span>
                </div>
              </template>
              <span v-else>-</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 通知信息（可编辑） -->
    <div class="section">
      <h4 class="section-title">
        <i class="el-icon-bell section-icon"></i> 通知信息
      </h4>
      <el-form
        ref="noticeFormRef"
        :model="form"
        label-width="120px"
        :rules="noticeRules"
        size="small"
        class="notice-form"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="通知替代型号" prop="noticeinstead">
              <el-input v-model="form.noticeinstead" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="通知备注" prop="noticecomment">
              <el-input v-model="form.noticecomment" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="通知作者" prop="noticeauther">
              <el-input v-model="form.noticeauther" placeholder="请输入" readonly class="readonly-input" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="通知制定时间" prop="noticebuilddate">
             <el-input v-model="form.noticebuilddate" placeholder="请输入" readonly class="readonly-input" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 按钮区 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose" class="cancel-btn">取 消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave" class="save-btn">
          保 存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
// 保持原有脚本不变
import { ref, watch, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { getBasContractItem, updateBasContractItem } from '@/api/contract/bascontract'
import { useUserStore } from '@/store/user'
import { baseURL } from '@/utils/request'

// ---------- Props ----------
const props = defineProps({
  itemId: { type: [Number, String], required: true },
  visible: { type: Boolean, default: false }
})

const userStore = useUserStore()
const emit = defineEmits(['update:visible'])

// ---------- 弹窗控制 ----------
const dialogVisible = ref(props.visible)
watch(() => props.visible, (val) => {
  dialogVisible.value = val
  if (val) {
    nextTick(() => {
      checkAndLoadData()
    })
  }
})
watch(dialogVisible, (val) => emit('update:visible', val))

// ---------- 表单数据（完全扁平） ----------
const defaultForm = {
  itemNo: '',
  itemName: '',
  itemSpec: '',
  itemnum: '',
  itemunit: '',
  itemmemo: '',
  tuzhiNo: '',
  tuzhiName: '',
  tuzhizuozhe: '',
  tuzhiurl: '',
  noticeid: '',
  noticename: '',
  noticeinstead: '',
  noticecomment: '',
  noticeauther: '',
  noticebuilddate: ''
}

const form = reactive({ ...defaultForm })

// ---------- 表单校验（只校验通知字段） ----------
const noticeFormRef = ref(null)
const noticeRules = {
  noticeid: [{ required: true, message: '请输入通知编号', trigger: 'blur' }],
  noticename: [{ required: true, message: '请输入通知名称', trigger: 'blur' }]
}

// ---------- 加载状态 ----------
const loading = ref(false)

// ---------- 检查并加载数据 ----------
const checkAndLoadData = () => {
  const id = props.itemId
  if (!id && id !== 0) {
    ElMessage.warning('缺少物料ID，无法加载信息')
    handleClose()
    return
  }
  fetchItemInfo(id)
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
// ---------- 加载数据 ----------
const fetchItemInfo = async (id) => {
  loading.value = true
  try {
    const res = await getBasContractItem({ itemId: id })
    const item = res.data.item || {}
    // 直接覆盖所有字段
    Object.assign(form, defaultForm, item)
    form.noticeauther = userStore.realName;
    form.noticebuilddate = new Date().toISOString().split('T')[0]

  } catch (e) {
    ElMessage.error('获取信息失败')
    console.error(e)
  } finally {
    loading.value = false
  }
}

// ---------- 保存（只提交通知字段，扁平结构） ----------
const saving = ref(false)
const handleSave = async () => {
  try {
    await noticeFormRef.value?.validate()
  } catch {
    return
  }

  saving.value = true
  try {
    // 直接提交扁平的通知字段 + id
    const payload = {
      id: props.itemId,
      noticeid: form.noticeid,
      noticename: form.noticename,
      noticeinstead: form.noticeinstead,
      noticecomment: form.noticecomment,
      noticeauther: form.noticeauther,
      noticebuilddate: form.noticebuilddate
    }

    const res = await updateBasContractItem(payload)
    const updatedItem = res.data.item || {}
    Object.assign(form, defaultForm, updatedItem)

    ElMessage.success('保存成功')
    handleClose()
  } catch (e) {
    ElMessage.error('保存失败')
    console.error(e)
  } finally {
    saving.value = false
  }
}

// ---------- 关闭 ----------
const handleClose = () => {
  dialogVisible.value = false
  noticeFormRef.value?.resetFields()
  Object.assign(form, defaultForm) // 重置
}
</script>

<style scoped>
/* 基础样式优化 */
.custom-notice-dialog {
  --el-dialog-padding: 24px;
}

.section {
  margin-bottom: 28px;
  position: relative;
}

/* 标题样式优化 */
.section-title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: #1989fa; /* 主色调 */
  display: flex;
  align-items: center;
  padding-left: 8px;
  border-left: 3px solid #1989fa;
}

.section-icon {
  margin-right: 8px;
  font-size: 18px;
}

/* 信息卡片样式 - 重点优化部分 */
.info-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f2f5;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
}

.info-item-full {
  grid-column: 1 / -1; /* 占满整行 */
}

.info-label {
  font-weight: 500;
  color: #4e5969;
  min-width: 80px;
  margin-right: 8px;
  white-space: nowrap;
}

.info-value {
  flex: 1;
  color: #1d2129;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-all;
}

/* 文件列表样式 */
.file-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 4px 0;
}

.file-link {
  color: #409eff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background-color: #f0f9ff;
  border-radius: 4px;
  transition: all 0.3s;
}

.file-link:hover {
  color: #1989fa;
  background-color: #e0f2fe;
  text-decoration: none;
}

.file-link i {
  margin-right: 6px;
  font-size: 12px;
}

/* 表单样式优化 */
.notice-form {
  background-color: #ffffff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f2f5;
}

/* 只读输入框样式 */
.readonly-input {
  background-color: #f9fafb !important;
  color: #6b7280 !important;
  cursor: not-allowed;
}

/* 按钮样式优化 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn {
  border-color: #d1d5db;
  color: #4b5563;
  transition: all 0.3s;
}

.cancel-btn:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.save-btn {
  background-color: #1989fa;
  border-color: #1989fa;
  transition: all 0.3s;
}

.save-btn:hover {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .custom-notice-dialog {
    width: 80% !important;
  }
  
  .info-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

@media (max-width: 768px) {
  .custom-notice-dialog {
    width: 95% !important;
  }
  
  .el-row {
    flex-direction: column;
  }
  
  .el-col {
    width: 100% !important;
    margin-bottom: 8px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .info-item {
    align-items: flex-start;
  }
  
  .info-label {
    min-width: 70px;
  }
}

/* 空值样式优化 */
.info-value:empty::after,
.info-value:contains('-') {
  color: #909399;
}

/* 修复hover效果 */
::v-deep(.el-input__inner:read-only:hover) {
  border-color: #dcdfe6 !important;
}
</style>