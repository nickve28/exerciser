# Exerciser

This is a hobby project which I use to track my workout progression.

## Technology Stack

### Elixir

The backend part is written in Elixir/Phoenix, and split up using umbrella projects. The entities are housed in several umbrella apps.

### PostgreSQL

PostgreSQL's support for array/objects but also having a strict schema seems like a perfect fit. Next to being my favourite DBMS to work with :P

###  React.JS

React.JS is used to create the FE.

### GraphQL

To get associated with graphQL, the API has been written in graphQL instead of a rest way.

## Project layout.

### High level Layout

The project currently consists of 5 apps.

1. Api:
This app holds the front end code and houses the graphQL API. It's the point of communication for the consumers.

2. User:
This app contains the user model.

3. Workout:
This app tracks the workouts and its related data for the user. A workout consists of multiple performed exercises.
This service consists of three subservices:

- The exercise service allows creation, editing, reading and deleting exercises (Formerly the exercises service)
- The categories services allows listing of all categories used in exercises throughout the system
- The Workout service controls the workout model, and allows tracking of your workouts.

4. Progress:
This app measures progress for a user, using data from exercises and workouts.

### App level layout

Besides the API project, the apps are divided in several layers.

1. Service:
Contains the layer to which the API or other services communicate.

2. Operation:
Contains frequently used operations over repository entities. See below.

3. Repository:
This layer abstracts how data is fetched and saved. Can either be to a database, an external API or another app.

4. Schemas:
The ecto schemas.

5. Pools
All applications use an internal pool of processes. The pools folder contain the settings for these process pools.
