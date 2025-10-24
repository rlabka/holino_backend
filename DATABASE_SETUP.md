# PostgreSQL Database Setup für Holino Backend

## 🚀 Schnellstart

### 1. PostgreSQL installieren

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**macOS (mit Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Windows:**
- Download von [postgresql.org](https://www.postgresql.org/download/windows/)
- Oder mit Chocolatey: `choco install postgresql`

### 2. Datenbank erstellen

```bash
# Als postgres User anmelden
sudo -u postgres psql

# Datenbank und User erstellen
CREATE DATABASE holino_db;
CREATE USER holino_user WITH PASSWORD 'holino_password';
GRANT ALL PRIVILEGES ON DATABASE holino_db TO holino_user;
\q
```

### 3. Environment-Variablen konfigurieren

Kopiere `env.example` zu `.env` und passe die Datenbank-URL an:

```bash
cp env.example .env
```

Bearbeite `.env`:
```env
DATABASE_URL="postgresql://holino_user:holino_password@localhost:5432/holino_db?schema=public"
```

### 4. Prisma Client generieren und Migrationen ausführen

```bash
# Prisma Client generieren
npm run db:generate

# Erste Migration erstellen und ausführen
npm run db:migrate

# Testdaten einfügen (optional)
npm run db:seed
```

### 5. Server starten

```bash
# Development
npm run dev

# Production
npm start
```

## 📊 Datenbank-Schema

Das Schema enthält folgende Hauptmodelle:

- **User**: Benutzer mit Account-Typen (Privat/Gewerblich)
- **Service**: Angebotene Services mit Kategorien
- **Booking**: Buchungen zwischen Benutzern und Services
- **Review**: Bewertungen für Services
- **Message**: Nachrichten zwischen Benutzern
- **Favorite**: Favorisierte Services

## 🛠️ Nützliche Commands

```bash
# Prisma Studio öffnen (GUI für Datenbank)
npm run db:studio

# Neue Migration erstellen
npx prisma migrate dev --name migration_name

# Migrationen in Production deployen
npm run db:deploy

# Datenbank zurücksetzen
npx prisma migrate reset
```

## 🔧 Troubleshooting

### Verbindungsfehler
- Prüfe ob PostgreSQL läuft: `sudo systemctl status postgresql`
- Prüfe die DATABASE_URL in `.env`
- Prüfe ob der User die richtigen Rechte hat

### Migration-Fehler
- Lösche den `migrations` Ordner und führe `npm run db:migrate` erneut aus
- Prüfe ob die Datenbank leer ist vor der ersten Migration

### Port-Konflikte
- Standard PostgreSQL Port ist 5432
- Prüfe ob der Port frei ist: `netstat -tulpn | grep 5432`

## 📝 Nächste Schritte

1. **API-Endpunkte** für alle Modelle erstellen
2. **Authentifizierung** mit JWT implementieren
3. **Validierung** mit express-validator
4. **File Upload** für Service-Bilder
5. **Search & Filter** Funktionalität
6. **Real-time Messaging** mit WebSockets
