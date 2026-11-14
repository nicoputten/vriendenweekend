# Deploying to TrueNAS

The site runs as a **Custom App** on TrueNAS SCALE 25.10 (Goldeye), behind an existing Nginx reverse proxy that also handles the Let's Encrypt certificates.

```
Internet ──https──▶ Nginx reverse proxy (own container, TLS) ──http──▶ vriendenweekend container :8080
                                                                         ├─▶ oauth2-proxy :4180  (login session)
                                                                         └─▶ Dex :5556           (Google / Microsoft)
```

oauth2-proxy and Dex are only needed for the login (see [Login](#login)). Without them the site works as before and simply shows no login button.

In the examples below, `site.example.com` stands for the real domain and `OWNER` for the GitHub owner of this repository. The real values only go into the TrueNAS and proxy configuration, never into this repo.

## First time

1. **Make the image public.** After the first release the image is at `ghcr.io/OWNER/vriendenweekend`. Set the package to _public_ on GitHub (Package settings > Change visibility) so TrueNAS can pull it without credentials.
2. **Create the Custom App.** Apps > Discover Apps > Custom App > _Install via YAML_. Paste [`deploy/truenas-app.yaml`](../deploy/truenas-app.yaml) and replace `OWNER`. Change the host port (default `8088`) if it is taken.
3. **Check it.** `curl http://TRUENAS_IP:8088/healthz` should return `ok`.
4. **DNS.** An A record (or CNAME) for `site.example.com` pointing to your public IP.
5. **Reverse proxy.** Add a server block, see [`deploy/reverse-proxy.example.conf`](../deploy/reverse-proxy.example.conf), and request a certificate for the domain.

## Login

The login ([US-004](stories/US-004-login.md)) adds two containers to the same Custom App. All information pages stay public; only `/leden` (and later the payment overview and cooking sign-up) needs a login. Nothing private goes into this repo: client IDs, secrets and the allow list only live on TrueNAS.

### 1. Config folder on a dataset

Create a folder, for example `/mnt/POOL/apps/vriendenweekend/auth`, and put three files in it (TrueNAS shell; use the tag of the release you deploy):

```sh
cd /mnt/POOL/apps/vriendenweekend/auth
curl -fsSLO https://raw.githubusercontent.com/OWNER/vriendenweekend/vX.Y.Z/deploy/auth/dex.yaml
curl -fsSLO https://raw.githubusercontent.com/OWNER/vriendenweekend/vX.Y.Z/deploy/auth/oauth2-proxy.yaml
nano allowed-emails.txt   # one email address per line
chmod 755 . && chmod 644 *
```

`allowed-emails.txt` is the guest list: only those addresses can log in. Use the address of the Google or Microsoft account people log in with. oauth2-proxy picks up changes to this file without a restart.

### 2. Google OAuth client

1. [Google Cloud console](https://console.cloud.google.com/) > create a project (for example "Vriendenweekend").
2. _APIs & Services > OAuth consent screen_: user type **External**, app name "Vriendenweekend", your email as support and developer contact. Scopes: only `openid`, `email` and `profile` (no verification needed). Then **Publish app**; in "Testing" mode only listed test users can log in.
3. _APIs & Services > Credentials > Create credentials > OAuth client ID_: type **Web application**, authorised redirect URI `https://site.example.com/dex/callback`.
4. Note the client ID and client secret.

### 3. Microsoft app registration

1. [Microsoft Entra admin center](https://entra.microsoft.com/) > _Applications > App registrations > New registration_ (a free Azure account with a personal Microsoft account works).
2. Name "Vriendenweekend", supported account types: **Accounts in any organizational directory and personal Microsoft accounts**, redirect URI platform **Web**: `https://site.example.com/dex/callback`.
3. _Certificates & secrets > New client secret_. Note the secret **value** and the _Application (client) ID_ from the overview. The secret expires (at most 24 months): set a reminder to renew it.
4. _API permissions_: the default `User.Read` is enough.

### 4. Secrets

Generate two random values (any machine with OpenSSL):

```sh
openssl rand -base64 32 | tr -- '+/' '-_'   # OAUTH2_PROXY_COOKIE_SECRET
openssl rand -hex 32                        # OAUTH2_PROXY_CLIENT_SECRET (between oauth2-proxy and Dex)
```

### 5. Update the Custom App

Apps > vriendenweekend > _Edit_ and replace the YAML with the current [`deploy/truenas-app.yaml`](../deploy/truenas-app.yaml). Fill in the domain, the folder from step 1, the image tag and the `CHANGE_ME` values from steps 2 to 4. The reverse proxy needs no new locations: `/oauth2/` and `/dex/` go through the site container. Do add the larger `proxy_buffer_size` from [`reverse-proxy.example.conf`](../deploy/reverse-proxy.example.conf), because the session cookie is a few kB.

### 6. Check

1. `https://site.example.com/` shows an _Inloggen_ button top right (desktop) or in the menu (mobile).
2. Log in with Google and with Microsoft; you land back on the page you came from and the header shows your name.
3. `https://site.example.com/leden` without being logged in sends you to the login page.
4. An account that is not on the list gets "Dit account staat niet op de gastenlijst".

If something fails: Apps > vriendenweekend > _Logs_ for the `oauth2-proxy` and `dex` containers. A Google or Microsoft error about the redirect URI means the URI in step 2 or 3 does not exactly match `https://<domain>/dex/callback`.

To test the whole flow locally without Google or Microsoft: `tests/auth/run.sh` (needs Docker).

## Rolling out a new version

1. Cut a release (see [CONTRIBUTING.md](CONTRIBUTING.md)).
2. On TrueNAS: Apps > vriendenweekend > _Edit_, and set the image tag in the YAML to the new version (for example `:0.2.0`). Saving pulls the new image and restarts the app.

Tip: a fixed version tag is more predictable than `latest`, and rolling back is just changing the tag back.

## Rolling back

Set the image tag in the YAML back to the previous version and save.
