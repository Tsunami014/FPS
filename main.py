from flask import Flask, request, redirect, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from urllib.parse import quote_plus
from pathlib import Path
from PIL import Image
import os
import requests
import config
import sqliteLimiter # Only needs to be imported to use sqlite storage in the Limiter!
sqliteLimiter.register() # No-op to stop the linter from complaining

print("Minifying website...")
for cmd in (
    "cat src/user.js src/camera.js src/objs.js src/screens.js src/main.js | minify --type js -o build/index.js",
    "minify base/main.html -o build/index.html",
    "minify base/main.css -o build/index.css",
    ):
    if os.system(cmd) != 0:
        raise RuntimeError("Command failed!")

print("Minifying images...")
SOURCE = Path("assets")
DEST = Path("build/imgs")
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

        dest.parent.mkdir(parents=True, exist_ok=True)
        img.save(dest, "WEBP", quality=80, method=6)

print("Finished building!")

app = Flask(__name__, static_folder="build", static_url_path="")
limiter = Limiter(get_remote_address, app=app,
    storage_uri="sqlite:///limiter.db", default_limits=["200 per minute"])

# We reimplement this here to avoid cors issues
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
    return jsonify(r.json()), r.status_code

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
