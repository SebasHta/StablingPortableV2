# Depot Control — Unit Lookup (deploy to Back4App Containers)

A small web app to search a train unit, see where it's stabled, edit its
details, and push the change to your Back4App `TrainLocation` class.

## Files
- `index.html` — the lookup app (loads the Parse SDK from a CDN in the browser).
- `Dockerfile` — serves the folder with nginx on port 80.
- (optional) `depot-train-locations.html` — drop the full depot diagram here too;
  it'll be available at `/depot-train-locations.html` and the footer link will work.

## 1. Put your keys in (optional but convenient)
Open `index.html` and set `appId`, `jsKey`, and `live:true` in the `CONFIG` block
near the top of the script, so the deployed app connects without anyone typing keys.
These are Parse **client** keys and are safe to expose — but **never** put the
Master Key here. If you skip this, users set the keys at runtime via the ⚙ button.

## 2. Make sure the class allows it
In Back4App → Database → `TrainLocation` → **Class-Level Permissions**, allow
**Find/Get** (read) and **Create/Update/Delete** (write) at the level you need.
If writes are blocked, the app shows the exact error.

## 3. Push to GitHub
Create a repo containing these files (Dockerfile at the repo root) and push it.

```
git init
git add .
git commit -m "Depot unit lookup"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

## 4. Deploy on Back4App Containers
1. In Back4App, choose **Container as a Service** and open the **Containers** area.
2. Connect your **GitHub** account and authorize the repo.
3. Create a new app from the repo. Set:
   - **Branch:** `main`
   - **Root directory:** `/` (where the Dockerfile is)
   - **Exposed port:** `80`
   - **Auto-deploy:** on (redeploys on every push)
4. Click create/deploy and watch the build logs. When it's green you'll get a
   public subdomain URL — that's your live app.

## Local test (optional)
```
docker build -t depot-lookup .
docker run -p 8080:80 depot-lookup
# open http://localhost:8080
```

## Login (one shared technician account)

The app opens to a sign-in screen. There's no signup — you create **one** shared
account once, and every technician uses it.

**Recommended — a real Back4App user (`AUTH.mode = "parse"` in index.html):**
1. Create the single user once. On the deployed app, open the browser console and run:
   ```js
   Parse.User.signUp("technician", "YOUR_SHARED_PASSWORD")
     .then(u => console.log("created", u.id))
     .catch(e => console.log(e.message));
   ```
   (Or use any one-off script with the Parse SDK. You only do this once.)
2. Lock the data so the login actually matters: Back4App → Database →
   `TrainLocation` → **Class-Level Permissions** → turn **off** public Find/Get/
   Create/Update/Delete and turn **on** the "requires authentication" option (or
   restrict to a Role your user belongs to). Now only a signed-in session can
   read or write the class.
3. Hand the username + password to your technicians. Done — no per-person accounts.

**Simple mode (`AUTH.mode = "simple"`):** a username/password checked in the
browser. This only hides the screen — anyone can read the credentials from the
page source and the Parse keys still work without it, so it is **not** real
security. Fine for a low-stakes internal display; not for protecting data.

> If you lock the class to "requires authentication", any other page that reads it
> (e.g. the depot diagram) must also sign in, or keep its own public-read access.

- The app talks to Back4App directly from the browser via the Parse JS SDK, so the
  container only serves static files — no server-side secrets.
- Because client keys are visible to anyone with the URL, keep the container behind
  whatever access control you need, and rely on Class-Level Permissions (or a logged-in
  Parse user / Cloud Code) to govern who can write.
