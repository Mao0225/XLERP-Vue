<template>
  <div class="acsr-management">
        <div class="action-bar">
      <el-input v-model="queryParams.RawmaterialManufacturer" placeholder="请输入原材料制造商查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getACSRList" @keyup.enter="getACSRList" />
      <el-input v-model="queryParams.Size" placeholder="请输入尺寸" style="width: 200px; margin-right: 10px;"
        clearable @clear="getACSRList" @keyup.enter="getACSRList" />
    <el-input v-model="queryParams.IncomingNo" placeholder="请输入来料检验批次号" style="width: 200px; margin-right: 10px;"
        clearable @clear="getACSRList" @keyup.enter="getACSRList" />
    
       <!-- <el-select v-model="queryParams.contractno"  placeholder="选择合同号" style="width: 200px; margin-right: 10px;" >
          <el-option  v-for="contractno in contractnoOptions" :key="contractno" :label="contractno" :value="contractno" />
      </el-select>  -->


      <el-button type="primary" @click="getACSRList">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon>
          <Refresh />
        </el-icon> 刷新
      </el-button>

      <el-button type="primary" style="margin-left: auto;" @click="handleAdd">新增</el-button>
    </div>
    
    <el-table :data="acsrList" border v-loading="loading" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />

<el-table-column prop="gridno" label="电网合同编号" />

      <el-table-column prop="RawmaterialManufacturer" label="原材料制造商" />
            <el-table-column prop="Size" label="尺寸" />
            
      <el-table-column prop="IncomingNo" label="来料检验批次号" />
     
      <el-table-column prop="SinglefilamentStrength" label="力学性能-单丝强度" />

      <el-table-column prop="Factorydata" label="原材料出厂检测日期" width="120" />      
      <el-table-column prop="Incomingdata" label="原材料入厂检测日期" width="120"/>
   <!--    <el-table-column prop="QualityCertificate" label="质量证明书" /> -->
       <el-table-column prop="QualityCertificate" label="质量证明书">
        <template #default="{ row }">
          <a v-if="row.QualityCertificate" :href="`/api/download/${row.QualityCertificate}`" target="_blank">{{ row.QualityCertificate }}</a>
          <span v-else>未上传</span>
        </template>
      </el-table-column>

      

      <el-table-column label="操作" width="200">
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

    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="800px"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">

           <el-form-item label="电网合同编号" prop="gridno">
              <el-input v-model="form.gridno" placeholder="选择电网合同编号" readonly @click="selectGridNo">
                <template #append>
                  <el-button @click="selectGridNo" size="small">选择</el-button>
                </template>
              </el-input>
            </el-form-item>



            <el-form-item label="原材料制造商" prop="RawmaterialManufacturer">
              <el-input v-model="form.RawmaterialManufacturer" placeholder="请输入原材料制造商" />
            </el-form-item>
            <el-form-item label="尺寸" prop="Size">
                <el-input v-model="form.Size" placeholder="尺寸" />
            </el-form-item>
            
            <el-form-item label="来料检验批次号" prop="IncomingNo">
              <el-input v-model="form.IncomingNo" placeholder="请输入来料检验批次号" />
            </el-form-item>
           
           <el-form-item label="力学性能-单丝强度" prop="SinglefilamentStrength">
              <el-input v-model="form.SinglefilamentStrength" placeholder="力学性能-单丝强度" />
            </el-form-item>
            
           
            <el-form-item label="原材料出厂检测日期" prop="Factorydata">
              
              <el-date-picker
                v-model="form.Factorydata"
                type="date"
                placeholder="请选择原材料出厂检测日期"
                value-format="YYYY-MM-DD"
              style="width: 100%" />  

            </el-form-item>
            <el-form-item label="原材料入厂检测日期" prop="Incomingdata">
              
              <el-date-picker
                v-model="form.Incomingdata"
                type="date"
                placeholder="请选择原材料入厂检测日期"
                value-format="YYYY-MM-DD"
              style="width: 100%"/>

            </el-form-item>
            <!-- <el-form-item label="质量证明书" prop="QualityCertificate">
              <el-input v-model="form.QualityCertificate" placeholder="请输入质量证明书" />
            </el-form-item> -->
            <el-form-item label="质量证明书" prop="QualityCertificate">
              <el-upload
                class="upload-demo"
                :action="uploadUrl"
                :on-success="handleUploadSuccess"
                :on-error="handleUploadError"
                :before-upload="beforeUpload"
                :show-file-list="false"
              >
                <!-- <el-button type="primary">点击上传</el-button> -->
                 <el-button type="primary" @click="handleUpload">上传文件</el-button>

 <!-- 添加隐藏的文件输入框 -->
    <input ref="fileInputRef" type="file" style="display: none;" @change="handleFileChange" />

              </el-upload>
              <!-- 显示已上传的文件名 -->
              <div v-if="form.QualityCertificate">{{ form.QualityCertificate }}
               <!-- <el-button type="danger" size="small" @click="handleDeleteFile">删除</el-button> -->
              </div>
            </el-form-item>

          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 合同号选择弹窗 -->
    <GridNoSelector v-model="gridnoSelectorVisible" @select="handleGridNoSelectorSelect" 
     :gridnoList="gridnoList" 
      :totalNo="totalgridno" 
      :loadingGridNo="loadingGridNo" 
      @search="searchGridNo" 
      />
 </div> 
