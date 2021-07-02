# Monitor Components Documentation Site

## Available Scripts

In the project directory, you can run:

### `brazil-build deploy`
This will build and deploy the documentation to `https://{stage}.console.harmony.a2z.com/monitor-components-doc-site/`. Deployment takes a couple minutes.

Make sure to have first ran `npm install -g git+ssh://git.amazon.com/pkg/HarmonyCLI#master` at some point in time. Must have permissions to the posix group [AWS-IoT-VoT-Team](https://bindles.amazon.com/software_app/AWS-IoT-VoT-Team).

### `brazil-build run-script start`

Runs the app in the development mode.<br />
Open [http://localhost:6060](http://localhost:6060) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `brazil-build run-script build`

Builds the app for production to the `app` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
