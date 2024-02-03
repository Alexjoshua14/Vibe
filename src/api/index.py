from src.api.ranking.ranking3 import Rankings, testing, calculate_rankings
from flask import Flask, request, jsonify
import logging
app = Flask(__name__)

logging.basicConfig(level=logging.DEBUG)

@app.route("/api/hello")
def hello_world():
    app.logger.debug("Testing debug logger right this very second")
    return testing()
  
@app.route("/api/sample", methods=["POST"])
def sample():
  app.logger.debug("Request received...")
  try:
    app.logger.debug("Request received and parsing JSON data...")
    json_data = request.get_json()
    
    app.logger.debug(json_data)
    
    if not json_data:
      return jsonify({"error": "No JSON data provided"}), 400
    
    return jsonify(json_data)
  except Exception as e:
    app.logger.debug("Exception: " + str(e))
    return jsonify({"error": "An error occurred.."}), 500
  
@app.route("/api/ranking", methods=["POST"])
def compute_ranking():
  try:
    app.logger.debug("Request received and parsing JSON data...")
    json_data = request.get_json()
    
    app.logger.debug(json_data)
    
    if not json_data:
      return jsonify({"error": "No JSON data provided"}), 400
    
    limit = json_data.get("limit")
    
    if not limit:
      return jsonify({"error": "No limit provided"}), 400
    
    items = json_data.get("items")
    
    if not items:
      return jsonify({"error": "No items provided"}), 400
    
    return calculate_rankings(json_data)

  
  except Exception as e:
    app.logger.debug("Exception: " + str(e))
    return jsonify({"error": "An error occurred"}), 500
    
    
  