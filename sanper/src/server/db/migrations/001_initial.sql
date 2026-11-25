-- ============================================================
-- Sanper · 001 · Esquema inicial
--
-- Bloques:
--   1. Usuarios (comunidad)
--   2. Ingesta: fuentes, artículos, corridas
--   3. Historias (Story) y su vínculo con artículos
--   4. Motor de inteligencia y revisión editorial
--   5. Modelo causal (fase 2, vacío por ahora)
--   6. Investigaciones de la comunidad
--
-- Convención: estados como text + CHECK (más fácil de
-- evolucionar que ENUM). Fechas siempre timestamptz.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------
-- 1. Usuarios
--    reader      lee y comenta
--    contributor propone relaciones, reglas e investigaciones
--    analyst     contributor con acceso a trazas y datos
--    editor      aprueba vínculos, reglas y publicaciones
--    admin       todo
-- ------------------------------------------------------------

CREATE TABLE users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  handle        text NOT NULL UNIQUE,
  display_name  text NOT NULL,
  email         text UNIQUE,
  role          text NOT NULL DEFAULT 'reader'
                CHECK (role IN ('reader','contributor','analyst','editor','admin')),
  reputation    integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ------------------------------------------------------------
-- 2. Ingesta
-- ------------------------------------------------------------

CREATE TABLE sources (
  id               text PRIMARY KEY,
  name             text NOT NULL,
  url              text NOT NULL UNIQUE,
  kind             text NOT NULL DEFAULT 'rss'
                   CHECK (kind IN ('rss','gdelt','official','api')),
  language         text NOT NULL,
  enabled          boolean NOT NULL DEFAULT true,
  reliability      numeric(3,2) NOT NULL DEFAULT 0.50
                   CHECK (reliability BETWEEN 0 AND 1),
  last_fetched_at  timestamptz,
  last_error       text,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE articles (
  id              text PRIMARY KEY,
  source_id       text NOT NULL REFERENCES sources(id),
  external_id     text,
  url             text NOT NULL,
  canonical_url   text NOT NULL UNIQUE,
  content_hash    text NOT NULL,
  title           text NOT NULL,
  description     text NOT NULL DEFAULT '',
  content         text NOT NULL DEFAULT '',
  language        text NOT NULL,
  normalized_text text NOT NULL DEFAULT '',
  published_at    timestamptz NOT NULL,
  received_at     timestamptz NOT NULL DEFAULT now(),
  -- Casi duplicado de otra nota (misma noticia, otra URL).
  duplicate_of    text REFERENCES articles(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX articles_published_at_idx ON articles (published_at DESC);
CREATE INDEX articles_source_idx       ON articles (source_id);
CREATE INDEX articles_content_hash_idx ON articles (content_hash);

CREATE TABLE ingestion_runs (
  id              bigserial PRIMARY KEY,
  trigger         text NOT NULL CHECK (trigger IN ('schedule','manual')),
  started_at      timestamptz NOT NULL DEFAULT now(),
  finished_at     timestamptz,
  fetched         integer NOT NULL DEFAULT 0,
  inserted        integer NOT NULL DEFAULT 0,
  duplicates      integer NOT NULL DEFAULT 0,
  failed_sources  jsonb NOT NULL DEFAULT '[]'::jsonb
);

-- ------------------------------------------------------------
-- 3. Historias
-- ------------------------------------------------------------

CREATE TABLE stories (
  id             text PRIMARY KEY,
  title          text NOT NULL,
  summary        text NOT NULL DEFAULT '',
  sectors        text[] NOT NULL DEFAULT '{}',
  importance     text NOT NULL DEFAULT 'regional'
                 CHECK (importance IN ('local','national','regional','international','global')),
  relevance      text NOT NULL DEFAULT 'monitoring'
                 CHECK (relevance IN ('high','medium','monitoring')),
  location_name  text,
  latitude       double precision,
  longitude      double precision,
  status         text NOT NULL DEFAULT 'active'
                 CHECK (status IN ('active','archived')),
  started_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  created_by     uuid REFERENCES users(id),
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX stories_updated_at_idx ON stories (updated_at DESC);
CREATE INDEX stories_sectors_idx    ON stories USING gin (sectors);

CREATE TABLE story_territories (
  story_id  text NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  code      text NOT NULL,
  name      text NOT NULL,
  PRIMARY KEY (story_id, code)
);

CREATE TABLE story_countries (
  story_id      text NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  country_code  text NOT NULL,
  role          text NOT NULL CHECK (role IN ('involved','affected')),
  PRIMARY KEY (story_id, country_code)
);

CREATE TABLE story_articles (
  story_id    text NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  article_id  text NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  linked_by   text NOT NULL CHECK (linked_by IN ('engine','editor','seed')),
  linked_by_user uuid REFERENCES users(id),
  linked_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (story_id, article_id)
);

CREATE INDEX story_articles_article_idx ON story_articles (article_id);

-- ------------------------------------------------------------
-- 4. Motor de inteligencia y revisión
-- ------------------------------------------------------------

CREATE TABLE article_analysis (
  article_id        text PRIMARY KEY REFERENCES articles(id) ON DELETE CASCADE,
  engine_version    text NOT NULL,
  sectors           text[] NOT NULL DEFAULT '{}',
  keywords          text[] NOT NULL DEFAULT '{}',
  entities          jsonb NOT NULL DEFAULT '[]'::jsonb,
  status            text NOT NULL
                    CHECK (status IN ('matched','new_story','review_required')),
  match_story_id    text REFERENCES stories(id) ON DELETE SET NULL,
  match_confidence  real NOT NULL DEFAULT 0,
  match_reason      text NOT NULL DEFAULT '',
  processed_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX article_analysis_status_idx ON article_analysis (status);

-- Estado actual de la revisión de cada artículo.
CREATE TABLE reviews (
  article_id   text PRIMARY KEY REFERENCES articles(id) ON DELETE CASCADE,
  decision     text NOT NULL DEFAULT 'pending'
               CHECK (decision IN ('pending','approved','rejected')),
  story_id     text REFERENCES stories(id) ON DELETE SET NULL,
  reviewer_id  uuid REFERENCES users(id),
  note         text,
  reviewed_at  timestamptz,
  updated_at   timestamptz NOT NULL DEFAULT now(),
  CHECK (decision <> 'approved' OR story_id IS NOT NULL)
);

CREATE INDEX reviews_decision_idx ON reviews (decision);

CREATE TRIGGER reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Historial inmutable: quién decidió qué y cuándo.
CREATE TABLE review_log (
  id           bigserial PRIMARY KEY,
  article_id   text NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  decision     text NOT NULL CHECK (decision IN ('pending','approved','rejected')),
  story_id     text,
  reviewer_id  uuid REFERENCES users(id),
  note         text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- 5. Modelo causal (fase 2)
--    Relaciones y reglas pueden venir de la comunidad:
--    created_by + review_status. El motor sólo usa 'approved'.
-- ------------------------------------------------------------

CREATE TABLE entities (
  id          text PRIMARY KEY,           -- 'country:MX', 'chokepoint:hormuz'
  kind        text NOT NULL CHECK (kind IN (
                'country','organization','company','chokepoint',
                'commodity','sector','index','currency')),
  name        text NOT NULL,
  aliases     text[] NOT NULL DEFAULT '{}',
  codes       jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX entities_aliases_idx ON entities USING gin (aliases);

CREATE TABLE relations (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_entity    text NOT NULL REFERENCES entities(id),
  to_entity      text NOT NULL REFERENCES entities(id),
  type           text NOT NULL CHECK (type IN (
                   'exports_to','imports_from','transits','controls',
                   'depends_on','supplies','member_of','priced_in')),
  weight         real NOT NULL CHECK (weight BETWEEN 0 AND 1),
  source_url     text NOT NULL,
  as_of          date NOT NULL,
  created_by     uuid REFERENCES users(id),
  review_status  text NOT NULL DEFAULT 'proposed'
                 CHECK (review_status IN ('proposed','approved','rejected','retired')),
  created_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (from_entity, to_entity, type, as_of)
);

CREATE INDEX relations_from_idx ON relations (from_entity) WHERE review_status = 'approved';
CREATE INDEX relations_to_idx   ON relations (to_entity)   WHERE review_status = 'approved';

CREATE TABLE transmission_rules (
  id             text PRIMARY KEY,
  event_type     text NOT NULL,
  relation_type  text NOT NULL,
  channel        text NOT NULL CHECK (channel IN (
                   'physical_supply','risk_premium','trade_flows',
                   'monetary_policy','fx_safe_haven','earnings','sentiment')),
  -- when / via / effect / lag / attenuation / evidence (TransmissionRule)
  definition     jsonb NOT NULL,
  hit_rate       real,
  samples        integer NOT NULL DEFAULT 0,
  created_by     uuid REFERENCES users(id),
  review_status  text NOT NULL DEFAULT 'proposed'
                 CHECK (review_status IN ('proposed','approved','rejected','retired')),
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER transmission_rules_updated_at
  BEFORE UPDATE ON transmission_rules
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE geo_events (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type                   text NOT NULL,
  status                 text NOT NULL
                         CHECK (status IN ('threatened','announced','implemented','reversed')),
  actors                 text[] NOT NULL DEFAULT '{}',
  targets                text[] NOT NULL DEFAULT '{}',
  objects                text[] NOT NULL DEFAULT '{}',
  magnitude_value        numeric,
  magnitude_unit         text,
  occurred_at            timestamptz NOT NULL,
  story_id               text REFERENCES stories(id) ON DELETE SET NULL,
  extraction_confidence  real NOT NULL,
  created_at             timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE event_articles (
  event_id    uuid NOT NULL REFERENCES geo_events(id) ON DELETE CASCADE,
  article_id  text NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, article_id)
);

CREATE TABLE impact_hypotheses (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id       uuid NOT NULL REFERENCES geo_events(id) ON DELETE CASCADE,
  target_entity  text NOT NULL REFERENCES entities(id),
  variable       text NOT NULL,
  direction      text NOT NULL CHECK (direction IN ('up','down')),
  magnitude      text NOT NULL CHECK (magnitude IN ('low','medium','high')),
  horizon        text NOT NULL CHECK (horizon IN ('intraday','days','weeks','months')),
  confidence     real NOT NULL CHECK (confidence BETWEEN 0 AND 1),
  trace          jsonb NOT NULL,
  status         text NOT NULL DEFAULT 'open'
                 CHECK (status IN ('open','confirmed','refuted','inconclusive')),
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE observations (
  id               bigserial PRIMARY KEY,
  hypothesis_id    uuid NOT NULL REFERENCES impact_hypotheses(id) ON DELETE CASCADE,
  instrument       text NOT NULL,
  window_from      timestamptz NOT NULL,
  window_to        timestamptz NOT NULL,
  actual_return    double precision NOT NULL,
  abnormal_return  double precision NOT NULL,
  z_score          double precision NOT NULL,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- 6. Investigaciones de la comunidad
--    Una investigación puede discutir una historia o una
--    hipótesis, y proponer relaciones o reglas nuevas.
-- ------------------------------------------------------------

CREATE TABLE research_notes (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id      uuid NOT NULL REFERENCES users(id),
  title          text NOT NULL,
  body_markdown  text NOT NULL,
  story_id       text REFERENCES stories(id) ON DELETE SET NULL,
  hypothesis_id  uuid REFERENCES impact_hypotheses(id) ON DELETE SET NULL,
  status         text NOT NULL DEFAULT 'draft'
                 CHECK (status IN ('draft','submitted','published','rejected')),
  published_at   timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER research_notes_updated_at
  BEFORE UPDATE ON research_notes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE research_note_proposals (
  note_id      uuid NOT NULL REFERENCES research_notes(id) ON DELETE CASCADE,
  relation_id  uuid REFERENCES relations(id) ON DELETE CASCADE,
  rule_id      text REFERENCES transmission_rules(id) ON DELETE CASCADE,
  CHECK ((relation_id IS NULL) <> (rule_id IS NULL))
);

CREATE UNIQUE INDEX research_note_proposals_uniq
  ON research_note_proposals (note_id, coalesce(relation_id::text, rule_id));
