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
}
// When page navigation occurs
navigation.addEventListener('navigate', ()=>{
    const url = new URL(event.destination.url)
    updateSel(url.hash)
})