</template> 










<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getACSR, getACSRById, createACSR, updateACSR, deleteACSR,uploadFileToCustomPath ,getGridNoList} from '@/api/detection/acsr'


import GridNoSelector from '@/views/detection/GridNoSelector.vue'






// 查询参数
const queryParams = reactive({
  gridno: '',
   /* constractnoName: '', // 新增字段用于显示合同号名称 */
  RawmaterialManufacturer: '',
  SinglefilamentStrength: '',
  Size:'',
  IncomingNo: '',
  pageNumber: 1,
  pageSize: 10
})

// 物料列表数据
const acsrList = ref([])
const total = ref(0)
const loading = ref(false)



// 合同号选择弹窗显示状态
const gridnoSelectorVisible = ref(false)
// 合同号列表
const gridnoList = ref([])
// 合同号总数
const totalGridNo = ref(0)
// 合同号列表加载状态
const loadingGridNo = ref(false)


// 弹窗表单相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const dialogTitle = computed(() => dialogType.value === 'add' ? '新增数据' : '编辑数据')
const formRef = ref(null)
const form = reactive({
  id: undefined,
  gridno: '',
   /* constractnoName: '', */
   RawmaterialManufacturer: '',
  SinglefilamentStrength: '',
  Size:'',
  IncomingNo: '',
  Factorydata: '',
  Incomingdata: '',
  QualityCertificate: '',
  status: 0,
  isdelete: 0
})

