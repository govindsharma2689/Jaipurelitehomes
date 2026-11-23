# Jaipur Elite Homes — website source code

This is the full source of **https://jaipurelitehomes.com** as it runs today.

| Folder | What it is |
|---|---|
| `frontend/` | The website people see. Next.js (React) + Tailwind CSS. Pages are in `frontend/app/`, reusable parts in `frontend/components/`, images in `frontend/public/`. |
| `backend/` | The API and admin panel logic. Python (FastAPI) in `backend/server.py`, with MongoDB as the database. Images uploaded through the admin panel go to `backend/uploads/`. |
| `database/properties.json` | Export of the property listings (43) from the live database, so a copy of the site can be started with the same content. Customer enquiries are not included. |
| `deploy.sh`, `ecosystem.config.js`, `nginx-jaipurelitehomes.conf` | How the site is set up on the current server (pm2 + nginx). |

## Run it on your computer

Needs Node.js 18+ with Yarn, Python 3.10+ and MongoDB.

**Backend**
```bash
cd backend
cp .env.example .env        # then fill in your own values
pip install -r requirements.txt
mongoimport --db jaipur_elite_homes --collection properties --jsonArray --file ../database/properties.json
uvicorn server:app --reload --port 8010
```

**Frontend**
```bash
cd frontend
cp .env.example .env.local  # point NEXT_PUBLIC_BACKEND_URL at http://localhost:8010 for local work
yarn install
yarn dev                    # opens on http://localhost:3000
```

## Passwords and keys

No real passwords or secret keys are in this repository. `.env.example` files list every setting the site needs; put your own values in `.env` files, which are never committed.

## Making changes

- Text, layout and design: `frontend/app/` and `frontend/components/`.
- Property listings can also be changed without code through the admin panel at `/admin/login`.
- To publish a change: build the frontend (`yarn build`) and restart the two apps on the server, or move the site to the host of your choice.
