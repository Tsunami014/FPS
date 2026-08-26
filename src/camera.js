function getExtremalBox(elm) {
    var minL = Infinity
    var maxR = -Infinity
    var minT = Infinity
    var maxB = -Infinity
    if (elm.tagName !== 'DIV') {
        const r = elm.getBoundingClientRect()
        minL = r.left
        maxR = r.right
        minT = r.top
        maxB = r.bottom
    }
    elm.querySelectorAll('*:not(div)').forEach(e => {
        const r = e.getBoundingClientRect()
        minL = Math.min(r.left, minL)
        maxR = Math.max(r.right, maxR)
        minT = Math.min(r.top, minT)
        maxB = Math.max(r.bottom, maxB)
    })
    return { left: minL, top: minT, right: maxR, bottom: maxB }
}

function getRotRect(elm) {
    var thisrot = parseFloat(elm.style.rotate) || 0
    var rot = thisrot
    let curelm = elm.parentElement
    while (curelm && curelm !== document.body) {
        rot += parseFloat(curelm.style.rotate) || 0
        curelm = curelm.parentElement
    }

    elm.style.rotate = (thisrot - rot) + 'deg'
    const b = getExtremalBox(elm)
    elm.style.rotate = thisrot + 'deg'

    const thisr = elm.getBoundingClientRect()
    return {
        rot: rot,
        x: b.left,
        y: b.top,
        width: b.right - b.left,
        height: b.bottom - b.top,
        qx: thisr.left + thisr.width / 2,
        qy: thisr.top + thisr.height / 2,
    }
}

var focussing
function focusOn(elm, zoomon) {
    focussing = { elm: elm, zoomon: zoomon }
    updFocus()
}
const viewp = document.getElementById("viewp")
const mainStage = document.getElementById("main")
const msel = document.getElementById("mainSelect")
function updFocus() {
    viewp.style.rotate = ""
    viewp.style.translate = ""
    const mrect = mainStage.getBoundingClientRect()
    const box = getRotRect(focussing.elm)

    const hypCenterX = box.x + box.width / 2
    const hypCenterY = box.y + box.height / 2
    const rad = box.rot * Math.PI / 180
    const relX = hypCenterX - box.qx
    const relY = hypCenterY - box.qy
    const trueCenterX = box.qx + relX * Math.cos(rad) - relY * Math.sin(rad)
    const trueCenterY = box.qy + relX * Math.sin(rad) + relY * Math.cos(rad)

    msel.style.display = ""
    msel.style.left = (trueCenterX - box.width / 2 - 3 - mrect.x) + 'px'
    msel.style.top = (trueCenterY - box.height / 2 - 3 - mrect.y) + 'px'
    msel.style.width = (box.width + 6) + 'px'
    msel.style.height = (box.height + 6) + 'px'
    msel.style.rotate = `${box.rot}deg`

    const zbox = getRotRect(focussing.zoomon)

    viewp.style.translate = ""
    viewp.style.rotate = -zbox.rot + 'deg'

    const landed = getExtremalBox(focussing.zoomon)

    const dx = (mrect.x + 3) - landed.left
    const dy = (mrect.y + 3) - landed.top
    viewp.style.translate = `${dx}px ${dy}px`
}
