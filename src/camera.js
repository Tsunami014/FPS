const mainStage = document.getElementById("main")

function getRotRect(elm) {
    var thisrot = 0
    {
        const m = elm.style.rotate.match(/^([0-9.\-]+)deg$/)
        if (m) thisrot = parseFloat(m[1])
    }
    var rot = thisrot
    let curelm = elm.parentElement
    while (curelm && curelm !== document.body) {
        const m = curelm.style.rotate.match(/^([0-9.\-]+)deg$/)
        if (m) rot += parseFloat(m[1])
        curelm = curelm.parentElement
    }
    elm.style.rotate = (thisrot - rot) + 'deg'

    var minL = Infinity
    var maxR = -Infinity
    var minT = Infinity
    var maxB = -Infinity
    if (elm.tagName !== 'DIV') {
        const thisr = elm.getBoundingClientRect()
        minL = thisr.left
        maxR = thisr.right
        minT = thisr.top
        maxB = thisr.bottom
    }
    elm.querySelectorAll('*:not(div)').forEach(e=>{
        const r = e.getBoundingClientRect()
        minL = Math.min(r.left, minL)
        maxR = Math.max(r.right, maxR)
        minT = Math.min(r.top, minT)
        maxB = Math.max(r.bottom, maxB)
    })

    elm.style.rotate = thisrot + 'deg'

    const parentr = mainStage.getBoundingClientRect()
    return {
        rot: rot,
        x: minL,
        y: minT,
        width: maxR - minL,
        height: maxB - minT,
    }
}

var focussing
function focusOn(elm, zoomon) {
    focussing = { elm: elm, zoomon: zoomon }
    updFocus()
}
function updFocus() {
    const box = getRotRect(focussing.elm)
    const sel = document.getElementById("mainSelect")
    sel.style.display = ""
    sel.style.left = (box.x-3) + 'px'
    sel.style.top = (box.y-3) + 'px'
    sel.style.width = box.width + 'px'
    sel.style.height = box.height + 'px'
    sel.style.rotate = `${box.rot}deg`
}
