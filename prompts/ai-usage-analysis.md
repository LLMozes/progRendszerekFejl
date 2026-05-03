# AI-használat és promptelemzés


## 1. Bevezetés

A projektmunka keretében egy teljes web-rendszer készült el, amely egy **Szokáskövető alkalmazást** valósít meg. Az alkalmazás célja, hogy a felhasználók regisztráció után saját szokásokat hozhassanak létre, azokat kategóriákba rendezhessék, célokat és gyakoriságot adhassanak meg hozzájuk, majd napi vagy heti teljesítéseket rögzíthessenek.

A rendszer tartalmaz:

- adatbázist,
- szerver oldali REST API-t,
- webes felhasználói felületet,
- session alapú hitelesítést,
- adminisztrátori funkciókat,
- szoftveres dokumentációt,
- valamint a fejlesztés során használt AI-promptok és beszélgetések dokumentálását.

A fejlesztés során **GitHub Copilot Chat** került felhasználásra fejlesztői segédeszközként. Az AI használata nem helyettesítette az önálló fejlesztői munkát, hanem támogatta a tervezési, implementációs, hibakeresési és dokumentációs folyamatokat. A döntéseket, követelményeket és a végleges működést minden esetben fejlesztői ellenőrzés követte.

A teljes, nyers promptnapló külön fájlban került dokumentálásra a repository `prompts` mappájában. Jelen dokumentum ezek rövid elemzését, értékelését és tanulságait tartalmazza.

---

## 2. A projekt rövid bemutatása

A választott téma egy **Szokáskövető alkalmazás**, amelyben a felhasználók saját szokásokat kezelhetnek. A rendszer lehetővé teszi, hogy a regisztrált felhasználók például sport, olvasás, vízfogyasztás vagy tanulás témában hozzanak létre szokásokat.

A felhasználók a szokásokhoz:

- címet,
- leírást,
- célt,
- gyakoriságot,
- kategóriát

rendelhetnek. A szokásokhoz teljesítéseket is rögzíthetnek, majd megtekinthetik korábbi eredményeiket és egyszerű statisztikáikat.

Az adminisztrátor feladata:

- felhasználói fiókok kezelése,
- alapértelmezett kategóriák karbantartása,
- rendszerlogok megtekintése,
- a rendszer használatának figyelemmel követése.

A projekt célja a rendszeres önfejlesztés támogatása, valamint egy teljes webes rendszer bemutatása adatbázissal, backenddel, frontenddel, hitelesítéssel és dokumentációval.

---

## 3. A projektben használt technológiai stack

A fejlesztés során az alábbi technológiák kerültek felhasználásra:

| Réteg | Technológia | Szerepe |
|---|---|---|
| Frontend | React | Webes felhasználói felület megvalósítása |
| Frontend build tool | Vite | Gyors fejlesztői környezet biztosítása |
| Frontend nyelv | TypeScript | Típusosabb, karbantarthatóbb frontend kód |
| Backend | Node.js | Szerver oldali futtatókörnyezet |
| Backend keretrendszer | Express | REST API végpontok létrehozása |
| Backend nyelv | TypeScript | Típusosabb, átláthatóbb backend fejlesztés |
| Adatbázis | SQLite | Helyi fejlesztéshez egyszerű relációs adatbázis |
| ORM | Prisma | Adatmodell és adatbázis-műveletek kezelése |
| Hitelesítés | express-session | Session alapú bejelentkezés kezelése |
| Jelszóvédelem | bcrypt | Jelszavak biztonságos hashelése |
| Fejlesztői eszköz | VS Code + GitHub Copilot | Kódírás, hibakeresés és dokumentáció támogatása |

---

## 4. Az AI használatának célja

Az AI használatának célja az volt, hogy támogassa a fejlesztés különböző fázisait. A GitHub Copilot Chat segítséget nyújtott:

- adatmodell kialakításában,
- Prisma séma létrehozásában,
- backend REST API-k elkészítésében,
- session alapú hitelesítés megvalósításában,
- CRUD műveletek implementálásában,
- frontend oldalak felépítésében,
- hibák értelmezésében,
- UI/UX finomításban,
- dokumentáció írásában,
- promptok és beszélgetések rendszerezésében.

