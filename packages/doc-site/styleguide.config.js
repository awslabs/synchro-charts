const path = require('path');

module.exports = {
    title: 'Synchro Charts',
    theme: {
        fontFamily: {
            base: '"Amazon Ember", Helvetica, Arial, sans-serif'
        }
    },
    styleguideDir: 'app',
    pagePerSection: true,
    sections: [
        {
            name: 'Introduction',
            content: 'docs/introduction.md',
        },
        {
            name: 'Setup',
            content: 'docs/setup.md',
        },
        {
            name: 'Components',
            sectionDepth: 2,
            components: 'src/components/**/*.js',
            ignore: 'src/components/chart-demo/**',
        },
        {
            name: 'API',
            sectionDepth: 2,
            sections: [
                {
                  name: 'Properties',
                  content: 'docs/api.md',
                },
                {
                  name: 'Events',
                  content: 'docs/events.md',
                },
            ]
        },
        {
            name: 'Features',
            sectionDepth: 2,
            sections: [
                {
                    name: 'Synchronization',
                    content: 'docs/synchronization.md',
                },
                {
                    name: 'Performance',
                    content: 'docs/performance.md',
                },
                {
                    name: 'Annotation',
                    content: 'docs/annotation.md',
                },
                {
                    name: 'Threshold',
                    content: 'docs/threshold.md',
                },
                {
                    name: 'Trends',
                    content: 'docs/trendLine.md',
                },
                {
                    name: 'Widget Configuration Updates',
                    content: 'docs/widgetConfigurationUpdates.md',
                }
            ]
        },
        {
            name: 'Limitations',
            content: 'docs/limitations.md',
        },
        {
            name: 'Accessibility',
            content: 'docs/accessibility.md',
        },
        {
            name: 'Browser Support',
            content: 'docs/browserSupport.md',
        }
    ],
    getComponentPathLine(componentPath) {
        const name = path.basename(componentPath, '.js');
        return `import { ${name} } from '@synchro-charts/react';`;
    },
    styleguideComponents: {
        SectionsRenderer: path.join(__dirname, 'src/styleguide/Sections'),
    },
}
