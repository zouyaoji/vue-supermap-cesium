import {
  Cesium as CesiumNative,
  AnyFunction,
  Cartesian2Option,
  Cartesian3Option,
  Cartesian4Option,
  PolygonHierarchyOption,
  CartographicInDegreeOption,
  NearFarScalarOption,
  DistanceDisplayConditionOption,
  ColorInByteOption,
  MaterialOption,
  VcComponentInternalInstance,
  RectangleInDegreeOption,
  BoundingRectangleOption,
  PlaneOption,
  TranslationRotationScaleOption,
  CameraOption,
  HeadingPitchRollOption
} from './types'
import { hasOwn, isFunction, isArray, isString, isPlainObject, isEmptyObj, getObjClassName } from './util'

/**
 * 将对象或数组转换为 Cesium.Cartesian2
 * @param {Object} val
 * @returns {Cartesian2 | CallbackProperty} 返回 Cartesian2 或者 CallbackProperty
 * @example
 * const options = [100, 100]
 * // const options = [x: 100, y: 100]
 * const position = makeCartesian2(options)
 */
export function makeCartesian2(
  val: CesiumNative.CallbackProperty | CesiumNative.Cartesian2 | Cartesian2Option | Array<number> | AnyFunction,
  isConstant = false
): CesiumNative.Cartesian2 | CesiumNative.CallbackProperty {
  const { Cartesian2, CallbackProperty } = Cesium

  if (val instanceof Cesium.Cartesian2 || val instanceof CallbackProperty) {
    return val
  }

  if (isPlainObject(val)) {
    if (hasOwn(val, 'x') && hasOwn(val, 'y')) {
      const value = val as Cartesian2Option
      return new Cartesian2(value.x, value.y)
    }
  }

  if (isArray(val)) {
    return new Cartesian2(val[0], val[1])
  }

  if (isFunction(val)) {
    return new CallbackProperty(val, isConstant)
  }

  return undefined
}

/**
 * 将对象或者数组转换为 Cesium.Cartesian3
 * @param {Object} val 传入的对象或数组
 * @param {Boolean} isConstant 传入function时生效，true 代表回调 function 每时每刻都返回值， false 代表改变才会返回值。默认false。
 * @returns 返回 Cartesian3 或者 CallbackProperty
 * @example
 * const options = {
 *  lng: 108,
 *  lat: 35,
 *  height: 1000
 * }
 * // const options = [108, 35, 1000]
 * const position = makeCartesian3 (options) // return Cesium.Cartesian3
 */
export function makeCartesian3(
  val:
    | CesiumNative.CallbackProperty
    | CesiumNative.Cartesian3
    | Cartesian3Option
    | CartographicInDegreeOption
    | Array<number>
    | AnyFunction,
  isConstant = false
): CesiumNative.Cartesian3 | CesiumNative.CallbackProperty {
  const { CallbackProperty, Cartesian3 } = Cesium

  if (val instanceof Cartesian3 || val instanceof CallbackProperty) {
    return val
  }

  if (isPlainObject(val)) {
    if (hasOwn(val, 'x') && hasOwn(val, 'y') && hasOwn(val, 'z')) {
      const value = val as Cartesian3Option
      return new Cartesian3(value.x, value.y, value.z)
    } else if (hasOwn(val, 'lng') && hasOwn(val, 'lat')) {
      const value = val as CartographicInDegreeOption
      return Cartesian3.fromDegrees(value.lng, value.lat, value.height || 0)
    }
  }
  // 经纬度数组
  if (isArray(val)) {
    return Cartesian3.fromDegrees(val[0], val[1], val[2] || 0)
  }

  if (isFunction(val)) {
    return new CallbackProperty(val, isConstant)
  }

  return undefined
}

/**
 * 将数组 [lng, lat, height, ……，lng, lat, height] 转换为 Cesium.Cartesian3 数组
 * @param {Array} val
 * @returns {Array<Cartesian3>}
 */
