function updateSel(hash) {
    // Remove selected element if already exists
    const sel = document.querySelector('.sel')
    if (sel) sel.classList.remove("sel")
    // Set active title
    const newsel = document.getElementById("top").querySelector(`a[href="${hash || "#main"}"]`)
    if (newsel) newsel.classList.add("sel")
}

{ // When the page loads
    updateSel(location.hash)
}
// When page navigation occurs
navigation.addEventListener('navigate', ()=>{
    const url = new URL(event.destination.url)
    updateSel(url.hash)
})
