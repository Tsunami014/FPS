from flask import Flask, request, Response, redirect, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from urllib.parse import quote_plus
import os
import requests
import config

os.system("cat src/config.js src/user.js src/objs.js src/screens.js src/main.js | minify --type js -o build/index.js")
os.system("minify base/main.html -o build/index.html")
os.system("minify base/main.css -o build/index.css")
print("Finished building!")

app = Flask(__name__)
limiter = Limiter(get_remote_address, app=app, default_limits=["100 per hour"])

# We reimplement this here to avoid cors issues
@app.route('/api/token', methods=['POST'])
@limiter.limit("10 per 15 minutes")
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
with open("build/index.js") as f:
    JS = f.read()
with open("build/index.css") as f:
    CSS = f.read()
@app.route('/', methods=['GET'])
def mainhtml():
    return HTML
@app.route('/index.js', methods=['GET'])
def mainjs():
    return Response(JS, mimetype='text/javascript')
@app.route('/index.css', methods=['GET'])
def maincss():
    return Response(CSS, mimetype='text/css')

app.run(port="9876")
