function inspectElm(parent, data) {
    data.forEach(it=>{
        if (it.type) {
            var elm
            switch (it.type) {
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
            }
        } else if (it.bubble) {
            const elm = document.createElement("div")
            elm.classList.add("bubble")
            elm.innerText = it.labl
            parent.appendChild(elm)
            inspectElm(parent, it.conts)
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

function loadTree(tree, data) {
    data.forEach(it=>{
        if (it.class) {
            const elm = document.createElement("button")
            elm.classList.add("obj")
            elm.classList.add(it.class)
            elm.innerText = it.labl
            elm.onclick = gotoInspector
            tree.appendChild(elm)
        } else {
            const newtree = document.createElement("details")
            newtree.open = it.open
            const labl = document.createElement("summary")
            labl.innerText = it.labl
            newtree.appendChild(labl)
            loadTree(newtree, it.conts)
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
    const displ = document.getElementById("left").className
    const elm = document.getElementById("lefttabs").children[ltabbtns.findIndex(it=>{ return it[1] == displ })]
    if (elm) elm.classList.add("sel")
}

function gotoInspector() {
    document.getElementById("left").className = "displinsp"
    updateLTabSel()
}


function updateTopSel(hash) {
    // Remove selected element if already exists
    const sel = document.querySelector('a.sel')
    if (sel) sel.classList.remove("sel")
    // Set active title
    const newsel = document.getElementById("top").querySelector(`a[href="${hash || "#main"}"]`)
    if (newsel) newsel.classList.add("sel")

    const stage = document.getElementById("stage")
    stage.replaceChildren()
    loadTree(stage, [
        { labl: "Stage", open: true, conts: [
            { labl: "Obj", class: "image" },
            { labl: "Hello", conts: [
                { labl: "Obj", class: "image" },
            ]},
        ]},
    ])
}

{ // When the page loads
    updateTopSel(location.hash)
    const insp = document.getElementById("inspector")
    insp.replaceChildren()
    inspectElm(insp, [
        { labl: "Test", bubble: true, conts: [
            { labl: "Transform", conts: [
                { labl: "Transform", type: "labl" },
                { labl: "Test", type: "btn" },
            ]},
        ]},
    ])
    // Auto generate left tab buttons
    const tabbar = document.getElementById("lefttabs")
    const left = document.getElementById("left")
    ltabbtns.forEach(it=>{
        const btn = document.createElement("button")
        btn.type = "button"
        btn.classList.add("tab")
        btn.innerText = it[0]
        btn.onclick = ()=>{
            left.className = it[1]
            updateLTabSel()
        }
        tabbar.appendChild(btn)
    })
    left.className = ltabbtns[0][1]
    updateLTabSel()
}
// When page navigation occurs
navigation.addEventListener('navigate', ()=>{
    const url = new URL(event.destination.url)
    updateTopSel(url.hash)
})
