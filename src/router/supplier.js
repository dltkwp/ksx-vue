/**
 *  供应商的路由管理
 */
import SupplierGoods from '@/page/supplier/goods/goods.vue'
import SupplierGoodsSave from '@/page/supplier/goods/save.vue'
import SupplierGoodsDetail from '@/page/supplier/goods/detail.vue'
import DistributorLevel from '@/page/supplier/distributor-level/distributor-level.vue'
import Distributor from '@/page/supplier/distributor/distributor.vue'
import GoodsCategory from '@/page/supplier/goods-category/goods-category.vue'
import SupplierOrder from '@/page/supplier/order/order.vue'

export default [{
  path: '/v_supplier_goods',
  name: 'SupplierGoods',
  meta: {
    parentKey: 'Supplier',
    childrenKey: 'SupplierGoods'
  },
  component: SupplierGoods
},
{
  path: '/v_supplier_goods_save',
  name: 'SupplierGoodsSave',
  meta: {
    parentKey: 'Supplier',
    childrenKey: 'SupplierGoods'
  },
  component: SupplierGoodsSave
},
{
  path: '/v_supplier_goods_detail/:id',
  name: 'SupplierGoodsDetail',
  meta: {
    parentKey: 'Supplier',
    childrenKey: 'SupplierGoods'
  },
  component: SupplierGoodsDetail
},
{
  path: '/v_level',
  name: 'DistributorLevel',
  meta: {
    parentKey: 'Supplier',
    childrenKey: 'DistributorLevel'
  },
  component: DistributorLevel
},
{
  path: '/v_distributor',
  name: 'Distributor',
  meta: {
    parentKey: 'Supplier',
    childrenKey: 'Distributor'
  },
  component: Distributor
}, {
  path: '/v_category',
  name: 'GoodsCategory',
  meta: {
    parentKey: 'Supplier',
    childrenKey: 'GoodsCategory'
  },
  component: GoodsCategory
},
{
  path: '/v_supplier_order',
  name: 'SupplierOrder',
  meta: {
    parentKey: 'Supplier',
    childrenKey: 'SupplierOrder'
  },
  component: SupplierOrder
}
]
