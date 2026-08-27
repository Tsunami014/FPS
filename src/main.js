function checkMobile() {
    if (window.innerWidth < 500) {
        document.body.classList.add('mobile');
    } else {
        document.body.classList.remove('mobile');
    }
}
checkMobile();
window.addEventListener('resize', checkMobile);


const clamp = (num, min, max) => {
    let res = num;
    if (min !== null && min !== undefined) {
        res = Math.max(res, min);
    }
    if (max !== null && max !== undefined) {
        res = Math.min(res, max);
    }
    return res;
};

function inspectElm(parent, data) {
    data.forEach(it=>{
        if (it === null) {
            parent.appendChild(document.createElement("hr"))
        } else if (it.show === false) {
            return;
        } else if (it.type) {
            var elm
            var conn
            if (it.conn) conn = (e)=>{ it.conn(e.target.value) }
            switch (it.type) {
                case "line":
                case "multiline":
                case "col":
                case "num":
                case "opts":
                    elm = document.createElement("label")
                    elm.innerText = it.labl
                    break;
                case "multiopts":
                    elm = document.createElement("fieldset")
                    const labl = document.createElement("legend")
                    labl.innerText = it.labl
                    elm.appendChild(labl)
                    const sels = it.value? it.value : []
                    it.choices.forEach((val,idx)=>{
                        if (idx != 0) {
                            const space = document.createElement("div")
                            space.className = "flexSpacer"
                            elm.appendChild(space)
                        }
                        const innrlabl = document.createElement("label")
                        innrlabl.className = "initem"
                        const opt = document.createElement("input")
                        opt.type = "checkbox"
                        opt.checked = sels.includes(val)
                        innrlabl.appendChild(opt)
                        innrlabl.append(val)
                        elm.appendChild(innrlabl)
                        if (it.conn) {
                            opt.addEventListener('change', ()=>{
                                const index = sels.indexOf(val)
                                if (opt.checked) {
                                    if (index === -1) sels.push(val)
                                } else {
                                    if (index !== -1) sels.splice(index, 1)
                                }
                                it.conn(sels)
                            });
                        }
                    })
                    break;
                case "labl":
                    elm = document.createElement("div")
                    elm.innerText = it.labl
                    break;
                case "btn":
                    elm = document.createElement("button")
                    elm.type = "button"
                    elm.innerText = it.labl
                    if (conn) elm.onclick = conn
                    break;
                default:
                    console.error("Unknown item type:", it.type)
            }
            if (elm) {
                elm.classList.add("item")
                parent.appendChild(elm)
                switch (it.type) {
                    case "line":
                        inp = document.createElement("input")
                        inp.type = "text"
                        if (it.value) inp.value = it.value
                        if (conn) inp.oninput = conn
                        parent.appendChild(inp)
                        break;
                    case "multiline":
                        inp = document.createElement("textarea")
                        if (it.value) inp.value = it.value
                        if (conn) inp.oninput = conn
                        parent.appendChild(inp)
                        break;
                    case "col":
                        inp = document.createElement("input")
                        inp.type = "color" // Ew Americans
                        if (it.value) inp.value = it.value
                        if (conn) inp.oninput = conn
                        parent.appendChild(inp)
                        break;
                    case "num":
                        inp = document.createElement("input")
                        inp.type = "number"
                        if (it.value) inp.value = it.value
                        if (conn) {
                            inp.oninput = (e)=>{
                                var val = e.target.valueAsNumber
                                if (it.bound) {
                                    val = clamp(val, it.bound[0], it.bound[1])
                                }
                                it.conn(val)
                            }
                        }
                        if (it.step) inp.step = it.step
                        if (it.bound) {
                            inp.onchange = (e)=>{
                                e.target.value = clamp(e.target.value, it.bound[0], it.bound[1])
                            }
                        }
                        parent.appendChild(inp)
                        break;
                    case "opts":
                        inp = document.createElement("select")
                        it.choices.forEach(val=>{
                            opt = document.createElement("option")
                            opt.value = val
                            opt.innerText = val
                            inp.appendChild(opt)
                        })
                        if (it.value) inp.value = it.value
                        if (conn) inp.oninput = conn
                        parent.appendChild(inp)
                        break;
                }
            }
        } else if (it.bubble) {
            const elm = document.createElement("div")
            elm.classList.add("bubble")
            elm.innerText = it.labl
            parent.appendChild(elm)
        } else {
            const newbase = document.createElement("details")
            newbase.classList.add("regular")
            const labl = document.createElement("summary")
            labl.innerText = it.labl
            newbase.appendChild(labl)
            inspectElm(newbase, it.conts)
            parent.appendChild(newbase)
        }
    })
}

