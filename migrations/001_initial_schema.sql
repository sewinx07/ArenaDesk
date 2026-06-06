-- ArenaDesk OS - Initial Database Schema
-- PostgreSQL Migration 001
-- This migration creates the complete schema for ArenaDesk OS

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'customer' CHECK (role IN ('owner', 'staff', 'customer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- CAFES (multi-tenant)
-- ============================================
CREATE TABLE cafes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cafes_owner ON cafes(owner_id);

-- Junction table for staff-cafe assignment
CREATE TABLE cafe_staff (
  cafe_id UUID NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (cafe_id, user_id)
);

-- ============================================
-- PCS
-- ============================================
CREATE TABLE pcs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cafe_id UUID NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'in_use', 'reserved', 'offline')),
  hourly_rate DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pcs_cafe ON pcs(cafe_id);
CREATE INDEX idx_pcs_status ON pcs(status);

-- ============================================
-- SESSIONS
-- ============================================
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pc_id UUID NOT NULL REFERENCES pcs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  total_price DECIMAL(10, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_pc ON sessions(pc_id);
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_sessions_active ON sessions(pc_id) WHERE status = 'active';

-- ============================================
-- RESERVATIONS
-- ============================================
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pc_id UUID NOT NULL REFERENCES pcs(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reservations_pc ON reservations(pc_id);
CREATE INDEX idx_reservations_user ON reservations(user_id);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_time ON reservations(start_time, end_time);

-- ============================================
-- TRANSACTIONS
-- ============================================
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID UNIQUE NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('cash', 'card', 'mobile')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_session ON transactions(session_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(created_at);

-- ============================================
-- TOURNAMENTS
-- ============================================
CREATE TABLE tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cafe_id UUID NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  game VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'registration' CHECK (status IN ('registration', 'in_progress', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tournaments_cafe ON tournaments(cafe_id);
CREATE INDEX idx_tournaments_status ON tournaments(status);

-- ============================================
-- TOURNAMENT PARTICIPANTS
-- ============================================
CREATE TABLE tournament_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  team_name VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tournament_id, user_id)
);

CREATE INDEX idx_tournament_participants_tournament ON tournament_participants(tournament_id);
CREATE INDEX idx_tournament_participants_user ON tournament_participants(user_id);

-- ============================================
-- AUDIT LOGS
-- ============================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cafe_id UUID REFERENCES cafes(id) ON DELETE SET NULL,
  action VARCHAR(255) NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_cafe ON audit_logs(cafe_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_date ON audit_logs(created_at);

-- ============================================
-- HEARTBEAT TRACKING (for desktop clients)
-- ============================================
CREATE TABLE pc_heartbeats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pc_id UUID NOT NULL REFERENCES pcs(id) ON DELETE CASCADE,
  last_heartbeat TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_connected BOOLEAN NOT NULL DEFAULT true
);

CREATE UNIQUE INDEX idx_pc_heartbeats_pc ON pc_heartbeats(pc_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update heartbeat timestamp
CREATE OR REPLACE FUNCTION update_heartbeat()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO pc_heartbeats (pc_id, last_heartbeat, is_connected)
  VALUES (NEW.id, NOW(), true)
  ON CONFLICT (pc_id)
  DO UPDATE SET last_heartbeat = NOW(), is_connected = true;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to detect stale PCs (no heartbeat > 30 seconds) and auto-lock
CREATE OR REPLACE FUNCTION auto_lock_stale_pcs()
RETURNS TABLE(pc_id UUID, pc_name VARCHAR) AS $$
BEGIN
  RETURN QUERY
  UPDATE pcs
  SET status = 'offline'
  FROM pc_heartbeats
  WHERE pcs.id = pc_heartbeats.pc_id
    AND pc_heartbeats.is_connected = true
    AND pc_heartbeats.last_heartbeat < NOW() - INTERVAL '35 seconds'
    AND pcs.status = 'in_use'
  RETURNING pcs.id, pcs.name;
END;
$$ LANGUAGE plpgsql;
