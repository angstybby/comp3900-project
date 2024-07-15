[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=15169359&assignment_repo_type=AssignmentRepo)

## Docker setup
Ensure that you have the .env in the root directory. Run the command `docker compose up --build` in the root directory.

**For windows users:**

If you are encountering errors in the compose function, navigate to the `backend` folder and find the file `entrypoint.sh`. Make sure the end of line sequence for this file is LF and not CRLF. Save and re-run `docker compose up --build`. 

If u made an update to the frontend/backend you can just rebuild one part using
`docker compose up --build frontend`

## Setup

Go to `frontend` and `backend` and run `npm i` on EACH FOLDER

## Running Locally

- Run `npm run dev` from the `frontend` folder
- Run `npm run dev` from the `backend` folder

## Database Schema Changes

If there are changes made to the schema of the database, defined in `backend/prisma/migrations/schema.prisma` you will need to run:

- `npx prisma generate`

To view the interactive database, simply run `npx prisma studio`. This will reflect the current state of the database but is not updated in real-time. To update data you will need to refresh the page. 
