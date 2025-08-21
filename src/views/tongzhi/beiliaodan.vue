<template>
  <div class="beiliaodan-container">
    <el-form :model="queryParams" size="small" label-width="80px" class="search-form">
      <el-row :gutter="12">
        <el-col :span="6">
          <el-form-item label="通知编号">
            <el-input v-model="queryParams.noticeid" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="图纸编号">
            <el-input v-model="queryParams.noticedrawno" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="合同编号">
            <el-input v-model="queryParams.contractno" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="工程名称">
            <el-input v-model="queryParams.contractname" readonly />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="beiliaoList" border size="small" style="width: 100%">
      <!--el-table-column prop="contractno" label="合同编号" />
      <el-table-column prop="contractname" label="工程名称" /-->
      <el-table-column prop="itemno" label="订货产品编码" />
      <el-table-column prop="spec" label="订货产品型号" />
      <el-table-column prop="name" label="订货产品名称" />
      <el-table-column prop="unit" label="订货产品单位" />
      <el-table-column prop="dinghuotaoshu" label="订货套数" />
      <el-table-column prop="sxclitemno" label="所需子材料编码" />
      <el-table-column prop="sxclname" label="所需子材料名称" />
      <el-table-column prop="unit" label="单位" />
      <el-table-column prop="sxclshuliang" label="所需材料数量" />
      <el-table-column prop="sxcltihuoshuliang" label="子材料数量" />
      <el-table-column prop="sxclshijishuliang" label="实际备货数量" />
      <el-table-column prop="sxclcaizhi" label="材质" />
      <el-table-column prop="zhidingbumen" label="制定部门" />
      <el-table-column prop="zhidingriqi" label="制定日期" />
      <el-table-column prop="tiliaoshijian" label="提料时间" />
      <el-table-column prop="jiaohuoshijian" label="交货时间" />
      <el-table-column prop="memo" label="备注" />
      <el-table-column prop="bianzhiren" label="编制人" />
      <el-table-column prop="jiaoyanren" label="校验人" />
      <el-table-column prop="shenheren" label="审核人" />
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="scope">
          <el-button size="small" type="primary" @click="openEditDialog(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryParams.pageNumber"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="queryParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 编辑备料计划对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑备料计划" width="70%">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="100px" size="small">
        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item label="合同编号">
              <el-input v-model="editForm.contractno" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工程名称">
              <el-input v-model="editForm.contractname" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="通知编号">
              <el-input v-model="editForm.noticeid" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订货物料编码">
              <el-input v-model="editForm.itemno" readonly />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item label="所需子材料编码">
              <el-input v-model="editForm.sxclitemno" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所需材料名称">
              <el-input v-model="editForm.sxclname" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单位">
              <el-input v-model="editForm.unit" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订货套数">
              <el-input v-model.number="editForm.dinghuotaoshu" readonly />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item label="所需材料数量" prop="sxclshuliang">
              <el-input v-model.number="editForm.sxclshuliang" @change="calculatePlanPickup" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="计划提货数量" prop="sxcltihuoshuliang">
              <el-input v-model.number="editForm.sxcltihuoshuliang" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="实际提货数量" prop="sxclshijishuliang">
              <el-input v-model="editForm.sxclshijishuliang" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="材质" prop="sxclcaizhi">
              <el-input v-model="editForm.sxclcaizhi" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="制定部门" prop="zhidingbumen">
              <el-input v-model="editForm.zhidingbumen" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item label="制定日期" prop="zhidingriqi">
              <el-date-picker
                v-model="editForm.zhidingriqi"
                type="date"
                placeholder="选择日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="提料时间" prop="tiliaoshijian">
              <el-date-picker
                v-model="editForm.tiliaoshijian"
                type="date"
                placeholder="选择日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="交货时间" prop="jiaohuoshijian">
              <el-date-picker
                v-model="editForm.jiaohuoshijian"
                type="date"
                placeholder="选择日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="编制人" prop="bianzhiren">
              <el-input v-model="editForm.bianzhiren" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="12">
          <!--el-col :span="6">
            <el-form-item label="校验人" prop="jiaoyanren">
              <el-input v-model="editForm.jiaoyanren" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="审核人" prop="shenheren">
              <el-input v-model="editForm.shenheren" />
            </el-form-item>
          </el-col-->
          <el-col :span="12">
            <el-form-item label="备注" prop="memo">
              <el-input type="textarea" :rows="3" v-model="editForm.memo" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveBeiliao">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { ElMessage, ElLoading } from 'element-plus';
import { getBeiliaojihuaPage, saveBeiliaojihua } from '@/api/tongzhi/beiliaodan.js';

