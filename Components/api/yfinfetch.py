import yfinance as yf
from flask import Flask, jsonify
import time
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

STOCKS = [
    "AAPL", "TSLA", "GOOGL", "MSFT", "NVDA", "AMZN", "META", "NFLX", "BA", "DIS",
    "IBM", "AMD", "INTC", "V", "PYPL", "JPM", "GS", "TSM", "XOM", "WMT"
]

@app.route("/api/stock_data", methods=["GET"])
def get_stock_data():
    percentage_changes = []
    try:
        for stock in STOCKS:
            data = yf.download(stock, period="1d", interval="5m", group_by='ticker')
            
            today_close = data[stock].iloc[-1]['Close']
            yesterday_close = data[stock].iloc[-2]['Close']
            
            percentage_change = ((today_close - yesterday_close) / yesterday_close) * 100
            
            percentage_changes.append(f"{stock}: {today_close}: {round(percentage_change, 3)}%")
            
        
        
        print(percentage_changes)
        
        # time.sleep(20)
        return jsonify(percentage_changes)

    except Exception as e:
        print(f"Error fetching data: {e}")
        return jsonify({"error": "Failed to fetch stock data"}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)