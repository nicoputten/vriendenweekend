# Deploying to TrueNAS

The site runs as a **Custom App** on TrueNAS SCALE 25.10 (Goldeye), behind an existing Nginx reverse proxy that also handles the Let's Encrypt certificates.

```
Internet ──https──▶ Nginx reverse proxy (own container, TLS) ──http──▶ vriendenweekend container :8080
```

In the examples below, `site.example.com` stands for the real domain and `OWNER` for the GitHub owner of this repository. The real values only go into the TrueNAS and proxy configuration, never into this repo.

## First time

1. **Make the image public.** After the first release the image is at `ghcr.io/OWNER/vriendenweekend`. Set the package to _public_ on GitHub (Package settings > Change visibility) so TrueNAS can pull it without credentials.
2. **Create the Custom App.** Apps > Discover Apps > Custom App > _Install via YAML_. Paste [`deploy/truenas-app.yaml`](../deploy/truenas-app.yaml) and replace `OWNER`. Change the host port (default `8088`) if it is taken.
3. **Check it.** `curl http://TRUENAS_IP:8088/healthz` should return `ok`.
4. **DNS.** An A record (or CNAME) for `site.example.com` pointing to your public IP.
5. **Reverse proxy.** Add a server block, see [`deploy/reverse-proxy.example.conf`](../deploy/reverse-proxy.example.conf), and request a certificate for the domain.

## Rolling out a new version

1. Cut a release (see [CONTRIBUTING.md](CONTRIBUTING.md)).
2. On TrueNAS: Apps > vriendenweekend > _Edit_, and set the image tag in the YAML to the new version (for example `:0.2.0`). Saving pulls the new image and restarts the app.

Tip: a fixed version tag is more predictable than `latest`, and rolling back is just changing the tag back.

## Rolling back

Set the image tag in the YAML back to the previous version and save.