export function makeCartesian3Array(
  vals:
    | CesiumNative.CallbackProperty
    | Array<CesiumNative.Cartesian3>
    | Array<Cartesian3Option>
    | Array<CartographicInDegreeOption>
    | Array<number>
    | Array<Array<number>>
    | AnyFunction,
  isConstant = false
): Array<CesiumNative.Cartesian3> | CesiumNative.CallbackProperty {
  const { CallbackProperty, Cartesian3 } = Cesium

  if (vals instanceof CallbackProperty) {
    return vals
  }

  if (isArray(vals)) {
    if (vals[0] instanceof Cartesian3) {
      // If the first element is Cartesian3, it is considered to be Array<Cartesian3>.
      // 第一个元素为Cartesian3,认为已经存的是 Array<Cartesian3> 数组了
      return vals as Array<CesiumNative.Cartesian3>
    }

    if (isArray(vals[0])) {
      const values = vals as Array<Array<number>>
      const coordinates: Array<number> = []
      values.forEach(item => {
        coordinates.push(item[0])
        coordinates.push(item[1])
        coordinates.push(item[2] || 0)
      })
      return Cartesian3.fromDegreesArrayHeights(coordinates) // 认为是经纬度
    } else if (isPlainObject(vals[0])) {
      // 类数组
      const coordinates: Array<number> = []
      if (hasOwn(vals[0], 'lng') && hasOwn(vals[0], 'lat')) {
        const values = vals as Array<CartographicInDegreeOption>
        values.forEach(item => {
          coordinates.push(item.lng)
          coordinates.push(item.lat)
          coordinates.push(item.height || 0)
        })
        return Cartesian3.fromDegreesArrayHeights(coordinates)
      } else if (hasOwn(vals[0], 'x') && hasOwn(vals[0], 'y') && hasOwn(vals[0], 'z')) {
        const values = vals as Array<Cartesian3Option>
        values.forEach(item => {
          coordinates.push(item.x)
          coordinates.push(item.y)
          coordinates.push(item.z || 0)
        })
        return Cartesian3.fromRadiansArrayHeights(coordinates)
      }
    }

    return Cartesian3.fromDegreesArrayHeights(vals as Array<number>)
  }

  if (isFunction(vals)) {
    return new CallbackProperty(vals, isConstant)
  }

  return undefined
}

/**
 * 将形如 [lng, lat, ……，lng, lat] 数组转换为 Cesium.Cartesian2 数组
 * @param {Array} vals
 * @returns {Array<Cartesian2>}
 */
export function makeCartesian2Array(
  vals:
    | CesiumNative.CallbackProperty
    | Array<CesiumNative.Cartesian2>
    | Array<Cartesian2Option>
    | Array<Array<number>>
    | Array<number>
    | AnyFunction,
  isConstant
): CesiumNative.CallbackProperty | Array<CesiumNative.Cartesian2> {
  const { CallbackProperty, Cartesian2 } = Cesium

  if (vals instanceof CallbackProperty) {
    return vals
  }

  if (isArray(vals)) {
    if (vals[0] instanceof Cartesian2) {
      return vals as Array<CesiumNative.Cartesian2>
    }

    const points: Array<CesiumNative.Cartesian2> = []
    if (isArray(vals[0])) {
      const values = vals as Array<Array<number>>
      values.forEach(item => {
        const point = new Cartesian2(item[0], item[1])
        points.push(point)
      })
    } else if (isPlainObject(vals[0]) && hasOwn(vals[0], 'x') && hasOwn(vals[0], 'y')) {
      const values = vals as Array<Cartesian2Option>
      values.forEach(item => {
        points.push(new Cartesian2(item.x, item.y))
      })
    }
    return points
  }

  if (isFunction(vals)) {
    return new CallbackProperty(vals, isConstant)
  }

  return undefined
}

/**
 * 将对象或数组 转换为 Cesium.Quaternion
 * @param {Object} val
 * @example
 * const options = {x: 0, y: 0, z: 0, w: 0}
 * // const options = [0, 0, 0, 0]
 * const orientation = makeQuaternion(options) // returns Cesium.Quaternion
 */
export function makeQuaternion(
  val: CesiumNative.CallbackProperty | CesiumNative.Quaternion | Cartesian4Option | Array<number> | AnyFunction,
  isConstant = false
): CesiumNative.CallbackProperty | CesiumNative.Quaternion {
  const { CallbackProperty, Quaternion } = Cesium

  if (val instanceof Quaternion || val instanceof CallbackProperty) {
    return val
  }

  if (isPlainObject(val) && hasOwn(val, 'x') && hasOwn(val, 'y')) {
    const value = val as Cartesian4Option
    return new Quaternion(value.x, value.y, value.z, value.w)
  }

  if (isArray(val)) {
    return new Quaternion(val[0], val[1], val[2], val[3])
  }

  if (isFunction(val)) {
    return new CallbackProperty(val, isConstant)
  }

  return undefined
}

