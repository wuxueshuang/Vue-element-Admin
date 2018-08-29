<template>
    <div>
        <w-table 
            :dataSource = 'data'
            :column = 'column'
            ref = "table"
            v-if = "flag"
            @changeTableData = "changeTableData"
            :showPagination = "showPagination"
            :addClassTopagination = "addClassTopagination"
            @selection-change="handleSelectionChange"
            @row-click = "rowClick"
            @select = "select"            
            :defaultSelectedRowKeys = "defaultSelectionKeys"
            :page = "page"
            @size-change = "handleSizeChange"
          
        ></w-table><!-- v-if = "flag" -->
        <div style="margin-top: 20px">
            <el-button @click="toggleSelection(data.data)">全选</el-button>
            <el-button @click="toggleSelection()">取消选择</el-button>
        </div>
         <!-- <div class="block">
            <span class="demonstration">完整功能</span>
            <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage4"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400">
            </el-pagination>
        </div> -->
    </div>
</template>
<script>
    import WTable from "@/components/tableWxs.vue"
    import { getTableData } from '@/api/table-www'

  export default {
    data() {
      return {
        column: [{
            prop: "name",
            label: "姓名"
          },
          {
            prop: "date",
            label: "日期"
          },
          {
            prop: "address",
            label: "地址"
          }
        ],
        data: [],
        flag:false,
        page:1,
        size:10,
        // totalNum:"",
        showPagination:{
            isShow:true,
            paginationPosition:"center"  
        },
        addClassTopagination:'test',
        defaultSelectionKeys:[2,3,4],
        // isFlag:true//是否已经请求完数据的标志   
        // currentPage4:1
      }
    },
    components:{
     "w-table": WTable
    },
    created(){
        this.fetchData(this.page,this.pageSize);
    },
    methods:{
        async fetchData(page,size) {
            await getTableData(page,size).then(response => {
                // console.log("page",page,"size",size)
                
                this.data = response.data.data
              

                this.flag = true        
            }).catch(err => {
                console.log(err)
            })
         },
        changeTableData(changedPage){
            this.flag = false
            this.page = changedPage
            this.fetchData(changedPage)
        },
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.table.$refs.wTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.table.$refs.wTable.clearSelection();
            }
        },
        handleSelectionChange(selection){//获取所有选中行的数据
            // console.log("父组件selection",selection)

        },
        rowClick(row, event, column){//点击行事件
            if(this.defaultSelectionKeys.length){
                let isExist = this.defaultSelectionKeys.findIndex((item,index,arr)=>{
                    return row.id == item
                })
                // console.log("isExist",isExist)
                if(isExist == '-1'){
                    this.defaultSelectionKeys.push(row.id)          
                }else{
                    this.defaultSelectionKeys.splice(isExist,1)
                }
            }else{
                this.defaultSelectionKeys.push(row.id)
            }
           
            this.$refs.table.$refs.wTable.toggleRowSelection(row);
        },
        select(selection, row){//点击复选框事件
           if(this.defaultSelectionKeys.length){
                let isExist = this.defaultSelectionKeys.findIndex((item,index,arr)=>{
                    return row.id == item
                })
                // console.log("isExist",isExist)
                if(isExist == '-1'){
                    this.defaultSelectionKeys.push(row.id)          
                }else{
                    this.defaultSelectionKeys.splice(isExist,1)
                }
            }else{
                this.defaultSelectionKeys.push(row.id)
            }
        },
        handleSizeChange(val){//每页显示数据条数发生变化
            this.pageSize = val
            console.log(this.pageSize,"this.pageSize")
            this.fetchData(this.page,this.pageSize);
        },
        handleCurrentChange(val){
            // console.log("changgeFlag")
            this.page = val
            console.log("this.page----改变了",this.page)
        }       
    },
    watch:{
        defaultSelectionKeys:{
            handler(val, oldVal) {
                // console.log("val",val,"oldVal",oldVal);
                this.defaultSelectionKeys = val
            },
            // immediate: true,
            deep: true
        },
        flag:{
            handler(val, oldVal) {
                // console.log("flag",val,"oldflag",oldVal);
                this.flag = val
            },
            // immediate: true,
            deep: true
        },
        data:{
             handler(val, oldVal) {
                // console.log("data",val,"olddata",oldVal);
                this.data = val
            },
            // immediate: true,
            deep: true
        },
        // page:{
        //      handler(val, oldVal) {
        //         console.log("page",val,"oldpage",oldVal);
        //         this.page = val
        //     },
        //     // immediate: true,
        //     deep: true
        // },
    }

}


function unique (data){
    var result = [];
    for(var i=0;i<data.length;i++){
    　　var flag = true;
    　　for(var j=0;j<result.length;j++){
    　　　　if(data[i].id == result[j].id){
    　　　　　　flag = false;
    　　　　};
    　　}; 
    　　if(flag){
    　　　　result.push(data[i]);
    　　};
    };
    return result
}
</script>
<style>
    .test{
        padding:20px;
    }

</style>
