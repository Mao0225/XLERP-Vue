<template>
  <div class="clbgxjsbxjlc-management">
    <div class="action-bar">
      <el-input
        v-model="queryParams.matRecheckNo"
        placeholder="来料检验批次号"
        style="width: 180px; margin-right: 10px;"
        clearable
        @clear="getList"
        @input="handleQueryChange"
      />
      <el-input
        v-model="queryParams.mafactory"
        placeholder="原材料制造商"
        readonly
        style="width: 200px; margin-right: 10px; cursor: pointer;"
        @click.stop="searchSupplierDialogVisible= true"
        :suffix-icon="'el-icon-search'"
        clearable
        @clear="clearSearchSupplier"
      >
        <template #append>
          <el-button @click="searchSupplierDialogVisible = true" size="small">选择</el-button>
        </template>
      </el-input>
      <el-input
        v-model="queryParams.woNo"
        placeholder="生产工单号"
        readonly
        style="width: 200px; margin-right: 10px; cursor: pointer;"
        @click.stop="searchWoDialogVisible= true"
        :suffix-icon="'el-icon-search'"
        clearable
        @clear="clearSearchWoNo"
      >
        <template #append>
          <el-button @click="searchWoDialogVisible = true" size="small">选择</el-button>
        </template>
      </el-input>
      <el-button type="primary" @click="getList">搜索</el-button>
      <el-button type="warning" @click="resetQuery" style="margin-left: 10px;">重置</el-button>
      <el-button type="primary" style="margin-left: auto;" @click="handleAdd">新增铝材</el-button>
    </div>
    <el-table :data="list" border v-loading="loading" style="width: 100%">
      <el-table-column type="index" label="序号" width="70" />
      <el-table-column prop="matRecheckNo" label="来料检验批次号" />
      <el-table-column prop="orderno" label="入库单号" />
      <el-table-column prop="mafactory" label="原材料制造商" />
      <el-table-column prop="matMaterial" label="牌号" />
      <el-table-column prop="chemAl" label="化学成分-Al(%)" >
         <template #default="{ row }">
          {{ formatChemicalValue(row.chemAl) }}
        </template>
      </el-table-column>
      <el-table-column prop="chemSi" label="化学成分-Si(%)" >
        <template #default="{ row }">
          {{ formatChemicalValue(row.chemSi) }}
        </template>
      </el-table-column>
      <el-table-column prop="chemFe" label="化学成分-Fe(%)" >
        <template #default="{ row }">
          {{ formatChemicalValue(row.chemFe) }}
        </template>
      </el-table-column>
      <el-table-column prop="chemCu" label="化学成分-Cu(%)" >
        <template #default="{ row }">
          {{ formatChemicalValue(row.chemCu) }}
        </template>
      </el-table-column>
      <el-table-column prop="chemMg" label="化学成分-Mg(%)" >
        <template #default="{ row }">
          {{ formatChemicalValue(row.chemMg) }}
        </template>
      </el-table-column>
      <el-table-column prop="chemMn" label="化学成分-Mn(%)" >
        <template #default="{ row }">
          {{ formatChemicalValue(row.chemMn) }}
        </template>
      </el-table-column>
      <el-table-column prop="chemZn" label="化学成分-Zn(%)" >
        <template #default="{ row }">
          {{ formatChemicalValue(row.chemZn) }}
        </template>
      </el-table-column>
      <el-table-column prop="chemTi" label="化学成分-Ti(%)" >
        <template #default="{ row }">
          {{ formatChemicalValue(row.chemTi) }}
        </template>
      </el-table-column>
      <el-table-column prop="chemCr" label="化学成分-Cr(%)" >
        <template #default="{ row }">
          {{ formatChemicalValue(row.chemCr) }}
        </template>
      </el-table-column>
      <el-table-column prop="tensileStrength" label="拉伸强度(MPa)" />
      <el-table-column prop="elongation" label="延伸率(%)" />
      <el-table-column prop="leavefactoryDate" label="原材料出厂检测日期" width="130" />
      <el-table-column prop="detectionTime" label="原材料入厂检测日期" width="130" />
      <el-table-column label="质量证明书">
        <template #default="{ row }">
          <div v-for="(file, index) in parseCertificateForDisplay(row.certificate)" :key="index">
            <span class="file-link" @click="handleCertificateClick(file)">{{ file.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="contractNo" label="合同编号" />
      <el-table-column prop="woNo" label="生产工单号" />
      <el-table-column prop="ipoNo" label="生产订单号" />
      <el-table-column prop="writer" label="录入人" />
      <el-table-column prop="writeTime" label="录入时间" width="150" />
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
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
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="900px" @closed="resetForm">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="150px">
            <el-form-item label="生产工单号" prop="woNo">
              <el-input
                v-model="form.woNo"
                placeholder="请选择生产工单号"
                readonly
                @click="openWoSelector"
              >
                <template #append>
                  <el-button @click="openWoSelector" size="small">选择</el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="合同编号" prop="contractNo">
              <el-input v-model="form.contractNo" disabled />
            </el-form-item>
<el-form-item label="生产订单号" prop="ipoNo">
              <el-input v-model="form.ipoNo" disabled />
            </el-form-item>
            <el-form-item label="来料检验批次号" prop="matRecheckNo">
              <el-input v-model="form.matRecheckNo" maxlength="48" />
            </el-form-item>
         <el-form-item label="入库单号" prop="orderno">
              <el-input v-model="form.orderno" maxlength="48" />
            </el-form-item>
         <el-form-item label="原材料制造商" prop="mafactory">
              <el-input
                v-model="form.mafactory"
                placeholder="请选择原材料制造商"
                readonly
                style="cursor: pointer;"
                @click="showSupplierDialog = true;"
              >
                <template #append>
                  <el-button @click="showSupplierDialog = true" size="small">选择</el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="牌号" prop="matMaterial">
              <el-input v-model="form.matMaterial" maxlength="48" />
            </el-form-item>
        <el-divider>化学成分分析</el-divider>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Al(%)" prop="chemAl">
              <el-input v-model="form.chemAl" maxlength="20" @blur="handleNumberInputBlur('chemAl', 3)">
                <template #append>%</template>
              </el-input>
              <div class="el-form-item__tip">小数保留3位</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Si(%)" prop="chemSi">
              <el-input v-model="form.chemSi" maxlength="20" @blur="handleNumberInputBlur('chemSi', 3)">
                <template #append>%</template>
              </el-input>
              <div class="el-form-item__tip">小数保留3位</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Fe(%)" prop="chemFe">
              <el-input v-model="form.chemFe" maxlength="20" @blur="handleNumberInputBlur('chemFe', 3)">
                <template #append>%</template>
              </el-input>
              <div class="el-form-item__tip">小数保留3位</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Cu(%)" prop="chemCu">
              <el-input v-model="form.chemCu" maxlength="20" @blur="handleNumberInputBlur('chemCu', 3)">
                <template #append>%</template>
              </el-input>
              <div class="el-form-item__tip">小数保留3位</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Mg(%)" prop="chemMg">
              <el-input v-model="form.chemMg" maxlength="20" @blur="handleNumberInputBlur('chemMg', 3)">
                <template #append>%</template>
              </el-input>
              <div class="el-form-item__tip">小数保留3位</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Mn(%)" prop="chemMn">
              <el-input v-model="form.chemMn" maxlength="20" @blur="handleNumberInputBlur('chemMn', 3)">
                <template #append>%</template>
              </el-input>
              <div class="el-form-item__tip">小数保留3位</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Zn(%)" prop="chemZn">
              <el-input v-model="form.chemZn" maxlength="20" @blur="handleNumberInputBlur('chemZn', 3)">
                <template #append>%</template>
              </el-input>
              <div class="el-form-item__tip">小数保留3位</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Ti(%)" prop="chemTi">
              <el-input v-model="form.chemTi" maxlength="20" @blur="handleNumberInputBlur('chemTi', 3)">
                <template #append>%</template>
              </el-input>
              <div class="el-form-item__tip">小数保留3位</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Cr(%)" prop="chemCr">
              <el-input v-model="form.chemCr" maxlength="20" @blur="handleNumberInputBlur('chemCr', 3)">
                <template #append>%</template>
              </el-input>
              <div class="el-form-item__tip">小数保留3位</div>
            </el-form-item>
          </el-col>
        </el-row>
            <el-form-item label="拉伸强度(MPa)" prop="tensileStrength">
              <el-input v-model="form.tensileStrength" maxlength="20" @blur="handleNumberInputBlur('tensileStrength', 1)">
                <template #append>MPa</template>
              </el-input>
              <div class="el-form-item__tip">小数保留1位</div>
            </el-form-item>
         <el-form-item label="延伸率(%)" prop="elongation">
              <el-input v-model="form.elongation" maxlength="20" @blur="handleNumberInputBlur('elongation', 0)">
                <template #append>%</template>
              </el-input>
              <div class="el-form-item__tip">小数保留0位</div>
            </el-form-item><el-form-item label="原材料出厂检测日期" prop="leavefactoryDate">
              <el-date-picker v-model="form.leavefactoryDate" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style="width: 100%;" />
            </el-form-item>
          <el-form-item label="原材料入厂检测日期" prop="detectionTime">
              <el-date-picker v-model="form.detectionTime" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style="width: 100%;" />
            </el-form-item>
         <el-form-item label="质量证明书" prop="certificate">
          <el-upload
            ref="certificateUpload"
            :auto-upload="false"
            :on-change="handleCertificateChange"
            :limit="3"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            :file-list="[]"  
            :show-file-list="false"
          >
            <el-button type="primary">上传质量证明书</el-button>
            <div class="el-upload__tip">支持 pdf、doc、docx、xls、xlsx、jpg、jpeg、png 等格式，最多3个质量证明书</div>
          </el-upload>
          <div class="uploaded-files" v-if="form.certificate">
            <div v-for="(file, index) in JSON.parse(form.certificate)" :key="index" class="uploaded-file">
              {{ file.name }}
              <el-button type="danger" size="mini" @click="deleteCertificateFile(index)">删除</el-button>
            </div>
          </div>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="录入人" prop="writer">
              <el-input v-model="form.writer" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="录入时间" prop="writeTime">
              <el-input v-model="form.writeTime" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="saving">保存</el-button>
      </template>
      <WoSelectorDialog v-model="woSelectorVisible" @select="handleWoSelect" />
      <SupplierDialog v-model="showSupplierDialog" @select="handleSupplierSelect" />
    </el-dialog>
    <!-- 质量证明书预览弹窗 -->
    <el-dialog 
      title="质量证明书预览" 
      v-model="certificatePreviewVisible" 
      width="80%" 
      :close-on-click-modal="false"
      :before-close="handlePreviewClose"
    >
      <!-- 图片预览 -->
      <div v-if="previewFileType === 'image'" class="preview-container">
        <img 
          :src="certificatePreviewUrl" 
          alt="质量证明书" 
          style="max-width: 100%; max-height: 70vh; display: block; margin: 0 auto;"
          @error="handleImageError"
        />
      </div>
      <!-- PDF预览 -->
      <div v-else-if="previewFileType === 'pdf'" class="preview-container">
        <iframe 
          :src="certificatePreviewUrl" 
          width="100%" 
          height="600px" 
          frameborder="0"
          @error="handlePdfError"
        >
          您的浏览器不支持PDF预览，请<a :href="certificatePreviewUrl" target="_blank">点击此处下载</a>
        </iframe>
      </div>
      <!-- 不支持预览的文件类型 -->
      <div v-else class="preview-container">
        <div style="text-align: center; padding: 40px;">
          <el-icon size="64" color="#909399">
            <Document />
          </el-icon>
          <p style="margin: 20px 0; color: #606266;">此文件类型不支持在线预览</p>
          <el-button type="primary" @click="downloadFile(certificatePreviewUrl, previewFileName)">
            下载文件
          </el-button>
        </div>
      </div>
      <template #footer>
        <el-button @click="certificatePreviewVisible = false">关闭</el-button>
        <el-button type="primary" @click="downloadFile(certificatePreviewUrl, previewFileName)">
          下载
        </el-button>
      </template>
    </el-dialog>
    <WoSelectorDialog v-model="searchWoDialogVisible" @select="handleSearchWoSelect" />
    <SupplierDialog v-model="searchSupplierDialogVisible" @select="handleSearchSupplierSelect" />
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document } from '@element-plus/icons-vue'
import { getClbgxjsbxjlcList, getClbgxjsbxjlcById, createClbgxjsbxjlc, updateClbgxjsbxjlc, deleteClbgxjsbxjlc, getGongdanByWoNo } from '@/api/clmanage/clbgxjsbxjlc'
import { uploadFile } from '@/api/file/file'
import WoSelectorDialog from '@/views/clmanage/ljq/components/WoSelectorDialog.vue'
import SupplierDialog from '@/views/clmanage/ljq/components/SupplierDialog.vue'
import { useUserStore } from '@/store/user'
import { baseURL } from '@/utils/request'

const userStore = useUserStore()
// 用户信息
const userInfo = computed(() => ({
  username: userStore.realName || '未登录'
}))

const BASE_FILE_URL = baseURL

const form = ref(createEmptyForm())
const queryParams = reactive({
  matRecheckNo: '', // 来料检验批次号
  mafactory: '',      // 原材料制造商名称
  matMaterial: '',    // 牌号
  orderno: '',        // 入库单号
  woNo: '',           // 生产工单号
  pageNumber: 1,
  pageSize: 10
})
const list = ref([])
const total = ref(0)
const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新增并沟线夹设备线夹铝材')
const dialogType = ref('add')
const formRef = ref(null)
const saving = ref(false)
const searchSupplierDialogVisible = ref(false)
const woSelectorVisible = ref(false)             // 表单弹窗的工单选择
const showSupplierDialog = ref(false)            // 表单弹窗的供应商选择
const searchWoDialogVisible = ref(false)         // 搜索栏的工单选择
const certificateUpload = ref(null)              // 质量证明书上传组件引用

// 质量证明书文件上传
const certificateFileList = ref([]) // el-upload文件列表 (确保 url 是完整路径)

// 预览相关状态
const certificatePreviewVisible = ref(false)
const certificatePreviewUrl = ref('')
const previewFileType = ref('') // 'image', 'pdf', 'other'
const previewFileName = ref('')

function parseCertificateForDisplay(certStr) {
  if (!certStr) return [];
  try {
    const parsed = JSON.parse(certStr);
    if (Array.isArray(parsed)) {
        // 确保显示时 URL 是完整的
        return parsed.map(item => ({
            ...item,
            url: item.url.startsWith('http') ? item.url : BASE_FILE_URL + item.url
        }));
    }
    return [];
  } catch (e) {
    console.warn('Failed to parse certificate JSON for display:', certStr);
    return [];
  }
}

// 格式化化学值显示
function formatChemicalValue(val) {
  if (val === null || val === undefined || val === '') return '-'
  const num = Number(val)
  return isNaN(num) ? val : num.toFixed(3) + '%'
}

// 通用数字输入框失焦处理
const handleNumberInputBlur = (field, decimals) => {
  const value = form.value[field];
  if (value !== undefined && value !== null && value !== '') {
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      form.value[field] = numValue.toFixed(decimals);
    } else {
      form.value[field] = ''; // Clear if not a valid number
      ElMessage.warning('请输入有效的数字');
    }
  }
};

