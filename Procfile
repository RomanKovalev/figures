release: python backend/src/manage.py migrate
web: $(cd backend/src/figures_api/; gunicorn backend.src.figures_api1.wsgi --log-file -)