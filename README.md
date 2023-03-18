# Covid Tracker App

## Introduction
You can access the app through [THIS LINK](https://main.d315lp313zhs88.amplifyapp.com/)
### Technical Decisions

 - This project was created in the form of a monorepo using Nx as it is more effecient to share type interfaces between different apps and automate build and deployment process
 - This app was deployed on Heroku and AWS Amplify using an automated pipline connected to the Github Repository

### Code Structure
Both the frontend and the backend apps can be found the `/apps` directory
#### API

 - in the `/api` directory you will find the backend project which is seperated into

	-  `core` directory which includes classes for `ApiError` and `ApiResponse` classes to implement uniformity 			across all errors and responses
	- `database` directory which include the initialization of the database and a division of `model` and `repository` files which include the definition of the collection models and the groups of all different functionalities needed per model respectively. 
	- `routes` directory which includes all routed definition and the schema validation objects for each endpoint
	-  `helpers` directory include some useful utils such as request validators and async function handler
	- `auth` directory which includes a middleware for authenticating custom API_KEYs, although for the sake of simplicity I have used the `express-oauth2-jwt-bearer` auth method as middleware to validate incoming requests' access tokens as per the Auth0 Documentation

#### Frontend

 - in the `/frontend/src/app` directory you will find the frontend application which is seperated into
	 - `styles` which includes general styles and themes as well as specific component styling
	 - `components` which includes different reusable components throughout the app
	 - `pages`which includes all the pages of the app

#### This structure was built to implement multiple Clean Code concepts such as:

 - Seperation of concerns
 - Uniformity of responses
 - Uniformity of error handling
 - Type safe development

## Running the app locally 

 1. Clone the github repository `git clone https://github.com/alaaamady/covid-tracker.git`
 2. Install all dependencies using `yarn`
 3. Add a `.env.local` file in the root directory following the following example
	```
	PORT=3000
	CORS_URL=*
	DB_CONNECTION_STRING=
	AUTH0_DOMAIN=
	AUTH0_AUDIENCE=
	AUTH0_MANAGEMENT_API_KEY=
	```
4. Add a `.env.local` file in the root directory of the frontend app following the following example
```
VITE_APP_AUTH0_DOMAIN=
VITE_APP_AUTH0_CLIENT_ID=
VITE_APP_AUTH0_CALLBACK_URL=
VITE_APP_AUTH0_AUDIENCE=
VITE_API_URL=
VITE_MAPBOX_TOKEN=
```

5. Run both the frontend and the backend projects using
 `yarn nx run-many --target=serve --projects=frontend,api --parallel=true`

And That's it!