// 获取文件类型
const getFileType = (url, fileName = '') => {
  const fileUrl = url || fileName;
  if (/\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileUrl)) {
    return 'image';
  } else if (/\.pdf$/i.test(fileUrl)) {
    return 'pdf';
  } else {
    return 'other';
  }
};

// 处理质量证明书点击事件
const handleCertificateClick = (file) => {
  const fileType = getFileType(file.url, file.name);
  
  if (fileType === 'image' || fileType === 'pdf') {
    // 可预览的文件类型，打开预览弹窗
    previewCertificate(file.url, file.name, fileType);
  } else {
    // 不可预览的文件类型，直接下载
    downloadFile(file.url, file.name);
  }
};

// 预览文件
const previewCertificate = (url, fileName = '', fileType = '') => {
  const fullUrl = url.startsWith('http') ? url : BASE_FILE_URL + url;
  certificatePreviewUrl.value = fullUrl;
  previewFileName.value = fileName;
  previewFileType.value = fileType || getFileType(fullUrl, fileName);
  certificatePreviewVisible.value = true;
};

// 下载文件
const downloadFile = (url, fileName = '') => {
  try {
    const fullUrl = url.startsWith('http') ? url : BASE_FILE_URL + url;
    
    // 创建一个临时的 a 标签进行下载
    const link = document.createElement('a');
    link.href = fullUrl;
    link.download = fileName || '质量证明书';
    link.target = '_blank';
    
    // 触发下载
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    ElMessage.success('文件下载已开始');
  } catch (error) {
    console.error('下载文件失败:', error);
    ElMessage.error('文件下载失败，请稍后重试');
    
    // 如果下载失败，尝试在新窗口打开
    window.open(url.startsWith('http') ? url : BASE_FILE_URL + url, '_blank');
  }
};

