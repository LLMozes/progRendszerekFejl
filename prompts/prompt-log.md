# AI prompt napló

Ebben a fájlban dokumentálom a fejlesztés során használt fontosabb AI promptokat.

## 1. Projekttervezés  - ChatGPT

### Prompt

```text
I am building a university project called Habit Tracker. The required stack is React + Vite + TypeScript frontend, Node.js + Express + TypeScript backend, Prisma ORM with SQLite database, and session-based authentication.

Please create a detailed implementation plan with milestones. The application must support registration, login, logout, authenticated CRUD operations, admin functions, demo data, and at least five database entities: User, Category, Habit, HabitCompletion, and SystemLog.

Do not generate code yet. Only create a clear development plan.



## 2. Backend alap létrehozása - ChatGPT

### Prompt

```text
Create the initial backend structure for a Node.js + Express + TypeScript REST API.

Requirements:
- src/server.ts as entry point
- Express app with JSON middleware
- CORS configured for frontend running on localhost:5173
- Basic health check endpoint: GET /api/health
- Folder structure: routes, controllers, services, middlewares, utils
- Use clean and simple TypeScript
- Do not add authentication or database logic yet.



## 3. Prisma + SQLite adatmodell

You are working on an existing university project. Do NOT redesign or restructure the project.

The project structure is already created and must NOT be changed.

Current goal:
We already initialized Prisma. Continue by completing the prisma/schema.prisma file based on the requirements.

Requirements:
- Minimum 5 entities: User, Category, Habit, HabitCompletion, SystemLog
- Proper relations between them
- SQLite database
- Role enum with USER and ADMIN
- Frequency enum with DAILY and WEEKLY
- Do not implement authentication yet
- Do not implement REST endpoints yet
- Only focus on Prisma setup and schema.

Output:
- ONLY the updated prisma/schema.prisma content
- No project restructuring suggestions



## 4. Seed data

Prompt:
Create a Prisma seed script for my existing Habit Tracker project...

Értékelés:
A prompt jól működött, mert konkrétan meghatározta a létrehozandó demó adatokat. A generált kódot ellenőriztem és szükség esetén módosítottam.


## 5. Session alapú autentikáció

Prompt:
Implement session-based authentication for my existing Habit Tracker backend.

Requirements:

Use express-session
Use bcrypt
Use PrismaClient
Add auth routes:
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me
Store only userId and role in the session
Never return passwordHash
Add requireAuth middleware
Add requireAdmin middleware
Keep the existing project structure
Do not create frontend code
Do not change the Prisma schema
Do not implement habit CRUD yet
Files to create or update:

backend/src/routes/auth.routes.ts
backend/src/controllers/auth.controller.ts
backend/src/middlewares/auth.middleware.ts
backend/src/server.ts

Értékelés:
A prompt konkrétan meghatározta az auth végpontokat, a session használatát és azt, hogy a passwordHash nem kerülhet vissza API válaszban. A generált kódot teszteltem register, login, me és logout végpontokkal.




## 6. Habit CRUD API

Prompt:
Implement authenticated Habit CRUD API endpoints for my existing Habit Tracker backend.

Requirements:

Use PrismaClient
Use the existing requireAuth middleware
Keep the existing project structure
Do not change the Prisma schema
Do not create frontend code
Routes:

GET /api/habits
list only the logged-in user's habits
include category and completions
GET /api/habits/:id
return one habit only if it belongs to the logged-in user
POST /api/habits
create a habit for the logged-in user
required fields: title, goal, frequency, categoryId
optional field: description
PUT /api/habits/:id
update only the logged-in user's own habit
DELETE /api/habits/:id
delete only the logged-in user's own habit
Also:

Add SystemLog entries for create, update and delete actions
Add basic validation
Never allow users to access or modify another user's habits
Files to create or update:

backend/src/routes/habit.routes.ts
backend/src/controllers/habit.controller.ts
backend/src/server.ts

Értékelés:
A prompt jól működött, mert pontosan meghatározta a szükséges CRUD végpontokat és az jogosultsági szabályt, hogy a felhasználó csak a saját szokásait kezelheti.



## 7. Habit completion API

