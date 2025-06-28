<template>
    <div class="chakantongzhi-management">
      <el-table :data="tongzhiDetailList" border style="width: 100%">
        <el-table-column prop="noticename" label="通知名称" />
        <el-table-column prop="noticedeliver" label="通知校验人" />
        <el-table-column prop="no" label="编号" />
        <el-table-column prop="noticeauther" label="通知作者" />
        <el-table-column prop="noticeinstead" label="替代编号" />
        <el-table-column prop="noticedrawno" label="图纸编号" />
        <el-table-column prop="spec" label="规格" />
        <el-table-column prop="noticeid" label="通知ID" />
        <el-table-column prop="itemnum" label="数量" />
        <el-table-column prop="unit" label="单位" />
        <el-table-column prop="noticeshenhe" label="审核人" />
        <el-table-column prop="name" label="名称" />
        <el-table-column 
          prop="noticebuilddate" 
          label="通知创建日期"
          :formatter="formatDate"
        />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEditNotice(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <el-dialog :visible.sync="dialogVisible" title="修改通知信息">
        <template #content>
          <el-form :model="editForm" label-width="120px">
            <el-form-item label="通知名称">
              <el-input v-model="editForm.noticename" />
            </el-form-item>
            <el-form-item label="通知校验人">
              <el-input v-model="editForm.noticedeliver" />
            </el-form-item>
            <!-- 其他字段以此类推 -->
          </el-form>
        </template>
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveEdit">保存</el-button>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { ElMessage } from 'element-plus';
  import { getTongzhiById, updateNoticeItem } from '@/api/tongzhi/querentongzhi.js';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const tongzhiDetailList = ref([]);
  const dialogVisible = ref(false);
  const editForm = ref({});
  
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
  const getTongzhiDetail = async () => {
    const noticeid = route.query.noticeid;
    try {
      const res = await getTongzhiById({ noticeid });
      if (res.success) {
        tongzhiDetailList.value = res.data.page.list;
      } else {
        ElMessage.error(res.msg || '查询通知信息失败');
      }
    } catch (error) {
      console.error('查询通知信息失败:', error);
      ElMessage.error('查询通知信息失败');
    }
  };
  
  // 保存编辑信息
  const handleSaveEdit = async () => {
    try {
      const res = await updateNoticeItem(editForm.value);
      if (res.success) {
        ElMessage.success(res.msg);
        dialogVisible.value = false;
        getTongzhiDetail(); // 刷新数据
      } else {
        ElMessage.error(res.msg);
      }
    } catch (error) {
      console.error('更新物料失败:', error);
      ElMessage.error('更新物料失败');
    }
  };
  
  // 编辑通知
  const handleEditNotice = (row) => {
    editForm.value = { ...row };
    dialogVisible.value = true;
  };
  
  // 页面初始化
  onMounted(() => {
    getTongzhiDetail();
  });
  </script>
  
  <style scoped>
  .chakantongzhi-management {
    padding: 20px;
  }
  </style>