// 处理预览关闭
const handlePreviewClose = () => {
  certificatePreviewVisible.value = false;
  certificatePreviewUrl.value = '';
  previewFileName.value = '';
  previewFileType.value = '';
};

// 处理图片加载错误
const handleImageError = () => {
  ElMessage.error('图片加载失败');
  // 可以选择显示默认错误图片或其他处理
};

// 处理PDF加载错误
const handlePdfError = () => {
  ElMessage.error('PDF预览失败，请尝试下载文件');
};

// 处理文件上传
const handleCertificateChange = async (file) => {
  if (certificateFileList.value.length >= 3) {
    ElMessage.warning('最多只能上传3个质量证明书');
    certificateUpload.value.clearFiles();
    return;
  }
  const formData = new FormData();
  formData.append('file', file.raw);
  try {
    const res = await uploadFile(formData);
    if (res.success && res.data && res.data.url) {
      const newUrl = BASE_FILE_URL + res.data.url;
      const fileList = JSON.parse(form.value.certificate || '[]');
      fileList.push({ name: file.name, url: newUrl }); // 存储完整 URL
      // 更新表单数据
      form.value.certificate = JSON.stringify(fileList);
      // 同步更新 el-upload 的 fileList (使用完整 URL)
      certificateFileList.value.push({ name: file.name, url: newUrl });
      ElMessage.success(`${file.name} 上传成功`);
    } else {
      throw new Error(res.msg || '文件上传失败');
    }
  } catch (e) {
    console.error('文件上传失败', e);
    ElMessage.error(`${file.name} 上传失败`);
    certificateUpload.value.clearFiles();
  }
};

