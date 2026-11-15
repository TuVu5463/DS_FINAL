# AFC Asian Cup 2027 Predictor

An educational football analytics project that uses historical international match data and statistical / machine-learning methods to estimate match outcomes, scorelines, and AFC Asian Cup 2027 tournament probabilities.

> **Project status: Early development.** This repository is being prepared. The API and frontend starter files provide the initial application scaffold. Prediction models, verified tournament data, and the Monte Carlo simulator must be implemented and evaluated before their results can be treated as meaningful forecasts.

## 1. Project goals

### 1.1 Tournament prediction

Estimate the probability that each qualified national team will:

- Win the tournament or finish as runner-up.
- Reach the semi-finals, quarter-finals, or Round of 16.
- Be eliminated in the group stage or at a particular knockout round.

The application must distinguish the probability of **reaching** a round from the probability of **being eliminated at** that round.

### 1.2 Match prediction

Allow users to select two national teams and estimate:

- Team A win, draw, and Team B win probabilities after 90 minutes.
- Expected goals for both teams.
- A probability distribution over possible scorelines.
- The most likely scorelines, such as the top five.

For knockout matches, regulation-time probabilities must be reported separately from extra-time, penalty-shootout, and qualification probabilities.

### 1.3 Tournament simulation

Run Monte Carlo simulations using match-level probability distributions. The simulator should:

- Apply the official group-stage and knockout rules.
- Rank teams using the applicable competition regulations and tie-breakers.
- Select the best third-placed teams according to the official format.
- Simulate extra time and penalty shoot-outs where required.
- Aggregate outcomes into title, advancement, and elimination probabilities.

Tournament groups, fixtures, dates, and tie-break rules should be stored as data/configuration rather than hard-coded. Verify them against the latest official AFC information before each release.

## 2. Technology stack

The application uses a separated frontend/backend architecture:

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | React 19 + Vite | User interface and interactive dashboard |
| Frontend charts | Recharts | Tournament, team, and match visualizations |
| Frontend HTTP client | Axios | Calls the backend API |
| Backend API | FastAPI | REST endpoints, validation, and orchestration |
| API schemas | Pydantic | Request/response validation |
| Data analysis | Python, Pandas, NumPy, SciPy | Collection, cleaning, EDA, and feature engineering |
| Machine learning | Scikit-learn, CatBoost, Statsmodels | Result and scoreline models |
| Database | PostgreSQL + SQLAlchemy | Structured data and prediction metadata |
| Testing | Pytest + Vitest (planned) | Backend and frontend tests |
| Deployment | Docker + GitHub Actions | Reproducible runtime and CI |

React is the presentation layer. Python data science and model code remain in `src/`; FastAPI exposes those capabilities to the React frontend. Do not put model training code in React.

## 3. Planned methodology

1. **Data collection:** gather historical international match results, Asian Cup history, FIFA ranking snapshots, and official tournament information.
2. **Data cleaning:** standardize team identities, dates, competition names, match stages, and score definitions; identify duplicates and missing values.
3. **EDA:** examine scoring patterns, home/away and neutral-venue effects, recent form, ranking differences, and historical Asian Cup performance.
4. **Feature engineering:** calculate pre-match Elo ratings, recent form, goals scored/conceded, opponent strength, rest days, and other features available before kick-off.
5. **Match result modeling:** establish a baseline with Logistic Regression and compare it with tree-based models such as CatBoost.
6. **Scoreline modeling:** develop a Poisson model and evaluate extensions such as Dixon-Coles for low-scoring outcomes.
7. **Probability calibration:** assess and calibrate probability estimates rather than relying on raw model scores alone.
8. **Tournament simulation:** repeatedly simulate the group stage and knockout bracket with Monte Carlo sampling.
9. **API and frontend:** expose prediction/simulation services through FastAPI and present the results in React.

These are planned methods, not claims about completed model performance. Model selection must be based on chronological backtesting and documented evaluation results.

## 4. Data sources

These are candidate sources. Coverage, update frequency, usage terms, and licensing must be reviewed before data is ingested or redistributed.

