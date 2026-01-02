# Weekly Sauna Scheduler

## Overview
This project was created as a practical assignment during a second-year course on React web development in the Degree Programme in Business Information Technology. The goal was to apply the concepts learned during the course and build a self-initiated application from scratch.

The idea for the application was inspired by a real-life situation. In my housing company, sauna reservations are managed using a physical paper list near the sauna, which can be inconvenient due to its locations and frequent changes. This project was created to provide a digital alternative for managing sauna reservations.

The focus of the course was fullstack web development, including server-side programming, REST APIs, database integration, authentication, and client–server communication. During the course, I implemented a fullstack solution using a React-based frontend and a Node.js & Express backend. The backend exposes a REST API, handles authentication with JWT, manages data using Prisma ORM, and enforces CORS configuration. The frontend uses Material UI for building the user interface and communicates with the backend via HTTP requests.

In addition to the course requirements, I further refined the project to make it deployable. This included refactoring the project structure, configuring environment variables, migrating the database from SQLite to PostgreSQL, and deploying the backend service and frontend application separately. The application UI is currently available in Finnish.

Test live application: https://anupaivansade.github.io/Reserve_Weekly_Sauna  
<br/>ℹ️ _**Note:** The backend is hosted on Render (free tier). If the service has been idle, the first request may take up to ~1–2 minutes while the server wakes up. This is a known limitation of free cloud hosting._

## Features

### Client-side features
  - Users can authenticate to the application:
    - Login using a username and password
    - Logout from the application
    - Register as a new user
    - Registration is restricted to residents of As Oy Metsämäki (validated during signup)

- Authenticated users can manage sauna reservations:
  - View available sauna time slots
  - Reserve a free sauna slot for themselves
  - View already reserved slots and see which user has made the reservation
  - App prevents users from booking multiple sauna slots during the same week
 
  <br/>
 
### Server-side features
  - Sauna reservation data is managed on the server:
    - Sauna slots, reservation status and user data are stored in a database
    - Database access is handled using Prisma ORM
      
- The server exposes a REST API:
  - Requests are handled according to REST principles
  - Endpoints are used for authentication, user management and sauna reservations

- Security-related features:
  - CORS is used to control cross-origin requests
  - JWT (JSON Web Tokens) are used for user authentication and authorization
  - User passwords are stored as SHA-512 hashes instead of plain text

- Sauna slots are generated programmatically:
  - Initial sauna slots for four Fridays are created automatically in the database
  - Slot generation is implemented using a custom script and the date-fns library

## Technologies
- **React** – for building the client-side user interface and components 
- **React Router DOM** – for client-side routing and navigation 
- **Material UI** – for UI components and styling
- **Node.js** - runtime environment for the server application
- **Express** - for building the REST API and handling HTTP requests  
- **TypeScript** – programming languages for both frontend and backend logic
- **Prisma ORM** - for database modeling and database access
- **SQLite / PostgreSQL** - SQLite was originally used in the development phase, PostgreSQL is used in the hosted production environment database
- **JWT** - for user authentification and authorization  
- **localStorage** – for persisting user data in the browser
- **CORS** - for controlling cross-origin requests between client and server  
- **Styling** - applied inline and through Material UI's `sx` prop directly within components; no separate CSS files are used.
- **date-fns** - for date handling and programmatic generation of sauna time slots

## My Role
I was responsible for the full implementation of the application, including logic, UI structure and deployment.

## What I learned
This project strengthened my understanding of fullstack application development and clarified how a React-based client and a server-side API work together in practice. Compared to earlier courses, React’s structure, data flow, and component composition became much clearer, and I gained more confidence in using props, state, and Material UI components to build a clean and consistent user interface.

Authentication and authorization (login, registration, JWT, and CORS) were among the more challenging aspects. Reusing and adapting existing authentication logic helped me understand how previously written code can be applied in new contexts.

A significant learning experience came from preparing the application for deployment. I learned how to manage environment variables, migrate a database from SQLite to PostgreSQL using Prisma ORM, host a server application, deploy a React client to GitHub Pages, and connect the frontend and backend in a production environment.

## Ideas for Further Development

Several ideas emerged during and after developing this project for potential future enhancements:

  - Allow users to edit or cancel existing sauna reservations
    
  - Replace the current select-based booking flow with a card-based UI, where available time slots can be selected visually
    
  - Implement a calendar-style view to display available and reserved sauna slots more intuitively
    
  - Improve session handling so users remain logged in after refreshing the page
    
  - Add role-based access (e.g. admin users) for managing sauna schedules and users

  - Extend the application into a mobile version, providing a more accessible and convenient experience for users on the go