// 删除文件
const deleteCertificateFile = (index) => {
  const fileList = JSON.parse(form.value.certificate || '[]');
  fileList.splice(index, 1);
  form.value.certificate = JSON.stringify(fileList);
  certificateFileList.value.splice(index, 1); // 同步删除
};

function createEmptyForm() {
  return {
    id: undefined,
    mafactory: '',
    matMaterial: '',
    orderno: '',
    matRecheckNo: '',
    chemAl: '',
    chemSi: '',
    chemFe: '',
    chemCu: '',
    chemMg: '',
    chemMn: '',
    chemZn: '',
    chemTi: '',
    chemCr: '',
    tensileStrength: '',
    elongation: '',
    leavefactoryDate: '',
    detectionTime: '',
    certificate: '[]', // 默认空数组
    contractNo: '',
    woNo: '',
    ipoNo: '',
    writer: userInfo.value.username, // 重置时设置为当前用户
    writeTime: '',
    flag: '',
    status: '',
    memo: '',
    type: ''
  };
}

const rules = {
  mafactory: [{ required: true, message: '请选择原材料制造商', trigger: 'change' }],
  matMaterial: [{ required: true, message: '请填写牌号', trigger: 'blur' }],
  orderno: [{ required: true, message: '请填写入库单号', trigger: 'blur' }],
  matRecheckNo: [{ required: true, message: '请填写来料检验批次号', trigger: 'blur' }],
  chemAl: [{ required: true, message: '请填写Al含量', trigger: 'blur' }],
  chemSi: [{ required: true, message: '请填写Si含量', trigger: 'blur' }],
  chemFe: [{ required: true, message: '请填写Fe含量', trigger: 'blur' }],
  chemCu: [{ required: true, message: '请填写Cu含量', trigger: 'blur' }],
  chemMg: [{ required: true, message: '请填写Mg含量', trigger: 'blur' }],
  chemMn: [{ required: true, message: '请填写Mn含量', trigger: 'blur' }],
  chemZn: [{ required: true, message: '请填写Zn含量', trigger: 'blur' }],
  chemTi: [{ required: true, message: '请填写Ti含量', trigger: 'blur' }],
  tensileStrength: [{ required: true, message: '请填写拉伸强度', trigger: 'blur' }],
  elongation: [{ required: true, message: '请填写延伸率', trigger: 'blur' }],
  leavefactoryDate: [{ required: true, message: '请选择原材料出厂检测日期', trigger: 'change' }],
  detectionTime: [{ required: true, message: '请选择原材料入厂检测日期', trigger: 'change' }],
  certificate: [{ required: true, message: '请上传质量证明书', trigger: 'change' }],
  woNo: [{ required: true, message: '请选择生产工单号', trigger: 'change' }],
  contractNo: [{ required: true, message: '合同编号不能为空', trigger: 'change' }],
  ipoNo: [{ required: true, message: '生产订单号不能为空', trigger: 'change' }],
  writer: [{ required: true, message: '录入人不能为空', trigger: 'blur' }]
};

