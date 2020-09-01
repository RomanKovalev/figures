release: python backend/src/manage.py migrate
web: $(cd backend/src/figures_api/; gunicorn wsgi --log-file -)