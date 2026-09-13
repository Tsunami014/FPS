function MachineID() {
    // Update login.html if this changes
    let mid = localStorage.getItem('umid');
    if (!mid) {
        mid = crypto.randomUUID();
        localStorage.setItem('umid', mid);
    }
    return mid;
}

function login() {
    location.href = `/api/login?id=${MachineID()}`
}
function logout() {
    localStorage.removeItem('hackatime_token')
    location.href = location.pathname + location.search
}

function loggedIn() {
    return localStorage.getItem('hackatime_token') !== null
}

function getTok() {
    return localStorage.getItem('hackatime_token')
}