function deselect() {
    const oldsel = document.querySelector('.scnsel')
    if (oldsel) oldsel.classList.remove("scnsel")
    msel.style.display = "none"
}
function setupClickHandler(elm, it, isObj) {
    elm.onclick = (e)=>{
        if (!elm.classList.contains("scnsel")) {
            e.preventDefault()
        }
        const sd = it.sceneDef

        const insp = document.getElementById("inspector")
        insp.replaceChildren()

        const titl = document.createElement("div")
        titl.innerText = sd.labl
        titl.classList.add("insptitle")
        titl.classList.add("obj_"+sd.class)
        insp.appendChild(titl)

        if (sd.spec) inspectElm(insp, sd.spec)

        deselect()
        elm.classList.add("scnsel")
        focusOn(it.mainobj, isObj? it.mainobj.parentElement : it.mainobj)
    }
    if (isObj) {
        elm.ondblclick = ()=>{
            // Instantly go to the inspector
            document.getElementById("side").className = "displinsp"
            updateLTabSel()
        }
    }
}
function loadTree(tree, data, parentStage) {
    data.forEach(it=>{
        if (it.constructor.isObj) {
            parentStage.appendChild(it.mainobj)
            const sd = it.sceneDef
            const elm = document.createElement("button")
            elm.classList.add("obj")
            elm.classList.add("obj_"+sd.class)
            elm.innerText = sd.labl
            setupClickHandler(elm, it, true)
            tree.appendChild(elm)
        } else {
            const newtree = document.createElement("details")
            newtree.open = it.open
            const labl = document.createElement("summary")
            labl.innerText = it.name
            newtree.appendChild(labl)
            parentStage.appendChild(it.mainobj)
            setupClickHandler(labl, it, false)
            loadTree(newtree, it.conts, it.mainobj)
            tree.appendChild(newtree)
        }
    })
}


const ltabbtns = [
    ["Scene", "displscene"],
    ["Inspector", "displinsp"]
]
function updateLTabSel() {
    // Remove selected if exists
    const sel = document.querySelector('button.sel')
    if (sel) sel.classList.remove("sel")
    // Set new selected
    const displ = document.getElementById("side").className
    const elm = document.getElementById("sidetabs").children[ltabbtns.findIndex(it=>{ return it[1] == displ })]
    if (elm) elm.classList.add("sel")
}


const stage = document.getElementById("stage")
const overl = document.getElementById("overl")
function updateTopSel(hash) {
    overl.classList.add("hide")

    hash = hash || "#home"
    // Remove selected element if already exists
    const sel = document.querySelector('a.sel')
    if (sel) sel.classList.remove("sel")
    // Set active title
    const newsel = document.getElementById("top").querySelector(`a[href="${hash}"]`)
    if (newsel) newsel.classList.add("sel")

    document.getElementById("inspector").replaceChildren()

    // Instantly go to the scene
    document.getElementById("side").className = "displscene"
    updateLTabSel()

    stage.replaceChildren()
    viewp.replaceChildren(msel)
    var scrn = SCREENS[hash.substr(1)]
    if (!scrn) scrn = SCREENS["404"]
    loadTree(stage, scrn[1], viewp)

    setTimeout(() => {
        overl.classList.remove("hide")
        const def = document.getElementById("default")
        focusOn(null, def, true)
    }, 100)
}

{ // Stuff that runs instantly
    // Auto generate top tabs
    const toptabs = document.getElementById("top")
    for (const [ref, val] of Object.entries(SCREENS)) {
        if (val[0] === null) continue;
        const t = document.createElement("a")
        t.href = "#"+ref
        t.innerText = val[0]
        toptabs.appendChild(t)
    }
    // Auto generate side tab buttons
    const tabbar = document.getElementById("sidetabs")
    const side = document.getElementById("side")
    ltabbtns.forEach(it=>{
        const btn = document.createElement("button")
        btn.type = "button"
        btn.classList.add("tab")
        btn.innerText = it[0]
        btn.onclick = ()=>{
            side.className = it[1]
            updateLTabSel()
        }
        tabbar.appendChild(btn)
    })
    side.className = ltabbtns[0][1]
    updateLTabSel()
    mainStage.addEventListener('click', deselect)

    // Update the main page for the current page
    updateTopSel(location.hash)
}
// When page navigation occurs
navigation.addEventListener('navigate', ()=>{
    const url = new URL(event.destination.url)
    updateTopSel(url.hash)
})
