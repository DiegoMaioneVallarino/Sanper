import "./MarketsPage.css";

interface MarketIndex {
  name: string;
  symbol: string;
  value: string;
  change: number;
}

interface MarketAsset {
  name: string;
  symbol: string;
  value: string;
  change: number;
}

const indices: MarketIndex[] = [
  {
    name: "S&P 500",
    symbol: "SPX",
    value: "5,487.03",
    change: 0.42,
  },
  {
    name: "Nasdaq",
    symbol: "IXIC",
    value: "17,862.23",
    change: 0.81,
  },
  {
    name: "Dow Jones",
    symbol: "DJI",
    value: "39,150.33",
    change: -0.12,
  },
  {
    name: "IPC México",
    symbol: "MXX",
    value: "52,784.19",
    change: 0.31,
  },
];

const currencies: MarketAsset[] = [
  {
    name: "USD / MXN",
    symbol: "USDMXN",
    value: "18.24",
    change: 0.21,
  },
  {
    name: "EUR / USD",
    symbol: "EURUSD",
    value: "1.071",
    change: -0.08,
  },
  {
    name: "USD / JPY",
    symbol: "USDJPY",
    value: "159.61",
    change: 0.34,
  },
];

const commodities: MarketAsset[] = [
  {
    name: "Petróleo Brent",
    symbol: "BRENT",
    value: "$85.71",
    change: 2.41,
  },
  {
    name: "Oro",
    symbol: "GOLD",
    value: "$2,326",
    change: -0.31,
  },
  {
    name: "Gas natural",
    symbol: "NATGAS",
    value: "$2.71",
    change: 1.18,
  },
];

function MarketChange({
  value,
}: {
  value: number;
}) {
  const positive = value >= 0;

  return (
    <span
      className={
        positive
          ? "markets__change markets__change--positive"
          : "markets__change markets__change--negative"
      }
    >
      {positive ? "+" : ""}
      {value.toFixed(2)}%
    </span>
  );
}

export function MarketsPage() {
  return (
    <main className="markets">
      <header className="markets__header">
        <span className="markets__eyebrow">
          SANPER MERCADOS
        </span>

        <h1>Mercados</h1>

        <p>
          Datos, movimientos y contexto
          financiero global.
        </p>
      </header>

      <section className="markets__indices">
        {indices.map((index) => (
          <article
            key={index.symbol}
            className="markets__index"
          >
            <div className="markets__index-heading">
              <strong>
                {index.name}
              </strong>

              <span>
                {index.symbol}
              </span>
            </div>

            <div className="markets__index-value">
              {index.value}
            </div>

            <MarketChange
              value={index.change}
            />
          </article>
        ))}
      </section>

      <section className="markets__main">
        <div className="markets__chart-panel">
          <div className="markets__section-heading">
            <div>
              <span>
                PANORAMA DE MERCADOS
              </span>

              <h2>S&P 500</h2>
            </div>

            <div className="markets__periods">
              <button type="button">
                1D
              </button>

              <button type="button">
                5D
              </button>

              <button
                type="button"
                className="is-active"
              >
                1M
              </button>

              <button type="button">
                6M
              </button>

              <button type="button">
                1A
              </button>
            </div>
          </div>

          <div className="markets__chart">
            <svg
              viewBox="0 0 800 300"
              preserveAspectRatio="none"
              aria-label="Gráfica provisional del S&P 500"
            >
              <path
                className="markets__chart-grid"
                d="
                  M0 60 H800
                  M0 120 H800
                  M0 180 H800
                  M0 240 H800
                "
              />

              <path
                className="markets__chart-line"
                d="
                  M0 230
                  C50 220 70 245 120 210
                  S190 175 230 190
                  S300 150 350 165
                  S420 110 465 130
                  S530 100 570 115
                  S640 65 680 85
                  S750 45 800 58
                "
              />
            </svg>
          </div>

          <p className="markets__demo-note">
            Datos de demostración
          </p>
        </div>

        <aside className="markets__movers">
          <span className="markets__label">
            EN MOVIMIENTO
          </span>

          {commodities.map((asset) => (
            <div
              key={asset.symbol}
              className="markets__mover"
            >
              <div>
                <strong>
                  {asset.name}
                </strong>

                <span>
                  {asset.value}
                </span>
              </div>

              <MarketChange
                value={asset.change}
              />
            </div>
          ))}
        </aside>
      </section>

      <section className="markets__tables">
        <MarketTable
          title="Divisas"
          assets={currencies}
        />

        <MarketTable
          title="Materias primas"
          assets={commodities}
        />
      </section>

      <section className="markets__editorial">
        <div className="markets__editorial-heading">
          <span>
            INTELIGENCIA DE MERCADOS
          </span>

          <h2>
            Lo que está moviendo
            los mercados
          </h2>
        </div>

        <article className="markets__lead-story">
          <div>
            <span>
              ENERGÍA · GEOPOLÍTICA
            </span>

            <h3>
              La presión sobre los corredores
              energéticos vuelve al centro de
              atención de los mercados
            </h3>

            <p>
              Los inversores siguen los
              acontecimientos internacionales
              ante su posible impacto sobre
              energía, inflación y transporte.
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}

function MarketTable({
  title,
  assets,
}: {
  title: string;
  assets: MarketAsset[];
}) {
  return (
    <div className="markets__table">
      <h2>{title}</h2>

      {assets.map((asset) => (
        <div
          key={asset.symbol}
          className="markets__table-row"
        >
          <div>
            <strong>
              {asset.name}
            </strong>

            <span>
              {asset.symbol}
            </span>
          </div>

          <strong>
            {asset.value}
          </strong>

          <MarketChange
            value={asset.change}
          />
        </div>
      ))}
    </div>
  );
}