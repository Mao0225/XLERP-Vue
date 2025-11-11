<template>
  <div class="insp-list">
    <div class="action-bar">
      <el-input v-model="query.orderNo" placeholder="检验单号" style="width:180px;margin-right:10px" clearable @clear="getList" @keyup.enter="getList" />
      <el-input v-model="query.batchNo" placeholder="炉批号" style="width:180px;margin-right:10px" clearable @clear="getList" @keyup.enter="getList" />
      <el-input v-model="query.batchNumber" placeholder="批次号" style="width:180px;margin-right:10px" clearable @clear="getList" @keyup.enter="getList" />
      <el-button type="primary" @click="getList">搜索</el-button>
      <el-button type="primary" style="margin-left:auto" @click="handleAdd">新建报检单</el-button>
    </div>

    <el-table :data="list" border v-loading="loading">
      <el-table-column type="index" label="序号" width="70" />
            <el-table-column label="状态" width="150" fixed ="left"> 

        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)">{{ getStatusLabel(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="orderNo" label="检验单号" width="160" />
      <el-table-column prop="itemName" label="物料名称" width="200" />
      <el-table-column prop="itemCode" label="物料编码" width="250" />
      <el-table-column prop="itemSpec" label="物料型号" width="250" />
      <el-table-column prop="batchNo" label="炉批号" width="130" />
      <el-table-column prop="batchNumber" label="批次号" width="130" />
      <el-table-column prop="reporter" label="报检人" width="100" />
      
      <el-table-column prop="actualMaterial" label="到货材质" width="120" />
      <el-table-column prop="actualSpec" label="到货型号" width="120" />
      <el-table-column label="质量证明书" width="180">
                <template #default="{ row }">
                    <div v-if="row.certificate">
                        <div v-for="(f, i) in parseCertificate(row.certificate)" :key="i" style="margin-bottom:4px">
                            <el-tooltip :content="f.name">
                                <span class="file-link" @click="openFileInNewWindow(f.url)">{{ f.name }}</span>
                            </el-tooltip>
                        </div>
                    </div>
                    <span v-else>-</span>
                </template>
            </el-table-column>


      <!-- 操作 -->
      <el-table-column label="操作" width="320" fixed="right">
        <template #default="{ row }">
          <el-button v-if="row.status == 0" size="small" type="success" @click="updateStatus(row, 10)">提交报检</el-button>
          <el-button v-if="row.status == 11" size="small" type="success" @click="updateStatus(row, 20)">提交检验</el-button>
          <el-button v-if="row.status == 22" size="small" type="success" @click="updateStatus(row, 30)">提交入库</el-button>
          <el-button  type="primary" size="small" @click="openInfoForm(row)">查看信息</el-button>
          <el-button v-if="row.status == 0" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button v-if="row.status == 0" size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="query.pageNumber"
        v-model:page-size="query.pageSize"
        :page-sizes="[10,20,50]"
        layout="total, sizes, prev, pager, next"
        :total="total"
        @size-change="getList"
        @current-change="getList"
      />
    </div>

    <AddOrderDialog v-model="addVisible" :new-code = "newCode" @success="getList" />
    <EditOrderDialog v-model="editVisible" :id="selectId" @success="getList" />
      <InspDataReadonly
  v-model="showReadDialog"
  :order-data="currentOrder"
  />
  </div>
</template>

<script setup>
import { reactive, onMounted, ref} from 'vue'
import { ElMessage } from 'element-plus'
import { useInspOrder } from './useInspOrder'
import AddOrderDialog from './addInspOrder.vue'
import EditOrderDialog from './editInspOrder.vue'
	import { getNewNoNyName } from '@/api/system/basno'
  import InspDataReadonly from './inspDataFormReadonly.vue'
import { baseURL } from '@/utils/request'	

	// 生成检验单编码
	const generateSInspNo = async () => {
	  try {
	    const res = await getNewNoNyName('insp');
	    
	    if (res?.code === 200) {
	      console.log("获取编码成功", res.data.fullNoNyName);
	      return res.data.fullNoNyName;
	    }
	    
	    ElMessage.error(res?.msg || '获取编码失败');
	    return '';
	    
	  } catch (error) {
	    console.error('生成检验单编码出错:', error);
	    ElMessage.error('请求编码服务时发生错误');
	    return '';
	  }
	};

const { query, list, total, loading, getList, updateStatus, handleDelete } = useInspOrder()
	const showReadDialog = ref(false)

const currentOrder = ref(null)
const openInfoForm = (row) => {
    // 此处实现获取检验结果的逻辑，示例：
  showReadDialog.value = true
  currentOrder.value = row
}
const addVisible = ref(false)
const editVisible = ref(false)

const selectId = ref(null)
const newCode = ref('')

const handleAdd = async() => {
  newCode.value = await generateSInspNo();
  addVisible.value = true
}
const handleEdit = (row) => { 
  editVisible.value = true
  selectId.value = row.id
}

const parseCertificate = s => s ? (Array.isArray(JSON.parse(s)) ? JSON.parse(s) : []) : []
const openFileInNewWindow = url => url && window.open(url.startsWith('http') ? url : baseURL + url, '_blank')


const statusOptions = [
  { label: '草稿', value: 0 }, { label: '报检确认，待审核', value: 10 }, { label: '报检通过', value: 11 },
  { label: '报检拒绝', value: 12 }, { label: '检验中', value: 20 }, { label: '检验完成，待审核', value: 21 },
  { label: '检验合格，待入库', value: 22 }, { label: '检验不合格', value: 23 }, { label: '入库中', value: 30 },
  { label: '已入库', value: 31 }, { label: '入库拒绝', value: 32 }
]
const statusMap = Object.fromEntries(statusOptions.map(s => [s.value, s.label]))
const getStatusLabel = s => statusMap[s] || '-'
const getStatusTagType = s => ({
  0: 'info', 10: 'warning', 11: 'success', 12: 'danger',
  20: 'primary', 21: 'warning', 22: 'success', 23: 'danger',
  30: 'primary', 31: 'success', 32: 'danger'
}[s] || 'info')

onMounted(getList)
</script>

<style scoped>
.insp-list { padding: 20px; }
.action-bar { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 20px; }
.pagination { margin-top: 20px; text-align: right; }
.file-link {
    color: #409eff;
    cursor: pointer;
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    max-width: 150px;
}

.file-link:hover {
    text-decoration: underline;
}
</style>