/**
 * 解析 HierarchyJson
 * @param {Object} val
 */
function parsePolygonHierarchyJson(val: Array<PolygonHierarchyOption>) {
  val.forEach(item => {
    item.positions = makeCartesian3Array(item.positions) as Array<CesiumNative.Cartesian3>
    if (item.holes) {
      parsePolygonHierarchyJson(item.holes)
    }
  })
}

/**
 * 普通数组或对象转 Cesium.PolygonHierarchy 对象。
 * @param {Object|Array} val
 */
export function makePolygonHierarchy(
  val:
    | CesiumNative.CallbackProperty
    | CesiumNative.PolygonHierarchy
    | PolygonHierarchyOption
    | Array<CesiumNative.Cartesian3>
    | Array<Cartesian3Option>
    | Array<Array<number>>
    | AnyFunction,
  isConstant = false
): CesiumNative.CallbackProperty | CesiumNative.PolygonHierarchy | PolygonHierarchyOption {
  const { PolygonHierarchy, CallbackProperty } = Cesium

  if (val instanceof PolygonHierarchy || val instanceof CallbackProperty) {
    return val
  }

  if (isFunction(val)) {
    return new CallbackProperty(val, isConstant)
  }

  if (isArray(val) && val.length >= 3) {
    const points = makeCartesian3Array(val) as Array<CesiumNative.Cartesian3>
    return new PolygonHierarchy(points)
  }

  if (isPlainObject(val) && hasOwn(val, 'positions')) {
    const value = val as PolygonHierarchyOption
    value.positions = makeCartesian3Array(value.positions) as Array<CesiumNative.Cartesian3>
    parsePolygonHierarchyJson(value.holes)
    return value
  }

  return undefined
}

/**
 * 对象或数组转 Cesium.NearFarScalar。
 * @param {Object} val
 * @returns {NearFarScalar}
 * @example
 * const options = {near: 1000, nearValue: 1.0, far: 10000, farValue: 0.5}
 * // const options = [1000, 1.0, 10000, 1.5]
 * const nearFarScalar = makeNearFarScalar(options)
 */
export function makeNearFarScalar(
  val: CesiumNative.NearFarScalar | CesiumNative.CallbackProperty | NearFarScalarOption | Array<number> | AnyFunction,
  isConstant = false
): CesiumNative.NearFarScalar | CesiumNative.CallbackProperty {
  const { NearFarScalar, CallbackProperty } = Cesium

  if (val instanceof NearFarScalar || val instanceof CallbackProperty) {
    return val
  }

  if (isPlainObject(val) && hasOwn(val, 'near') && hasOwn(val, 'far')) {
    const value = val as NearFarScalarOption
    return new NearFarScalar(value.near, value.nearValue || 0.0, value.far, value.farValue || 1.0)
  }

  if (isArray(val)) {
    return new NearFarScalar(val[0], val[1], val[2], val[3])
  }

  if (isFunction(val)) {
    return new CallbackProperty(val, isConstant)
  }

  return undefined
}
/**
 * 对象或数组转 Cesium.DistanceDisplayCondition。
 * @param {Object} val
 * @returns {DistanceDisplayCondition}
 * @example
 * const options = [0, 1000]
 * // const options = {near: 0, far: 1000}
 * const distanceDisplayCondition = makeDistanceDisplayCondition(options) // return Cesium.DistanceDisplayCondition
 */
export function makeDistanceDisplayCondition(
  val: CesiumNative.DistanceDisplayCondition | CesiumNative.CallbackProperty | DistanceDisplayConditionOption | Array<number> | AnyFunction,
  isConstant = false
): CesiumNative.DistanceDisplayCondition | CesiumNative.CallbackProperty {
  const { DistanceDisplayCondition, CallbackProperty } = Cesium

  if (val instanceof DistanceDisplayCondition || val instanceof CallbackProperty) {
    return val
  }

  if (isPlainObject(val) && hasOwn(val, 'near') && hasOwn(val, 'far')) {
    const value = val as DistanceDisplayConditionOption
    return new DistanceDisplayCondition(value.near, value.far)
  }

  if (isArray(val)) {
    return new DistanceDisplayCondition(val[0], val[1])
  }

  if (isFunction(val)) {
    return new CallbackProperty(val, isConstant)
  }

  return undefined
}

