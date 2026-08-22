const HACKATIME_APP_UID = "sCU1KloTqYS_qja4FY329gdhTes36ESLQA40Ypb07kA"
const REDIRECT_URI = "http://127.0.0.1:9876"

function MachineID() {
    let mid = localStorage.getItem('umid');
    if (!mid) {
        mid = crypto.randomUUID();
        localStorage.setItem('umid', mid);
    }
    return mid;
}
