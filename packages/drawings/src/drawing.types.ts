import { VcFabAction } from '@vue-cesium/ui'
import { CSSProperties, Ref } from 'vue'
import {
  pointActionDefault,
  pointDrawingDefault,
  polylineActionDefault,
  polylineDrawingDefault,
  polygonActionDefault,
  polygonDrawingDefault,
  clearActionDefault
} from './defaultProps'
import VcDrawingPoint from './point'
import VcDrawingPolyline from './polyline'
import VcDrawingPolygon from './polygon'

interface PointDrawing {
  show: boolean
  position: Cesium.Cartesian3
  drawStatus: number
}

interface PolygonDrawing {
  show: boolean
  positions: Array<Cesium.Cartesian3>
  polygonPositions: Array<Cesium.Cartesian3>
  drawStatus: number
  height?: number
}

interface DrawingInstanceOpts {
  name: string
  actionRef: Ref<typeof VcFabAction>
  actionOpts: typeof pointActionDefault | typeof polylineActionDefault | typeof polygonActionDefault | typeof clearActionDefault
  drawingRef: Ref<typeof VcDrawingPoint | typeof VcDrawingPolyline | typeof VcDrawingPolygon>
  drawingOpts: typeof pointDrawingDefault | typeof polylineDrawingDefault | typeof polygonDrawingDefault
  actionStyle?: CSSProperties
  actionClass?: string
  tip?: string
  cmp: typeof VcDrawingPoint | typeof VcDrawingPolyline | typeof VcDrawingPolygon
  isActive: boolean
}

export {
  PointDrawing,
  PolygonDrawing,
  DrawingInstanceOpts
}