/**
 * 普通对象、数组或字符串转 Cesium.Color。
 * @param {String|Array|Object|Function} val
 * @returns {Color}
 * @example
 * const options = 'red'
 * // const options = [1, 0, 0, 1.0] // r g b a
 * // const options = {red: 255, green: 0, bule: 0, alpha: 255}
 * const color = makeColor(options) // return Cesium.Color
 */
export function makeColor(
  val: CesiumNative.Color | CesiumNative.CallbackProperty | string | Array<number> | ColorInByteOption | Cartesian4Option | AnyFunction,
  isConstant = false
): CesiumNative.Color | CesiumNative.CallbackProperty {
  const { Color, CallbackProperty } = Cesium

  if (val instanceof Color || val instanceof CallbackProperty) {
    return val
  }

  if (isString(val)) {
    return Color.fromCssColorString(val)
  }

  if (isPlainObject(val)) {
    if (hasOwn(val, 'red')) {
      const value = val as ColorInByteOption
      return Color.fromBytes(value.red, value.green || 255, value.blue || 255, value.alpha || 255)
    } else if (hasOwn(val, 'x')) {
      const value = val as Cartesian4Option
      return new Color(value.x, value.y || 1, value.z || 1, value.w || 1)
    }
  }

  if (isArray(val)) {
    return Color.fromBytes(val[0], val[1], val[2], val[3] || 255)
  }

  if (isFunction(val)) {
    return new CallbackProperty(val, isConstant)
  }

  return undefined
}

/**
 * 普通对象或数组 [r, g, b, a] 或字符串转 MaterialProperty
 * @param {String|Array|Object} val
 */
