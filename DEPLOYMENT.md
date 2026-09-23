# Deploy the complete application

This project needs React, the Java API, and MySQL. The production Compose file runs all three plus Caddy for HTTPS on one Linux server. Uploading only `frontend/dist` will not deploy the application.

## 1. Prepare a server and domain

Use a Linux server with Docker Engine and the Docker Compose plugin installed. A practical starting size is 2 CPUs and 4 GB RAM for building and running the stack; measure actual usage after launch.

- Docker installation instructions: https://docs.docker.com/engine/install/ubuntu/
- Point your domain's DNS A record to the server's public IPv4 address. Only add an AAAA record if IPv6 also reaches the server.
- Allow inbound TCP 80 and 443, and restrict SSH (22) to your own IP where possible. MySQL and the Java API do not need public ports.
- Copy this project to the server, or push your current changes to your own Git repository and clone it there. Include `backend`, `frontend`, `db`, `Caddyfile`, and `docker-compose.production.yml`. Do not upload `.env`, `node_modules`, build folders, or local tools.

## 2. Configure credentials on the server

Run these commands in the project directory on the Linux server:

```bash
cp .env.production.example .env.production
chmod 600 .env.production
openssl rand -hex 24
openssl rand -hex 24
openssl rand -base64 32
openssl rand -hex 24
nano .env.production
```

Use the four generated values, in order, for `DB_PASSWORD`, `MYSQL_ROOT_PASSWORD`, `JWT_SECRET`, and `ADMIN_PASSWORD`. Set `SITE_ADDRESS` to your real domain, without `https://`, and `CORS_ALLOWED_ORIGIN` to `https://` followed by that domain. Set your admin username. Keep these credentials private; `.env.production` is ignored by Git.

## 3. Build and start

```bash
docker compose --env-file .env.production -f docker-compose.production.yml config --quiet
docker compose --env-file .env.production -f docker-compose.production.yml up -d --build
docker compose --env-file .env.production -f docker-compose.production.yml ps
docker compose --env-file .env.production -f docker-compose.production.yml logs --tail=100 backend caddy
```

The first build can take several minutes. Caddy obtains and renews HTTPS certificates automatically once DNS and ports are correct: https://caddyserver.com/docs/automatic-https

The backend waits for MySQL readiness before starting: https://docs.docker.com/compose/how-tos/startup-order/

Open `https://YOUR_DOMAIN` and sign in with the `ADMIN_USERNAME` and `ADMIN_PASSWORD` values. The production database starts empty and creates your admin on first startup. Add sellers and products through the admin UI/API before expecting a populated storefront. Public signup creates customers only.

## 4. Verify the actual application

```bash
curl -fsS https://YOUR_DOMAIN/healthz
curl -fsS https://YOUR_DOMAIN/api/storefront/products
docker compose --env-file .env.production -f docker-compose.production.yml exec backend bash -c 'exec 3<>/dev/tcp/127.0.0.1/8081; printf "GET /actuator/health HTTP/1.0\r\nHost: localhost\r\n\r\n" >&3; cat <&3'
```

Expect `ok`, a products JSON response, and a health response with `UP`. Also verify admin login, creating a product with a valid seller, customer signup, cart, checkout, and order history in the browser. Refresh a nested page to verify routing. Container startup alone does not prove these workflows work.

If the API returns 502, inspect backend logs and allow time for Java startup. If HTTPS fails, check DNS, port 80/443 access, and Caddy logs. If login fails, note that changing `ADMIN_PASSWORD` after the account already exists does not reset its password.

## Existing local data

Production uses its own database volume. Existing local records are not copied automatically. Do not run `db/data.sql` on a database you want to keep: it deletes existing records and creates demo accounts. Migrating local data requires a separate reviewed dump/import, including reviewing existing users and credentials.

## Updates, backups, and stopping

After uploading updated code, repeat the `up -d --build` command. Schema changes to `db/schema.sql` only apply on first initialization; existing databases need explicit migrations.

Create a database backup on the Linux server and copy it to separate storage:

```bash
umask 077
docker compose --env-file .env.production -f docker-compose.production.yml exec -T mysql sh -c 'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" mysqldump -u root --single-transaction --no-tablespaces shopping_system' > "shopping-$(date +%F-%H%M%S).sql"
```

Check the command exit status and that the backup contains the expected tables; periodically test restoring to a separate database.

To stop containers while preserving data:

```bash
docker compose --env-file .env.production -f docker-compose.production.yml down
```

Do not add `-v`: that removes persistent database and certificate volumes.

## Run locally instead

Start Docker Desktop and wait until its engine is running. From this project directory, using your existing local `.env`:

```powershell
docker compose --env-file .env up -d --build
docker compose ps
```

Open http://localhost:5173. This local configuration initializes demo data only when its MySQL volume is new. For a public website use the production configuration above.
