import React from 'react';
import DefaultStyleGuideRenderer from 'react-styleguidist/lib/client/rsg-components/StyleGuide/StyleGuideRenderer';

const StyleGuideRoot = (props) => (
    <div>
        <DefaultStyleGuideRenderer {...props} />
        <sc-webgl-context />
    </div>
);

export default StyleGuideRoot;
