import DistributorGoods from '@/page/supplier/goods/goods.vue'
import DistributorGoodsSave from '@/page/supplier/goods/save.vue'
import DistributorGoodsDetail from '@/page/supplier/goods/detail.vue'

export default [{
  path: '/v_supplier_goods',
  name: 'DistributorGoods',
  meta: {
    parentKey: 'Supplier',
    childrenKey: 'DistributorGoods'
  },
  component: DistributorGoods
},
{
  path: '/v_supplier_goods_save',
  name: 'DistributorGoodsSave',
  meta: {
    parentKey: 'Supplier',
    childrenKey: 'DistributorGoods'
  },
  component: DistributorGoodsSave
},
{
  path: '/v_supplier_goods_detail/:id',
  name: 'DistributorGoodsDetail',
  meta: {
    parentKey: 'Supplier',
    childrenKey: 'DistributorGoods'
  },
  component: DistributorGoodsDetail
}
]
