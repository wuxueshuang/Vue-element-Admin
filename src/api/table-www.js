import request from '@/utils/request'

export function getTableData(query) {
  return request({
    url: '/tableData?page='+ query,
    method: 'get',
    params: query
  })
}