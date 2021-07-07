import '@synchro-charts/core/dist/synchro-charts/synchro-charts.css';
import React from 'react';
import DefaultSectionsRenderer from 'react-styleguidist/lib/client/rsg-components/Sections/SectionsRenderer';
import { WebglContext } from '@synchro-charts/react';
import './Sections.css';

const Sections = ({ children }) => (
    <div className="section">
        <DefaultSectionsRenderer>{children}</DefaultSectionsRenderer>
        <WebglContext />
    </div>
);

export default Sections;