export function makeMaterialProperty(
  val:
    | CesiumNative.CallbackProperty
    | CesiumNative.Color
    | CesiumNative.CheckerboardMaterialProperty
    | CesiumNative.ColorMaterialProperty
    | CesiumNative.GridMaterialProperty
    | CesiumNative.ImageMaterialProperty
    | CesiumNative.PolylineArrowMaterialProperty
    | CesiumNative.PolylineDashMaterialProperty
    | CesiumNative.PolylineGlowMaterialProperty
    | CesiumNative.PolylineOutlineMaterialProperty
    | CesiumNative.StripeMaterialProperty
    | MaterialOption
    | string
    | Array<number>
    | HTMLImageElement
    | HTMLCanvasElement
    | HTMLVideoElement
    | AnyFunction,
  isConstant = false
) {
  const {
    CallbackProperty,
    Color,
    CheckerboardMaterialProperty,
    ColorMaterialProperty,
    GridMaterialProperty,
    ImageMaterialProperty,
    PolylineArrowMaterialProperty,
    PolylineDashMaterialProperty,
    PolylineGlowMaterialProperty,
    PolylineOutlineMaterialProperty,
    StripeMaterialProperty,
    StripeOrientation
  } = Cesium

  if (
    val instanceof CallbackProperty ||
    val instanceof Color ||
    val instanceof CheckerboardMaterialProperty ||
    val instanceof ColorMaterialProperty ||
    val instanceof ImageMaterialProperty ||
    val instanceof PolylineArrowMaterialProperty ||
    val instanceof PolylineDashMaterialProperty ||
    val instanceof PolylineGlowMaterialProperty ||
    val instanceof PolylineOutlineMaterialProperty ||
    val instanceof StripeMaterialProperty ||
    getObjClassName(val as any).indexOf('MaterialProperty') !== -1
  ) {
    return val
  }
  if (
    (isString(val) && /(.*)\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/.test(val)) ||
    val instanceof HTMLImageElement ||
    val instanceof HTMLCanvasElement ||
    val instanceof HTMLVideoElement
  ) {
    return new ImageMaterialProperty({
      image: val,
      repeat: makeCartesian2({ x: 1.0, y: 1.0 }),
      color: Color.WHITE,
      transparent: true
    })
  }

  if (isArray(val) || isString(val)) {
    return new ColorMaterialProperty(makeColor(val))
  }

  if (isPlainObject(val) && hasOwn(val, 'fabric')) {
    const value = val as MaterialOption
    switch (value.fabric.type) {
      case 'Image':
        return new ImageMaterialProperty({
          image: value.fabric.uniforms.image,
          repeat: makeCartesian2((value.fabric.uniforms.repeat as Cartesian2Option) || { x: 1.0, y: 1.0 }),
          color: makeColor(value.fabric.uniforms.color) || Color.WHITE,
          transparent: value.fabric.uniforms.transparent || false
        })
      case 'Color':
        return new ColorMaterialProperty(makeColor(value.fabric.uniforms.color || Color.WHITE))
      case 'PolylineArrow':
        return new PolylineArrowMaterialProperty(makeColor(value.fabric.uniforms.color || Color.WHITE))
      case 'PolylineDash':
        return new PolylineDashMaterialProperty({
          color: makeColor(value.fabric.uniforms.color) || Color.WHITE,
          gapColor: makeColor(value.fabric.uniforms.gapColor) || Color.TRANSPARENT,
          dashLength: value.fabric.uniforms.taperPower || 16.0,
          dashPattern: value.fabric.uniforms.taperPower || 255.0
        })
      case 'PolylineGlow':
        return new PolylineGlowMaterialProperty({
          color: makeColor(value.fabric.uniforms.color) || Color.WHITE,
          glowPower: value.fabric.uniforms.glowPower || 0.25,
          taperPower: value.fabric.uniforms.taperPower || 1.0
        })
      case 'PolylineOutline':
        return new PolylineOutlineMaterialProperty({
          color: makeColor(value.fabric.uniforms.color) || Color.WHITE,
          outlineColor: makeColor(value.fabric.uniforms.outlineColor) || Color.BLACK,
          outlineWidth: value.fabric.uniforms.outlineWidth || 1.0
        })
      case 'Checkerboard':
        return new CheckerboardMaterialProperty({
          evenColor: makeColor(value.fabric.uniforms.evenColor) || Color.WHITE,
          oddColor: makeColor(value.fabric.uniforms.oddColor) || Color.BLACK,
          repeat: makeCartesian2((value.fabric.uniforms.repeat as Cartesian2Option) || { x: 2, y: 2 })
        })
      case 'Grid':
        return new GridMaterialProperty({
          color: makeColor(value.fabric.uniforms.color) || Color.WHITE,
          cellAlpha: value.fabric.uniforms.cellAlpha || 0.1,
          lineCount: makeCartesian2((value.fabric.uniforms.lineCount as Cartesian2Option) || { x: 8, y: 8 }),
          lineThickness: makeCartesian2((value.fabric.uniforms.lineThickness as Cartesian2Option) || { x: 1, y: 1 }),
          lineOffset: makeCartesian2((value.fabric.uniforms.lineOffset as Cartesian2Option) || { x: 0, y: 0 })
        })
      case 'Stripe':
        return new StripeMaterialProperty({
          orientation: value.fabric.uniforms.orientation || StripeOrientation.HORIZONTAL,
          evenColor: makeColor(value.fabric.uniforms.evenColor || 'white'),
          oddColor: makeColor(value.fabric.uniforms.oddColor || 'black'),
          offset: value.fabric.uniforms.offset || 0,
          repeat: (value.fabric.uniforms.repeat as number) || 1
        })
    }
  }

  if (isFunction(val)) {
    return new CallbackProperty(val, isConstant)
  }

  return val
}

/**
 * 转 Material
 * @param {String|Array|Object} val
 */
export function makeMaterial(val: string | Array<number> | MaterialOption) {
  const vcInstance = this as VcComponentInternalInstance
  const cmpName = vcInstance.proxy.$options.name
  if (cmpName && (cmpName.indexOf('Graphics') || cmpName.indexOf('Datasource')) !== -1) {
    return makeMaterialProperty(val)
  }
  const { Material, combine } = Cesium
  if (val instanceof Material) {
    return val
  }
  if (isPlainObject(val) && hasOwn(val, 'fabric')) {
    const f = obj => {
      for (const i in obj) {
        if (!isArray(obj[i]) && isPlainObject(obj[i])) {
          f(obj[i])
        } else {
          if (i.toLocaleLowerCase().indexOf('color') !== -1 && !isEmptyObj(obj[i])) {
            const result = makeColor(obj[i])
            // Cesium 通过对象属性个数判断具体材质类型的，通过 Cesium.combine 移除 vue 传的一些属性
            obj[i] = combine(result, result, true)
          }
        }
      }
    }
    f(val)
    return new Material(val as MaterialOption)
  }
  return val
}