Prompt:
Context:
backend/prisma/schema.prisma
backend/src/server.ts
backend/src/middlewares/auth.middleware.ts
backend/src/routes/habit.routes.ts
backend/src/controllers/habit.controller.ts
backend/package.json

Implement authenticated habit completion tracking API endpoints for my existing Habit Tracker backend.

Requirements:

Use PrismaClient
Use the existing requireAuth middleware
Keep the existing project structure
Do not change the Prisma schema
Do not create frontend code
Routes:

GET /api/habits/:habitId/completions

list completions only for a habit owned by the logged-in user
POST /api/habits/:habitId/completions

create a completion only for a habit owned by the logged-in user
fields: completedAt, value, note
PUT /api/completions/:id

update a completion only if it belongs to a habit owned by the logged-in user
DELETE /api/completions/:id

delete a completion only if it belongs to a habit owned by the logged-in user
Also:

Add SystemLog entry when a completion is created, updated or deleted
Add basic validation
Never allow users to access or modify another user's habit completions
Files to create or update:

backend/src/routes/completion.routes.ts
backend/src/controllers/completion.controller.ts
backend/src/server.ts

Értékelés:
A prompt jól működött, mert külön kezelte a szokások teljesítésének rögzítését, és meghatározta, hogy a felhasználó csak a saját szokásaihoz tartozó teljesítéseket kezelheti.




## 8. Admin API

Prompt:
context:
backend/prisma/schema.prisma
backend/src/server.ts
backend/src/middlewares/auth.middleware.ts
backend/src/controllers/auth.controller.ts
backend/src/controllers/habit.controller.ts
backend/package.json

Implement admin API endpoints for my existing Habit Tracker backend.

Requirements:

Use PrismaClient
Use the existing requireAdmin middleware
Keep the existing project structure
Do not change the Prisma schema
Do not create frontend code
Never return passwordHash in user responses
Routes:

GET /api/admin/users

list all users without passwordHash
PUT /api/admin/users/:id/role

update a user's role
accepted roles: USER, ADMIN
DELETE /api/admin/users/:id

delete a user
do not allow the admin to delete their own account
GET /api/admin/categories

list all categories
POST /api/admin/categories

create a category
fields: name, description, isDefault
PUT /api/admin/categories/:id

update a category
DELETE /api/admin/categories/:id

delete a category only if it has no related habits
GET /api/admin/system-logs

list system logs
include related user data without passwordHash
Also:

Add SystemLog entries for admin actions
Add basic validation
Return clear error messages
Files to create or update:

backend/src/routes/admin.routes.ts
backend/src/controllers/admin.controller.ts
backend/src/server.ts

Értékelés:
A prompt jól működött, mert pontosan elkülönítette az admin funkciókat a normál felhasználói funkcióktól. A generált végpontok lefedik a felhasználókezelést, kategóriakezelést és rendszerhasználati naplók megtekintését.



## 9. Statisztika API

Prompt:
Copilot context

backend/prisma/schema.prisma
backend/src/server.ts
backend/src/middlewares/auth.middleware.ts
backend/src/controllers/habit.controller.ts
backend/src/controllers/completion.controller.ts
backend/package.json

Implement simple authenticated statistics endpoints for my existing Habit Tracker backend.

Requirements:

Use PrismaClient
Use the existing requireAuth middleware
Keep the existing project structure
Do not change the Prisma schema
Do not create frontend code
Users can only see statistics for their own habits
Routes:

GET /api/statistics/summary

return:
total number of habits for the logged-in user
total number of completions for the logged-in user's habits
number of daily habits
number of weekly habits
GET /api/statistics/habits/:habitId

return statistics for one habit only if it belongs to the logged-in user
return:
habit id
habit title
frequency
goal
total completions
latest completion date
completions grouped by date if possible
Also:

Add basic validation
Never allow users to access another user's statistics
Return clear error messages
Files to create or update:

backend/src/routes/statistics.routes.ts
backend/src/controllers/statistics.controller.ts
backend/src/server.ts

Értékelés:
A prompt jól működött, mert csak egyszerű, a projekt céljához illeszkedő statisztikai végpontokat kért. Nem bonyolította túl az elemzést, de lefedte a felhasználói igényt, hogy a teljesítéseket vissza lehessen nézni.




