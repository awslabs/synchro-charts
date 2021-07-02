import '@synchro-charts/core/dist/synchro-charts/synchro-charts.css';
import React from 'react';
import DefaultSectionsRenderer from 'react-styleguidist/lib/client/rsg-components/Sections/SectionsRenderer';
import './Sections.css';

const Sections = ({ children }) => (
    <div className="section">
        <DefaultSectionsRenderer>{children}</DefaultSectionsRenderer>
        <sc-webgl-context />
    </div>
);

export default Sections;

