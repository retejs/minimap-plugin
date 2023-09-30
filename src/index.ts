import { BaseSchemes, GetSchemes, NodeEditor, Root, Scope } from 'rete'
import { Area2D, AreaPlugin, RenderSignal } from 'rete-area-plugin'

import { useBoundingCoordinateSystem } from './coordinate-system'
import { Rect } from './types'

type NodeSize = { width: number, height: number }

type ExpectedScheme = GetSchemes<
  BaseSchemes['Node'] & NodeSize,
  BaseSchemes['Connection']
>
export type Transform = {
  x: number
  y: number
  k: number
}
/**
 * Extra signal types for minimap rendering
 * @priority 10
 */
export type MinimapExtra =
  | RenderSignal<'minimap', {
    ratio: number
    nodes: Rect[]
    viewport: Rect
    start(): Transform
    translate(dx: number, dy: number): void
    point(x: number, y: number): void
  }>

/**
 * Minimap plugin, triggers rendering of the minimap
 * @priority 9
 * @listens nodetranslated
 * @listens nodecreated
 * @listens noderemoved
 * @listens translated
 * @listens resized
 * @listens noderesized
 * @listens zoomed
 * @emits render
 */
export class MinimapPlugin<Schemes extends ExpectedScheme> extends Scope<never, [Area2D<Schemes> | MinimapExtra, Root<Schemes>]> {
  element!: HTMLElement
  editor!: NodeEditor<Schemes>
  area!: AreaPlugin<Schemes, MinimapExtra>

  ratio: number
  minDistance: number
  boundViewport: boolean

  /**
   * @constructor
   * @param props Plugin properties
   * @param props.ratio minimap ratio. Default is `1`
   * @param props.minDistance minimap minimum distance. Default is `2000`
   * @param props.boundViewport whether to bound the mini-viewport to the minimap. Default is `false`
   */
  constructor(private props?: { minDistance?: number, ratio?: number, boundViewport?: boolean }) {
    super('minimap')

    this.ratio = this.props?.ratio || 1
    this.minDistance = this.props?.minDistance || 2000
    this.boundViewport = Boolean(this.props?.boundViewport)
  }

  setParent(scope: Scope<MinimapExtra | Area2D<Schemes>, [Root<Schemes>]>): void {
    super.setParent(scope)

    this.area = this.parentScope<AreaPlugin<Schemes>>(AreaPlugin)
    this.editor = this.area.parentScope<NodeEditor<Schemes>>(NodeEditor)

    this.element = document.createElement('div')
    this.area.container.appendChild(this.element)

    // eslint-disable-next-line complexity
    this.addPipe(context => {
      if (!('type' in context)) return context

      if (context.type === 'render' && context.data.type === 'node') {
        this.render()
      } else if (context.type === 'nodetranslated') {
        this.render()
      } else if (context.type === 'nodecreated') {
        this.render()
      } else if (context.type === 'noderemoved') {
        this.render()
      } else if (context.type === 'translated') {
        this.render()
      } else if (context.type === 'resized') {
        this.render()
      } else if (context.type === 'noderesized') {
        this.render()
      } else if (context.type === 'zoomed') {
        this.render()
      }

      return context
    })
  }

  private getNodesRect(): Rect[] {
    return this.editor.getNodes().map(node => {
      const view = this.area.nodeViews.get(node.id)

      if (!view) return null

      return {
        width: node.width,
        height: node.height,
        left: view.position.x,
        top: view.position.y
      }
    }).filter(Boolean) as Rect[]
  }

  private render() {
    const parent = this.parentScope() as any as Scope<MinimapExtra>
    const nodes = this.getNodesRect()
    const { transform } = this.area.area
    const { clientWidth: width, clientHeight: height } = this.area.container
    const { minDistance, ratio } = this
    const viewport: Rect = {
      left: -transform.x / transform.k,
      top: -transform.y / transform.k,
      width: width / transform.k,
      height: height / transform.k
    }
    const rects = this.boundViewport ? [...nodes, viewport] : nodes
    const { origin, scale, invert } = useBoundingCoordinateSystem(rects, minDistance, ratio)

    parent.emit({
      type: 'render',
      data: {
        type: 'minimap',
        element: this.element,
        ratio,
        start: () => transform,
        nodes: nodes.map(node => ({
          left: scale(node.left + origin.x),
          top: scale(node.top + origin.y),
          width: scale(node.width),
          height: scale(node.height)
        })),
        viewport: {
          left: scale(viewport.left + origin.x),
          top: scale(viewport.top + origin.y),
          width: scale(viewport.width),
          height: scale(viewport.height)
        },
        translate: (dx, dy) => {
          const { x, y, k } = transform

          this.area.area.translate(x + invert(dx) * k, y + invert(dy) * k)
        },
        point: (x, y) => {
          const areaCoordinatesPoint = {
            x: (origin.x - invert(x)) * transform.k,
            y: (origin.y - invert(y)) * transform.k
          }
          const center = {
            x: areaCoordinatesPoint.x + width / 2,
            y: areaCoordinatesPoint.y + height / 2
          }

          this.area.area.translate(center.x, center.y)
        }
      }
    })
  }
}
