const path = require('path');

function kebabize(string) {
  // uppercase after a non-uppercase or uppercase before non-uppercase
  const upper = /(?<!\p{Uppercase_Letter})\p{Uppercase_Letter}|\p{Uppercase_Letter}(?!\p{Uppercase_Letter})/gu;
  return string.replace(upper, "-$&").replace(/^-/, "").toLowerCase();
}

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
            name: 'Demo',
            content: 'docs/demo.md',
        },
        {
            name: 'Setup',
            content: 'docs/setup.md',
        },
        {
            name: 'Components',
            sectionDepth: 2,
            content: 'docs/components.md',
            components: 'src/components/**/*.js',
            ignore: 'src/components/chart-demo/**',
        },
        {
            name: 'API',
            content: 'docs/api.md',
            sectionDepth: 2,
            sections: [
                {
                  name: 'Properties',
                  content: 'docs/properties.md',
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
            content: 'docs/features.md',
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
                    name: 'Configuration updates',
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
        return `import { ${name} } from '@synchro-charts/react'; // <sc-${kebabize(name)}>`;
    },
    styleguideComponents: {
        SectionsRenderer: path.join(__dirname, 'src/styleguide/Sections'),
    },
}
