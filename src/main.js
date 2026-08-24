function checkMobile() {
    if (window.innerWidth < 500) {
        document.body.classList.add('mobile');
    } else {
        document.body.classList.remove('mobile');
    }
}
checkMobile();
window.addEventListener('resize', checkMobile);


function inspectElm(parent, data) {
    data.forEach(it=>{
        if (it === null) {
            parent.appendChild(document.createElement("hr"))
        } else if (it.type) {
            var elm
            switch (it.type) {
                case "line":
                case "multiline":
                case "col":
                case "num":
                case "opts":
                    elm = document.createElement("label")
                    elm.innerText = it.labl
                    break;
                case "labl":
                    elm = document.createElement("div")
                    elm.innerText = it.labl
                    break;
                case "btn":
                    elm = document.createElement("button")
                    elm.type = "button"
                    elm.innerText = it.labl
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
                        parent.appendChild(inp)
                        break;
                    case "multiline":
                        inp = document.createElement("textarea")
                        parent.appendChild(inp)
                        break;
                    case "col":
                        inp = document.createElement("input")
                        inp.type = "color" // Ew Americans
                        parent.appendChild(inp)
                        break;
                    case "num":
                        inp = document.createElement("input")
                        inp.type = "number"
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

function loadTree(tree, data, parents) {
    data.forEach(it=>{
        if (it.isObj) {
            const sd = it.sceneDef
            const elm = document.createElement("button")
            elm.classList.add("obj")
            elm.classList.add("obj_"+sd.class)
            elm.innerText = sd.labl
            elm.onclick = ()=>{
                const insp = document.getElementById("inspector")
                insp.replaceChildren()
                const titl = document.createElement("div")
                titl.innerText = sd.labl
                titl.classList.add("insptitle")
                titl.classList.add("obj_"+sd.class)
                insp.appendChild(titl)
                if (sd.spec) inspectElm(insp, sd.spec)

                // Remove selected if exists
                document.querySelectorAll('.scnsel').forEach(elm=>{
                    elm.classList.remove("scnsel")
                })
                // Add sel to this and all parents
                elm.classList.add("scnsel")
                parents.forEach(elm=>{ elm.classList.add("scnsel") })
            }
            elm.ondblclick = ()=>{
                // Instantly go to the inspector
                document.getElementById("side").className = "displinsp"
                updateLTabSel()
            }
            tree.appendChild(elm)
        } else {
            const newtree = document.createElement("details")
            newtree.open = it.open
            const labl = document.createElement("summary")
            labl.innerText = it.labl
            newtree.appendChild(labl)
            loadTree(newtree, it.conts, [...parents, labl])
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


function updateTopSel(hash) {
    hash = hash || "#main"
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

    const stage = document.getElementById("stage")
    stage.replaceChildren()
    loadTree(stage, SCREENS[hash.substr(1)], [])
}

{ // When the page loads
    updateTopSel(location.hash)
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
}
// When page navigation occurs
navigation.addEventListener('navigate', ()=>{
    const url = new URL(event.destination.url)
    updateTopSel(url.hash)
})
