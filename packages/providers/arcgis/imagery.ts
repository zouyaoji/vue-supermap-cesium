import { createCommentVNode, defineComponent, getCurrentInstance } from 'vue'
import { VcComponentInternalInstance } from '@vue-cesium/utils/types'
import { useProviders } from '@vue-cesium/composables'
import {
  token,
  tileDiscardPolicy,
  layers,
  enablePickFeatures,
  rectangle,
  tilingScheme,
  ellipsoid,
  credit,
  tileWidth,
  tileHeight,
  maximumLevel } from '@vue-cesium/utils/cesium-props'
import { kebabCase } from '@vue-cesium/utils/util'
export default defineComponent({
  name: 'VcProviderImageryArcgis',
  props: {
    url: {
      type: String,
      default: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
    },
    ...token,
    ...tileDiscardPolicy,
    usePreCachedTilesIfAvailable: {
      type: Boolean,
      default: true
    },
    ...layers,
    ...enablePickFeatures,
    ...rectangle,
    ...tilingScheme,
    ...ellipsoid,
    ...credit,
    ...tileWidth,
    ...tileHeight,
    ...maximumLevel
  },
  emits: ['beforeLoad', 'ready', 'destroyed', 'readyPromise'],
  setup (props, ctx) {
    // state
    const instance = getCurrentInstance() as VcComponentInternalInstance
    instance.cesiumClass = 'ArcGisMapServerImageryProvider'
    useProviders(props, ctx, instance)
    return () => createCommentVNode(kebabCase(instance.proxy.$options.name))
  }
})
