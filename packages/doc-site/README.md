# Synchro Charts documentation

The website which makes up the Synchro Charts documentation, as seen in https://synchrocharts.com.

## Setup
Run the following commands:

1. `yarn install`

2. `yarn build`

3. `yarn start`

4. Open your browser at `localhost:6060` to see a local instance of the documentation site.

## Available scripts

In the project directory, you can run:

- `yarn start`

  will start up a server at `localhost:6060` where you can interact with the documentation site.

- `yarn build`

  Builds documentation site, and copies over the build site to the root directory `docs` for usage by GitHub pages

- `yarn clean`

  Cleans up artifacts as well as the generated `docs` in the root directory.

## Deployment
To construct the correct artifacts, you will need to perform the following steps:

1. Alter the `.gitignore` file at the root level of the repository, and remove the following lines:
    - `build`
    - `/docs/*`
  
   This will allow the build artifacts to be included in the commit you will construct. 

2. Run `yarn build` at the root of the repository.

3. Force push your branch to the `docs` branch: `git push --force origin docs`

GitHub will then serve the updated artifacts as contained in the `docs` folder constructed from the build process. The update process should take less than a couple of minutes.