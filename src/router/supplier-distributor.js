import Distributor from '@/page/supplier/distributor/distributor.vue'

export default [{
  path: '/v_distributor',
  name: 'Distributor',
  meta: {
    parentKey: 'Supplier',
    childrenKey: 'Distributor'
  },
  component: Distributor
}]
