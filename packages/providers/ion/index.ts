import { createCommentVNode, defineComponent, getCurrentInstance } from 'vue'
import { VcComponentInternalInstance } from '@vue-cesium/utils/types'
import { useProviders } from '@vue-cesium/composables'
import { accessToken } from '@vue-cesium/utils/cesium-props'
import { kebabCase } from '@vue-cesium/utils/util'

export default defineComponent({
  name: 'VcProviderImageryIon',
  props: {
    assetId: Number,
    ...accessToken,
    server: [String, Object]
  },
  emits: ['beforeLoad', 'ready', 'destroyed', 'readyPromise'],
  setup (props, ctx) {
    // state
    const instance = getCurrentInstance() as VcComponentInternalInstance
    instance.cesiumClass = 'IonImageryProvider'
    useProviders(props, ctx, instance)
    return () => createCommentVNode(kebabCase(instance.proxy.$options.name))
  }
})
