import { createCommentVNode, defineComponent, getCurrentInstance, PropType } from 'vue'
import { VcComponentInternalInstance, } from '@vue-cesium/utils/types'
import { useCommon } from '@vue-cesium/composables/index'
import { kebabCase } from '@vue-cesium/utils/util'
import defaultProps from './defaultProps'

export default defineComponent({
  name: 'VcPostProcessStage',
  props: defaultProps,
  emits: ['beforeLoad', 'ready', 'destroyed'],
  setup (props, ctx) {
    // state
    const instance = getCurrentInstance() as VcComponentInternalInstance
    instance.cesiumClass = 'PostProcessStage'
    instance.cesiumEvents = []
    const commonState = useCommon(props, ctx, instance)
    if (commonState === void 0) {
      return
    }
    const { $services } = commonState

    // methods
    instance.mount = async () => {
      const { postProcessStages } = $services
      const stage = postProcessStages.add(instance.cesiumObject as Cesium.PostProcessStage)
      return postProcessStages.contains(stage)
    }

    instance.unmount = async () => {
      const { postProcessStages } = $services
      return postProcessStages?.remove(instance.cesiumObject as Cesium.PostProcessStage)
    }

    return () => createCommentVNode(kebabCase(instance.proxy.$options.name))
  }
})
