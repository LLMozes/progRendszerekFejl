# REST API attekintes

## Auth vegpontok

- POST /api/auth/register
  - Cel: uj felhasznalo letrehozasa
  - Bejelentkezes szukseges: nem
  - Admin jogosultsag szukseges: nem

- POST /api/auth/login
  - Cel: bejelentkezes session letrehozassal
  - Bejelentkezes szukseges: nem
  - Admin jogosultsag szukseges: nem

- POST /api/auth/logout
  - Cel: kijelentkezes, session torlese
  - Bejelentkezes szukseges: igen
  - Admin jogosultsag szukseges: nem

- GET /api/auth/me
  - Cel: bejelentkezett felhasznalo adatai
  - Bejelentkezes szukseges: igen
  - Admin jogosultsag szukseges: nem

## Habit vegpontok

- GET /api/habits
  - Cel: sajat szokasok listazasa
  - Bejelentkezes szukseges: igen
  - Admin jogosultsag szukseges: nem

- GET /api/habits/:id
  - Cel: egy szokas lekerdezese
  - Bejelentkezes szukseges: igen
  - Admin jogosultsag szukseges: nem

- POST /api/habits
  - Cel: uj szokas letrehozasa
  - Bejelentkezes szukseges: igen
  - Admin jogosultsag szukseges: nem

- PUT /api/habits/:id
  - Cel: szokas frissitese
  - Bejelentkezes szukseges: igen
  - Admin jogosultsag szukseges: nem

- DELETE /api/habits/:id
  - Cel: szokas torlese
  - Bejelentkezes szukseges: igen
  - Admin jogosultsag szukseges: nem

## HabitCompletion vegpontok

- GET /api/habits/:habitId/completions
  - Cel: teljesitesek listazasa egy szokashoz
  - Bejelentkezes szukseges: igen
  - Admin jogosultsag szukseges: nem

- POST /api/habits/:habitId/completions
  - Cel: uj teljesites rogzitese
  - Bejelentkezes szukseges: igen
  - Admin jogosultsag szukseges: nem

- PUT /api/completions/:id
  - Cel: teljesites frissitese
  - Bejelentkezes szukseges: igen
  - Admin jogosultsag szukseges: nem

- DELETE /api/completions/:id
  - Cel: teljesites torlese
  - Bejelentkezes szukseges: igen
  - Admin jogosultsag szukseges: nem

## Statistics vegpontok

- GET /api/statistics/summary
  - Cel: osszesitett statisztikak
  - Bejelentkezes szukseges: igen
  - Admin jogosultsag szukseges: nem

- GET /api/statistics/habits/:habitId
  - Cel: egy szokas statisztikaja
  - Bejelentkezes szukseges: igen
  - Admin jogosultsag szukseges: nem

## Admin vegpontok

- GET /api/admin/users
  - Cel: felhasznalok listazasa
  - Bejelentkezes szukseges: igen
  - Admin jogosultsag szukseges: igen

- PUT /api/admin/users/:id/role
  - Cel: szerepkor modositas
  - Bejelentkezes szukseges: igen
  - Admin jogosultsag szukseges: igen

- DELETE /api/admin/users/:id
  - Cel: felhasznalo torlese
  - Bejelentkezes szukseges: igen
  - Admin jogosultsag szukseges: igen

- GET /api/admin/categories
  - Cel: kategoriak listazasa
  - Bejelentkezes szukseges: igen
  - Admin jogosultsag szukseges: igen

- POST /api/admin/categories
  - Cel: uj kategoria letrehozasa
  - Bejelentkezes szukseges: igen
  - Admin jogosultsag szukseges: igen

- PUT /api/admin/categories/:id
  - Cel: kategoria frissitese
  - Bejelentkezes szukseges: igen
  - Admin jogosultsag szukseges: igen

- DELETE /api/admin/categories/:id
  - Cel: kategoria torlese
  - Bejelentkezes szukseges: igen
  - Admin jogosultsag szukseges: igen

- GET /api/admin/system-logs
  - Cel: rendszerlogok listazasa
  - Bejelentkezes szukseges: igen
  - Admin jogosultsag szukseges: igen
