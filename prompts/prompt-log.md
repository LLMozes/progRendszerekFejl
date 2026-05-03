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

