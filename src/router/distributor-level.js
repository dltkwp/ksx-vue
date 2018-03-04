import DistributorLevel from '@/page/supplier/distributor-level/distributor-level.vue'

export default [{
    path: '/v_level',
    name: 'DistributorLevel',
    meta: {
        parentKey: 'Supplier',
        childrenKey: 'DistributorLevel',
    },
    component: DistributorLevel
}]