Az AI-t minden esetben konkrét fejlesztési feladatra használtam. A promptokban igyekeztem megadni az érintett fájlokat, az elvárt technológiákat, a tiltott módosításokat és az adott fejlesztési rész célját.

---

## 5. Az AI használatának főbb fázisai

### 5.1. Projektstruktúra és fejlesztési irány rögzítése

A fejlesztés elején az AI-t arra használtam, hogy a már meglévő projektstruktúrához igazodva adjon javaslatokat. A projektben már rendelkezésre állt a `backend`, `frontend`, `docs` és `prompts` mappa, ezért fontos volt, hogy az AI ne javasoljon teljesen új architektúrát.

A promptokban többször szerepelt, hogy:

- a meglévő mappastruktúrát meg kell tartani,
- nem szabad új projektfelépítést javasolni,
- csak a megadott fájlokat lehet létrehozni vagy módosítani,
- a backend és frontend réteget külön kell kezelni.

Ez azért volt fontos, mert egy egyetemi beadandó esetében az átlátható, következetes struktúra és az előírások betartása különösen lényeges.

---

### 5.2. Adatbázis és Prisma séma kialakítása

Az AI-t a Prisma ORM és SQLite adatbázis beállításához is használtam. A projektkövetelmény szerint az adatmodellnek legalább 5 entitást kellett tartalmaznia, megfelelő kapcsolatkezeléssel.

A promptban pontosan megadtam az elvárt entitásokat:

- `User`
- `Category`
- `Habit`
- `HabitCompletion`
- `SystemLog`

A prompt tartalmazta az egyes mezőket, az enumokat és a kapcsolati szabályokat is. Az AI ennek alapján elkészítette a Prisma séma első változatát.

A fejlesztés során azonban Prisma verzióval kapcsolatos problémák is jelentkeztek, például a `datasource url` kezelésével és a Prisma 7 működésével kapcsolatban. Ezekben az esetekben az AI segítséget nyújtott a hibaüzenetek értelmezésében és a lehetséges javítási lépések meghatározásában.

---

### 5.3. Seed adatok létrehozása

A projektkövetelmény alapján az adatbázisnak alapértelmezetten tartalmaznia kellett demó adatokat. Az AI segítségével készült el a Prisma seed script, amely létrehozott:

- egy admin felhasználót,
- normál felhasználókat,
- alapértelmezett kategóriákat,
- demó szokásokat,
- demó teljesítéseket,
- rendszerlog bejegyzéseket.

Ebben a fázisban több technikai hiba is előjött, például:

- hiányzó Prisma Client generálás,
- hiányzó `bcrypt` csomag,
- Node.js verzióval kapcsolatos problémák,
- `better-sqlite3` telepítési és fordítási problémák.

Az AI ezekben a helyzetekben elsősorban hibakereső asszisztensként működött. A teljes hibaüzenetek megadása után pontosabb javaslatokat tudott adni.

---

### 5.4. Session alapú hitelesítés megvalósítása

A következő fejlesztési fázisban az AI segítségével készült el a session alapú hitelesítés.

A megvalósított auth végpontok:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

A promptban külön szerepelt, hogy:

- `express-session` használata szükséges,
- a jelszavakat `bcrypt` segítségével kell hashelni,
- a session csak a `userId` és `role` értékeket tárolja,
- a `passwordHash` soha nem kerülhet vissza a kliensnek,
- szükséges `requireAuth` és `requireAdmin` middleware.

Ez a prompt jól működött, mert egyértelműen meghatározta a biztonsági és technikai elvárásokat.

---

### 5.5. Backend CRUD végpontok létrehozása

Az AI segítségével készültek el a szokásokhoz kapcsolódó backend CRUD végpontok is.

A megvalósított funkciók:

- szokások listázása,
- egy szokás lekérése,
- szokás létrehozása,
- szokás módosítása,
- szokás törlése.

