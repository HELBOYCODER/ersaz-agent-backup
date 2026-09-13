CREATE TABLE _cf_KV (
        key TEXT PRIMARY KEY,
        value BLOB
      ) WITHOUT ROWID;

CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, uuid TEXT, limit_gb REAL, expiry_days INTEGER, ips TEXT, connection_type TEXT, tls TEXT, port INTEGER, used_gb REAL DEFAULT 0, is_active INTEGER DEFAULT 1, last_active INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, advanced_frag TEXT DEFAULT NULL, cipher_suites TEXT DEFAULT NULL, tls_mask TEXT DEFAULT NULL, fingerprint TEXT DEFAULT 'chrome', max_connections INTEGER, limit_req INTEGER, used_req INTEGER DEFAULT 0, ip_limit INTEGER DEFAULT NULL, active_ips TEXT DEFAULT NULL, block_porn INTEGER DEFAULT 0, block_ads INTEGER DEFAULT 0, frag_len TEXT DEFAULT '200-3000', frag_int TEXT DEFAULT '1-2', lifetime_used_gb REAL DEFAULT 0, user_proxy_ip TEXT DEFAULT NULL, user_proxy_iata TEXT DEFAULT NULL, user_socks5 TEXT DEFAULT NULL, auto_reset_vol_days INTEGER DEFAULT 0, auto_reset_req_days INTEGER DEFAULT 0, last_reset_vol_time INTEGER DEFAULT 0, last_reset_req_time INTEGER DEFAULT 0, auto_rotate_ip INTEGER DEFAULT 1, rotate_time INTEGER DEFAULT 0, ip_operator TEXT DEFAULT 'all', ip_count INTEGER DEFAULT 15, last_rotate_time INTEGER DEFAULT 0, auto_rotate_user_proxy INTEGER DEFAULT 0, start_on_first_connect INTEGER DEFAULT 0, first_connection_time INTEGER DEFAULT NULL, trojan_hash TEXT DEFAULT NULL, enable_direct INTEGER DEFAULT 1);

CREATE TABLE sqlite_sequence(name,seq);

CREATE TABLE settings (key TEXT PRIMARY KEY, value TEXT);

CREATE TABLE user_manual_configs (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, config_line TEXT NOT NULL, label TEXT DEFAULT '', limit_gb REAL DEFAULT 0, expiry_days INTEGER DEFAULT 0, used_gb REAL DEFAULT 0, created_at INTEGER DEFAULT (strftime('%s','now')*1000), is_active INTEGER DEFAULT 1);

CREATE TABLE netra_hub_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    uuid TEXT UNIQUE NOT NULL,
    limit_gb REAL DEFAULT 0,
    expiry_days INTEGER DEFAULT 30,
    used_bytes INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at INTEGER NOT NULL
);

CREATE TABLE netra_hub_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);
