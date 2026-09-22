# FPS
A Hack club YSWS (You Ship We Ship) I plan on doing at some point

## Structure
- All files in `base/`, `src/` and `assets/` are the unbuilt webpage
- It gets built to `build/`

## Testing & deploying
1. Ensure `minify` and `python` are installed
2. Run
```bash
cp config.example.py config.py
```
3. Fill in `config.py` with all the required variables
4. Run `./dploy.sh` once, which will set up a virtual environment and install all the required packages and start running the code in a production environment! You can stop this once it starts running, it was only to install the requirements.

- To test: Run `python3 main.py` (inside the virtual environment created at `.venv/`)
- To deploy: Run `./dploy.sh`
