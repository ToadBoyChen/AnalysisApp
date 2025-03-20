// stocks.js

// List of stock symbols
const STOCKS = [
    "AAPL", "TSLA", "GOOGL", "MSFT", "NVDA", "AMZN", "META", "NFLX", "BA", "DIS",
    "INTC", "AMD", "SPY", "V", "MA", "PYPL", "CSCO", "CRM", "WMT", "HD", "UNH",
    "PFE", "JNJ", "MRK", "KO", "PEP", "NKE", "MCD", "GS", "JPM", "MS", "AMT", "T",
    "VZ", "BABA", "TSM", "SQ", "WORK", "SNAP", "TWTR", "RBLX", "UBER", "LYFT", "F",
    "GM", "RACE", "LUV", "DAL", "AAL", "UAL", "XOM", "CVX", "SLB", "COP", "OXY",
    "WFC", "BAC", "C", "USB", "SPG", "REGN", "BIIB", "AMGN", "GILD", "BMY", "MO",
    "PM", "CL", "PG", "CLX", "XEL", "NEE", "DUK", "SO", "D", "WEC", "AEP", "NEM",
    "GOLD", "RIG", "PXD", "KMI", "MRO", "HES", "PSX", "FSLR", "SEDG", "ENPH", "NIO",
    "LI", "BYDDF", "XPEV", "RIVN", "LCID", "PLTR", "INTU", "VEEV", "ZS", "NET",
    "FTNT", "OKTA", "TENB", "CYBR", "SPLK", "PALO", "MDB", "SNOW", "WORK", "NOK",
    "ERIC", "ATVI", "EA", "TTWO", "BIDU", "JD", "TCEHY", "NTES", "YY", "YUM",
    "SBUX", "DPZ", "CMG", "WEN", "DNKN", "CHWY", "MELI", "RHT", "IBM", "ORCL",
    "ADBE", "NVDA", "AMD"
];

// API route to return the list of stocks
export default function handler(req, res) {
    // Handle GET requests to return the STOCKS list
    if (req.method === 'GET') {
        res.status(200).json(STOCKS);
    } else {
        // If method is not GET, send a 405 Method Not Allowed error
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