| Data | Candidate source | Intended use |
|---|---|---|
| International match results | [International football results (martj42)](https://github.com/martj42/international_results) | Historical match outcomes and score data |
| International match data | [OpenFootball Internationals](https://github.com/openfootball/internationals) | Cross-checking and supplemental match records |
| Competition format, regulations, fixtures | [Asian Football Confederation](https://www.the-afc.com/) | Official tournament rules and competition information |
| National-team rankings | [FIFA Men's World Ranking](https://inside.fifa.com/fifa-world-ranking/men) | Historical ranking features |

Advanced match statistics (expected goals, shots, possession, line-ups, and player availability) may be added later if reliable sources and appropriate usage rights are available.

### Data management principles

- Keep source files unchanged in `data/raw/` where repository policy and data licenses permit.
- Store cleaned and model-ready datasets separately.
- Record source URLs, retrieval dates, transformations, and data versions.
- Do not commit API keys, credentials, or private data.
- Avoid committing large datasets or model artifacts without a clear reason; consider external storage or Git LFS.
- Check each source's license and terms before publishing data.

## 5. Modeling and evaluation principles

- Use time-based splits or rolling-origin backtesting rather than relying only on random train/test splits.
- Use only information that would have been available before kick-off.
- Calculate Elo, rolling form, rankings, and dynamic features using historical information only.
- Separate regulation-time goals from extra-time goals and penalty-shootout results.
- Do not treat penalty-shootout scores as match goals.
- Evaluate probability quality and calibration, not accuracy alone.

| Task | Candidate metrics |
|---|---|
| Win/draw/loss classification | Accuracy, macro F1, Log Loss, Brier Score |
| Probability calibration | Reliability diagram, calibration error, Brier Score |
| Goals prediction | MAE, RMSE, Poisson deviance |
| Scoreline distribution | Negative log-likelihood and scoreline coverage |
| Tournament simulation | Historical advancement calibration and simulation consistency checks |

## 6. Target project structure

The structure below is the target architecture. Some modules are scaffolds or planned paths and may not yet be implemented.

```text
DS_FINAL/
├── .github/
│   └── workflows/               # CI workflows
├── backend/
│   └── app/
│       ├── api/                  # FastAPI routers
│       ├── core/                 # Settings, CORS, shared configuration
│       ├── schemas/              # Pydantic request/response schemas
│       ├── services/             # API-facing application services
│       └── main.py               # FastAPI application entry point
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable React components
│   │   ├── pages/                # Overview, predictor, simulator, analytics
│   │   ├── services/             # API client and endpoint functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── config/                       # Data, model, and tournament configuration
├── data/
│   ├── raw/
│   ├── interim/
│   ├── processed/
│   └── external/
├── docs/                         # Data dictionary and methodology
├── models/                       # Trained model artifacts and metadata
├── notebooks/                    # Collection, cleaning, EDA, experiments
├── src/
│   ├── data/                      # Ingestion, cleaning, validation
│   ├── features/                  # Elo, form, feature engineering
│   ├── models/                    # Result and score model implementations
│   ├── prediction/                # Reusable prediction logic
│   ├── simulation/                # Group stage, knockout, Monte Carlo
│   └── tournament/                # Competition rules and bracket logic
├── tests/                         # Python tests
├── .env.example
├── .gitignore
├── README.md
└── requirements.txt               # Python/backend dependencies
```

If the existing root-level `app/` directory was created for Streamlit, migrate any useful code before renaming or removing it. The target frontend directory is `frontend/`, while `backend/` contains the FastAPI application.

## 7. Getting started

### Prerequisites

- Python 3.11 or newer.
- Node.js 22.12 or newer (Node.js 26 LTS is a suitable choice).
- npm.
- Git.
- PostgreSQL for database-backed functionality when that integration is implemented.

### 7.1 Clone the repository

```bash
git clone https://github.com/TuVu5463/DS_FINAL.git
cd DS_FINAL
```

### 7.2 Set up the Python environment

**Windows PowerShell:**

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

**macOS / Linux:**

```bash
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

### 7.3 Start the FastAPI backend

From the repository root:

```bash
uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

When the backend is running, open:

- API health check: <http://127.0.0.1:8000/api/health>
- Interactive API documentation: <http://127.0.0.1:8000/docs>

### 7.4 Start the React frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite will print the local frontend URL, normally <http://localhost:5173>.

The frontend reads the API base URL from `VITE_API_BASE_URL`. A local example is:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Create `frontend/.env.local` for local settings; do not commit it.

### 7.5 Run backend tests

From the repository root:

```bash
python -m pytest -q
```

The test suite will grow as data, model, API, and simulation modules are implemented.

## 8. Environment variables and secrets

- Keep local credentials in `.env` or `frontend/.env.local` as appropriate.
- Commit only sanitized example files such as `.env.example`.
- Never commit API tokens, passwords, database credentials, or private keys.
- Frontend variables prefixed with `VITE_` are exposed to the browser; never put secrets in them.
- Store tournament groups, fixtures, and tie-break settings in configuration/data files and validate them against official regulations.

## 9. Development roadmap

- [ ] Complete data-source review and data dictionary.
- [ ] Build reproducible data collection and validation pipelines.
- [ ] Clean and integrate historical international match data.
- [ ] Complete exploratory data analysis.
- [ ] Implement pre-match Elo and recent-form features.
- [ ] Train and backtest win/draw/loss models.
- [ ] Train and evaluate scoreline models.
- [ ] Calibrate predicted probabilities.
- [ ] Implement and test official tournament rules.
- [ ] Build the Monte Carlo tournament simulator.
- [ ] Add FastAPI endpoints for match, scoreline, team, and tournament predictions.
- [ ] Build React pages for tournament overview, match predictor, simulator, and team analytics.
- [ ] Add automated tests, CI, Docker, and deployment configuration.

## 10. Limitations and disclaimer

Football outcomes are uncertain. Predicted probabilities are estimates based on available historical data and modeling assumptions; they are not guarantees. Data coverage, ranking updates, team changes, squad availability, and model drift can affect results. This project is intended for educational and analytical purposes, not as betting advice.

## 11. License and attribution

A project license has not yet been selected. Until one is added, do not assume that the repository's code or collected datasets are available for unrestricted reuse. Each external dataset remains subject to its own license and terms. Review source attribution and redistribution permissions before publishing data.

## 12. Maintainers

Maintained by the project owner and contributors.
