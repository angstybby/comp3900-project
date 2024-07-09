#!/bin/sh
set -x

npx prisma generate
npx prisma migrate deploy
ls -al /usr/src/app/dist
npm start