/**
 * 将对象 {west: number, south: number, east: number, north: number} 或者[west, south, east, north]数组 转 Cesium.Rectangle 对象。
 * @param {Object} val
 * @returns {Rectangle}
 */
export function makeRectangle(
  val: CesiumNative.Rectangle | CesiumNative.CallbackProperty | RectangleInDegreeOption | Cartesian4Option | Array<number> | AnyFunction,
  isConstant = false
): CesiumNative.Rectangle | CesiumNative.CallbackProperty | CesiumNative.RectangleGraphics {
  const { Rectangle, RectangleGraphics, CallbackProperty } = Cesium

  // Entiy 的 rectangle 属性不能调用这个方法
  if (val instanceof RectangleGraphics || val instanceof Rectangle || val instanceof CallbackProperty) {
    return val
  }

  if (isArray(val)) {
    return Rectangle.fromDegrees(val[0], val[1], val[2], val[3])
  }

  if (isPlainObject(val)) {
    if (hasOwn(val, 'west')) {
      const value = val as RectangleInDegreeOption
      return Rectangle.fromDegrees(value.west, value.south, value.east, value.north)
    } else if (hasOwn(val, 'x')) {
      const value = val as Cartesian4Option
      return new Rectangle(value.x, value.y, value.z, value.w)
    }
  }

  if (isFunction(val)) {
    return new CallbackProperty(val, isConstant)
  }

  return undefined
}

/**
 * 对象或数组转 Cesium.BoundingRectangle。
 * @param {Object} val
 * @returns {Cesium.BoundingRectangle}
 * @example
 * const options = [0, 0, 100, 100]
 * // const options = {x: 0, y: 0, width: 100, height: 100}
 * const boundingRectangle = makeBoundingRectangle(options)
 */
export function makeBoundingRectangle(
  val: CesiumNative.BoundingRectangle | CesiumNative.CallbackProperty | BoundingRectangleOption | Array<number> | AnyFunction,
  isConstant = false
): CesiumNative.BoundingRectangle | CesiumNative.CallbackProperty {
  const { BoundingRectangle, CallbackProperty } = Cesium

  if (val instanceof BoundingRectangle || val instanceof CallbackProperty) {
    return val
  }

  if (isPlainObject(val) && hasOwn(val, 'x')) {
    const value = val as BoundingRectangleOption
    return new BoundingRectangle(value.x, value.y, value.width, value.height)
  }

  if (isArray) {
    return new BoundingRectangle(val[0], val[1], val[2], val[3])
  }

  if (isFunction(val)) {
    return new CallbackProperty(val, isConstant)
  }

  return undefined
}

/**
 * 普通对象 {normal: number, distance: number} 转 Cesium.Plane 对象。
 * @param {Object} val
 * @returns {Plane}
 */
export function makePlane(
  val: CesiumNative.CallbackProperty | CesiumNative.Plane | PlaneOption | Array<any> | AnyFunction,
  isConstant = false
): CesiumNative.CallbackProperty | CesiumNative.Plane | CesiumNative.PlaneGraphics {
  const { Cartesian3, Plane, PlaneGraphics, CallbackProperty } = Cesium

  // Entiy 和 PlaneGraphics 都有个 plane 属性 要区别一下
  if (val instanceof PlaneGraphics || val instanceof Plane || val instanceof CallbackProperty) {
    return val
  }

  if (isPlainObject(val) && hasOwn(val, 'normal')) {
    const value = val as PlaneOption
    Cartesian3.normalize(makeCartesian3(value.normal) as CesiumNative.Cartesian3, value.normal as CesiumNative.Cartesian3)
    return new Plane(value.normal as CesiumNative.Cartesian3, value.distance)
  }

  if (isArray(val)) {
    const point3D = makeCartesian3(val[0]) as CesiumNative.Cartesian3
    const normalizePoint3D = Cartesian3.normalize(point3D, new Cartesian3())
    return new Plane(normalizePoint3D, val[1])
  }

  if (isFunction(val)) {
    return new CallbackProperty(val, isConstant)
  }

  return undefined
}

/**
 * 普通对象转平移、旋转、缩放变换对象。
 * @param {*} val
 */
