#!/bin/sh
set -x

npm install -g tsx
npx prisma generate
npx prisma db push --force-reset
npx prisma db seed
npm run test
npm start
