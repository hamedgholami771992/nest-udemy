FROM node:alpine As development 


WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./


RUN npm i

COPY . .


RUN npm run build   
# it generate built file inside ./dist dir

# we are going to move on to the next stage of our docker-image 
FROM node:alpine As production 

ARG NODE_ENV=production 

ENV NODE_ENV=${NODE_ENV}


WORKDIR /usr/src/app 

COPY package.json ./
COPY package-lock.json ./ 


RUN npm i --prod 
# it only install production dependencies


COPY --from=development  /usr/src/app/dist  ./dist 
# it copies files inside dist directory from the development image inside the ./dist in production image


CMD ["node", "dist/apps/reservations/main"]



# cd /apps/reservations
# docker build ../../ -f Dockerfile -t sleepr-reservations   ===> ../../  sets the context path, where the docker-command will be executed from,  do er can copy important files
# docker run sleepr_reservations


# create docker-compose file inside root of project-dir