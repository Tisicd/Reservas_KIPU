import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "reservas.db");

let sqlite: Database.Database | null = null;
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;
let initialized = false;

function getSqlite() {
  if (!sqlite) {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    sqlite = new Database(DB_PATH);
    sqlite.pragma("journal_mode = WAL");
    sqlite.pragma("foreign_keys = ON");
    sqlite.pragma("busy_timeout = 5000");
  }
  return sqlite;
}

function initDatabase() {
  if (initialized) return;
  const db = getSqlite();
  db.exec(`
    CREATE TABLE IF NOT EXISTS eventos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      descripcion TEXT,
      fecha TEXT NOT NULL,
      hora TEXT NOT NULL,
      ubicacion TEXT NOT NULL,
      capacidad_maxima INTEGER DEFAULT 30,
      activo INTEGER DEFAULT 1,
      requiere_pago INTEGER DEFAULT 0,
      precio INTEGER DEFAULT 0,
      metodos_pago TEXT DEFAULT 'qr',
      creado_en TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_completo TEXT NOT NULL,
      edad INTEGER NOT NULL,
      idiomas TEXT NOT NULL,
      telefono TEXT,
      email TEXT,
      creado_en TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS reservas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      evento_id INTEGER NOT NULL REFERENCES eventos(id),
      cliente_id INTEGER NOT NULL REFERENCES clientes(id),
      es_usuario_nuevo INTEGER NOT NULL,
      como_se_entero TEXT NOT NULL,
      notas TEXT,
      metodo_pago TEXT,
      comprobante_url TEXT,
      estado TEXT DEFAULT 'pendiente',
      registrado_en TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE INDEX IF NOT EXISTS idx_reservas_evento ON reservas(evento_id);
    CREATE INDEX IF NOT EXISTS idx_reservas_cliente ON reservas(cliente_id);
    CREATE INDEX IF NOT EXISTS idx_eventos_fecha ON eventos(fecha);
  `);

  try {
    const migrateReservas = () => {
      const cols = db.pragma("table_info(reservas)") as { name: string }[];
      const colNames = cols.map((c) => c.name);

      if (!colNames.includes("metodo_pago")) {
        db.exec("ALTER TABLE reservas ADD COLUMN metodo_pago TEXT");
      }
      if (!colNames.includes("comprobante_url")) {
        db.exec("ALTER TABLE reservas ADD COLUMN comprobante_url TEXT");
      }
      if (!colNames.includes("estado")) {
        db.exec("ALTER TABLE reservas ADD COLUMN estado TEXT DEFAULT 'pendiente'");
      }
    };

    const migrateEventos = () => {
      const cols = db.pragma("table_info(eventos)") as { name: string }[];
      const colNames = cols.map((c) => c.name);

      if (!colNames.includes("requiere_pago")) {
        db.exec("ALTER TABLE eventos ADD COLUMN requiere_pago INTEGER DEFAULT 0");
      }
      if (!colNames.includes("precio")) {
        db.exec("ALTER TABLE eventos ADD COLUMN precio INTEGER DEFAULT 0");
      }
      if (!colNames.includes("metodos_pago")) {
        db.exec("ALTER TABLE eventos ADD COLUMN metodos_pago TEXT DEFAULT 'qr'");
      }
    };

    migrateReservas();
    migrateEventos();
  } catch {
    // columns already exist or table doesn't exist yet
  }

  initialized = true;
}

export function getDb() {
  initDatabase();
  if (!dbInstance) {
    dbInstance = drizzle(getSqlite(), { schema });
  }
  return dbInstance;
}

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop) {
    const instance = getDb();
    const value = instance[prop as keyof typeof instance];
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
