import { Rect } from './types'

export function nodesBoundingBox(nodes: Rect[]) {
    const lefts = nodes.map(n => n.left)
    const rights = nodes.map(n => n.left + n.width)
    const tops = nodes.map(n => n.top)
    const bottoms = nodes.map(n => n.top + n.height)
    const left = Math.min(...lefts),
        right = Math.max(...rights),
        top = Math.min(...tops),
        bottom = Math.max(...bottoms);

    return {
        left, right, top, bottom,
        width: right - left,
        height: bottom - top
    }
}