## 10. Frontend alap

Prompt:
Context:
README.md
backend/src/server.ts
backend/src/routes/auth.routes.ts
backend/src/routes/habit.routes.ts
backend/src/routes/completion.routes.ts
backend/src/routes/statistics.routes.ts
backend/src/routes/admin.routes.ts

Create the initial React + Vite + TypeScript frontend structure for my existing Habit Tracker project.

Requirements:

Use the existing frontend folder
Use React Router
Use Axios for API calls
Backend runs on http://localhost:5000
Frontend runs on http://localhost:5173
Axios must send cookies with requests because backend authentication uses sessions
Keep the UI simple and beginner-friendly
Do not change backend code
Create or update:

src/api/client.ts
src/App.tsx
src/main.tsx
src/pages/LoginPage.tsx
src/pages/RegisterPage.tsx
src/pages/DashboardPage.tsx
src/pages/HabitsPage.tsx
src/pages/AdminPage.tsx
src/components/Navbar.tsx
Routes:

/login
/register
/dashboard
/habits
/admin
For now:

Only create page placeholders
Add navigation
Do not implement forms yet

Értékelés:
A prompt jól működött, mert csak az alap frontend struktúrát kérte, nem pedig teljes funkcionalitást. Az Axios kliensnél külön meg lett adva, hogy session alapú hitelesítés miatt a cookie-k küldéséhez withCredentials szükséges.



## 11. Frontend autentikáció

Prompt:
Implement frontend authentication for my existing Habit Tracker React app.

Requirements:

Use the existing Axios client from src/api/client.ts
Backend auth endpoints:
POST /auth/register
POST /auth/login
POST /auth/logout
GET /auth/me
Use session cookies, so keep withCredentials enabled
Create an AuthContext
Store current user in AuthContext
On app load, call /auth/me
Implement register form
Implement login form
Implement logout button in Navbar
After successful login or register, redirect to /dashboard
Show simple error messages
Do not change backend code
Keep UI simple and beginner-friendly
IMPORTANT:

The Admin page should only be visible to users with role "ADMIN"
Hide the Admin navigation link for non-admin users
Protect the AdminPage so non-admin users are redirected to /dashboard
Files to create or update:

frontend/src/context/AuthContext.tsx
frontend/src/pages/LoginPage.tsx
frontend/src/pages/RegisterPage.tsx
frontend/src/components/Navbar.tsx
frontend/src/pages/AdminPage.tsx
frontend/src/App.tsx

Értékelés:
A prompt jól működött, mert a meglévő backend auth végpontokra épített, és session alapú hitelesítést valósított meg.

További finomítás:
A prompt kiegészítésre került az admin jogosultság kezelésével. Az admin felület elrejtésre került nem admin felhasználók elől, valamint az AdminPage komponens is védve lett frontend oldalon. Ez javítja a felhasználói élményt és összhangban van a backend jogosultságkezeléssel.



## 12. Habit CRUD frontend

Prompt:
Copilot context

frontend/src/api/client.ts
frontend/src/context/AuthContext.tsx
frontend/src/App.tsx
frontend/src/pages/HabitsPage.tsx
frontend/src/components/Navbar.tsx
backend/src/routes/habit.routes.ts
backend/src/controllers/habit.controller.ts
backend/src/routes/admin.routes.ts
frontend/src/pages/DashboardPage.tsx

Implement the Habit CRUD frontend for my existing Habit Tracker React app.

Requirements:

Use the existing Axios client from src/api/client.ts
Use the existing authentication context
Do not change backend code
Keep the UI simple and beginner-friendly
Backend habit endpoints:

GET /habits
GET /habits/:id
POST /habits
PUT /habits/:id
DELETE /habits/:id
Backend admin category endpoint:

GET /admin/categories
Page to update:

frontend/src/pages/HabitsPage.tsx
Features:

List the logged-in user's habits
Show habit title, description, goal, frequency and category name
Add a create habit form
Add edit functionality
Add delete functionality
Load categories from the backend and use them in a select dropdown
Show simple loading, success and error messages
Redirect or show a message if the user is not logged in
Habit form fields:

