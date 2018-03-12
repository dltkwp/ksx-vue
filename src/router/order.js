import SupplierOrder from '@/page/supplier/order/order.vue'
import DistributorOrder from '@/page/distributor/order/order.vue'

export default [{
  path: '/v_supplier_order',
  name: 'SupplierOrder',
  meta: {
    parentKey: 'Supplier',
    childrenKey: 'SupplierOrder'
  },
  component: SupplierOrder
},
{
  path: '/v_distributor_order',
  name: 'DistributorOrder',
  meta: {
    parentKey: 'Distributor',
    childrenKey: 'DistributorOrder'
  },
  component: DistributorOrder
}
]
