const mainStage = document.getElementById("main")

var camtrans = {
    x: 0, y: 0, rot: 0, scale: 1
}
function applyCamera() {
    mainStage.style.transform =
        `translate(${camtrans.x}px, ${camtrans.y}px) rotate(${camtrans.rot}deg) scale(${camtrans.scale})`
}

function getRotRect(elm) {
    var rot = 0
    let curelm = elm
    while (curelm && curelm !== document.body) {
        const m = curelm.style.rotate.match(/^([0-9.\-]+)deg$/)
        if (m) rot += parseFloat(m[1])
        curelm = curelm.parentElement
    }

    const marker = document.createElement('div');
    marker.id = "positionP"
    elm.appendChild(marker);
    const mrect = marker.getBoundingClientRect();
    elm.removeChild(marker);

    const s = getComputedStyle(elm)
    const parentr = mainStage.getBoundingClientRect()
    return {
        rot: rot,
        x: mrect.left - parentr.x,
        y: mrect.top - parentr.y,
        width: parseFloat(s.width),
        height: parseFloat(s.height),
    }
}

var focussing;
function focusOn(elm, zoomon) {
    focussing = { elm: elm, zoomon: zoomon }
    updFocus()
}
function updFocus() {
    const sel = document.getElementById("mainSelect")
    sel.style.display = "block"
    const srr = getRotRect(focussing.elm)
    sel.style.translate = `${srr.x-1}px ${srr.y-1}px`
    sel.style.rotate = `${srr.rot}deg`
    sel.style.width = `${srr.width+2}px`
    sel.style.height = `${srr.height+2}px`

    const zrr = getRotRect(focussing.zoomon)
    const mainR = mainStage.getBoundingClientRect()
    camtrans = {
        x: -zrr.x, y: -zrr.y,
        rot: -zrr.rot,
        scale: 1//Math.min(mainR.width / zrr.width, mainR.height / zrr.height),
    }
    applyCamera()
}