A promptban fontos szempontként szerepelt, hogy a felhasználók csak a saját szokásaikat érhessék el. Ez a jogosultsági szabály a teljes Habit CRUD implementáció alapja volt.

A backend műveletekhez SystemLog bejegyzések is készültek, így a rendszer adminisztrátori oldalon visszakövethetőbbé vált.

---

### 5.6. HabitCompletion funkciók

Az AI a szokásokhoz tartozó teljesítések kezelésében is segített. A teljesítések külön backend végpontokat kaptak.

A megvalósított műveletek:

- teljesítések listázása,
- teljesítés létrehozása,
- teljesítés módosítása,
- teljesítés törlése.

Itt is fontos követelmény volt, hogy a felhasználók csak a saját szokásaikhoz tartozó teljesítéseket kezelhessék. Az AI a prompt alapján ezt a jogosultsági ellenőrzést is figyelembe vette.

---

### 5.7. Admin funkciók implementálása

Az admin funkciók megvalósítása során az AI backend és frontend oldalon is segítséget nyújtott.

Az admin végpontok segítségével az adminisztrátor:

- listázhatja a felhasználókat,
- módosíthatja a felhasználók szerepkörét,
- törölhet felhasználókat,
- kezelheti a kategóriákat,
- megtekintheti a rendszerlogokat.

A frontend oldalon az AdminPage létrehozásakor több pontosításra volt szükség, mert az AI egy alkalommal nem kódmódosítást végzett, hanem a promptnapló fájlt frissítette. Ezt követően a promptban külön meg kellett határozni, hogy nem dokumentációs bejegyzésre, hanem tényleges React/TypeScript kódmódosításra van szükség.

---

### 5.8. Frontend felület és hitelesítési állapot kezelése

Az AI segítségével készült el a frontend oldali navigáció, az Axios kliens, az AuthContext, valamint a login és register oldalak.

A frontend esetében fontos követelmény volt, hogy az Axios kliens cookie-kat is küldjön a backend felé, mivel a rendszer session alapú hitelesítést használ.

Egy fontos hiba volt a dupla `/api/api` útvonal használata. A Network tab adatai alapján sikerült azonosítani, hogy az Axios baseURL már tartalmazta az `/api` részt, ezért a komponensekben nem volt szabad újra `/api` előtaggal hívni a végpontokat. Az AI segítségével ez a probléma javításra került.

---

### 5.9. Dashboard, HabitsPage és HabitDetailsPage fejlesztése

Az AI-t a fő frontend oldalak fejlesztéséhez is használtam.

A DashboardPage valós statisztikai adatokat jelenít meg a backendről:

- szokások száma,
- teljesítések száma,
- napi szokások száma,
- heti szokások száma.

A HabitsPage lehetővé teszi:

- a szokások listázását,
- új szokás létrehozását,
- meglévő szokás szerkesztését,
- szokás törlését,
- részletező oldal megnyitását.

A HabitDetailsPage lehetővé teszi:

- teljesítések listázását,
- új teljesítés rögzítését,
- teljesítés módosítását,
- teljesítés törlését.

Ezeknél a funkcióknál az AI főként az oldalstruktúra, az API-hívások és az egyszerű állapotkezelés kialakításában segített.

---

### 5.10. UI/UX finomítás

A fejlesztés későbbi szakaszában az AI-t a felhasználói felület javítására is használtam. A promptokban egyértelműen szerepelt, hogy:

- backend kódot nem szabad módosítani,
- API útvonalakat nem szabad megváltoztatni,
- authentication logic nem módosítható,
- meglévő funkciót nem szabad eltávolítani,
- csak a vizuális megjelenés és használhatóság javítható.

Az AI segítségével javult:

- az oldalelrendezés,
- a kártyás megjelenítés,
- az input mezők stílusa,
- a gombok megjelenése,
- az AdminPage áttekinthetősége,
- a Dashboard tartalmi kitöltöttsége.

---

### 5.11. Dokumentáció készítése

Az AI-t a szoftveres dokumentáció elkészítéséhez is használtam. A promptokban megadtam, hogy a dokumentáció magyar nyelvű legyen, egyetemi beadandóhoz illeszkedjen, és csak a projektben ténylegesen használt technológiákat tartalmazza.

