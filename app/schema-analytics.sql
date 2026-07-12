-- Page visits. Aggregate only.
--
-- The site tells readers it does not track them, so this has to stay true to that.
-- There is NO session, NO cookie, NO per-person row and NO IP address stored.
--
-- pageviews holds a running count per day per path. Nothing identifies anybody.
--
-- visitors exists only to answer "how many PEOPLE, not how many clicks". It stores
-- a hash of (salt + ip + day). The day is inside the hash on purpose: the same
-- reader hashes to a DIFFERENT value tomorrow, so the table cannot be used to
-- follow anyone across days even by the person who owns it. It answers "how many
-- distinct visitors today" and nothing else.
CREATE TABLE IF NOT EXISTS pageviews (
  day   TEXT    NOT NULL,
  path  TEXT    NOT NULL,
  views INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, path)
);

CREATE TABLE IF NOT EXISTS visitors (
  day          TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  PRIMARY KEY (day, visitor_hash)
);