title
description
goal
frequency: DAILY or WEEKLY
categoryId
Important:

The API base URL already includes /api
Use endpoints like /habits and /admin/categories
Use withCredentials from the existing Axios client
Do not create complex styling
Do not implement habit completions yet
Do not implement statistics yet


Értékelés:
A prompt jól működött, mert a meglévő backend habit végpontokra épített, és külön meghatározta a szükséges felhasználói műveleteket: listázás, létrehozás, szerkesztés és törlés. A promptban külön szerepelt, hogy a goal mezőt számként kell kezelni, valamint hogy a kategóriákat legördülő listából kell kiválasztani.



###12.2 Habit szerkesztés javítása

Prompt:
Update the existing HabitsPage so that users can edit their habits.

Requirements:
- Do not change backend code
- Use the existing Axios client
- Use the existing habit endpoints
- Add edit functionality to the existing habit list
- Each habit should have an Edit button
- When Edit is clicked, fill the form with the selected habit data
- The user should be able to update:
  - title
  - description
  - goal
  - frequency
  - categoryId
- Submit the update with PUT /habits/:id
- Convert goal to Number before sending it to the backend
- Add a Cancel edit button
- After successful update, reload the habit list
- Show simple success and error messages
- Keep the UI simple

Értékelés:
A frontend Habit CRUD fejlesztése közben kiderült, hogy a szerkesztés funkció külön pontosítást igényelt. A prompt célzottan csak az edit működés javítására fókuszált, így a meglévő kód átstrukturálása nélkül sikerült kiegészíteni a felületet.


## 13. Habit completion frontend

Prompt:
Copilot context


frontend/src/api/client.ts
frontend/src/App.tsx
frontend/src/pages/HabitsPage.tsx
frontend/src/context/AuthContext.tsx
backend/src/routes/completion.routes.ts
backend/src/controllers/completion.controller.ts
backend/src/routes/habit.routes.ts


Implement the habit completion tracking frontend for my existing Habit Tracker React app.

Requirements:
- Use the existing Axios client from src/api/client.ts
- Do not change backend code
- Keep the UI simple and beginner-friendly

Backend endpoints:
- GET /habits/:habitId/completions
- POST /habits/:habitId/completions
- PUT /completions/:id
- DELETE /completions/:id

Frontend requirements:
- Create a HabitDetailsPage
- Add a route: /habits/:id
- On HabitsPage, add a Details or Completions button/link for each habit
- On HabitDetailsPage:
  - show the selected habit id from the URL
  - list previous completions
  - add a form to create a new completion
  - fields: completedAt, value, note
  - allow deleting a completion
  - allow editing a completion if it can be implemented simply
  - show simple loading, success and error messages
- Use completedAt as a datetime-local input if possible
- Convert value to Number before sending if it is filled
- After create, update or delete, reload the completion list
- Redirect or show a message if the user is not logged in

Értékelés:
A prompt jól működött, mert a meglévő completion backend végpontokra épített, és a felhasználói felületen lehetővé tette a szokások teljesítésének rögzítését és visszanézését. A fejlesztés során külön figyelmet kapott, hogy a value mező számként kerüljön elküldésre.



## 13. Dashboard statisztikák bekötése

Prompt:
Context Copilotba

frontend/src/pages/DashboardPage.tsx
frontend/src/api/client.ts
frontend/src/context/AuthContext.tsx
backend/src/routes/statistics.routes.ts
backend/src/controllers/statistics.controller.ts
Copilot prompt
Update the existing DashboardPage in my Habit Tracker React app so it displays real statistics from the backend.

Requirements:

Use the existing Axios client from src/api/client.ts
Do not change backend code
Use the existing endpoint: GET /statistics/summary
Remember that the Axios baseURL already contains /api
Load the statistics when the DashboardPage opens
Show loading state
Show error message if the request fails
Display:
total number of habits
total number of completions
number of daily habits
number of weekly habits
Keep the existing visual style of the DashboardPage
Replace placeholder "--" values with real data
If the user is not logged in, show a simple message or redirect to /login

