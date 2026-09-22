from flask import Flask, request, redirect, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from urllib.parse import quote_plus
from pathlib import Path
from PIL import Image
from functools import wraps
import os
import requests
import secrets
import config

import admin
import sqliteLimiter # Only needs to be imported to use sqlite storage in the Limiter!
sqliteLimiter.register() # No-op to stop the linter from complaining

for fold in (
    "build", "build/static", "build/static/imgs"
):
    if not os.path.exists(fold):
        os.mkdir(fold)

print("Minifying website...")
def mkCat(*fs):
    return "cat " + ' '.join("src/"+f for f in fs)

for cmd in (
    mkCat("user.js", "camera.js", "objs.js", "screens.js", "main.js") + " | minify --type js -o build/static/main.js",
    "{ echo 'export function setup(Objs, PAGE) {'; " +
        mkCat("_adminScrns.js") +
    "; echo '}'; } | minify --type js -o build/admin.js",
    "minify base/main.html -o build/index.html",
    "minify base/login.html -o build/static/login.html",
    "minify base/main.css -o build/static/index.css",
    ):
    if os.system(cmd) != 0:
        raise RuntimeError("Command failed!")

print("Minifying images...")
SOURCE = Path("assets")
DEST = Path("build/static/imgs")
for src in SOURCE.rglob("*"):
    if not src.is_file():
        continue

    dest = DEST / src.relative_to(SOURCE).with_suffix(".webp")
    print(f"{src} -> {dest}")
    with Image.open(src) as img:
        # Convert modes WebP can handle reliably
        if img.mode not in ("RGB", "RGBA"):
            if img.mode == "LA" or "transparency" in img.info:
                img = img.convert("RGBA")
            else:
                img = img.convert("RGB")
        img.save(dest, "WEBP", quality=80, method=6)

print("Finished building!")

SECRET = secrets.token_urlsafe(32)
print("\nPaste this into the console for admin access:\n" +
      f"localStorage.setItem('adminKey', `{SECRET}`)\nwindow.location.reload()\n" +
      "\nTo remove admin access run:\n" +
      "localStorage.removeItem('adminKey')\nwindow.location.reload()\n\n"
)

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return "Unauthorized", 401
        if not secrets.compare_digest(auth[7:], SECRET):
            return "Unauthorized", 401
        return fn(*args, **kwargs)
    return wrapper

app = Flask(__name__, static_folder="build/static", static_url_path="")
limiter = Limiter(get_remote_address, app=app,
    storage_uri="sqlite:///limiter.db", default_limits=["200 per minute"])


with open("build/admin.js") as f:
    ADMINJS = f.read()
@app.route('/admin.js', methods=['GET'])
@admin_required
def admnJs():
    return admin.format(ADMINJS)


@app.route('/api/token', methods=['POST'])
@limiter.limit("5 per minute; 15 per 15 minutes; 50 per hour")
def get_token():
    data = request.form
    body = {
        "client_id": config.HACKATIME_APP_UID,
        "client_secret": config.HACKATIME_SECRET,
        "code": data["code"],
        "redirect_uri": config.REDIRECT_URI,
        "grant_type": "authorization_code",
    }
    r = requests.post("https://hackatime.hackclub.com/oauth/token", data=body)
    if r.status_code != 200:
        return jsonify(r.json()), r.status_code

    jsn = r.json()
    usr = requests.get(
        "https://hackatime.hackclub.com/api/v1/authenticated/me",
        headers={"Authorization": f"Bearer {jsn["access_token"]}"},
    ).json()
    admin.rememberUser(usr)
    admin.rememberToken(admin.hash_token(jsn["access_token"]), usr["id"])

    return jsonify(jsn), 200

def login_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return "Unauthorized", 401
        user = admin.getUserInfo(admin.getUserId(auth[7:]))
        if user is None:
            return "Unauthorized", 401
        return fn(user, *args, **kwargs)
    return wrapper

@app.route('/api/me', methods=['GET'])
@login_required
def me(user):
    return jsonify({
        "hackatime_id": user["hkt_id"],
        "slack_id": user["slack_id"],
        "github_username": user["github_username"],
        "emails": user["emails"].split('\n'),
        "balance": user["balance"],
    })

@app.route('/api/login', methods=['GET'])
def login():
    args = request.args
    return redirect(f"https://hackatime.hackclub.com/oauth/authorize?client_id={config.HACKATIME_APP_UID}&redirect_uri={quote_plus(config.REDIRECT_URI)}&response_type=code&scope=profile+read&state={args["id"]}")


with open("build/index.html") as f:
    HTML = f.read()
@app.route('/', methods=['GET'])
def mainhtml():
    return HTML

if __name__ == '__main__':
    app.run(port="9876")
