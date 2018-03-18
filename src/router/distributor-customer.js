import DistributorCustomer from '@/page/distributor/customer/customer.vue'

export default [
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
