

1. Install to your project
    For use within react,
   
    ```bash
    yarn add @synchro-charts/react
   
    # or with npm..
    npm install --save @synchro-charts/react
    ```
   
    To utilize as webcomponents
    ```bash
    yarn add @synchro-charts/core
   
    # or with npm..
    npm install --save @synchro-charts/core
    ```
2. Initialize components
   
    ```js static
    import { defineComponents, applyPolyfill } from '@synchro-charts/core/dist/loader';

    applyPolyfill().then(() => defineComponents());
    ```

3. Include a `<sc-webgl-context>`
    Include the webgl context such that it's present where ever you utilize webgl based widgets (not required for all widgets)

    The position of 'webgl context' will determine where the canvas is rendered which is rendered ontop of all the webgl based widgets.

    It is important to assure that the `z-depth` of this canvas is above the Synchro Charts widgets

    ```jsx static
     ...
      <sc-webgl-context />
     ...
        
    ```
