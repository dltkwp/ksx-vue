import DistributorGoods from '@/page/supplier/goods/goods.vue'

export default [{
    path: '/v_supplier_goods',
    name: 'DistributorGoods',
    meta: {
        parentKey: 'Supplier',
        childrenKey: 'DistributorGoods',
    },
    component: DistributorGoods
}]