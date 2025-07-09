<template>
    <div class="chakantongzhi">
      <el-table :data="tongzhiDetails" border style="width: 100%">
        <el-table-column prop="itemno" label="产品型号" />
        <el-table-column prop="spec" label="规格" />
        <el-table-column prop="itemnum" label="数量" />
        <el-table-column prop="unit" label="单位" />
        <el-table-column prop="noticeid" label="通知编号" />
        <el-table-column prop="noticename" label="通知名称" />
        <el-table-column prop="noticedeliver" label="通知校验人" />
        <el-table-column prop="noticeauther" label="通知作者" />
        <el-table-column prop="noticeinstead" label="通知替代型号" />
        <el-table-column prop="noticedrawno" label="通知图纸编号" />
        <el-table-column prop="noticecomment" label="通知备注" />
        <el-table-column prop="noticeshenhe" label="通知审核者" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="noticebuilddate" label="通知创建日期" :formatter="formatDate" />
        <!--el-table-column prop="id" label="ID" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" type="primary" @click="openEditDialog(scope.row)">编辑</el-button>
          </template>
        </el-table-column-->
        
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
  
      <!-- 编辑对话框 -->
      <el-dialog v-model="editDialogVisible" title="编辑通知详情">
       
          <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="120px">
            <el-form-item label="物料编号" prop="itemno">
            <el-input v-model="editForm.itemno" />
          </el-form-item>
            <el-form-item label="规格" prop="spec">
              <el-input v-model="editForm.spec" />
            </el-form-item>
            <el-form-item label="数量" prop="itemnum">
              <el-input-number v-model="editForm.itemnum" :min="0" />
            </el-form-item>
            <el-form-item label="单位" prop="unit">
              <el-input v-model="editForm.unit" />
            </el-form-item>
            <el-form-item label="通知编号" prop="noticeid">
              <el-input v-model="editForm.noticeid" />
            </el-form-item>
            <el-form-item label="通知名称" prop="noticename">
              <el-input v-model="editForm.noticename" />
            </el-form-item>
            <el-form-item label="通知校验人" prop="noticedeliver">
              <el-input v-model="editForm.noticedeliver" />
            </el-form-item>
            <el-form-item label="通知作者" prop="noticeauther">
              <el-input v-model="editForm.noticeauther" />
            </el-form-item>
            <el-form-item label="通知替代型号" prop="noticeinstead">
              <el-input v-model="editForm.noticeinstead" />
            </el-form-item>
            <el-form-item label="通知图纸编号" prop="noticedrawno">
              <el-input v-model="editForm.noticedrawno" />
            </el-form-item>
            <el-form-item label="通知备注" prop="noticecomment">
              <el-input type="textarea" v-model="editForm.noticecomment" :rows="4" />
            </el-form-item>
            <el-form-item label="通知审核者" prop="noticeshenhe">
              <el-input v-model="editForm.noticeshenhe" />
            </el-form-item>
            <el-form-item label="名称" prop="name">
              <el-input v-model="editForm.name" />
            </el-form-item>
            <el-form-item label="通知创建日期" prop="noticebuilddate">
              <el-date-picker
                v-model="editForm.noticebuilddate"
                type="date"
                placeholder="选择日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-form>
       
        <template #footer>
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitEditForm">保存</el-button>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted, defineProps, toRefs, nextTick } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { getTongzhiById, updateNoticeItem } from '@/api/tongzhi/querentongzhi.js';
  
  // 获取父组件传递的 noticeid
  const props = defineProps({
    noticeid: {
      type: String,
      required: true
    }
  });
  
  // 查询参数
  const queryParams = reactive({
    noticeid: props.noticeid,
    pageNumber: 1,
    pageSize: 10
  });
  
  // 通知详情数据
  const tongzhiDetails = ref([]);
  const total = ref(0);
  
  // 编辑对话框相关
  const editDialogVisible = ref(false);
  const editForm = ref({});
  const editFormRef = ref(null);
  
  // 表单验证规则
  const editRules = reactive({
    no: [
      { required: true, message: '请输入合同编号', trigger: 'blur' }
    ],
    noticeid: [
      { required: true, message: '请输入通知编号', trigger: 'blur' }
    ],
    noticename: [
      { required: true, message: '请输入通知名称', trigger: 'blur' }
    ],
    noticebuilddate: [
      { required: true, message: '请选择通知创建日期', trigger: 'change' }
    ]
  });
  
  // 格式化日期
  const formatDate = (row, column, cellValue) => {
    if (!cellValue) return '';
  
    const date = new Date(cellValue);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };
  
  // 获取通知详情
  const getTongzhiDetails = async () => {
    try {
      const res = await getTongzhiById(queryParams);
      if (res.success) {
        tongzhiDetails.value = res.data.page.list;
        total.value = res.data.page.totalRow;
      } else {
        ElMessage.error(res.msg || '获取通知详情失败');
      }
    } catch (error) {
      console.error('获取通知详情失败:', error);
      ElMessage.error('获取通知详情失败');
    }
  };
  
  // 处理分页大小变化
  const handleSizeChange = (size) => {
    queryParams.pageSize = size;
    queryParams.pageNumber = 1;
    getTongzhiDetails();
  };
  
  // 处理当前页变化
  const handleCurrentChange = (page) => {
    queryParams.pageNumber = page;
    getTongzhiDetails();
  };
  
  // 打开编辑对话框
  const openEditDialog = (row) => {
    // 深拷贝数据，避免直接修改原数据
    editForm.value = JSON.parse(JSON.stringify(row));
    
    // 格式化日期，使其符合日期选择器的格式
    if (editForm.value.noticebuilddate) {
      const date = new Date(editForm.value.noticebuilddate);
      editForm.value.noticebuilddate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
    
    editDialogVisible.value = true;
    
    // 确保表单引用已初始化
    nextTick(() => {
      if (editFormRef.value) {
        // 重置表单验证状态
        editFormRef.value.clearValidate();
      }
    });
  };
  
  // 提交编辑表单
  const submitEditForm = async () => {
    if (!editFormRef.value) return;
    
    try {
      // 进行表单验证
      await editFormRef.value.validate();
      
      // 准备提交数据
      const submitData = {
        ...editForm.value,
        // 将日期格式转回后端需要的格式
        noticebuilddate: editForm.value.noticebuilddate 
          ? new Date(editForm.value.noticebuilddate).getTime() 
          : null
      };
      
      const res = await updateNoticeItem(submitData);
      
      if (res.success) {
        ElMessage.success('更新成功');
        editDialogVisible.value = false;
        getTongzhiDetails(); // 刷新数据
      } else {
        ElMessage.error(res.msg || '更新失败');
      }
    } catch (error) {
      // 处理验证失败的情况
      console.log('表单验证失败:', error);
      ElMessage.warning('请检查并填写必填字段');
    }
  };
  
  // 页面初始化
  onMounted(() => {
    getTongzhiDetails();
  });
  </script>
  
  <style scoped>
  .chakantongzhi {
    padding: 20px;
  }
  
  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
  </style>    