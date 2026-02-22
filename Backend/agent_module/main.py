from flask import Flask
from routes.endpoints_routes import campaign_bp
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.register_blueprint(campaign_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True, port=5001)