function MachineID() {
    let mid = localStorage.getItem('umid');
    if (!mid) {
        mid = crypto.randomUUID();
        localStorage.setItem('umid', mid);
    }
    return mid;
}

function connectHT() {
    window.location.href = `/api/login?id=${MachineID()}`;
}

(async () => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    if (code) {
        const state = url.searchParams.get("state");
        if (state !== MachineID()) {
            throw new Error("Incorrect state key!");
        }

        const response = await fetch("/api/token", {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: (new URLSearchParams({ code: code })).toString()
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const token = (await response.json()).access_token;
        localStorage.setItem('hackatime_token', token);
        console.log('Success:', token);

        url.searchParams.delete("code");
        url.searchParams.delete("state");
        history.replaceState({}, "", url);
    }
})()

function loggedIn() {
    return localStorage.getItem('hackatime_token') !== null
}