Az AI segítségével készültek vagy bővültek:

- `docs/documentation.md`
- `docs/functional-requirements.md`
- `docs/non-functional-requirements.md`
- `docs/database-model.md`
- `docs/api-overview.md`

Fontos volt, hogy a dokumentáció ne tartalmazzon nem használt technológiákat, például MongoDB-t, JWT-t, Dockert vagy felhős adatbázist megvalósított elemként.

---

## 6. Jól működő promptok elemzése

Ebben a fejezetben néhány olyan promptot mutatok be, amelyek jól működtek a fejlesztés során.

---

### 6.1. Prisma séma létrehozása

#### Prompt részlet

```text
Please create or update the Prisma schema with these entities:

1. User
Fields:
- id
- name
- email
- passwordHash
- role
- createdAt

2. Category
Fields:
- id
- name
- description
- isDefault
- createdAt

3. Habit
Fields:
- id
- title
- description
- goal
- frequency
- userId
- categoryId
- createdAt
- updatedAt

Additional requirements:
- Use SQLite-compatible Prisma syntax.
- Add Role enum with USER and ADMIN.
- Add Frequency enum with DAILY and WEEKLY.
- A User can have many Habits.
- A Category can have many Habits.
- A Habit belongs to one User and one Category.
```

#### Értékelés

Ez a prompt jól működött, mert pontosan meghatározta az adatmodell szerkezetét. Az AI nem maga találta ki az entitásokat, hanem egy konkrét specifikáció alapján dolgozott.

#### Miért volt hatékony?

- Pontosan megadta az entitásokat.
- Tartalmazta a mezőket.
- Tartalmazta a kapcsolatokat.
- Megadta az enumokat.
- Rögzítette az adatbázis típusát.
- Egyértelműen jelezte, hogy csak a Prisma sémára kell koncentrálni.

---

### 6.2. Meglévő projektstruktúra megtartása

#### Prompt részlet

```text
You are working on an existing university project. Do NOT redesign or restructure the project.

IMPORTANT:
The project structure is already created and must NOT be changed.

Current project structure:
- backend/
  - src/
    - routes/
    - controllers/
    - services/
    - middlewares/
    - utils/
    - server.ts
  - prisma/
    - schema.prisma
- frontend/
- docs/
- prompts/

Your task:
1. Analyze the current project structure.
2. Continue working WITH this structure.
3. Do NOT create new folders or alternative architectures.
4. Do NOT suggest different project setups.
5. Only modify or extend existing files.
```

#### Értékelés

Ez a prompt azért volt sikeres, mert egyértelműen korlátozta az AI mozgásterét. A Copilot gyakran javasolhat alternatív mappastruktúrát vagy új architektúrát, de ebben az esetben a prompt megtiltotta ezt.

#### Miért volt hatékony?

- Megvédte a meglévő projektstruktúrát.
- Elkerülte a felesleges újratervezést.
- Pontosan kijelölte a módosítás kereteit.
- Egyetemi beadandóhoz illő, kontrollált fejlesztési folyamatot támogatott.

---

### 6.3. Session alapú hitelesítés

#### Prompt részlet

```text
Implement session-based authentication for my existing Habit Tracker backend.

Requirements:
- Use express-session
- Use bcrypt
- Use PrismaClient
- Add auth routes:
  - POST /api/auth/register
  - POST /api/auth/login
  - POST /api/auth/logout
  - GET /api/auth/me
- Store only userId and role in the session
- Never return passwordHash
- Add requireAuth middleware
- Add requireAdmin middleware
- Keep the existing project structure
- Do not create frontend code
- Do not change the Prisma schema
```

#### Értékelés

Ez a prompt jól működött, mert egyszerre tartalmazta a funkcionális, technikai és biztonsági követelményeket.

#### Miért volt hatékony?

- Pontosan felsorolta az auth végpontokat.
- Megadta a használandó csomagokat.
- Tartalmazta a session tartalmára vonatkozó szabályt.
- Kiemelte, hogy `passwordHash` nem kerülhet vissza a kliensnek.
- Megadta, hogy frontend kódot nem kell készíteni.
- Megtiltotta a Prisma séma módosítását.

