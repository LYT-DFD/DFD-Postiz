# Deployment handoff

## Current source

- Repository: https://github.com/LYT-DFD/DFD-Postiz
- Working branch: codex/dfd-self-hosting (use this branch, not main)
- Latest application release: dfd-brand-v1, commit dffe64e3
- Changes include the light lavender/purple palette, light-mode default, Dogfood puppy logos, DFD-Postiz page titles, and the US flag for English.
- Frontend production builds and TypeScript checks passed. The current local Docker deployment was healthy after release; sign-up, sign-in and calendar were visually checked.
- Google OAuth setup was deliberately paused before creating credentials. Google and other unconfigured provider buttons can still appear and fail. Email/password authentication is available. Meta setup remains out of scope unless separately requested.

## Resume from another station

```sh
git clone --branch codex/dfd-self-hosting https://github.com/LYT-DFD/DFD-Postiz.git
cd DFD-Postiz
git remote add upstream https://github.com/gitroomhq/postiz-app.git
git submodule init
git config submodule.libraries/plugins/src/list/public-api.url https://github.com/gitroomhq/public-api.git
git submodule update --recursive
```

The intended next step is a separate deployment on an existing Coolify server, with a public HTTPS hostname. Obtain the private server address, chosen hostname and hosting access from the operator or the existing infrastructure runbook. They are intentionally not stored in this public repository.

The inspected Coolify target reports ARM64 architecture. The current local app image is x86-64. Build natively on the target or publish a verified linux/arm64 image; do not assume a workstation-local image tag exists remotely. Use Dockerfile.dev for a full source build. Local frontend-only build recipes used an existing workstation image and are not portable deployment recipes.

## Deployment steps still required

1. Verify trusted SSH identity and authorized access, using the other station's existing VPN/SSH setup. Do not disable host-key verification. Coolify web login worked, but its browser terminal lost its websocket connection.
2. Check current CPU, memory and disk usage before building. Recorded hardware specifications are not a measurement of free capacity.
3. Create an isolated Coolify project/resource, volumes, network and database. Leave existing applications and their databases untouched. Postiz needs its app, PostgreSQL, Redis and Temporal services; deploy the complete compatible stack rather than just the frontend.
4. Review and adapt the current operational Compose configuration privately. Repository Compose examples are upstream references, not the secret-bearing configuration of the running installation. Do not blindly deploy them over an existing stack.
5. Back up the current installation and agree on a write-free migration window. Transfer its database, persistent uploads/configuration, and necessary runtime secrets through a private channel. Restore into new isolated volumes. Preserve the existing JWT secret where appropriate; never put tokens, database dumps, passwords or environment files in Git.
6. Configure the chosen public HTTPS URL in MAIN_URL, FRONTEND_URL and NEXT_PUBLIC_BACKEND_URL (the latter ends in /api). Keep BACKEND_INTERNAL_URL internal. Enable secure cookies by removing NOT_SECURED rather than setting it to the string false; review the current code's environment handling. Confirm existing server tunnel/proxy routing before making a narrowly scoped route change.
7. Keep databases, Redis and Temporal administration ports private. Review registration policy before public exposure. Do not add an interactive access gate to media or callbacks required by social providers without checking compatibility.
8. Verify the actual deployed version, container/process health, HTTPS login, media uploads, persistence after restart and source-code release link. Then configure one chosen social platform's developer credentials and exact callback URL; Google app login and social-channel connections are distinct flows.
9. Test scheduling deliberately and avoid running two active copies of the same restored scheduling database. Keep the original deployment available for rollback, but stop its workers at cutover to avoid duplicate publishing.

## What Git does not carry

The current user's account, database, uploads, runtime secrets, local Docker images and private backups are not in this repository. Cloning this repository transfers source only. A fresh deployment will not contain existing users or media until a private data migration is completed.

No remote deployment, DNS change, tunnel creation, or data migration has been completed in this handoff. Google OAuth credentials have not been created, and no Google paid trial or billing was activated during setup.
