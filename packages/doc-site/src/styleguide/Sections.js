import '@synchro-charts/core/dist/synchro-charts/synchro-charts.css';
import React from 'react';
import DefaultSectionsRenderer from 'react-styleguidist/lib/client/rsg-components/Sections/SectionsRenderer';
import { WebglContext } from '@synchro-charts/react';
import './Sections.css';

const Sections = ({ children }) => {
  // Styleguidist will render multiple sections per a single screen - we want to ensure that were only
  // rendering a single `<WebglContext />`.
  const mountWebglContext = children.length > 0;
  return (
    <div className="section">
      <DefaultSectionsRenderer>{children}</DefaultSectionsRenderer>
      {mountWebglContext && <WebglContext />}
    </div>
  );
}

export default Sections;

