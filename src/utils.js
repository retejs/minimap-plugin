export function nodesBBox(nodes, nv = () => {}) {
    let lefts = nodes.map(n => n.position[0]);
    let rights = nodes.map(n => n.position[0] + nv(n).clientWidth);
    let tops = nodes.map(n => n.position[1]);
    let bottoms = nodes.map(n => n.position[1] + nv(n).clientHeight);
    let left = Math.min(...lefts),
        right = Math.max(...rights),
        top = Math.min(...tops),
        bottom = Math.max(...bottoms);

    return {
        left, right, top, bottom,
        width: right - left,
        height: bottom - top
    }
}