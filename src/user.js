function connectHT() {
    window.location.href = `https://hackatime.hackclub.com/oauth/authorize?client_id=${HACKATIME_APP_UID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=profile+read&state=${MachineID()}`;
}

(async () => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    if (code) {
        const state = url.searchParams.get("state");
        if (state !== MachineID()) {
            throw new Error("Incorrect state key!");
        }

        const body = new URLSearchParams({
            client_id: HACKATIME_APP_UID,
            code: code,
            redirect_uri: REDIRECT_URI,
        });

        const response = await fetch("/api/token", {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString()
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
