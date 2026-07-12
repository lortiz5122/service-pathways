-- Feedback from readers. Deliberately minimal.
--
-- This site promises that nothing a reader does here is sent to a recruiter, and
-- that promise has to survive contact with a form. So: no account, no tracking,
-- no raw IP. Contact is OPTIONAL and stored only because a correction sometimes
-- needs a follow-up question. The IP is stored ONLY as a salted hash, and only to
-- stop a bot filling the table — it cannot be reversed to an address.
CREATE TABLE IF NOT EXISTS feedback (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT    NOT NULL,
  kind       TEXT    NOT NULL,   -- correction | missing | broken | suggestion | other
  page       TEXT,               -- where they were when they hit send
  message    TEXT    NOT NULL,
  contact    TEXT,               -- optional; empty string when not given
  ua         TEXT,
  ip_hash    TEXT,               -- salted hash, for rate limiting only
  handled    INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_iphash  ON feedback (ip_hash, created_at);
