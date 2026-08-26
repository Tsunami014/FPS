/* If you must know, this was SO INCREDIBLY PAINFUL.
 * I used AI but it was SO TERRIBLE.
 * It took me figuring out most of it and it doing the last small fixes for this to actually come together */

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

var focussing = { elm: null, zoomon: null }
function focusOn(elm, zoomon, instant=false) {
    focussing = { elm: elm, zoomon: zoomon }
    updFocus(instant)
}
const viewp = document.getElementById("viewp")
const mainStage = document.getElementById("main")
const msel = document.getElementById("mainSelect")
function updFocus(instant=false) {
    if (!focussing.zoomon) {
        msel.style.display = "none"
        return;
    }

    const prevRotate = viewp.style.rotate
    const prevTranslate = viewp.style.translate
    const prevScale = viewp.style.scale

    viewp.style.transition = 'none'
    viewp.style.rotate = ""
    viewp.style.translate = ""
    viewp.style.scale = ""

    const mrect = mainStage.getBoundingClientRect()

    if (focussing.elm) {
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
    } else {
        msel.style.display = "none"
    }

    const zbox = getRotRect(focussing.zoomon)

    const targetRotate = -zbox.rot + 'deg'
    viewp.style.rotate = targetRotate

    const availWidth = mrect.width - 6
    const availHeight = mrect.height - 6
    const targetScale = Math.min(availWidth / zbox.width, availHeight / zbox.height)
    viewp.style.scale = targetScale

    const landed = getExtremalBox(focussing.zoomon)

    const landedCenterX = (landed.left + landed.right) / 2
    const landedCenterY = (landed.top + landed.bottom) / 2
    const targetCenterX = mrect.x + mrect.width / 2
    const targetCenterY = mrect.y + mrect.height / 2

    const targetTranslate = `${targetCenterX - landedCenterX}px ${targetCenterY - landedCenterY}px`

    if (!instant) {
        viewp.style.rotate = prevRotate
        viewp.style.translate = prevTranslate
        viewp.style.scale = prevScale
        void viewp.offsetWidth // force layout

        viewp.style.transition = ''
    }
    viewp.style.rotate = targetRotate
    viewp.style.translate = targetTranslate
    viewp.style.scale = targetScale
    if (instant) {
        void viewp.offsetWidth // force layout
        viewp.style.transition = ''
    }
}
