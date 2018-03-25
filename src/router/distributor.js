/**
 *  分销商的路由设置
 */
import DistributorGoods from '@/page/distributor/goods/goods.vue'
import DistributorGoodsSave from '@/page/distributor/goods/save.vue'
import DistributorGoodsDetail from '@/page/distributor/goods/detail.vue'
import DistributorOrder from '@/page/distributor/order/order.vue'
import DistributorCustomer from '@/page/distributor/customer/customer.vue'

export default [{
  path: '/v_distributor_goods',
  name: 'DistributorGoods',
  meta: {
    parentKey: 'Distributor',
    childrenKey: 'DistributorGoods'
  },
  component: DistributorGoods
},
{
  path: '/v_distributor_goods_save',
  name: 'DistributorGoodsSave',
  meta: {
    parentKey: 'Distributor',
    childrenKey: 'DistributorGoods'
  },
  component: DistributorGoodsSave
},
{
  path: '/v_distributor_goods_detail/:id',
  name: 'DistributorGoodsDetail',
  meta: {
    parentKey: 'Distributor',
    childrenKey: 'DistributorGoods'
  },
  component: DistributorGoodsDetail
},
{
  path: '/v_distributor_order',
  name: 'DistributorOrder',
  meta: {
    parentKey: 'Distributor',
    childrenKey: 'DistributorOrder'
  },
  component: DistributorOrder
},
{
  path: '/v_distributor_customer',
  name: 'DistributorCustomer',
  meta: {
    parentKey: 'Distributor',
    childrenKey: 'DistributorCustomer'
  },
  component: DistributorCustomer
}
]
