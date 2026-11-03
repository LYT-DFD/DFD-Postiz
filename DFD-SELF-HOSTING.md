# DFD-Postiz self-hosting

DFD-Postiz extends open-source Postiz for self-hosted publishing. Keep the upstream AGPL-3.0 license and notices, publish modifications and corresponding source as required, and track deployed builds by source revision.

## Build

From the app checkout, with Docker using Linux containers:

```powershell
git submodule init
git config submodule.libraries/plugins/src/list/public-api.url https://github.com/gitroomhq/public-api.git
git submodule update --recursive
docker build --progress=plain -f Dockerfile.dev --build-arg NEXT_PUBLIC_VERSION=dfd-local -t dfd-postiz:local .
if ($LASTEXITCODE -ne 0) { throw 'Build failed; keep the upstream service running.' }
```

Dockerfile.dev is used by the upstream container workflow. The legacy docker-build.sh references stages absent from this Dockerfile.

## Deploy

Only after a successful build, change the existing deployment's postiz service image in docker-compose.yaml:

```diff
-    image: ghcr.io/gitroomhq/postiz-app:latest
+    image: dfd-postiz:local
```

Preserve existing ports, volumes and runtime settings. Back up the database and persistent data before deploying a newer revision: the upstream startup command runs Prisma db push and can update the schema.

From the deployment's Compose directory:

```powershell
docker image inspect dfd-postiz:local --format '{{.Id}}'
docker compose config --quiet
docker compose up -d --no-deps --pull never postiz
docker compose ps postiz
```

Check the configured local service URL after startup. On a build failure, leave Compose and the running upstream service unchanged. On a deployment failure, restore the upstream image line and rerun the up command. Image rollback does not reverse schema changes; restore the pre-deployment backup if needed.

## Secrets

Store credentials only in untracked runtime configuration. Git and Docker exclusions cover .env variants, .secrets, and private keys. Never copy an existing deployment Compose file containing secrets into this public app repository. Inspect staged changes before pushing.

Keep Meta, Facebook and Instagram app credentials empty until provider setup is explicitly requested. Postiz Cloud activation is unnecessary.

## Updates

Keep origin pointed at the fork and upstream at https://github.com/gitroomhq/postiz-app.git. Fetch upstream and review updates on a branch before rebuilding. Use a distinct immutable image tag for each production source revision rather than overwriting a deployed tag.
