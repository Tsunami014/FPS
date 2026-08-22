from flask import Flask, request, Response, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os
import requests

app = Flask(__name__)
limiter = Limiter(get_remote_address, app=app, default_limits=["100 per hour"])

# We reimplement this here to avoid cors issues
@app.route('/api/token', methods=['POST'])
@limiter.limit("10 per 15 minutes")
def get_token():
    data = request.form
    body = {
        "client_id": data["client_id"],
        "code": data["code"],
        "redirect_uri": data["redirect_uri"],
        "grant_type": "authorization_code",
    }
    r = requests.post("https://hackatime.hackclub.com/oauth/token", data=body)
    return jsonify(r.json()), r.status_code

os.system("cat src/config.js src/user.js src/objs.js src/screens.js src/main.js | minify --type js -o build/index.js")
os.system("minify base/main.html -o build/index.html")
os.system("minify base/main.css -o build/index.css")
print("Finished building!")

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
