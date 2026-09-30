import "./MarketTicker.css";

const markets = [
  {
    symbol: "S&P 500",
    value: "5,718.24",
    change: "+0.82%",
  },
  {
    symbol: "NASDAQ",
    value: "18,243.11",
    change: "+0.97%",
  },
  {
    symbol: "BTC",
    value: "63,420.12",
    change: "-1.21%",
  },
  {
    symbol: "Oro",
    value: "2,356.80",
    change: "+0.41%",
  },
  {
    symbol: "Petróleo",
    value: "73.18",
    change: "-0.63%",
  },
];

export function MarketTicker() {
  return (
    <div className="market-ticker">
      <div className="market-ticker__content">
        {markets.map((market) => {
          const positive = market.change.startsWith("+");

          return (
            <div
              className="market-ticker__item"
              key={market.symbol}
            >
              <span className="market-ticker__symbol">
                {market.symbol}
              </span>

              <span className="market-ticker__value">
                {market.value}
              </span>

              <span
                className={
                  positive
                    ? "market-ticker__change market-ticker__change--positive"
                    : "market-ticker__change market-ticker__change--negative"
                }
              >
                {market.change}
              </span>
            </div>
          );
        })}

        <button
          className="market-ticker__markets"
          type="button"
        >
          Ver mercados →
        </button>
      </div>
    </div>
  );
}