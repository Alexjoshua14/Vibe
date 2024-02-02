from src.api.ranking.ranking3 import Rankings, testing
from flask import Flask, request, jsonify
app = Flask(__name__)

@app.route("/api/python")
def hello_world():
    return testing()
  
@app.route("/api/sample", methods=["POST"])
def sample():
  print("Request received...")
  try:
    print("Request received and parsing JSON data...")
    json_data = request.get_json()
    
    print("JSON data: " + json_data)
    
    if not json_data:
      return jsonify({"error": "No JSON data provided"}), 400
    
    return jsonify(json_data)
  except Exception as e:
    print("Exception: " + str(e))
    return jsonify({"error": "An error occurred"}), 500
  
@app.route("/api/ranking", methods=["POST"])
def compute_ranking():
  try:
    print("Request received and parsing JSON data...")
    json_data = request.get_json()
    
    print("JSON data: " + json_data)
    
    if not json_data:
      return jsonify({"error": "No JSON data provided"}), 400
    
    limit = json_data.get("limit")
    
    if not limit:
      return jsonify({"error": "No limit provided"}), 400
    
    items = json_data.get("items")
    
    if not items:
      return jsonify({"error": "No items provided"}), 400
    
    rankings = Rankings(limit)
  
  except Exception as e:
    print("Exception: " + str(e))
    return jsonify({"error": "An error occurred"}), 500
    
    
  