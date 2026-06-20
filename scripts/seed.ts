import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'database.sqlite');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new Database(DB_PATH);

db.exec(`DROP TABLE IF EXISTS access_logs`);
db.exec(`DROP TABLE IF EXISTS incidents`);
db.exec(`DROP TABLE IF EXISTS assets`);
db.exec(`DROP TABLE IF EXISTS personnel`);

db.exec(`
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
`);

const firstNames = ['James', 'Sarah', 'Michael', 'Emily', 'Robert', 'Jessica', 'David', 'Ashley', 'Daniel', 'Amanda', 'Christopher', 'Melissa', 'Matthew', 'Stephanie', 'Joshua', 'Nicole', 'Andrew', 'Jennifer', 'Ryan', 'Elizabeth', 'Brandon', 'Heather', 'Tyler', 'Megan', 'Kevin'];
const lastNames = ['Mitchell', 'Turner', 'Anderson', 'Harris', 'Clark', 'Lewis', 'Walker', 'Hall', 'Allen', 'Young', 'King', 'Wright', 'Scott', 'Green', 'Baker', 'Adams', 'Nelson', 'Carter', 'Perez', 'Roberts', 'Campbell', 'Parker', 'Evans', 'Edwards', 'Collins'];
const departments = ['IT', 'Security', 'Operations', 'HR', 'Finance'];
const ranks = ['Analyst', 'Senior Analyst', 'Manager', 'Director'];
const clearances = ['UNCLASSIFIED', 'SECRET', 'TOP SECRET'];

const personnelInsert = db.prepare(`INSERT INTO personnel (id, name, department, rank, clearance_level, hire_date) VALUES (?, ?, ?, ?, ?, ?)`);

for (let i = 1; i <= 50; i++) {
  const first = firstNames[(i - 1) % firstNames.length];
  const last = lastNames[Math.floor((i - 1) / 2) % lastNames.length];
  const dept = departments[(i - 1) % departments.length];
  const rank = ranks[(i - 1) % ranks.length];
  const clearance = clearances[(i - 1) % clearances.length];
  const year = 2018 + ((i - 1) % 7);
  const month = String(((i - 1) % 12) + 1).padStart(2, '0');
  const day = String(((i - 1) % 28) + 1).padStart(2, '0');
  personnelInsert.run(i, `${first} ${last}`, dept, rank, clearance, `${year}-${month}-${day}`);
}

const incidentTypes = ['data_breach', 'ransomware', 'phishing', 'outage', 'unauthorized_access', 'malware'];
const severities = ['low', 'medium', 'high', 'critical'];
const statuses = ['open', 'investigating', 'resolved'];

const incidentInsert = db.prepare(`INSERT INTO incidents (id, reported_by, type, severity, status, reported_at, resolved_at) VALUES (?, ?, ?, ?, ?, ?, ?)`);

for (let i = 1; i <= 50; i++) {
  const reportedBy = ((i - 1) % 50) + 1;
  const type = incidentTypes[(i - 1) % incidentTypes.length];
  const severity = severities[(i - 1) % severities.length];
  const status = statuses[(i - 1) % statuses.length];
  const year = 2023 + ((i - 1) % 3);
  const month = String(((i - 1) % 12) + 1).padStart(2, '0');
  const day = String(((i - 1) % 28) + 1).padStart(2, '0');
  const hour = String((i - 1) % 24).padStart(2, '0');
  const reportedAt = `${year}-${month}-${day}T${hour}:00:00Z`;
  const resolvedAt = status === 'resolved' ? `${year}-${month}-${String(Math.min(parseInt(day) + 3, 28)).padStart(2, '0')}T${hour}:30:00Z` : null;
  incidentInsert.run(i, reportedBy, type, severity, status, reportedAt, resolvedAt);
}

const assetNames = ['WEB-SRV', 'DB-SRV', 'MAIL-SRV', 'BACKUP-SRV', 'PROXY-SRV', 'DNS-SRV', 'AUTH-SRV', 'MON-SRV', 'WORKSTATION', 'LAPTOP', 'FIREWALL', 'SWITCH', 'ROUTER', 'AP', 'MOBILE'];
const categories = ['server', 'workstation', 'network_device', 'mobile_device'];
const locations = ['Building A', 'Building B', 'Data Center', 'Remote', 'Offsite Backup', 'HQ Floor 3', 'HQ Floor 1'];

const assetInsert = db.prepare(`INSERT INTO assets (id, name, category, assigned_to, location, last_audit) VALUES (?, ?, ?, ?, ?, ?)`);

for (let i = 1; i <= 50; i++) {
  const baseName = assetNames[(i - 1) % assetNames.length];
  const name = `${baseName}-${String(i).padStart(3, '0')}`;
  const category = categories[(i - 1) % categories.length];
  const assignedTo = ((i - 1) % 50) + 1;
  const location = locations[(i - 1) % locations.length];
  const year = 2024 + ((i - 1) % 2);
  const month = String(((i - 1) % 12) + 1).padStart(2, '0');
  const day = String(((i - 1) % 28) + 1).padStart(2, '0');
  assetInsert.run(i, name, category, assignedTo, location, `${year}-${month}-${day}`);
}

const actions = ['login', 'logout', 'file_access', 'config_change'];

const logInsert = db.prepare(`INSERT INTO access_logs (id, user_id, asset_id, action, timestamp, success) VALUES (?, ?, ?, ?, ?, ?)`);

for (let i = 1; i <= 50; i++) {
  const userId = ((i - 1) % 50) + 1;
  const assetId = ((i - 1) % 50) + 1;
  const action = actions[(i - 1) % actions.length];
  const year = 2024 + ((i - 1) % 2);
  const month = String(((i - 1) % 12) + 1).padStart(2, '0');
  const day = String(((i - 1) % 28) + 1).padStart(2, '0');
  const hour = String((i - 1) % 24).padStart(2, '0');
  const minute = String((i * 3) % 60).padStart(2, '0');
  const timestamp = `${year}-${month}-${day}T${hour}:${minute}:00Z`;
  const success = i % 4 === 0 ? 0 : 1;
  logInsert.run(i, userId, assetId, action, timestamp, success);
}

console.log('Database seeded successfully.');
console.log('  personnel: 50 rows');
console.log('  incidents: 50 rows');
console.log('  assets:    50 rows');
console.log('  access_logs: 50 rows');

db.close();
