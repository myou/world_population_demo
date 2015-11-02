# World Populations

Visualize the world's population over time.

[demo](http://world-population-demo.herokuapp.com/)

## Getting Started

### Dependencies

Node.js >= 0.10.24

### To run

If you unix/linux/osx:

    make start

If on windows, or if you don't have make:

    node server

Then, go to localhost:3000, note if another program is occupying the port, you will get an address in use error.

### To recompile CSV to specifically formatted JSON

If you unix/linux/osx:

    make convert-data

If on windows, or if you don't have make:

    node data/csv_to_json_converter
