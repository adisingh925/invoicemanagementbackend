FROM node
WORKDIR /backend
COPY package.json .
COPY package-lock.json .
COPY index.js .
COPY /routes /backend/routes
COPY /database /backend/database
COPY /middleware /backend/middleware
COPY /ratelimiters /backend/ratelimiters
COPY /ssl /backend/ssl
COPY /cron /backend/cron
COPY /aws /backend/aws
COPY /parser /backend/parser
COPY /imageprocessing /backend/imageprocessing
COPY /templates /backend/templates
COPY /mailing /backend/mailing
COPY filesystem /backend/filesystem
COPY .env.vault .
RUN npm install
ENV DOTENV_KEY=dotenv://:key_1cac2faa505dfdbf6a0b9d5f8424112c977cffcba2f4da4e7136aaec6f256d2d@dotenv.org/vault/.env.vault?environment=production
CMD [ "node", "index.js" ]