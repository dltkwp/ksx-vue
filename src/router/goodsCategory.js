import GoodsCategory from '@/page/supplier/goods-category/goods-category.vue'

export default [{
    path: '/v_category',
    name: 'GoodsCategory',
    meta: {
        parentKey: 'Supplier',
        childrenKey: 'GoodsCategory',
    },
    component: GoodsCategory
}]