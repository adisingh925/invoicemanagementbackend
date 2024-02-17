FROM node
WORKDIR /backend
COPY package.json .
COPY package-lock.json .
COPY index.js .
COPY /routes /backend/routes
COPY /database /backend/database
RUN npm install
CMD [ "node", "index.js" ]