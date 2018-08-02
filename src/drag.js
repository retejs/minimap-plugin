export function drag(el, getInitial = () => {}, onDrag = () => {}) {
    let start = null;
    let initial = null;

    el.addEventListener('mousedown', e => {
        initial = getInitial();
        start = [e.pageX, e.pageY];
    });
    window.addEventListener('mousemove', e => {
        if (!start) return;
        let [dx, dy] = [start[0] - e.pageX, start[1] - e.pageY];

        onDrag(dx, dy, initial);
    });
    window.addEventListener('mouseup', () => {
        start = null;
    });
}