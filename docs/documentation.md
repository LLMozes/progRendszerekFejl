# Projekt dokumentáció

## 1. Bevezetés

A projekt egy szokáskövető webalkalmazás, amely a mindennapi rutinok és célok nyomon követését támogatja. A felhasználók regisztráció és bejelentkezés után saját szokásokat hozhatnak létre, szerkeszthetnek, törölhetnek és teljesítéseket rögzíthetnek. Az admin szerepkör külön felületet kap a felhasználók, kategóriák és rendszerlogok kezelésére.

## 2. Választott technológiai stack

- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express + TypeScript
- Adatbázis: SQLite
- ORM: Prisma
- Hitelesítés: express-session + bcrypt
- Fejlesztői környezet: VS Code + GitHub Copilot

Rövid szerepkörök:
- React + Vite + TypeScript: modern, komponens-alapú frontend és gyors fejlesztés.
- Node.js + Express + TypeScript: REST API, típusbiztos backend logika.
- SQLite: egyszerűen futtatható helyi adatbázis.
- Prisma: adatmodell, migrációk, lekérdezések.
- express-session + bcrypt: session alapú bejelentkezés és jelszóhashelés.

## 3. Technológiai döntések indoklása

Az SQLite adatbázis választásának oka, hogy a projekt helyi fejlesztési környezetben egyszerűen futtatható, nem igényel külön adatbázis-szerver telepítést. A Prisma ORM segíti az adatmodell, a kapcsolatok és a migrációk kezelését, valamint egységesíti az adatbázis műveleteket.

A React + Vite + TypeScript frontend gyors fejlesztést tesz lehetővé, jól használható VS Code környezetben, és alkalmas modern webes felület kialakítására.

A Node.js + Express + TypeScript backend egyszerűen alkalmas REST API végpontok kialakítására, amelyek a frontend és az adatbázis közötti kommunikációt biztosítják.

Az express-session + bcrypt használata biztosítja a session alapú hitelesítést és a jelszavak biztonságos tárolását.

## 4. Funkcionális követelmények

Rövid összefoglaló a megvalósított funkciókról:
- regisztráció, bejelentkezés, kijelentkezés
- session alapú hitelesítés
- saját szokások kezelése (lista, létrehozás, szerkesztés, törlés)
- teljesítések rögzítése és listázása
- egyszerű dashboard statisztikák
- admin felhasználó- és kategóriakezelés
- rendszerlogok megtekintése

Részletes leírás: [docs/functional-requirements.md](functional-requirements.md)

## 5. Nem-funkcionális követelmények

Rövid összefoglaló:
- egyszerű használhatóság és átlátható felület
- frontend és backend szétválasztása
- REST API alapú kommunikáció
- alapvető jogosultságkezelés
- jelszóhashelés bcrypt segítségével
- karbantartható TypeScript kód

Részletes leírás: [docs/non-functional-requirements.md](non-functional-requirements.md)

## 6. Adatmodell

A fő entitások: User, Category, Habit, HabitCompletion, SystemLog. A modell lefedi a felhasználók, szokások, teljesítések és admin műveletek nyomon követését.

Részletes leírás: [docs/database-model.md](database-model.md)

## 7. REST API végpontok

Az API REST alapú, a végpontok auth, habit, completion, statistics és admin csoportokba rendezettek.

Rövid áttekintés: [docs/api-overview.md](api-overview.md)

## 8. Telepítés és futtatás

Rövid telepítési lépések:

Backend:
- `cd backend`
- `npm install`
- `npx prisma migrate deploy` (vagy fejlesztéshez `npx prisma migrate dev`)
- `npm run seed`
- `npm run dev`

Frontend:
- `cd frontend`
- `npm install`
- `npm run dev`