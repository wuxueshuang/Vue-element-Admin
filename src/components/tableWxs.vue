<template>
    <div class="icons-container">
        <el-table
            :data="tableData"
            style="width: 100%,margin-bottom:20px"
            max-height="500"
            @row-click = "rowClick"        
            @selection-change="handleSelectionChange"
            @select = "select"
            ref = "wTable"
        > 
            <el-table-column 
                type="selection"  
                width="55" 
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column 
                show-overflow-tooltip
                v-for = "(item,index) in columns"
                :key = index               
                :label="item.label" 
                :prop="item.prop" 
                
            />
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[5,10, 20, 30,]"
            :page-size="10"
            layout="sizes, prev, pager, next"
            :total= 'totalNum'
        >
        </el-pagination>
    </div>
</template>
<script>
import { Table, Pagination } from 'element-ui';
import Vue from 'vue';

export default {
    name:'TableW',
    data() {
        return {
            multipleSelection:[],//记录所有选中的行数据
            selectedRowKeys:[],//用于记录选中行数据的key值
            tableDataSource : [],
            currentPage:this.page
        }
    },
    props: [
        'dataSource',//table表格的数据源
        'column',//table表格的列
        "showPagination",//是否显示分页
        "addClassTopagination",//分页组件中添加的class名
        "defaultSelectedRowKeys",//默认选中的行的id,为数组
        "page",
    ],
    mounted() {
        //在mouneted中设置调用方法设置默认选中项方法
        let that = this
        console.log("wozhixingle ","that.defaultSelectionKeys",that.defaultSelectionKeys,"that.tableData",that.tableData)
        if(that.defaultSelectionKeys && that.tableData.length){
            that.defaultSelection(that.defaultSelectionKeys);
        }      
},
    computed:{
        tableData(){//table列表数据源
            this.tableDataSource = this.dataSource && this.dataSource.data ? this.dataSource.data : this.dataSource
            
            return this.tableDataSource      
           
        },
        columns(){//table表格中的所有列
            let columns = this.column;
            return columns
        },
        isShowPagination(){//是否显示分页
            let isShowPagination = '';
            if(this.showPagination == "undefined"){
                isShowPagination = 'block'
            }else{
                isShowPagination = this.showPagination.isShow== true ? 'block' : 'none'
            }
            return isShowPagination
        },
        PaginationPosition(){//控制分页器位置，默认在右边
            let PaginationPosition = '';
            if(this.showPagination == "undefned"){
                PaginationPosition = "right"
            }else{
                PaginationPosition = this.showPagination.paginationPosition
            }            
            return PaginationPosition
        },
        totalNum(){
            let totalNum = '';
            totalNum = this.dataSource && this.dataSource.total ? parseInt(this.dataSource.total) : null
           
            return totalNum
        },
        addclass(){
            let addClass = "";
            if(this.addClassTopagination == 'undefined'){
                addClass = ''
            }else{
                addClass =this.addClassTopagination
            }
            return addClass
        },
        defaultSelectionKeys(){// 计算默认选中的行的key值
            let defaultSelectionKeys = [];
            if(this.defaultSelectedRowKeys != undefined){
                defaultSelectionKeys = this.defaultSelectedRowKeys
            }
            // this.defaultSelection(this.defaultSelectionKeys);
            return defaultSelectionKeys
        }
       
    },
    methods:{
        handleCurrentChange(page){     
            // console.log("this.defaultSelectionKeys---handleCurrentChange",this.defaultSelectionKeys)
            this.$emit("changeTableData",page)
            let that = this
            setTimeout(function (){
                that.defaultSelection(that.defaultSelectionKeys);
            })
        },
        rowClick(row, event, column){//点击行事件
            this.$emit("row-click",row, event, column)
        },
        select(selection, row){//点击复选框事件
            this.$emit("select",row,  row)
            this.multipleSelection = selection;
        },
        defaultSelection(selectedRowKeys){//设置默认选中项
            let that = this
            // that.$refs.wTable.clearSelection()
            that.$children[0].clearSelection()
            console.log("that",that)
            let arr = [];
            if(that.tableData.length){
                selectedRowKeys.map((item,index)=>{
                    that.tableData.map((item2,index2)=>{
                        if(item2.id == item){
                            arr.push(item2)
                        }
                    });
                });
            }
            arr.map((item,index)=>{
                that.$children[0].toggleRowSelection(item,true)
                // that.$refs.wTable.toggleRowSelection(item,true)
            })
        },
        handleSizeChange(val) {//当前每页显示的条数改变
            console.log(`每页 ${val} 条`);
            this.$emit("size-change",val)
        },
        handleSelectionChange(selection) {//获取到的是所有选中的行数据
            this.$emit("selection-change",selection)
        },
    },
    watch:{
        selectedRowKeys:{
            handler(val, oldVal) {
                // console.log("val",val,"oldVal",oldVal);
                this.selectedRowKeys = val
                this.defaultSelection(this.selectedRowKeys);
            },
            // immediate: true,
            deep: true
        },
        tableDataSource:{
            handler(val, oldVal) {
                // console.log("val",val,"oldVal",oldVal);
                this.tableDataSource = val
                let that = this
                // console.log("wozhixingle ","that.defaultSelectionKeys",that.defaultSelectionKeys,"that.tableData",that.tableData)
                // if(that.defaultSelectionKeys && that.tableData.length){
                //     that.defaultSelection(that.defaultSelectionKeys);
                // }
            },
            // immediate: true,
            deep: true
        }
    }
}
/*
    wTable组件使用：
    1.原有的element中table的event事件均用this.$emit方式发布到父组件，在父组件中注册相对应的事件监听。
    2.原有的element中table的methods方法在父组件中需要添加ref = "table",然后可以用this.$refs.table.$refs.wTable
    获取到该方法。

*/
</script>
<style>
    .paginationClass{
        padding-top:50px;
    }
</style>