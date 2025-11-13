<template>
  <!-- 弹窗 -->
  <el-dialog
    v-model="dialogVisible"
    title="通知信息"
    width="50%"
    :close-on-click-modal="false"
    :before-close="handleClose"
    :loading="loading"
  >
    <!-- 物料信息（只读） -->
    <div class="section">
      <h4 class="section-title">物料信息</h4>
      <el-table
        :data="[form]"
        border
        size="small"
        style="width: 100%"
        :show-header="false"
      >
        <el-table-column prop="itemNo" label="产品编号" width="120" show-overflow-tooltip />
        <el-table-column prop="itemName" label="产品名称" width="140" show-overflow-tooltip />
        <el-table-column prop="itemSpec" label="规格型号" width="120" show-overflow-tooltip />
        <el-table-column prop="itemnum" label="数量" width="80" align="center" />
        <el-table-column prop="itemunit" label="单位" width="80" align="center" />
        <el-table-column prop="itemmemo" label="产品备注" min-width="120" show-overflow-tooltip />
      </el-table>
    </div>

    <!-- 图纸信息（只读） -->
    <div class="section">
      <h4 class="section-title">图纸信息</h4>
      <el-table
        :data="[form]"
        border
        size="small"
        style="width: 100%"
        :show-header="false"
      >
        <el-table-column prop="tuzhiNo" label="图纸编号" width="120" show-overflow-tooltip />
      </el-table>
    </div>

    <!-- 通知信息（可编辑） -->
    <div class="section">
      <h4 class="section-title">通知信息</h4>
      <el-form
        ref="noticeFormRef"
        :model="form"
        label-width="120px"
        :rules="noticeRules"
        size="small"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="通知编号" prop="noticeid">
              <el-input v-model="form.noticeid" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="通知名称" prop="noticename">
              <el-input v-model="form.noticename" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>

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
              <el-input v-model="form.noticeauther" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="通知制定时间" prop="noticebuilddate">
              <el-date-picker
                v-model="form.noticebuilddate"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 按钮区 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">
          保 存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { getBasContractItem, updateBasContractItem } from '@/api/contract/bascontract'

// ---------- Props ----------
const props = defineProps({
  itemId: { type: [Number, String], required: true },
  visible: { type: Boolean, default: false }
})

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

// ---------- 加载数据 ----------
const fetchItemInfo = async (id) => {
  loading.value = true
  try {
    const res = await getBasContractItem({ itemId: id })
    const item = res.data.item || {}
    // 直接覆盖所有字段
    Object.assign(form, defaultForm, item)
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
.section {
  margin-bottom: 24px;
}
.section-title {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}
.dialog-footer {
  text-align: right;
}
</style>