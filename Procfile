release: python backend/src/manage.py migrate
web: gunicorn backend.src.figures_api.wsgi --log-file -