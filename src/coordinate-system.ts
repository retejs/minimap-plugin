import { Rect } from './types'
import { nodesBoundingBox } from './utils'

export function useBoundingCoordinateSystem(rects: Rect[], minDistance: number, ratio: number) {
  const boundingBox = nodesBoundingBox(rects)
  const distance = Math.max(minDistance, Math.max(boundingBox.width, boundingBox.height * ratio))
  const originX = (distance - boundingBox.width) / 2 - boundingBox.left
  const originY = (distance / ratio - boundingBox.height) / 2 - boundingBox.top
  const scale = (v: number) => v / distance
  const invert = (v: number) => v * distance

  return {
    origin: {
      x: originX,
      y: originY
    },
    scale,
    invert
  }
}
