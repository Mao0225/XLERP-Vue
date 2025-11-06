<!-- src/views/plinspection/inspOrder/List.vue -->
<template>
    <div class="insp-order-management">
        <!-- 搜索栏 -->
        <div class="action-bar">
            <el-input v-model="query.orderNo" placeholder="检验单号" style="width:180px;margin-right:10px" clearable
                @clear="getList" @keyup.enter="getList" />
            <el-input v-model="query.batchNo" placeholder="炉批号" style="width:180px;margin-right:10px" clearable
                @clear="getList" @keyup.enter="getList" />
            <el-input v-model="query.batchNumber" placeholder="批次号" style="width:180px;margin-right:10px" clearable
                @clear="getList" @keyup.enter="getList" />
            <el-select v-model="query.status" placeholder="状态" style="width:160px;margin-right:10px" clearable
                @change="getList">
                <el-option v-for="s in statusOptions" :key="s.value" :label="s.label" :value="s.value" />
            </el-select>
            <el-button type="primary" @click="getList">搜索</el-button>
            <el-button type="warning" @click="handleRefresh"><el-icon>
                    <Refresh />
                </el-icon> 刷新</el-button>
            <el-button type="primary" style="margin-left:auto" @click="handleAdd">新建报检单</el-button>
        </div>

        <!-- 表格 -->
        <el-table :data="list" border v-loading="loading">
            <el-table-column type="index" label="序号" width="70" fixed="left" />
            <el-table-column prop="orderNo" label="检验单号" width="160" fixed="left" />
            <el-table-column prop="batchNo" label="炉批号" width="130" />
            <el-table-column prop="batchNumber" label="批次号" width="130" />
            <el-table-column prop="inspQuantity" label="检验数量" width="110" />
            <el-table-column prop="actualQuantity" label="到货数量" width="130" />
            <el-table-column prop="actualWeight" label="到货重量" width="130" />
            <el-table-column prop="actualMaterial" label="到货材质" width="130" />
            <el-table-column prop="actualSpec" label="到货型号" width="130" />
            <el-table-column label="检验时间" width="120">
                <template #default="{ row }">{{ formatDate(row.inspectTime) }}</template>
            </el-table-column>
            <el-table-column label="检验完成时间" width="160">
                <template #default="{ row }">{{ formatDate(row.inspectFinishTime) }}</template>
            </el-table-column>
            <el-table-column prop="reporter" label="报检人" width="100" />
            <el-table-column prop="reportReviewer" label="报检审核人" width="110" />
            <el-table-column prop="inspector" label="检验人" width="100" />
            <el-table-column prop="inspectReviewer" label="检验审核人" width="110" />
            <el-table-column prop="storageReviewer" label="入库审核人" width="110" />
            <el-table-column label="入库时间" width="160">
                <template #default="{ row }">{{ formatDate(row.inStockTime) }}</template>
            </el-table-column>
            <el-table-column label="状态" width="120">
                <template #default="{ row }">
                    <el-tag :type="getStatusTagType(row.status)">{{ getStatusLabel(row.status) }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="整单备注" show-overflow-tooltip min-width="150" />
            <el-table-column prop="inspRemark" label="检验备注" show-overflow-tooltip min-width="150" />
            <el-table-column prop="stockRemark" label="入库备注" show-overflow-tooltip min-width="150" />
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

            <!-- 操作列 -->
            <el-table-column label="操作" width="300" fixed="right">
                <template #default="{ row }">
                    <!-- 0 草稿 → 提交审核 -->
                    <el-button v-if="row.status == 0" type="primary" size="small"
                        @click="updateStatus(row, 10)">提交审核</el-button>

                    <!-- 10 报检待审核 -->
                    <el-button v-if="row.status == 10" type="primary" size="small"
                        @click="updateStatus(row, 11)">审核通过</el-button>
                    <el-button v-if="row.status == 10" type="danger" size="small"
                        @click="updateStatus(row, 12, true)">审核拒绝</el-button>

                    <!-- 11 → 20 -->
                    <el-button v-if="row.status == 11" type="success" size="small"
                        @click="updateStatus(row, 20)">开始检验</el-button>

                    <!-- 20 → 21 -->
                    <el-button v-if="row.status == 20" type="primary" size="small"
                        @click="updateStatus(row, 21)">完成检验</el-button>

                    <!-- 21 检验完成 -->
                    <el-button v-if="row.status == 21" type="primary" size="small"
                        @click="updateStatus(row, 22)">检验合格</el-button>
                    <el-button v-if="row.status == 21" type="danger" size="small"
                        @click="updateStatus(row, 23, true)">检验不合格</el-button>

                    <!-- 22 → 30 -->
                    <el-button v-if="row.status == 22" type="success" size="small"
                        @click="updateStatus(row, 30)">提交入库</el-button>

                    <!-- 30 入库中 -->
                    <el-button v-if="row.status == 30" type="primary" size="small"
                        @click="updateStatus(row, 31)">入库完成</el-button>
                    <el-button v-if="row.status == 30" type="danger" size="small"
                        @click="updateStatus(row, 32, true)">入库拒绝</el-button>

                    <!-- 通用 -->
                    <el-button type="primary" size="small" @click="handleView(row)">查看</el-button>
                    <el-button v-if="![31, 32, 99].includes(row.status)" type="danger" size="small"
                        @click="handleCancel(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination">
            <el-pagination v-model:current-page="query.pageNumber" v-model:page-size="query.pageSize"
                :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next" :total="total" @size-change="getList"
                @current-change="getList" />
        </div>

        <!-- 弹窗 -->
        <OrderDialog v-model="dialog.visible" :row="dialog.row" :type="dialog.type" @success="getList" />
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getInspOrderPage, deleteInspOrder, updateInspOrderStatus } from '@/api/plinspection/inspOrder'
import OrderDialog from './add.vue'
import { Refresh } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { baseURL } from '@/utils/request'

