# WeRoad Backend Challenge

## Project Overview

### Use case
Implement a checkout process for WeRoad users to buy a Travel where:
- the user can select a travel to book;
- the user inputs an email and the number of seats to reserve;
- the user pays the total amount to confirm the booking (FAKE payment step);

### Requirements
- A Travel has a max capacity of 5 seats;
- After confirming the number of seats to reserve the availability should be granted for 15 minutes before the cart expires;


## Folder Structure
```
├── postgres/                  # Database initialization scripts
│   └── init.sql               # SQL script to initialize PostgreSQL test database
├── src/                       # Application source code
│   ├── app.controller.ts      
│   ├── app.module.ts          
│   ├── app.service.ts         
│   ├── config/ 
|	|	├── database.config.ts # Used by Nest application to connect to DB
|	|	├── typeorm.config.ts  # used by typeorm migrations                 
│   ├── database/              
|	|	├── migrations		   # contains migrations generated by TypeOrm
|	|	├── seeder			   # utility to fill database with a few data
│   ├── domains/               # Domain-specific modules and entities (more details below)
│   ├── main.ts                
│   └── shared/                # Shared utilities and components
├── test/                      
│   ├── app.e2e-spec.ts        
│   ├── booking.e2e-spec.ts    
│   ├── travel.e2e-spec.ts     
│   ├── jest-e2e.json          
│   └── utils.ts               
├── .env.example               
├── Dockerfile.dev              
├── docker-compose.dev.yml      
├── Makefile                   
├── package.json               
├── tsconfig.json              
└── README.md
```


## Reasoning Behind Decisions

### Tech Stack
- **Typescript**: [project requirement] Useful to improve code quality and clarity across teams.
- **NestJS Framework**: A project requirement. Useful to have a modular and scalable project.
- **GraphQL**: [project requirement] Enables precise data fetching by allowing clients to request exactly what they need, reducing over-fetching or under-fetching data.
-  **Relational database**: [project requirement] we used PostgreSQL, a reliable and widely-used relational database suited for transactional systems.
-   **Docker**: Facilitates a consistent development environment across teams and different OS. 
-   **Testing Focus**: Unit test and E2E tests with Jest (fully integrated with Nest). It should ensure high reliability for booking workflow

### Architecture
The application follows a  **modular and layered architecture**  using NestJS. Key architectural choices include:
1.  **Modular Design**: 
	- Each domain is encapsulated in its own module, ensuring separation of concerns and scalability. 
	- Anyway at the moment domains are coupled due to fact that when we've got side effects in other domains, a service can call another service from another domain. For the purpose of this project it would enough doing this way. 
	- In the future when the project will grow in terms of features and people working on it, we should think about implement **Event Driven Architecture** to better separate domains.
2.  **Database Integration**:
    -   Uses  **PostgreSQL**, while we use the default database to launch Nest application, we initialize another database named  `test`  through  `postgres/init.sql`. The goal of this database is to run e2e without affecting the main database. 
    -   You can manually seed the main database and test app with a bunch of data that you will find in  `src/database/seeder` 
3.  **Configuration**:
    -   Environment variables managed through  `src/config`. At the moment we just used configuration for connecting to the database, both main database both test database, and launch migrations on those db.
4.  **Testing Strategy**:
    -   Unit and E2E tests implemented using  **Jest**  for comprehensive test coverage. We did not implement integration tests but only unit (with mocks) and e2e to test the whole process. In the future we should think about adding Integration Tests
5. **Handle expired bookings**:
	-	We decided to demand to a cron job running every 5 minutes to keep things simple. However as the system grows we probably need a more efficient system. A possibile solution will be to create a delayed job, for each booking, that will run 15 minutes after the start of a booking action. In this way you can avoid to poll the database every n minutes like in a cron job. [BullMQ](https://docs.bullmq.io/) should be a great fit for implementing that kind of solution
6. **Docker**: 
	- The entire solution is dockerized to increase application portability. However we only configured a Dockerfile for a development environment. We do not encourage to use the same strategy on a production environment. For instance: node dependencies should be optimized for a production environment, code should be transpiled to javascript, database should be configured more accurately to be consistent and secure.
7. **Makefile**:
Why use Makefile? in my opinion it simplifies a lot the interaction with the system and in general I found more customizable than npm scripts. In addition adding the docker exec command will enable you to interact directly with commands inside nest container.
8. **Moods Table**:
At the beginning we thought about having Moods in a json field inside Travels table. In our opinion in a relational database you should avoid the more json fields you can even though Postgres supports them awesome. Also, when you think about Moods you think that can be extended easily because they are in a json fields. In general having a json field is useful when you have unstructured data. In this case moods can be added but they follow a known pattern (key value), so we decided to use an enum and a separate table with a foreign key to match travels.

## How to interact with the project

1.  **Start App**:
    
    Using Makefile command `make start` lets you to setup docker containers, nest app with its dependencies and database structure (only for default database, not `test` database)
Nest Applications waits for database to be up and running, also thanks to a shell scripts that physically waits for the database server to be ready on its specific port.
You'll find application at `localhost:3000` with graphql playground at `localhost:3000/graphql`
    
2.  **Stop App**: 
Using Makefile command `make stop` lets you to stop application without erasing data
Using Makefile command `make stop-and-remove-volumes`lets you to erase database data while stopping containers

3. **Migrations**:
To start project and use it you shouldn't need to run migrations on default database because domain entities are read by nestjs and typeorm and table creation should be automatic when it founds an empty database.
However if you start adding stuff or new entities you can:
- run `make generate-migrations` : this should create a new migration file in folder `src/database/migrations`, remember to provide a name for the migration (like `make generate-migrations name=myMigration`) otherwise the command wouldn't work
- `run make migration`: this should execute migrations on your default database
- `run make migration-test`: this should execute migrations on your test database (probably is an avoidable redundancy but it does the job)


## How to Test the Project

### Unit Tests

Run all unit tests: `make run-test` 

### End-to-End (E2E) Tests

Run E2E tests: `make run-e2e-tests` 

## Forgotten Late fixes
- **Moods** table has an id column that can be avoided because using mood column and travelId column as unique key should be enough to guarantee row unicity.
- **Travel** entity does not extends the base entity containing common fields `id`, `createdAt` and `updatedAt`, so that also Travels table does not have `createdAt` and `updatedAt` columns