export function makeTranslationRotationScale(
  val: CesiumNative.TranslationRotationScale | CesiumNative.CallbackProperty | TranslationRotationScaleOption | AnyFunction | Array<any>,
  isConstant = false
) {
  const { TranslationRotationScale, CallbackProperty } = Cesium
  if (val instanceof CallbackProperty || val instanceof TranslationRotationScale) {
    return val
  }

  if (isPlainObject(val) && hasOwn(val, 'translation')) {
    const value = val as TranslationRotationScaleOption
    return new TranslationRotationScale(
      makeCartesian3(value.translation) as CesiumNative.Cartesian3,
      makeQuaternion(value.rotation) as CesiumNative.Quaternion,
      makeCartesian3(value.scale) as CesiumNative.Cartesian3
    )
  }

  if (isArray(val)) {
    return new TranslationRotationScale(
      makeCartesian3(val[0]) as CesiumNative.Cartesian3,
      makeQuaternion(val[1]) as CesiumNative.Quaternion,
      makeCartesian3(val[2]) as CesiumNative.Cartesian3
    )
  }

  if (isFunction(val)) {
    return new CallbackProperty(val, isConstant)
  }
  return undefined
}

export function makeOptions(val) {
  const vcInstance = this as VcComponentInternalInstance
  const cmpName = vcInstance.proxy.$options.name
  const result: any = {}
  switch (cmpName) {
    case 'vc-datasource-geojson':
      Object.assign(result, val)
      result && result.markerColor && (result.markerColor = makeColor(result.markerColor))
      result && result.stroke && (result.stroke = makeColor(result.stroke))
      result && result.fill && (result.fill = makeColor(result.fill))
      return result
  }
  return val
}

export function captureScreenshot(viewer: CesiumNative.Viewer) {
  const scene = viewer.scene
  const promise: Promise<string> = new Promise((resolve, reject) => {
    const removeCallback = viewer.scene.postRender.addEventListener(() => {
      removeCallback()
      try {
        const cesiumCanvas = viewer.scene.canvas
        const canvas = cesiumCanvas
        resolve(canvas.toDataURL('image/png'))
      } catch (e) {
        reject(e)
      }
    })
  })

  scene.render(viewer.clock.currentTime)
  return promise
}

export function makeCameraOptions(camera: CameraOption) {
  const { Math: CesiumMath, Rectangle } = Cesium

  let destination: CesiumNative.Cartesian3 | CesiumNative.Rectangle = undefined
  let orientation: HeadingPitchRollOption = {}

  if (hasOwn(camera, 'position')) {
    const position = camera.position
    destination = makeCartesian3(position) as CesiumNative.Cartesian3
    if (hasOwn(position, 'lng') && hasOwn(position, 'lat')) {
      orientation = {
        heading: CesiumMath.toRadians(camera.heading || 360),
        pitch: CesiumMath.toRadians(camera.pitch || -90),
        roll: CesiumMath.toRadians(camera.roll || 0)
      }
    } else {
      orientation = {
        heading: camera.heading || 2 * Math.PI,
        pitch: camera.pitch || -Math.PI / 2,
        roll: camera.roll || 0
      }
    }
  } else if (hasOwn(camera, 'rectangle')) {
    const rectangle = camera.retangle
    destination = makeRectangle(rectangle) as CesiumNative.Rectangle
    Rectangle.validate(destination)
    if (hasOwn(rectangle, 'west') && hasOwn(rectangle, 'south') && hasOwn(rectangle, 'east') && hasOwn(rectangle, 'north')) {
      orientation = {
        heading: CesiumMath.toRadians(camera.heading || 360),
        pitch: CesiumMath.toRadians(camera.pitch || -90),
        roll: CesiumMath.toRadians(camera.roll || 0)
      }
    } else {
      orientation = {
        heading: camera.heading || 2 * Math.PI,
        pitch: camera.pitch || -Math.PI / 2,
        roll: camera.roll || 0
      }
    }
  }

  return {
    destination,
    orientation
  }
}

export function setViewerCamera(viewer: CesiumNative.Viewer, camera: CameraOption) {
  const { destination, orientation } = makeCameraOptions(camera)
  viewer.camera.setView({
    destination: destination,
    orientation: orientation
  })
}

export function flyToCamera(viewer: CesiumNative.Viewer, camera: CameraOption, options?) {
  const { destination, orientation } = makeCameraOptions(camera)
  viewer.camera.flyTo({
    destination: options.destination || destination,
    orientation: options.orientation || orientation,
    duration: options.duration,
    complete: options.complete,
    cancel: options.cancel
  })
}