---

### 6.4. Habit CRUD backend

#### Prompt részlet

```text
Implement authenticated Habit CRUD API endpoints for my existing Habit Tracker backend.

Requirements:
- Use PrismaClient
- Use the existing requireAuth middleware
- Keep the existing project structure
- Do not change the Prisma schema
- Do not create frontend code

Routes:
- GET /api/habits
  - list only the logged-in user's habits
- GET /api/habits/:id
  - return one habit only if it belongs to the logged-in user
- POST /api/habits
  - create a habit for the logged-in user
- PUT /api/habits/:id
  - update only the logged-in user's own habit
- DELETE /api/habits/:id
  - delete only the logged-in user's own habit
```

#### Értékelés

Ez a prompt jól működött, mert minden végponthoz megadta a szükséges jogosultsági szabályt. A rendszer szempontjából kritikus volt, hogy egy felhasználó ne férhessen hozzá más felhasználó szokásaihoz.

#### Miért volt hatékony?

- Minden CRUD végpont külön szerepelt.
- Pontosan megadta az ownership-szabályt.
- Egyértelműen jelezte, hogy autentikált végpontokról van szó.
- Megtiltotta a nem szükséges frontend és adatmodell módosításokat.

---

### 6.5. AdminPage javított prompt

#### Prompt részlet

```text
Important:
- Do NOT edit prompts/prompt-log.md.
- Do NOT edit documentation.
- Do NOT only write a prompt entry.
- I need actual React/TypeScript code changes.
- Modify the AdminPage and related frontend files if needed.
```

#### Értékelés

Ez a prompt egy korábbi félreértést javított ki. Az AI először csak a promptnapló fájlt frissítette, pedig tényleges kódmódosításra lett volna szükség.

#### Miért volt hatékony?

- Egyértelműen megtiltotta a dokumentáció módosítását.
- Kimondta, hogy tényleges kódváltoztatás szükséges.
- Pontosan meghatározta, hogy frontend fájlokat kell módosítani.
- Javította az AI feladatértelmezését.

---

## 7. Kevésbé jól működő promptok elemzése

Ebben a fejezetben olyan promptokat mutatok be, amelyek kevésbé voltak hatékonyak, mert túl kevés információt tartalmaztak vagy félreérthetőek voltak.

---

### 7.1. Túl általános hibaleírás

#### Prompt részlet

```text
most ezt kapom mit csináljak ?
```

#### Probléma

Ez a prompt túl általános volt. Nem tartalmazta:

- a futtatott parancsot,
- a teljes hibaüzenetet,
- az érintett fájlokat,
- a használt technológiai verziót,
- a hiba előzményeit.

#### Következmény

Az AI nem tudott azonnal pontos megoldást adni, ezért vissza kellett kérdeznie a teljes hibaüzenetre.

#### Javított prompt

```text
A backend mappában futtattam ezt a parancsot:

npx prisma migrate dev --name init

Ezt a teljes hibaüzenetet kaptam:
[hibaüzenet teljes szövege]

A Prisma CLI verzióm: 7.8.0.

Kérlek, mondd meg pontosan, melyik fájlban mit kell módosítani.
```

---

### 7.2. Admin hiba túl rövid leírása

#### Prompt részlet

```text
Valamiért az admin az nem megy
```

#### Probléma

A promptból nem derült ki, hogy pontosan mi nem működik:

- nem sikerül az admin bejelentkezés,
- az admin oldal nem tölt be,
- 403-as jogosultsági hiba van,
- rossz a felhasználói szerepkör,
- vagy frontend oldali hiba történik.

#### Következmény

Az AI nem tudott konkrét megoldást adni, csak további kérdéseket tett fel.

#### Javított prompt

```text
Admin felhasználóval próbálok belépni:

Email: admin@example.com
Password: Admin1234

A login sikeres, de az /admin oldalra lépve visszadob a /dashboard oldalra.
A Network tabon a GET /api/auth/me válaszában ez látszik:
[response JSON]

Kérlek, ellenőrizd, hogy a frontend role kezelése és az admin route védelme helyes-e.
```

