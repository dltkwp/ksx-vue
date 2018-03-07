import SupplierOrder from '@/page/supplier/order/order.vue'

export default [{
    path: '/v_supplier_order',
    name: 'SupplierOrder',
    meta: {
        parentKey: 'Supplier',
        childrenKey: 'SupplierOrder',
    },
    component: SupplierOrder
}]