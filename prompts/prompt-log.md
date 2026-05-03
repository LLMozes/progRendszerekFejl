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