Értékelés:
A prompt jól működött, mert a már meglévő Dashboard felületet nem újragenerálta, hanem a backend statisztika végpontjához kapcsolta. A fejlesztés során külön figyelmet kapott, hogy az Axios baseURL már tartalmazza az /api előtagot, ezért a frontendben csak a /statistics/summary végpontot kellett meghívni.










## 15. Admin frontend

Prompt:
Contextbe csak ezeket add
frontend/src/pages/AdminPage.tsx
frontend/src/api/client.ts
frontend/src/context/AuthContext.tsx
frontend/src/App.tsx
frontend/src/components/Navbar.tsx
backend/src/routes/admin.routes.ts
backend/src/controllers/admin.controller.ts

Important:

Do NOT edit prompts/prompt-log.md.
Do NOT edit documentation.
Do NOT only write a prompt entry.
I need actual React/TypeScript code changes.
Modify the AdminPage and related frontend files if needed.
Use the existing project structure.

Requirements:

Use the existing Axios client from src/api/client.ts
Use the existing AuthContext
Do not change backend code
Only users with role ADMIN can access this page
If the current user is not ADMIN, redirect to /dashboard
Keep the UI simple and beginner-friendly
Backend admin endpoints:

GET /admin/users
PUT /admin/users/:id/role
DELETE /admin/users/:id
GET /admin/categories
POST /admin/categories
PUT /admin/categories/:id
DELETE /admin/categories/:id
GET /admin/system-logs
AdminPage features:

Users section
List users
Show id, name, email, role and createdAt
Do not show passwordHash
Allow changing user role between USER and ADMIN
Allow deleting users
Categories section
List categories
Create new category
Edit category
Delete category
Fields: name, description, isDefault
System logs section
List system logs
Show action, createdAt and related user if available
Important API rule:

The Axios baseURL already contains /api
Use endpoints like /admin/users, not /api/admin/users
Please apply the code changes to:

frontend/src/pages/AdminPage.tsx
frontend/src/App.tsx only if routing needs adjustment
frontend/src/components/Navbar.tsx only if admin link visibility needs adjustment


A prompt első változata nem működött megfelelően, mert a Copilot a prompt-log fájlt módosította a tényleges kód helyett. A javított promptban egyértelműen megadtam, hogy ne dokumentációt vagy prompt-logot szerkesszen, hanem az AdminPage React/TypeScript kódját generálja.



## 16. Frontend UI/UX egységesítés

Prompt:
Contextbe csak frontend fájlok

frontend/src/index.css
frontend/src/components/Navbar.tsx
frontend/src/pages/LoginPage.tsx
frontend/src/pages/RegisterPage.tsx
frontend/src/pages/DashboardPage.tsx
frontend/src/pages/HabitsPage.tsx
frontend/src/pages/HabitDetailsPage.tsx
frontend/src/pages/AdminPage.tsx

Ne add contextbe ezeket:

I need actual code changes, not documentation.

Do NOT edit prompts/prompt-log.md.
Do NOT edit any markdown files.
Do NOT write a prompt-log entry.
Do NOT explain the task only.

Modify the existing React frontend code to improve the UI/UX.

Allowed files to edit:

frontend/src/index.css
frontend/src/components/Navbar.tsx
frontend/src/pages/LoginPage.tsx
frontend/src/pages/RegisterPage.tsx
frontend/src/pages/DashboardPage.tsx
frontend/src/pages/HabitsPage.tsx
frontend/src/pages/HabitDetailsPage.tsx
frontend/src/pages/AdminPage.tsx
Task:
Improve the visual design and usability of the existing app.

Important:

Do not change backend code.
Do not change API endpoint paths.
Do not change authentication logic.
Do not remove existing functionality.
Preserve all current API calls and state handling.
Only improve layout, styling, spacing, forms, buttons, cards, tables and responsiveness.
Specific improvements:

Make all pages visually consistent.
Improve the AdminPage layout significantly.
Use cleaner cards or tables for users, categories and logs.
Improve button styles.
Improve input and select styles.
Improve spacing and typography.
Keep the existing beige/teal visual direction.
Keep login, register, dashboard, habits, habit details and admin features working.
Please apply the code changes directly to the existing frontend files.

