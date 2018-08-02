import './style.sass';
import Vue from 'vue';
import { drag } from './drag';
import { nodesBBox } from './utils';
import template from './map.pug';

const SIZE = {
    SMALL: 'small',
    MIDDLE: 'middle',
    LARGE: 'large'
}

function install(editor, params) {
    params.enable = params.enable || true;
    params.size = params.size || SIZE.MIDDLE;

    const el = document.createElement('div');

    el.innerHTML = template();
    editor.view.container.appendChild(el);

    var app = new Vue({
        data: {
            params: params,
            nodes: editor.nodes,
            views: editor.view.nodes,
            transform: { ox:0, oy: 0, scale: () => 1, invert: () => 1 }
        },
        mounted() {
            this.$watch('params.size', this.updateTransform);
            
            drag(this.$refs.viewport, () => {
                return { ...editor.view.area.transform }
            }, (dx, dy, initial) => {
                let { x, y, k } = initial;
                let { invert } = this.transform;
        
                editor.view.area.translate(x + k * invert(dx), y + k * invert(dy));
            })
        },
        methods: {
            mapClass() {
                return {
                    [this.params.size]: true
                }
            },
            updateTransform() {
                let { left, top, width, height } = nodesBBox(this.nodes, this.nv);
                let space = Math.max(2000, Math.max(width, height));
                let w = this.$refs.area.clientWidth;
                let h = this.$refs.area.clientHeight;
                let ox = (space - width) / 2 - left;
                let oy = (space * h / w - height) / 2 - top;

                this.transform = {
                    scale: v => v * (w / space),
                    invert: v => v / (w / space),
                    ox, 
                    oy
                }
            },
            px(v) {
                return v+'px';
            },
            nv(node) {
                return this.views.get(node).el;
            },
            nodeStyle(node) {
                let { ox, oy, scale } = this.transform;

                return {
                    left: this.px(scale(ox + node.position[0])), 
                    top: this.px(scale(oy + node.position[1])), 
                    width: this.px(scale(this.nv(node).clientWidth)), 
                    height: this.px(scale(this.nv(node).clientHeight))
                }
            },
            viewportStyle() {
                let { ox, oy, scale } = this.transform;
                let { x, y, k } = editor.view.area.transform;
                let width = editor.view.container.clientWidth;
                let height = editor.view.container.clientHeight;
                
                return {
                    left: this.px(scale(ox - x / k)), 
                    top: this.px(scale(oy - y / k)), 
                    width: this.px(scale(width / k)), 
                    height: this.px(scale(height / k))
                }
            }
        }
    }).$mount(el);

    editor.on('nodetranslated nodecreated noderemoved translated zoomed', app.updateTransform.bind(app));
    window.addEventListener('resize', app.updateTransform.bind(app))
}

export default {
    install,
    ...SIZE
}