const handleQueryChange = () => {
  // 小优化，当输入框内容清空时也触发列表更新
  if (!queryParams.matRecheckNo && !queryParams.matMaterial && !queryParams.orderno) {
    getList();
  }
};

const getList = async () => {
  loading.value = true;
  try {
    const res = await getClbgxjsbxjlcList(queryParams);
    list.value = res.data.page.list;
    total.value = res.data.page.totalRow;
  } catch (e) {
    ElMessage.error('获取数据失败');
  } finally {
    loading.value = false;
  }
};

const resetQuery = () => {
  queryParams.matRecheckNo = '';
  queryParams.mafactory = '';
  queryParams.woNo = '';
  queryParams.pageNumber = 1;
  getList();
};

const handleSizeChange = (size) => {
  queryParams.pageSize = size;
  getList();
};

const handleCurrentChange = (page) => {
  queryParams.pageNumber = page;
  getList();
};

const handleAdd = () => {
  dialogTitle.value = '新增并沟线夹设备线夹铝材';
  dialogType.value = 'add';
  form.value = createEmptyForm();
  form.value.writer = userInfo.value.username;
  form.value.writeTime = formatDateTime(new Date());
  // 重置文件列表
  certificateFileList.value = [];
  form.value.certificate = '[]';
  dialogVisible.value = true;
};

