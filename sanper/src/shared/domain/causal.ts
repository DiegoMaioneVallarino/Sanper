/*
 * Modelo causal de Sanper (fase 2).
 *
 * Se define ahora para fijar el esquema de base de datos;
 * todavía no hay código que lo use.
 *
 * Todo lo que puede aportar la comunidad (relaciones, reglas,
 * investigaciones) lleva `createdBy` y `reviewStatus`: nada
 * entra al motor sin aprobación editorial.
 */

export type ContributionStatus =
  | "proposed"
  | "approved"
  | "rejected"
  | "retired";

/* ── Mundo: entidades y relaciones de exposición ── */

export type EntityKind =
  | "country"
  | "organization"
  | "company"
  | "chokepoint"
  | "commodity"
  | "sector"
  | "index"
  | "currency";

export interface Entity {
  id: string; // "country:MX", "chokepoint:hormuz", "index:SPX"
  kind: EntityKind;
  name: string;
  aliases: string[];
  codes?: {
    iso2?: string;
    ticker?: string;
    wikidata?: string;
  };
}

export type RelationType =
  | "exports_to"
  | "imports_from"
  | "transits"
  | "controls"
  | "depends_on"
  | "supplies"
  | "member_of"
  | "priced_in";

export interface Relation {
  id: string;
  from: string;
  to: string;
  type: RelationType;
  weight: number; // 0..1
  source: string; // URL del dato
  asOf: string;
  createdBy: string | null;
  reviewStatus: ContributionStatus;
}

/* ── Eventos estructurados ── */

export type EventType =
  | "military_action"
  | "sanction"
  | "tariff"
  | "export_control"
  | "supply_disruption"
  | "policy_rate_change"
  | "election_result"
  | "agreement"
  | "unrest"
  | "natural_disaster";

export type EventStatus =
  | "threatened"
  | "announced"
  | "implemented"
  | "reversed";

export interface GeoEvent {
  id: string;
  type: EventType;
  status: EventStatus;
  actors: string[];
  targets: string[];
  objects: string[];
  magnitude?: { value: number; unit: string };
  occurredAt: string;
  storyId: string | null;
  articleIds: string[];
  extractionConfidence: number;
}

/* ── Reglas de transmisión ── */

export type Channel =
  | "physical_supply"
  | "risk_premium"
  | "trade_flows"
  | "monetary_policy"
  | "fx_safe_haven"
  | "earnings"
  | "sentiment";

export type EffectVariable =
  | "price"
  | "volatility"
  | "spread"
  | "flow"
  | "inflation";

export type Magnitude = "low" | "medium" | "high";
export type Horizon = "intraday" | "days" | "weeks" | "months";

export interface TransmissionRule {
  id: string;
  when: {
    eventType: EventType;
    status?: EventStatus[];
  };
  via: {
    relation: RelationType;
    hop: "forward" | "backward";
  };
  channel: Channel;
  effect: {
    variable: EffectVariable;
    direction: "up" | "down";
    magnitude: Magnitude;
  };
  lag: Horizon;
  attenuation: number; // 0..1 por salto
  evidence: {
    basis: "literature" | "backtest" | "expert";
    hitRate?: number;
    samples?: number;
    note: string;
  };
  createdBy: string | null;
  reviewStatus: ContributionStatus;
}

/* ── Lo que el motor deduce ── */

export interface TraceStep {
  from: string;
  to: string;
  ruleId?: string;
  relationId?: string;
  channel: Channel;
  note: string;
}

export type HypothesisStatus =
  | "open"
  | "confirmed"
  | "refuted"
  | "inconclusive";

export interface ImpactHypothesis {
  id: string;
  eventId: string;
  target: string;
  variable: EffectVariable;
  direction: "up" | "down";
  magnitude: Magnitude;
  horizon: Horizon;
  confidence: number;
  trace: TraceStep[];
  status: HypothesisStatus;
}

/* ── Lo que el mercado hizo ── */

export interface Observation {
  hypothesisId: string;
  instrument: string; // "BZ=F", "USDMXN", "SOXX"
  window: { from: string; to: string };
  actualReturn: number;
  abnormalReturn: number;
  zScore: number;
}

/* ── Comunidad: investigaciones de usuarios ── */

export type ResearchStatus =
  | "draft"
  | "submitted"
  | "published"
  | "rejected";

export interface ResearchNote {
  id: string;
  authorId: string;
  title: string;
  bodyMarkdown: string;
  storyId: string | null;
  hypothesisId: string | null;
  /* Relaciones o reglas que la investigación propone. */
  proposedRelationIds: string[];
  proposedRuleIds: string[];
  status: ResearchStatus;
  createdAt: string;
  updatedAt: string;
}
