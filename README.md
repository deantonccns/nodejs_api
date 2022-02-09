## About The Project
---
An application which uses the Express.JS framework to expose a RESTful API
to manage cars. It applies the following technics:

* Containerize solution with a Dockerfile which build 2 docker images and a docker copmose file by which a user can run and test the application.
* Node.JS (node 12)
* express, ajv and mongoose package from NPM
* Typescript

## Getting Started
---
### Prerequisites
* A linux system with Docker Container installed
* The RESTful API server takes the port 3000 in both container and host while MongoDB takes 3000. Please make sure these 2 ports are not occupied by other applications in your system.
### Installation
1. Clone the repo
   ```sh
   git clone git@github.com:deantonccns/nodejs_api.git
   ```
2. Build and run the docker images
   2 images are bulit via a Dockerfile and run the application by a docker compose file
   ```sh
   docker-compose up -d --build
   ```
3. Check whether these 2 images are running or not in your docker
   ```sh
   docker ps
   ```
   you suppose to have these 2 images running
   ```sh
   CONTAINER ID   IMAGE                      COMMAND                  CREATED          STATUS          PORTS                      NAMES
   e93ca8c76bcb   node_mongodb_docker_node   "docker-entrypoint.s…"   49 minutes ago   Up 49 minutes   0.0.0.0:3000->3000/tcp     node_mongodb_docker_node_1
   38ba3e888b54   mongo:3.0                  "docker-entrypoint.s…"   3 hours ago      Up 3 hours      0.0.0.0:27017->27017/tcp   node_mongodb_docker_mongo_1
   ```
4. Shutdown the applications
   ```sh
   docker-compose down
   ```
## Usage of the APIs
There are 5 APIs provided:
* Get all cars in the database (GET /cars)
* Get a car of a specific license number (as known as car id) (GET /car/CAR_ID)
* Add a new car (POST /car)
  * Car data in JSON format in post body is needed
* Update a car (POST /car_update)
  * Car data in JSON format in post body is needed
* Delete a car (DELETE /car/CAR_ID)

Preferably test the APIs by [Postman](https://www.postman.com/downloads/)

## Structure and implementation of the application
under construciton...
