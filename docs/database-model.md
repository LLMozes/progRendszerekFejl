# Adatmodell

## Entitasok es celjaik

- User: felhasznalok adatai es szerepkoruk (USER/ADMIN).
- Category: szokasok kategoriai.
- Habit: felhasznalohoz tartozo szokas rekord.
- HabitCompletion: egy szokas teljesitesi bejegyzese.
- SystemLog: rendszer es admin muveletek naplozasa.

## Fontosabb mezok

- User: id, name, email, passwordHash, role, createdAt
- Category: id, name, description, isDefault, createdAt
- Habit: id, title, description, goal, frequency, createdAt, updatedAt, userId, categoryId
- HabitCompletion: id, completedAt, value, note, habitId
- SystemLog: id, action, createdAt, userId

## Kapcsolatok

- Egy User tobb Habit rekorddal rendelkezhet.
- Egy Category tobb Habit rekordhoz kapcsolodhat.
- Egy Habit tobb HabitCompletion rekorddal rendelkezhet.
- Egy SystemLog opcionálisan kapcsolodhat User rekordhoz.

## Minimum 5 entitas kovetelmeny

A modell ot entitast tartalmaz (User, Category, Habit, HabitCompletion, SystemLog), igy megfelel a minimum kovetelmenynek. A strukturabol kovetkezik a felhasznalo-szokas-teljesites es az admin naplozas logikai kapcsolata.

## Demo adatok kapcsolata

A seed script admin felhasznalot es alap kategoriakat hoz letre, igy a felulet azonnal hasznalhato es kiprobalhato fejleszteskor.