Értékelés:
A prompt célja nem új funkciók létrehozása volt, hanem a meglévő frontend felület vizuális és használhatósági javítása. A promptban külön kiemeltem, hogy az API hívások, az autentikációs logika és a backend kód nem módosulhatnak, így a működő funkciók megtartása mellett javult az alkalmazás megjelenése.


## 17 Dokumentációs fájlok elkészítése

Prompt:
Context Copilotba

Húzd be:

docs/documentation.md
README.md
backend/prisma/schema.prisma
backend/src/server.ts
backend/src/routes/auth.routes.ts
backend/src/routes/habit.routes.ts
backend/src/routes/completion.routes.ts
backend/src/routes/statistics.routes.ts
backend/src/routes/admin.routes.ts
frontend/src/App.tsx
frontend/src/pages/LoginPage.tsx
frontend/src/pages/RegisterPage.tsx
frontend/src/pages/DashboardPage.tsx
frontend/src/pages/HabitsPage.tsx
frontend/src/pages/HabitDetailsPage.tsx
frontend/src/pages/AdminPage.tsx

Kérlek, készítsd el és frissítsd a projekt dokumentációs fájljait a meglévő Habit Tracker / Szokáskövető alkalmazás alapján.

Fontos:

Magyar nyelven írj.
Ne módosíts forráskódot.
Csak a docs mappában lévő markdown fájlokat hozd létre vagy módosítsd.
Ne írj bele nem használt technológiákat.
Ne említs MongoDB-t, JWT-t, Docker-t vagy felhős adatbázist megvalósított elemként.
A projekt SQLite + Prisma adatbázist, Express backend-et, React + Vite frontend-et és express-session alapú hitelesítést használ.
A dokumentáció legyen egyetemi beadandóhoz illő, világos és strukturált.
A meglévő docs/documentation.md fájlt bővítsd ki, és tüntesd el belőle a „Később kerül kitöltésre.” részeket.
Hozd létre vagy frissítsd ezeket a fájlokat:

docs/documentation.md
Ez legyen a fő dokumentáció. Tartalmazza:
projekt áttekintése
alkalmazás célja
felhasználói és admin szerepkörök
választott technológiai stack
technológiai döntések indoklása
rövid funkcionális követelményösszefoglaló
rövid nem-funkcionális követelményösszefoglaló
adatmodell rövid bemutatása
REST API rövid áttekintése
telepítés és futtatás röviden
hivatkozás a többi docs fájlra
docs/functional-requirements.md
Részletesen írd le a megvalósított funkcionális követelményeket:
regisztráció
bejelentkezés
kijelentkezés
session alapú hitelesítés
saját szokások listázása
szokás létrehozása
szokás szerkesztése
szokás törlése
teljesítések rögzítése
teljesítések listázása
teljesítések szerkesztése vagy törlése, ha megvalósult
dashboard statisztikák
admin felhasználókezelés
admin kategóriakezelés
rendszerlogok megtekintése
docs/non-functional-requirements.md
Írd le a megvalósított nem-funkcionális követelményeket:
egyszerű használhatóság
átlátható felhasználói felület
frontend és backend szétválasztása
REST API alapú kommunikáció
session alapú hozzáférés-kezelés
jelszóhashelés bcrypt segítségével
karbantartható TypeScript kód
átlátható mappastruktúra
helyi fejlesztési környezet támogatása
demó adatok seed script segítségével
docs/database-model.md
Mutasd be az adatmodellt:
User
Category
Habit
HabitCompletion
SystemLog
Írd le:

az entitások célját
fontosabb mezőiket
kapcsolataikat
miért felel meg az adatmodell a minimum 5 entitásos követelménynek
hogyan kapcsolódnak a demó adatok a modellhez
docs/api-overview.md
Készíts REST API áttekintést csoportosítva:
Auth végpontok
Habit végpontok
HabitCompletion végpontok
Statistics végpontok
Admin végpontok
Minden végpontnál írd le röviden:

