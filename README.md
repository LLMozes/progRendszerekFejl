# Szokáskövető alkalmazás / Habit Tracker

Ez a projekt a Programrendszerek fejlesztése című egyetemi tárgy beadandó projektmunkája.

## Rövid leírás

Az alkalmazás célja, hogy a felhasználók saját szokásokat hozhassanak létre, kezelhessék azokat, és teljesítéseket rögzíthessenek. Az admin felhasználók kezelhetik a felhasználókat, kategóriákat és rendszerlogokat.

## Technológiai stack

- **Frontend**: React + Vite + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Adatbázis**: SQLite
- **ORM**: Prisma
- **Hitelesítés**: express-session + bcrypt

## Fő funkciók

- Regisztráció
- Bejelentkezés és kijelentkezés
- Session alapú hitelesítés
- Szokások CRUD kezelése
- Szokásteljesítések kezelése
- Dashboard statisztikák
- Admin felhasználókezelés
- Admin kategóriakezelés
- Rendszerlogok megtekintése

## Projekt mappastruktúra

```text
backend/    # Backend kód és konfiguráció
frontend/   # Frontend kód és konfiguráció
docs/       # Dokumentációk
prompts/    # AI használati promptok és elemzések
```

## Előfeltételek

- Node.js
- npm
- Git
- VS Code (ajánlott)

## Backend telepítése és futtatása

```bash
cd backend
npm install
npx prisma migrate dev
npm run seed
npm run dev
```

## Frontend telepítése és futtatása

```bash
cd frontend
npm install
npm run dev
```

## Alapértelmezett elérési URL-ek

- **Backend**: [http://localhost:5000](http://localhost:5000)
- **Frontend**: [http://localhost:5173](http://localhost:5173)

## Demo felhasználók

- **Admin**:
  - Email: `admin@example.com`
  - Jelszó: `Admin1234`

- **Normál felhasználó pl:**:
    - Email: `test@example.com`
    - Jelszó: `Test1234`

  - A demo felhasználók adatai a `backend/prisma/seed.ts` fájlban találhatók.

## Dokumentáció

A részletes dokumentáció a `docs` mappában található:

- `api-overview.md`: API áttekintés
- `database-model.md`: Adatbázismodell
- `functional-requirements.md`: Funkcionális követelmények
- `non-functional-requirements.md`: Nem funkcionális követelmények

## AI használat dokumentációja

A fejlesztés során használt promptok és promptelemzések a `prompts` mappában találhatók.

## Megjegyzés az adatbázishoz

A projekt SQLite adatbázist használ, amely helyileg jön létre a Prisma migrációval és seedeléssel. A migrációk és seedelés biztosítják az alapértelmezett adatok létrehozását a fejlesztési környezetben.