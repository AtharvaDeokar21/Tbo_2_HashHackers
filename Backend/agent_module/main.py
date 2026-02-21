from flask import Flask
from routes.endpoints_routes import campaign_bp

app = Flask(__name__)

app.register_blueprint(campaign_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True)