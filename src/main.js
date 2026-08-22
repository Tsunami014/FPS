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


function updateSel(hash) {
    // Remove selected element if already exists
    const sel = document.querySelector('.sel')
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
    updateSel(location.hash)
    const right = document.getElementById("right")
    right.replaceChildren()
    inspectElm(right, [
        { labl: "Test", bubble: true, conts: [
            { labl: "Transform", conts: [
                { labl: "Transform", type: "labl" },
                { labl: "Test", type: "btn" },
            ]},
        ]},
    ])
}
// When page navigation occurs
navigation.addEventListener('navigate', ()=>{
    const url = new URL(event.destination.url)
    updateSel(url.hash)
})
