import SQLite from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';

SQLite.enablePromise(true);

const DB_NAME = 'expenses.db';
const DB_LOCATION: any = 'default';

export interface ExpenseRow {
  id: number;
  category: string;
  amount: number;
  note?: string | null;
  created_at: string; // ISO
}

export interface CategoryTotal { category: string; total: number; }

let db: SQLite.SQLiteDatabase | null = null;

export async function openDb() {
  if (db) return db;
  db = await SQLite.openDatabase({ name: DB_NAME, location: DB_LOCATION });
  await db.executeSql(`CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    amount REAL NOT NULL,
    note TEXT,
    created_at TEXT NOT NULL
  );`);
  await db.executeSql('CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);');
  return db;
}

export async function addExpense(category: string, amount: number, note?: string) {
  const database = await openDb();
  const created = new Date().toISOString();
  await database.executeSql('INSERT INTO expenses(category, amount, note, created_at) VALUES (?,?,?,?)', [category, amount, note ?? null, created]);
}

export async function listExpenses(limit = 100, offset = 0): Promise<ExpenseRow[]> {
  const database = await openDb();
  const [result] = await database.executeSql('SELECT * FROM expenses ORDER BY id DESC LIMIT ? OFFSET ?', [limit, offset]);
  const rows: ExpenseRow[] = [];
  for (let i = 0; i < result.rows.length; i++) rows.push(result.rows.item(i));
  return rows;
}

export async function categoryTotals(): Promise<CategoryTotal[]> {
  const database = await openDb();
  const [result] = await database.executeSql('SELECT category, SUM(amount) as total FROM expenses GROUP BY category ORDER BY total DESC');
  const rows: CategoryTotal[] = [];
  for (let i = 0; i < result.rows.length; i++) rows.push(result.rows.item(i));
  return rows;
}

export async function deleteExpense(id: number) {
  const database = await openDb();
  await database.executeSql('DELETE FROM expenses WHERE id=?', [id]);
}

export async function backupDatabase(): Promise<string> {
  // copy db file to Documents with timestamp
  const src = `${RNFS.LibraryDirectoryPath}/LocalDatabase/${DB_NAME}`; // iOS default
  const androidSrc = `${RNFS.DocumentDirectoryPath}/${DB_NAME}`; // may vary
  const timestamp = Date.now();
  const dest = `${RNFS.DocumentDirectoryPath}/expenses-backup-${timestamp}.db`;
  try {
    const exists = await RNFS.exists(src);
    if (exists) {
      await RNFS.copyFile(src, dest);
      return dest;
    }
    const existsAndroid = await RNFS.exists(androidSrc);
    if (existsAndroid) {
      await RNFS.copyFile(androidSrc, dest);
      return dest;
    }
    throw new Error('Database file not found for backup');
  } catch (e:any) {
    throw new Error(e.message || 'Backup failed');
  }
}

export async function restoreDatabase(filePath: string) {
  // close current db and replace file (best-effort)
  if (db) {
    try { await db.close(); } catch {}
    db = null;
  }
  const target = `${RNFS.LibraryDirectoryPath}/LocalDatabase/${DB_NAME}`;
  const androidTarget = `${RNFS.DocumentDirectoryPath}/${DB_NAME}`;
  try {
    const dest = (await RNFS.exists(target)) || !(await RNFS.exists(androidTarget)) ? target : androidTarget;
    await RNFS.copyFile(filePath, dest);
  } catch (e:any) {
    throw new Error(e.message || 'Restore failed');
  }
}

export async function clearAll() {
  const database = await openDb();
  await database.executeSql('DELETE FROM expenses');
}
