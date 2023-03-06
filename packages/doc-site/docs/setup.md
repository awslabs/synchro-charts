

1. Install to your project

   To utilize as webcomponents
    ```bash
    yarn add @iot-app-kit-visualizations/core
   
    # or with npm..
    npm install --save @iot-app-kit-visualizations/core
    ```
   
   For use within react,
   
    ```bash
    yarn add @iot-app-kit-visualizations/react
   
    # or with npm..
    npm install --save @iot-app-kit-visualizations/react
    ```
2. Initialize components if you are not using the react wrapper

    ```js static
    import { defineComponents, applyPolyfill } from '@synchro-charts/core/dist/loader';

    applyPolyfill().then(() => defineComponents());
    ```
   
    If you are using the react wrapper, this step is not necessary.

3. Include a `<sc-webgl-context>`
    Include the webgl context such that it's present where ever you utilize webgl based components (not required for all components)

    ```jsx static
     ...
      <sc-webgl-context />
     ...
        
    ```
    
    Visit the [WebGL context documentation]( https://synchrocharts.com//#/WebGL%20context ) to learn more about how to set up the WebGL context.

