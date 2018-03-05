import DistributorGoods from '@/page/supplier/goods/goods.vue'
import DistributorGoodsSave from '@/page/supplier/goods/save.vue'

export default [{
        path: '/v_supplier_goods',
        name: 'DistributorGoods',
        meta: {
            parentKey: 'Supplier',
            childrenKey: 'DistributorGoods',
        },
        component: DistributorGoods
    },
    {
        path: '/v_supplier_goods_save',
        name: 'DistributorGoodsSave',
        meta: {
            parentKey: 'Supplier',
            childrenKey: 'DistributorGoodsSave',
        },
        component: DistributorGoodsSave
    }
]