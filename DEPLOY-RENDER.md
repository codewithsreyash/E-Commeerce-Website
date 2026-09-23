# Deploy this project on Render

Use the root `render.yaml` Blueprint. It creates a React static site, a Spring Boot Docker web service, and a private MySQL Docker service with a persistent disk. Render supplies HTTPS URLs; no custom domain or local Docker engine is required.

This configuration uses paid 1 CPU / 2 GB instances for both MySQL and Java, plus 10 GB of disk. Review the current estimate Render displays before deploying. It is not an entirely free setup. MySQL is self-hosted on a private service, not Render's managed PostgreSQL database.

## 1. Push the project to GitHub

The local Git remote is `https://github.com/codewithsreyash/E-Commeerce-Website.git`.
Commit and push the intended current application changes together with `render.yaml`, `db/Dockerfile`, and the updated backend properties. Do not commit `.env` files containing credentials. The blueprint must exist on the branch you select in Render.

## 2. Create the Blueprint

1. Sign in at https://dashboard.render.com and connect your GitHub account.
2. Choose **New > Blueprint** and select the repository and branch.
3. Use the root `render.yaml` file.
4. Enter the prompted values:

| Service / variable | Initial value |
| --- | --- |
| API: `ADMIN_PASSWORD` | A new strong admin password; save it privately |
| API: `CORS_ALLOWED_ORIGIN` | `https://example.invalid` temporarily |
| Frontend: `VITE_API_BASE_URL` | `https://example.invalid/api` temporarily |

5. Review the paid services and disk estimate, then deploy.

The temporary URLs deliberately do not work. Replace them with the actual URLs in step 3 before using the site. Render generates the database passwords and JWT key, and connects the API to MySQL using the private hostname automatically.

## 3. Connect the public URLs

After Render creates the services, copy the actual public URLs from their dashboards. Do not guess them: Render may append a suffix to a service name.

1. Open `shopping-frontend` > **Environment**. Set `VITE_API_BASE_URL` to the API's HTTPS URL followed by `/api`, for example `https://shopping-api-xxxx.onrender.com/api`. Save and rebuild/redeploy the frontend. Vite embeds this value at build time, so a rebuild is required.
2. Open `shopping-api` > **Environment**. Set `CORS_ALLOWED_ORIGIN` to the frontend's exact HTTPS origin, for example `https://shopping-frontend-xxxx.onrender.com`, with no trailing slash or path. Save and redeploy the API.
3. Wait for MySQL and the API to become healthy. If the first API deploy failed because MySQL was still initializing, trigger **Manual Deploy > Deploy latest commit** for the API after MySQL is running.

Do not set `DB_URL` to your local database address. The Blueprint supplies `DB_HOST` and the backend constructs its JDBC URL from it.

## 4. Verify and use the site

- Visit `https://YOUR_API_URL/actuator/health`: expect `{"status":"UP"}`.
- Visit `https://YOUR_API_URL/api/storefront/products`: expect JSON, initially with no products.
- Open the frontend URL, log in as `admin` with the password you chose, and refresh a nested page to check routing.
- Create a seller via the admin API (`POST /api/admin/sellers`) before creating products that reference its seller ID. The seller API requires the admin bearer token; its body includes `companyName`, `email`, `password`, and `phone`.
- Register a customer and verify browsing, cart, checkout, and order history after adding products.

Deployment creates an empty database and the configured admin account. Local data is not uploaded. The destructive demo seed `db/data.sql` is intentionally excluded. Keep the disk attached, arrange logical MySQL backups, and apply future schema changes as migrations: initialization SQL only runs on an empty disk. Changing the admin environment password later does not reset an existing account.

## Using Netlify or Vercel for just the frontend

You can keep this Java API and MySQL on Render and host the React frontend elsewhere:

- Select `frontend` as the frontend project root.
- Build with `npm run build`; publish `dist`.
- Set `VITE_API_BASE_URL` to the Render API's HTTPS URL plus `/api` before building.
- Set the Render API's `CORS_ALLOWED_ORIGIN` to the actual frontend origin.
- Configure the frontend host's SPA fallback to `/index.html` so refreshing routes works.

The Render Blueprint already configures the SPA fallback for its own frontend. Deploying only the frontend does not start Java or MySQL.

References: [Blueprints](https://render.com/docs/blueprint-spec), [MySQL](https://render.com/docs/deploy-mysql), [free service limits](https://render.com/docs/free), [static sites](https://render.com/docs/static-sites).
