<template>
  <div :class="{'hidden':hidden}" class="pagination-container">
    <el-pagination
        :background="background"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :layout="layout"
        :page-sizes="pageSizes"
        :total="total"
		:small="small"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import {computed} from "vue";
import {scrollTo} from '@/utils/scroll-to'
	export default{
		  name:'GlobalTable',
		  components:{},
		  props:["total","page","limit","pageSizes","layout","background","autoScroll","hidden","small"],
		  emits:['update:page'],
		  setup(props,context){
				const currentPage = computed({
				  get() {
					return props.page
				  },
				  set(val) {
					context.emit('update:page', val)
				  }
				})

				const pageSize = computed({
				  get() {
					return props.limit
				  },
				  set(val) {
					context.emit('update:limit', val)
				  }
				})

				function handleSizeChange(val) {
				  context.emit('pagination', {page: currentPage, limit: val})
				  if (props.autoScroll) {
					scrollTo(0, 800)
				  }
				}

				function handleCurrentChange(val) {
				  context.emit('pagination', {page: val, limit: props.pageSizes})
				  if (props.autoScroll) {
					scrollTo(0, 800)
				  }
				}
			return {
				currentPage,pageSize,//compute
				handleSizeChange,handleCurrentChange,//function
			}
			  }
		}


</script>

<style scoped>
.pagination-container {
  padding: 16px 16px;
}

.pagination-container.hidden {
  display: none;
}
</style>
