import User from '@/page/user/user.vue'

export default [{
  path: '/v_user',
  name: 'User',
  meta: {
    parentKey: 'Setting',
    childrenKey: 'User'
  },
  component: User
}]