// 表单验证规则
const rules = {
  RawmaterialManufacturer: [
    { required: true, message: '请输入原材料制造商', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  Size: [
    { required: true, message: '请输入尺寸', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  IncomingNo: [
    { required: true, message: '请输入来料检测批测号', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  SinglefilamentStrength: [
    { required: true, message: '请输入单丝强度', trigger: 'blur' },
    { max: 100, message: '保留小数点后三位', trigger: 'blur' }
  ],
  
  Factorydata: [
    { required: true, message: '请输入出厂日期', trigger: 'change' }
    /* { max: 50, message: '长度不能超过50个字符', trigger: 'blur' } */
  ],
  Incomingdata: [
    { required: true, message: '请输入入厂日期', trigger: 'change' }
    /* { max: 50, message: '长度不能超过50个字符', trigger: 'blur' } */
  ],
  QualityCertificate: [
    { max:100, message: '请输入', trigger: 'change' }
    /* { max: 50, message: '长度不能超过50个字符', trigger: 'blur' } */
  ],
  gridno: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ]
}



// 选择合同号
const selectGridNo = () => {
  gridnoSelectorVisible.value = true
  searchGridNo() // 确保函数被调用
};

// 处理合同号选择事件
const handleGridNoSelectorSelect = (gridno) => {
  queryParams.gridno = gridno;
  form.gridno = gridno;
  gridnoSelectorVisible.value = false;
}



// 获取合同号列表
const searchGridNo = async (gridno = '') => {
  loadingGridNo.value = true
  try {
    const res = await getGridNoList({
      pageNumber: 1,
      pageSize: 10,
      gridno
    })
    gridnoList.value = res.data.page.list
    totalGridNo.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取合同号列表失败', error)
    ElMessage.error('获取合同号列表失败')
  } finally {
    loadingGridNo.value = false
  }
}



/* // 获取数据列表
const getACSRList = async () => {
  loading.value = true
  try {
    const res = await getACSR(queryParams)
    acsrList.value = res.data.page.list
    total.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取数据列表失败', error)
    ElMessage.error('获取数据列表失败')
  } finally {
    loading.value = false
  }
} */
// 获取数据列表
const getACSRList = async () => {
  loading.value = true;
  try {
    const res = await getACSR(queryParams);
    console.log('返回的数据:', res.data.page.list); // 打印返回的数据
    acsrList.value = res.data.page.list;
    total.value = res.data.page.totalRow;
  } catch (error) {
    console.error('获取数据列表失败', error);
    ElMessage.error('获取数据列表失败');
  } finally {
    loading.value = false;
  }
}


// 上传文件相关
const fileInputRef = ref(null)

// 上传文件方法
const handleUpload = () => {
  fileInputRef.value.click()
}

const handleFileChange = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)
  formData.append('path', 'custom')

  try {
    const res = await uploadFileToCustomPath(formData)
    ElMessage.success('文件上传成功')
    console.log('文件上传成功，路径：', res.data.url)

// 将上传文件的信息更新到表单中
    form.QualityCertificate = res.data.url // 假设返回的文件名在 res.data.url 中

  } catch (error) {
    console.error('文件上传失败', error)
    ElMessage.error('文件上传失败')
  }
}



// 处理分页大小变化
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getACSRList()
}

// 处理当前页变化
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getACSRList()
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  Object.assign(form, {
    id: undefined,
    gridno: '',
    /* constractnoName: '', */
  RawmaterialManufacturer: '',
  SinglefilamentStrength: '',
  Size:'',
  IncomingNo: '',
  
  Factorydata: '',
  Incomingdata: '',
  QualityCertificate: '',
  status: 0,
  isdelete: 0
  })
}

//刷新
const handleRefresh = () => {
  queryParams.gridno = ''
  queryParams.RawmaterialManufacturer = ''
  queryParams.Size = ''
  queryParams.SinglefilamentStrength = ''
  queryParams.IncomingNo = ''
  queryParams.pageNumber = 1
  getACSRList()
}



// 新增数据
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
}

// 编辑数据
const handleEdit = async (row) => {
  dialogType.value = 'edit'
  const res = await getACSRById({ id: row.id })
  Object.assign(form, res.data.acsr)
  dialogVisible.value = true
}

// 删除数据
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除数据"${row.no}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteACSR({ id: row.id })
      ElMessage.success('删除成功')
      getACSRList()
    } catch (error) {
      console.error('删除数据失败', error)
      ElMessage.error('删除数据失败')
    }
  }).catch(() => {})
}

// 提交表单
const submitForm = () => {
  if (!formRef.value) return
  
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (dialogType.value === 'add') {
          await createACSR(form)
          ElMessage.success('新增成功')
        } else {
          await updateACSR(form)
          ElMessage.success('修改成功')
        }
        dialogVisible.value = false
        getACSRList()
      } catch (error) {
        console.error('保存数据失败', error)
        ElMessage.error('保存数据失败')
      }
    }
  })
}






// 页面初始化
onMounted(() => {
  getACSRList()
})
</script>

<style scoped>
.acsr-management {
  padding: 20px;
}
.action-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>