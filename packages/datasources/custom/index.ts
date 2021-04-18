import { createCommentVNode, defineComponent, getCurrentInstance, h } from 'vue'
import { VcComponentInternalInstance } from '@vue-cesium/utils/types'
import { userDatasources } from '@vue-cesium/composables'
import { kebabCase } from '@vue-cesium/utils/util'
import { hSlot } from '@vue-cesium/utils/private/render'
import { show } from '@vue-cesium/utils/cesium-props'
export default defineComponent({
  name: 'VcDatasourceCustom',
  props: {
    ...show,
    enableEvent: {
      type: Boolean,
      default: true
    },
    entities: {
      type: Array,
      default: () => []
    },
    name: String
  },
  emits: ['beforeLoad', 'ready', 'destroyed', 'definitionChanged', 'clusterEvent', 'collectionChanged', 'changedEvent', 'errorEvent', 'loadingEvent'],
  setup (props, ctx) {
    // state
    const instance = getCurrentInstance() as VcComponentInternalInstance
    instance.cesiumClass = 'CustomDataSource'
    userDatasources(props, ctx, instance)

    instance.createCesiumObject = async () => {
      return new Cesium.CustomDataSource(props.name)
    }

    return () => ctx.slots.default ? (
      h('i', {
        class: kebabCase(instance.proxy.$options.name),
        style: { display: 'none !important' }
      }, hSlot(ctx.slots.default))
    ) : createCommentVNode(kebabCase(instance.proxy.$options.name))
  }
})
