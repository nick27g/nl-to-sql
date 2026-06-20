export const SCHEMA_STRING = `
CREATE TABLE personnel (
  id INTEGER PRIMARY KEY,
  name TEXT,
  department TEXT,
  rank TEXT,
  clearance_level TEXT,
  hire_date TEXT
);

CREATE TABLE incidents (
  id INTEGER PRIMARY KEY,
  reported_by INTEGER REFERENCES personnel(id),
  type TEXT,
  severity TEXT,
  status TEXT,
  reported_at TEXT,
  resolved_at TEXT
);

CREATE TABLE assets (
  id INTEGER PRIMARY KEY,
  name TEXT,
  category TEXT,
  assigned_to INTEGER REFERENCES personnel(id),
  location TEXT,
  last_audit TEXT
);

CREATE TABLE access_logs (
  id INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES personnel(id),
  asset_id INTEGER REFERENCES assets(id),
  action TEXT,
  timestamp TEXT,
  success INTEGER
);
`;
