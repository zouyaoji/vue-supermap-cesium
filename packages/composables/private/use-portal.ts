import { h, ref, onUnmounted, Teleport } from 'vue'
import { createGlobalNode, removeGlobalNode } from '@vue-cesium/utils/private/global-nodes'
import { portalList } from '@vue-cesium/utils/private/portal'

function isOnGlobalDialog(vm) {
  vm = vm.parent

  while (vm !== void 0 && vm !== null) {
    if (vm.type.name === 'VcGlobalDialog') {
      return true
    }
    if (vm.type.name === 'VcDialog' || vm.type.name === 'VcMenu') {
      return false
    }

    vm = vm.parent
  }

  return false
}

// Warning!
// You MUST specify "inheritAttrs: false" in your component

export default function(vm, innerRef, renderPortalContent, checkGlobalDialog?) {

  let portalEl = null
  const onGlobalDialog = checkGlobalDialog === true && isOnGlobalDialog(vm)
  const portalIsActive = ref(false)

  function showPortal() {
    if (onGlobalDialog === false) {
      portalEl = createGlobalNode()
    }

    portalIsActive.value = true

    // register portal
    portalList.push(vm.proxy)
  }

  function hidePortal() {
    portalIsActive.value = false

    // unregister portal
    const index = portalList.indexOf(vm.proxy)
    if (index > -1) {
      portalList.splice(index, 1)
    }

    if (portalEl !== null) {
      removeGlobalNode(portalEl)
      portalEl = null
    }
  }

  onUnmounted(hidePortal)

  // expose publicly needed stuff for portal utils
  Object.assign(vm.proxy, { __vcPortalInnerRef: innerRef })

  return {
    showPortal,
    hidePortal,

    portalIsActive,

    renderPortal: () =>
    {
      return onGlobalDialog === true
        ? renderPortalContent()
        : portalIsActive.value === true
          ? [h(Teleport, { to: portalEl }, renderPortalContent())]
          : void 0
    }
  }
}
