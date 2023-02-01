import { BaseSchemes, CanAssignSignal, GetSchemes, NodeEditor, Root, Scope } from 'rete'
import { Area2D, Area2DInherited, AreaPlugin, RenderData } from 'rete-area-plugin'

import { useBoundingCoordinateSystem } from './coordinate-system'
import { Rect } from './types'

type NodeSize = { width: number, height: number }

type ExpectedScheme = GetSchemes<
    BaseSchemes['Node'] & NodeSize,
    BaseSchemes['Connection']
>

export type MinimapData = {
    type: 'minimap'
    element: HTMLElement
    ratio: number
    nodes: Rect[]
    viewport: Rect
    translate(dx: number, dy: number): void
    point(x: number, y: number): void
}

export type MinimapExtra<Schemes extends ExpectedScheme> =
    | { type: 'unmount', data: { element: HTMLElement } }
    | { type: 'render', data: RenderData<Schemes> | MinimapData }

type IsCompatible<K> = Extract<K, { type: 'render' }> extends { type: 'render', data: infer P } ? CanAssignSignal<P, MinimapData> : false // TODO reusable
type Substitute<K, Schemes extends ExpectedScheme> = IsCompatible<K> extends true ? K : MinimapExtra<Schemes>

export class MinimapPlugin<Schemes extends ExpectedScheme, K> extends Scope<never, Area2DInherited<Schemes, Substitute<K, Schemes>>> {
    element!: HTMLElement
    editor!: NodeEditor<Schemes>
    area!: AreaPlugin<Schemes, MinimapExtra<Schemes>>

    ratio: number
    minDistance: number
    boundViewport: boolean

    constructor(private props?: { minDistance?: number, ratio?: number, boundViewport?: boolean }) {
        super('minimap')

        this.ratio = this.props?.ratio || 1
        this.minDistance = this.props?.minDistance || 2000
        this.boundViewport = Boolean(this.props?.boundViewport)
    }

    setParent(scope: Scope<Substitute<K, Schemes> | Area2D<Schemes>, [Root<Schemes>]>): void {
        super.setParent(scope)

        this.area = this.parentScope<AreaPlugin<Schemes>>(AreaPlugin)
        this.editor = this.area.parentScope<NodeEditor<Schemes>>(NodeEditor)

        this.element = document.createElement('div')
        this.area.container.appendChild(this.element)

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
            } else if (context.type === 'zoomed') {
                this.render()
            }

            return context
        })
    }

    private getNodesRect(): Rect[] {
        return this.editor.getNodes().map(node => {
            const view = this.area.nodeViews.get(node.id)

            if (!view) throw new Error('view')

            return {
                width: node.width,
                height: node.height,
                left: view.position.x,
                top: view.position.y
            }
        })
    }

    private render() {
        const parent = this.parentScope() as any as Scope<MinimapExtra<Schemes>>
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