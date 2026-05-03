# Szokáskövető alkalmazás

Ez a projekt a Programrendszerek fejlesztése című egyetemi tárgy beadandó projektmunkája.

## Projekt célja

Az alkalmazás célja, hogy a felhasználók saját szokásokat hozhassanak létre, azokhoz célt, gyakoriságot és kategóriát rendelhessenek, majd napi vagy heti teljesítéseket rögzíthessenek.

## Fő funkciók

- Felhasználói regisztráció
- Bejelentkezés és kijelentkezés
- Session alapú hitelesítés
- Szokások létrehozása, listázása, szerkesztése és törlése
- Teljesítések rögzítése
- Egyszerű statisztikák megtekintése
- Admin felhasználókezelés
- Admin kategóriakezelés
- Rendszerhasználati napló megtekintése

## Tervezett technológiai stack

- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express + TypeScript
- Adatbázis: SQLite
- ORM: Prisma
- Hitelesítés: express-session + bcrypt

## Mappastruktúra

```text
backend/
frontend/
docs/
prompts/
.github/