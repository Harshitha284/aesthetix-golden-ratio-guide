-- D1 Database Schema for UMAX AI Looksmaxxing

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    streak_days INTEGER DEFAULT 1,
    last_active_date TEXT,
    overall_rating REAL DEFAULT 0,
    potential_rating REAL DEFAULT 0,
    tier TEXT DEFAULT 'Bronze Maxxer',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scans (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    overall_score REAL NOT NULL,
    potential_score REAL NOT NULL,
    jawline_score REAL NOT NULL,
    cheekbones_score REAL NOT NULL,
    masculinity_score REAL NOT NULL,
    skin_quality_score REAL NOT NULL,
    canthal_tilt_score REAL NOT NULL,
    hair_score REAL NOT NULL,
    symmetry_score REAL NOT NULL,
    face_shape TEXT NOT NULL,
    archetype TEXT NOT NULL,
    strengths_json TEXT NOT NULL,
    flaws_json TEXT NOT NULL,
    recommendations_json TEXT NOT NULL,
    image_preview TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS habits (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS leaderboards (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    tier TEXT NOT NULL,
    overall_score REAL NOT NULL,
    potential_score REAL NOT NULL,
    avatar_index INTEGER DEFAULT 1,
    verified INTEGER DEFAULT 1
);

-- Seed initial leaderboard entries
INSERT OR IGNORE INTO leaderboards (id, username, tier, overall_score, potential_score, avatar_index, verified)
VALUES
('lb-1', 'Jordan "Apex" V.', 'God Tier Maxxer', 94.2, 98.0, 1, 1),
('lb-2', 'Alexander K.', 'Chadlite', 88.5, 95.0, 2, 1),
('lb-3', 'Marcus S.', 'High Tier Normie', 83.1, 91.5, 3, 1),
('lb-4', 'David L.', 'Ascending Maxxer', 79.4, 89.2, 4, 1),
('lb-5', 'Kenji T.', 'Chadlite', 86.8, 93.4, 5, 1);