const handleEdit = async (row) => {
  dialogTitle.value = '编辑并沟线夹设备线夹铝材';
  dialogType.value = 'edit';
  try {
    const res = await getClbgxjsbxjlcById({ id: row.id });
    if (res && res.code === 200 && res.data && res.data.clBgxjsbxjLc) {
      form.value = {
        ...createEmptyForm(),
        ...res.data.clBgxjsbxjLc
      };
      Object.keys(form.value).forEach(key => {
        if (key.startsWith('chem') && form.value[key] !== '') {
          form.value[key] = Number(form.value[key]).toFixed(3);
        } else if (key === 'tensileStrength' && form.value[key] !== '') {
          form.value[key] = Number(form.value[key]).toFixed(1);
        } else if (key === 'elongation' && form.value[key] !== '') {
          form.value[key] = Number(form.value[key]).toFixed(0);
        }
      });
    }
    certificateFileList.value = parseCertificateForDisplay(form.value.certificate)
    dialogVisible.value = true;
  } catch (e) {
    console.error('获取详情失败', e);
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除该条铝材数据吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await deleteClbgxjsbxjlc({ id: row.id });
    ElMessage.success('删除成功');
    resetQuery();
  }).catch(() => {});
};

const openWoSelector = () => {
  woSelectorVisible.value = true;
};