---

### 7.3. Nem elég pontos újrapróbálkozás

#### Prompt részlet

```text
@agent Try Again
```

#### Probléma

Ez a prompt nem tartalmazott érdemi információt. Nem derült ki belőle:

- mit kell újrapróbálni,
- mi volt a hiba,
- melyik fájlt kell javítani,
- milyen eredmény lenne elvárt.

#### Következmény

Az AI nem tudott célzottan javítani, mert nem kapott új kontextust.

#### Javított prompt

```text
Az előző módosítás után a DashboardPage továbbra is "--" értékeket mutat.
Kérlek, ellenőrizd a frontend/src/pages/DashboardPage.tsx fájlt.

Elvárás:
- használd a GET /statistics/summary endpointot,
- az Axios baseURL már tartalmazza az /api részt,
- ne módosíts backend kódot,
- a dashboard kártyákban jelenjenek meg a valódi értékek.
```

---

### 7.4. Félreérthető kódgenerálási kérés

#### Prompt részlet

```text
Implement the AdminPage frontend for my existing Habit Tracker React app.
```

#### Probléma

Bár a prompt alapvetően jó irányú volt, a korábbi beszélgetési kontextus miatt az AI először nem React kódot módosított, hanem a `prompts/prompt-log.md` fájlba írt bejegyzést.

#### Következmény

A feladatot újra kellett pontosítani.

#### Javított prompt

```text
Important:
- Do NOT edit prompts/prompt-log.md.
- Do NOT edit documentation.
- Do NOT only write a prompt entry.
- I need actual React/TypeScript code changes.

Please apply the code changes directly to:
- frontend/src/pages/AdminPage.tsx
- frontend/src/App.tsx only if routing needs adjustment
- frontend/src/components/Navbar.tsx only if admin link visibility needs adjustment
```

---

## 8. A promptolás során levont tanulságok

A fejlesztés során jól látható volt, hogy az AI válaszainak minősége nagymértékben függ a prompt pontosságától.

A jól működő promptok jellemzői:

- pontosan megadták az érintett fájlokat,
- felsorolták a végpontokat,
- meghatározták a használandó technológiákat,
- megadták, mit nem szabad módosítani,
- konkrét funkcionális elvárásokat tartalmaztak,
- tartalmazták a jogosultsági szabályokat,
- hiba esetén tartalmazták a teljes hibaüzenetet.

A gyengébben működő promptok jellemzői:

- túl rövidek voltak,
- nem tartalmaztak hibaüzenetet,
- nem adtak technológiai kontextust,
- nem derült ki belőlük, hogy kódot vagy dokumentációt kell módosítani,
- nem határozták meg az érintett fájlokat.

A fejlesztés során ezért egyre tudatosabban használtam a promptokat. A későbbi promptokban már gyakran szerepeltek ilyen korlátozások:

```text
Do not change backend code.
Do not change API endpoint paths.
Do not change authentication logic.
Do not edit documentation.
I need actual code changes.
Use the existing project structure.
The Axios baseURL already contains /api.
```

Ezek a pontosítások jelentősen javították az AI válaszainak minőségét.

---

## 9. Az AI használatának előnyei

A GitHub Copilot Chat használata több szempontból is hasznos volt a projekt során.

### 9.1. Gyorsabb fejlesztés

Az AI gyorsan tudott kiinduló kódot készíteni például route-okhoz, controllerekhez, React oldalakhoz és dokumentációhoz. Ez felgyorsította a fejlesztési folyamatot.

### 9.2. Hibakeresés támogatása

A teljes hibaüzenetek megadása után az AI segített értelmezni a problémákat, például:

- Prisma konfigurációs hibákat,
- hiányzó csomagokat,
- Node.js verzióval kapcsolatos problémákat,
- frontend API útvonal hibákat,
- jogosultsági hibákat.

### 9.3. Dokumentáció készítése

Az AI különösen hasznos volt a dokumentáció szerkezetének kialakításában. Segített a funkcionális és nem-funkcionális követelmények, az adatmodell és az API áttekintés megfogalmazásában.

