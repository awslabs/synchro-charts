# Widget Grid

Widget grid, exposed as the `<sc-widget-grid />` Web component, is the base component for the following visualizations:

- KPI
- status-grid

The widget grid handles responsibilities which are common amongst visualizations which consist of a grid of cells, such as:

- syncing to viewport group
- associating alarm data with it's associated data stream
- providing the correct data streams to the corresponding cells
- provide trend information
- determine breached threshold
- creating update events for editing the widget name