import { useUserStore } from '@/store/user'
const userStore = useUserStore()

// 时间格式化
const formatDate = d => d ? dayjs(d).format('YYYY-MM-DD HH:mm') : '-'

// 解析证明书
const parseCertificate = s => s ? (Array.isArray(JSON.parse(s)) ? JSON.parse(s) : []) : []

// 打开文件
const openFileInNewWindow = url => url && window.open(url.startsWith('http') ? url : baseURL + url, '_blank')

// 查询
const query = reactive({ orderNo: '', batchNo: '', batchNumber: '', status: '', pageNumber: 1, pageSize: 10 })
const list = ref([])
const total = ref(0)
const loading = ref(false)

// 状态（新增 0 草稿）
const statusOptions = [
    { label: '草稿', value: 0 },
    { label: '报检待审核', value: 10 },
    { label: '报检通过', value: 11 },
    { label: '报检拒绝', value: 12 },
    { label: '检验中', value: 20 },
    { label: '检验完成', value: 21 },
    { label: '检验合格', value: 22 },
    { label: '检验不合格', value: 23 },
    { label: '入库中', value: 30 },
    { label: '已入库', value: 31 },
    { label: '入库拒绝', value: 32 }
]
const statusMap = Object.fromEntries(statusOptions.map(s => [s.value, s.label]))
const getStatusLabel = s => statusMap[s] || '-'
const getStatusTagType = s => ({
    0: 'info',          // 草稿
    10: 'warning', 11: 'success', 12: 'danger',
    20: 'primary', 21: 'info', 22: 'success', 23: 'danger',
    30: 'primary', 31: 'success', 32: 'danger', 99: 'info'
}[s] || 'info')

// 数据加载
const getList = async () => {
    loading.value = true
    try {
        const res = await getInspOrderPage(query)
        list.value = res.data.page?.list || []
        total.value = res.data.page?.totalRow || 0
    } catch { ElMessage.error('加载失败') } finally { loading.value = false }
}

const handleRefresh = () => {
    Object.assign(query, { orderNo: '', batchNo: '', batchNumber: '', status: '', pageNumber: 1 })
    getList()
}

// 弹窗
const dialog = reactive({ visible: false, row: null, type: 'add' })
const handleAdd = () => { dialog.type = 'add'; dialog.row = null; dialog.visible = true }
const handleView = row => { dialog.type = 'view'; dialog.row = { ...row }; dialog.visible = true }

// 统一状态变更
const updateStatus = async (row, newStatus, needRemark = false) => {
    let remark = ''
    if (needRemark) {
        const { value } = await ElMessageBox.prompt('请输入拒绝原因', '提示', { inputValidator: v => v ? true : '必填' })
        remark = value
    }

    try {
        await updateInspOrderStatus({ orderId: row.id, newStatus: newStatus, remark, operator: userStore.realName })
        ElMessage.success('操作成功')
        getList()
    } catch {
        ElMessage.error('操作失败')
    }
}

// 删除
const handleCancel = row => {
    ElMessageBox.confirm(`确认删除 "${row.orderNo}"？`, '警告', { type: 'warning' })
        .then(async () => {
            await deleteInspOrder({ id: row.id })
            ElMessage.success('已删除')
            getList()
        })
        .catch(() => { })
}

watch(() => dialog.visible, v => { if (!v) dialog.row = null })
onMounted(getList)
</script>

<style scoped>
.insp-order-management {
    padding: 20px;
}

.action-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    margin-bottom: 20px;
}

.pagination {
    margin-top: 20px;
    text-align: right;
}

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