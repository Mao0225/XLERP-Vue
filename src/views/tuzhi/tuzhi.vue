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
          <el-icon>
            <Refresh />
          </el-icon> 刷新
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
        <el-table-column prop="memo" label="备注" />
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
            <el-input v-model="form.tuzhizuozhe" placeholder="请输入图纸作者" />
          </el-form-item>
          <el-form-item label="创作日期" prop="chuangzuoriqi">
            <el-input v-model="form.chuangzuoriqi" placeholder="请输入创作日期" />
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
              :limit="10"
              accept=".pdf,.jpg,.jpeg,.png"
              :file-list="tuzhiFileList"
            >
              <el-button type="primary">上传图纸</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="cancelForm">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted, computed } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { getTuzhis, getTuzhiById, createTuzhi, updateTuzhi, deleteTuzhi } from '@/api/tuzhi/tuzhi'
  import { uploadFile } from '@/api/file/file'
  
  const baseUrl = 'http://127.0.0.1:8099'
  
  // 查询参数
  const queryParams = reactive({
    pageNumber: 1,
    pageSize: 10,
    tuzhimingcheng: ''
  })
  
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
    tuzhiurl: ''
  })
  
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
      { required: true, message: '请输入创作日期', trigger: 'blur' },
      { max: 100, message: '长度不能超过10个字符', trigger: 'blur' }
    ],
    tuzhimiaoshu: [
      { required: true, message: '请输入图纸描述', trigger: 'blur' },
      { max: 10, message: '长度不能超过100个字符', trigger: 'blur' }
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
      tuzhizuozhe: '',
      chuangzuoriqi: '',
      tuzhimiaoshu: '',
      memo: '',
      flag: 0,
      type: 0,
      writer: '',
      tuzhiurl: ''
    })
  }
  
  // 处理图纸上传
  const handleTuzhiChange = async (file) => {
    const formData = new FormData()
    formData.append('file', file.raw)

    try {
      const res = await uploadFile(formData)
      if (res.success && res.data && res.data.url) {
        const newUrl = res.data.url;
        if (form.tuzhiurl) {
          form.tuzhiurl += `-${newUrl}`;
        } else {
          form.tuzhiurl = newUrl;
        }
        tuzhiFileList.value.push({ name: file.name, url: baseUrl + newUrl });
        ElMessage.success(`${file.name} 上传成功`);
      } else {
        throw new Error(res.msg || '图纸上传失败');
      }
    } catch (error) {
      console.error('图纸上传失败', error);
      ElMessage.error(`${file.name} 上传失败`);
      tuzhiUpload.value.clearFiles();
    }
  }
  
  // 新增图纸
  const handleAdd = () => {
    dialogType.value = 'add';
    dialogVisible.value = true;
    tuzhiFileList.value = [];
  }
  
  // 编辑图纸
  const handleEdit = async (row) => {
    dialogType.value = 'edit';
    try {
      const res = await getTuzhiById({ id: row.id });
      Object.assign(form, res.data.tuzhi);
      dialogVisible.value = true;
    } catch (error) {
      console.error('获取图纸信息失败', error);
      ElMessage.error('获取图纸信息失败');
    }
  }
  
  // 取消表单
  const cancelForm = () => {
    dialogVisible.value = false;
    resetForm();
  }
  
  // 删除图纸
  const handleDelete = (row) => {
    ElMessageBox.confirm(`确认删除图纸"${row.tuzhimingcheng}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      try {
        await deleteTuzhi({ id: row.id });
        ElMessage.success('删除成功');
        getTuzhiList();
      } catch (error) {
        console.error('删除图纸失败', error);
        ElMessage.error('删除图纸失败');
      }
    }).catch(() => {});
  }
  
  // 提交表单（关键修正点）
  const submitForm = () => {
    if (!formRef.value) return;
    formRef.value.validate(async (valid) => {
      if (valid) {
        try {
          // 1. 提取表单数据（普通对象）
          const submitForm = { ...form };
          
          // 2. 处理文件上传（如有）
          if (tuzhiFileList.value.length > 0) {
            // 这里假设上传文件接口已正确设置tuzhiurl，无需额外处理
            console.log('已上传图纸文件，URL:', form.tuzhiurl);
          }
          
          // 3. 提交数据（与部门管理一致的格式）
          if (dialogType.value === 'add') {
            await createTuzhi(submitForm);
            ElMessage.success('新增成功');
          } else {
            await updateTuzhi(submitForm);
            ElMessage.success('修改成功');
          }
          
          dialogVisible.value = false;
          resetForm();
          getTuzhiList();
        } catch (error) {
          console.error('保存图纸失败', error);
          ElMessage.error('保存图纸失败');
        }
      }
    });
  }
  
  const handleRefresh = () => {
    queryParams.tuzhimingcheng = '';
    queryParams.pageNumber = 1;
    getTuzhiList();
  }
  
  // 页面初始化
  onMounted(() => {
    getTuzhiList();
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
  </style>