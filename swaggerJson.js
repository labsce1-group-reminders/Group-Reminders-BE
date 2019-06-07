const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        // API informations (required)
        title: 'Group Reminder', // Title (required)
        version: '1.0.0', // Version (required)
        description: 'A sample API', // Description (optional)
    },
    servers: {
        url: "http://localhost:5000/api",
        description: "Main (dev) server",

    } // Base path (optional)
};

const options = {
    swaggerDefinition,
    apis: ['./controllers/*.js'], // <-- not in the definition, but in the options
};
module.exports = swaggerJSDoc(options);