const props = defineProps({
  noticeid: {
    type: String,
    required: true
  },
  noticedrawno: {
    type: String,
    required: true
  },
  contractno: {
    type: String,
    required: true
  },
  contractname: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['close']);

// 查询参数
const queryParams = reactive({
  noticeid: props.noticeid,
  noticedrawno: props.noticedrawno,
  contractno: props.contractno,
  contractname: props.contractname,
  pageNumber: 1,
  pageSize: 10
});

// 数据列表
const beiliaoList = ref([]);
const total = ref(0);

// 编辑对话框相关
const editDialogVisible = ref(false);
const editForm = reactive({});
const editFormRef = ref(null);
const currentEditIndex = ref(-1);

// 表单验证规则
const editRules = {
  sxclshuliang: [{ required: true, message: '请输入所需材料数量', trigger: 'blur' }],
  sxclshijishuliang: [{ required: true, message: '请输入实际备料数量', trigger: 'blur' }],
  sxclcaizhi: [{ required: true, message: '请输入材质', trigger: 'blur' }],
  zhidingbumen: [{ required: true, message: '请输入制定部门', trigger: 'blur' }],
  zhidingriqi: [{ required: true, message: '请选择制定日期', trigger: 'change' }],
  tiliaoshijian: [{ required: true, message: '请选择提料时间', trigger: 'change' }],
  jiaohuoshijian: [{ required: true, message: '请选择交货时间', trigger: 'change' }],
  bianzhiren: [{ required: true, message: '请输入编制人', trigger: 'blur' }],
  jiaoyanren: [{ required: true, message: '请输入校验人', trigger: 'blur' }],
  shenheren: [{ required: true, message: '请输入审核人', trigger: 'blur' }]
};

// 计算计划提货数量
const calculatePlanPickup = () => {
  if (editForm.dinghuotaoshu && editForm.sxclshuliang) {
    editForm.sxcltihuoshuliang = editForm.dinghuotaoshu * editForm.sxclshuliang;
  }
};

// 加载备料计划数据
const loadBeiliaoData = async () => {
  let loading = null;
  try {
    loading = ElLoading.service({
      lock: true,
      text: '加载数据中...',
      background: 'rgba(0, 0, 0, 0.7)'
    });

    const res = await getBeiliaojihuaPage(queryParams);
    if (res.success) {
      beiliaoList.value = res.data.page.list || [];
      total.value = res.data.page.totalRow || 0;
    } else {
      ElMessage.error(res.msg || '获取备料计划失败');
    }
  } catch (error) {
    ElMessage.error('获取备料计划失败: ' + error.message);
    console.error('获取备料计划失败', error);
  } finally {
    loading?.close();
  }
};

// 分页相关方法
const handleSizeChange = (newSize) => {
  queryParams.pageSize = newSize;
  loadBeiliaoData();
};

const handleCurrentChange = (newPage) => {
  queryParams.pageNumber = newPage;
  loadBeiliaoData();
};

// 打开编辑对话框
const openEditDialog = (row) => {
  // 复制数据到编辑表单
  Object.assign(editForm, row);
  
  // 设置默认值
  if (!editForm.bianzhiren || editForm.bianzhiren.trim() === '') {
    editForm.bianzhiren = localStorage.getItem('realName');
  }
  
  if (!editForm.zhidingbumen || editForm.zhidingbumen.trim() === '') {
    editForm.zhidingbumen = '研究所';
  }
  
  // 计算计划提货数量
  calculatePlanPickup();
  
  // 记录当前编辑的行索引
  currentEditIndex.value = beiliaoList.value.findIndex(item => item.id === row.id);
  
  // 显示对话框
  editDialogVisible.value = true;
};

// 保存备料计划
const saveBeiliao = async () => {
  editFormRef.value.validate(async (valid) => {
    if (valid) {
      let loading = null;
      try {
        loading = ElLoading.service({
          lock: true,
          text: '保存中...',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        // 准备保存数据
        const saveData = {
          ...editForm,
          noticeid: props.noticeid,
          noticedrawno: props.noticedrawno
        };

        const res = await saveBeiliaojihua(saveData);
        if (res.success) {
          ElMessage.success('保存成功');
          editDialogVisible.value = false;
          loadBeiliaoData(); // 刷新数据
        } else {
          ElMessage.error(res.msg || '保存失败');
        }
      } catch (error) {
        ElMessage.error('保存失败: ' + error.message);
        console.error('保存失败', error);
      } finally {
        loading?.close();
      }
    } else {
      ElMessage.error('请检查表单信息');
      return false;
    }
  });
};

// 监听props变化
watch(
  () => [props.noticeid, props.noticedrawno],
  (newVal) => {
    queryParams.noticeid = newVal[0];
    queryParams.noticedrawno = newVal[1];
    loadBeiliaoData();
  },
  { immediate: true }
);

onMounted(() => {
  loadBeiliaoData();
});
</script>

<style scoped>
.beiliaodan-container {
  padding: 12px;
}

.search-form {
  margin-bottom: 12px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
    