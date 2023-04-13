Its a simple admin dashboard project with React, Typescript and Material UI.
# Getting Started
## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


### `Debugging with VS Code`

Run the application with `npm run start` and run the debugger from the VS code by pressing `f5` or manually running it on the `Run and Debug` 


### `Running with Docker`

To Create a docker image

`$ docker build -t team-space-web .`

To check the created image

`$ docker images | grep "team-space-web"`

To run as container

`$ docker run -d -p 8000:80 --name="team-space-web" team-space-web`

To check the running container

`$ docker ps | grep "team-space-web"`

To check the container logs 

`$ docker logs -f team-space-web`

### Deployment

Nil.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).