HTTP metódus
útvonal
cél
szükséges-e bejelentkezés
admin jogosultság szükséges-e
Ne írj túl hosszú dokumentációt, de legyen elég részletes ahhoz, hogy a beadandó követelményeit lefedje.


Értékelés:
A prompt jól működött, mert magyar nyelven kérte a teljes docs mappa dokumentációjának elkészítését, és pontosan meghatározta az egyes dokumentációs fájlok szerepét. A prompt külön kizárta a projektben nem használt technológiák, például MongoDB, JWT, Docker vagy felhős adatbázis megvalósított elemként való említését.



## 18. AI promptelemzés elkészítése  - ChatGPT az egész beszélgetés alatt történő chatelésből generáltam

Értékelés:
A prompt jól működött, mert pontosan meghatározta, hogy a promptelemzésnek milyen fejezeteket kell tartalmaznia. A dokumentum külön kitért a jól működő és kevésbé jól működő promptokra, valamint arra, hogy az AI által generált kódot fejlesztőként ellenőriztem és teszteltem.



## 19. README véglegesítése



Prompt:
Kérlek, frissítsd és véglegesítsd a README.md fájlt a meglévő Habit Tracker / Szokáskövető alkalmazás projekthez.

Fontos:
- Magyar nyelven írj.
- Csak a README.md fájlt módosítsd.
- Ne módosíts forráskódot.
- Ne írj bele nem használt technológiákat.
- Ne említs Docker-t, MongoDB-t, JWT-t, cloud adatbázist vagy deploymentet megvalósított funkcióként.
- A projekt lokálisan futtatható SQLite adatbázissal.

A README tartalmazza ezeket a részeket:

1. Projekt címe
- Szokáskövető alkalmazás / Habit Tracker

2. Rövid leírás
- Egyetemi beadandó projekt a Programrendszerek fejlesztése tárgyhoz.
- A felhasználók szokásokat hozhatnak létre, kezelhetnek és teljesítéseket rögzíthetnek.
- Az admin felhasználók kezelhetik a felhasználókat, kategóriákat és rendszerlogokat.

3. Technológiai stack
- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express + TypeScript
- Adatbázis: SQLite
- ORM: Prisma
- Hitelesítés: express-session + bcrypt

4. Fő funkciók
- Regisztráció
- Bejelentkezés és kijelentkezés
- Session alapú hitelesítés
- Szokások CRUD kezelése
- Szokásteljesítések kezelése
- Dashboard statisztikák
- Admin felhasználókezelés
- Admin kategóriakezelés
- Rendszerlogok megtekintése

5. Projekt mappastruktúra
Mutasd be röviden:
- backend
- frontend
- docs
- prompts

6. Előfeltételek
- Node.js
- npm
- Git
- VS Code ajánlott

7. Backend telepítése és futtatása
Írd le a parancsokat:
cd backend
npm install
npx prisma migrate dev
npm run seed
npm run dev

8. Frontend telepítése és futtatása
Írd le a parancsokat:
cd frontend
npm install
npm run dev

9. Alapértelmezett elérési URL-ek
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

10. Demo felhasználók
Írd bele:
Admin:
email: admin@example.com
password: Admin1234

Normál felhasználó:
ha a seed.ts alapján pontosan látható, írd bele a demo user emailt és jelszót.
Ha nem egyértelmű, írd azt, hogy a demo felhasználók a backend/prisma/seed.ts fájlban találhatók.

11. Dokumentáció
Írd le, hogy a részletes dokumentáció a docs mappában található.

12. AI használat dokumentációja
Írd le, hogy a fejlesztés során használt promptok és promptelemzés a prompts mappában találhatók.

13. Megjegyzés az adatbázishoz
Írd le, hogy a projekt SQLite adatbázist használ, amely helyileg jön létre Prisma migrációval és seedeléssel.

A README legyen világos, könnyen követhető és alkalmas arra, hogy a tanár a repository alapján el tudja indítani a projektet.



Értékelés:
A prompt jól működött, mert pontosan meghatározta, hogy a README célja a projekt telepítésének és futtatásának bemutatása. A prompt külön kérte a backend, frontend, Prisma migráció, seed adatok, demo felhasználók, dokumentáció és AI prompt mappa bemutatását.