// 搜索栏
const handleSearchSupplierSelect = (descr) => {
  queryParams.mafactory = descr;
  searchSupplierDialogVisible.value = false;
};

const handleSearchWoSelect = (row) => {
  queryParams.woNo = row.woNo;
  searchWoDialogVisible.value = false;
};

const clearSearchSupplier = () => {
  queryParams.mafactory = '';
  getList(); // Clear and refresh list
};

const clearSearchWoNo = () => {
  queryParams.woNo = '';
  getList(); // Clear and refresh list
};

// 表单弹窗
const handleSupplierSelect = (descr) => {
  form.value.mafactory = descr;
  showSupplierDialog.value = false;
};

const handleWoSelect = async (row) => {
  form.value.woNo = row.woNo;
  // 工单号自动填充合同编号和订单号，失败时给提示
  try {
    const { data } = await getGongdanByWoNo({ woNo: row.woNo });
    form.value.contractNo = data?.contractNo || '';
    form.value.ipoNo = data?.ipoNo || '';
    // 兼容如果接口没返回
    if (!form.value.contractNo || !form.value.ipoNo) {
      ElMessage.warning('未能从工单获取合同编号或订单号，请确认工单数据');
    }
  } catch (e) {
    form.value.contractNo = '';
    form.value.ipoNo = '';
    ElMessage.error('获取工单详情失败，请联系管理员或检查接口');
  }
  woSelectorVisible.value = false;
};

const handleSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    saving.value = true;
    try {
      form.value.certificate = JSON.stringify(certificateFileList.value);

      if (dialogType.value === 'add') {
        form.value.writer = userInfo.value.username;
        form.value.writeTime = formatDateTime(new Date());
        await createClbgxjsbxjlc(form.value);
        ElMessage.success('新增成功');
        resetQuery();
      } else {
        await updateClbgxjsbxjlc(form.value);
        ElMessage.success('修改成功');
        resetQuery();
      }
      dialogVisible.value = false;
    } catch (e) {
       console.error('保存失败:', e); // 添加详细错误日志
      ElMessage.error('保存失败: ' + (e.message || e));
    } finally {
      saving.value = false;
    }
  });
};

function formatDateTime(date) {
  if (!date) return '';
  const d = new Date(date);
  const pad = (n) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// 重置表单
const resetForm = () => {
  form.value = createEmptyForm();
  certificateFileList.value = [];
  // 重置预览相关状态
  handlePreviewClose();
  if (formRef.value) {
    formRef.value.resetFields(); // 重置表单验证状态
  }
};

onMounted(getList);
</script>

<style scoped>
.clbgxjsbxjlc-management {
  padding: 20px;
}

.action-bar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

.certificate-uploader {
  width: 100%;
}

.uploaded-files {
  margin-top: 10px;
}

.uploaded-file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.file-link {
  color: #409eff;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s;
}

.file-link:hover {
  color: #66b1ff;
  text-decoration: underline;
}

.preview-container {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.el-form-item__tip {
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
  margin-top: 4px;
}

.el-form-item__error {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
}

/* 预览弹窗样式调整 */
.el-dialog__body {
  padding: 10px 20px;
}

@media (max-width: 768px) {
  .el-dialog {
    width: 95% !important;
    margin: 0 auto;
  }
  
  .preview-container img {
    max-height: 50vh !important;
  }
  
  .preview-container iframe {
    height: 400px !important;
  }
}
</style>