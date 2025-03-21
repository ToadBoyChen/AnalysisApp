import yfinance as yf
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

STOCKS = [
    "AAPL", "TSLA", "GOOGL", "MSFT", "NVDA", "AMZN", "META", "NFLX", "BA", "DIS",
    "IBM", "AMD", "INTC", "V", "PYPL", "JPM", "GS", "TSM", "XOM", "WMT"
]

@app.route("/api/stock_data", methods=["GET"])
def get_stock_data():
    stock_data = []
    try:
        for stock in STOCKS:
            data = yf.download(stock, period="7d", interval="1d", group_by='ticker')
            
            today_close = data[stock].iloc[-1]['Close']
            yesterday_close = data[stock].iloc[-2]['Close']
            high = data[stock].iloc[-1]['High']
            low = data[stock].iloc[-1]['Low']
            percentage_change = ((today_close - yesterday_close) / yesterday_close) * 100
            
            stock_data.append({
                "symbol": stock,
                "today_close": today_close,
                "yesterday_close": yesterday_close,
                "percentage_change": round(percentage_change, 3),
                "high": high,
                "low": low
            })
        
        return jsonify(stock_data)

    except Exception as e:
        print(f"Error fetching data: {e}")
        return jsonify({"error": "Failed to fetch stock data"}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)