### 9.4. UI/UX finomítás

Az AI a frontend megjelenés javításában is segített. A felület egységesebb lett, a kártyák, gombok, űrlapok és admin oldali szekciók átláthatóbbá váltak.

---

## 10. Az AI használatának korlátai

A fejlesztés során az AI használatának korlátai is megjelentek.

### 10.1. Nem mindig értette pontosan a kontextust

Előfordult, hogy az AI nem kódot módosított, hanem dokumentációs bejegyzést írt. Ez akkor történt, amikor a korábbi beszélgetési kontextusban sok prompt-loggal kapcsolatos kérés szerepelt.

### 10.2. A generált kódot mindig ellenőrizni kellett

Az AI által generált kód nem volt minden esetben azonnal hibátlan. Például előfordultak:

- rossz API útvonalak,
- típuseltérések,
- nem megfelelő response shape kezelés,
- frontend oldali állapotkezelési problémák.

### 10.3. A hibaüzenetek nélkül kevésbé volt pontos

Amikor csak általános hibaleírást adtam, az AI nem tudott pontos választ adni. A teljes hibaüzenetek, Network tab adatok és Console hibák megadása jelentősen javította a válaszokat.

### 10.4. Verziófüggő technológiai problémák

A Prisma 7 és a SQLite adapter használata során több olyan probléma jelentkezett, amely verziófüggő volt. Ilyenkor különösen fontos volt a környezet pontos megadása, például Node.js verzió, Prisma verzió és csomagverziók.

---

## 11. Összegzés

A projekt fejlesztése során az AI-t több fázisban használtam: adatmodell tervezéshez, backend API-k létrehozásához, hitelesítés megvalósításához, frontend oldalak készítéséhez, hibakereséshez, UI/UX finomításhoz és dokumentáció írásához.

Az AI használata jelentősen segítette a munkát, de nem helyettesítette az önálló fejlesztői döntéseket. A generált kódot minden esetben ellenőrizni, futtatni és tesztelni kellett. Több esetben javító promptokra volt szükség, amelyek alapján a megoldások fokozatosan pontosabbá váltak.

A legfontosabb tanulság, hogy az AI akkor használható hatékonyan fejlesztési környezetben, ha a prompt:

- pontos,
- konkrét,
- tartalmazza az érintett fájlokat,
- tartalmazza a követelményeket,
- megadja a tiltott módosításokat,
- és hiba esetén tartalmazza a teljes hibaüzenetet.

A projektben az AI tehát fejlesztést támogató eszközként jelent meg, amely segítette a produktivitást, de a végleges rendszer működéséért, teszteléséért és ellenőrzéséért továbbra is a fejlesztő volt felelős.

---

## 12. Kapcsolódó fájlok a repository-ban

A projekt AI-használattal kapcsolatos dokumentációja a repository `prompts` mappájában található.

Javasolt fájlstruktúra:

```text
prompts/
  prompt-log.md
  ai-usage-analysis.md
```

A `prompt-log.md` fájl tartalmazza a fejlesztés során használt nyers promptokat és beszélgetéseket.  
Az `ai-usage-analysis.md` fájl, vagyis jelen dokumentum, ezek rövid elemzését és értékelését tartalmazza.

---

## 13. Megfelelés a projektmunka AI-használati követelményének

A projektmunka követelménye szerint az AI használata esetén:

- a fejlesztés során használt promptokat fel kell tölteni,
- rövid elemzésben be kell mutatni, mely fázisokra használtam az AI-t,
- ki kell gyűjteni jól működő promptokat,
- ki kell gyűjteni kevésbé jól működő promptokat,
- a promptok dokumentálását a repository `prompts` mappájában kell elhelyezni.

Jelen dokumentum ezeknek a követelményeknek megfelel, mivel bemutatja:

- az AI használatának célját,
- a fejlesztési fázisokat,
- a jól működő promptokat,
- a kevésbé jól működő promptokat,
- a tanulságokat,
- valamint az AI használatának előnyeit és korlátait.
