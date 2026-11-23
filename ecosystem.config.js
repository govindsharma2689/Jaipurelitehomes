module.exports = {
  apps: [
    {
      name: "jaipurelitehomes-frontend",
      cwd: "/var/www/jaipurelitehomes/frontend",
      script: "node_modules/.bin/next",
      args: "start -p 3010",
      env: {
        NODE_ENV: "production",
        NEXT_PUBLIC_BACKEND_URL: "https://jaipurelitehomes.com",
        REACT_APP_BACKEND_URL: "https://jaipurelitehomes.com",
        NEXT_PUBLIC_SITE_URL: "https://jaipurelitehomes.com"
      },
      max_memory_restart: "500M",
      instances: 1,
      exec_mode: "fork"
    },
    {
      name: "jaipurelitehomes-backend",
      cwd: "/var/www/jaipurelitehomes/backend",
      script: "/usr/bin/python3",
      args: "-m uvicorn server:app --host 0.0.0.0 --port 8010",
      env: {
        PYTHONPATH: "/var/www/jaipurelitehomes/backend"
      },
      max_memory_restart: "300M",
      instances: 1,
      exec_mode: "fork"
    }
  ]
};
