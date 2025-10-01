const swaggerJSDoc = require('swagger-jsdoc');
const config = require('../config');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: config.swagger.title,
            version: config.swagger.version,
            description: config.swagger.description,
            contact: {
                name: 'API Support',
                email: 'support@jewelrystore.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: `http://localhost:${config.port}${config.api.prefix}`,
                description: 'Development server'
            }
        ],
        tags: [
            {
                name: 'Products',
                description: 'Jewelry product management and filtering'
            }
        ],
        components: {
            schemas: {
                Product: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'Product ID'
                        },
                        name: {
                            type: 'string',
                            description: 'Product name'
                        },
                        popularityScore: {
                            type: 'number',
                            minimum: 0,
                            maximum: 1,
                            description: 'Popularity score (0-1)'
                        },
                        popularityScoreOutOf5: {
                            type: 'number',
                            minimum: 0,
                            maximum: 5,
                            description: 'Popularity score out of 5'
                        },
                        weight: {
                            type: 'number',
                            description: 'Weight in grams'
                        },
                        price: {
                            type: 'number',
                            description: 'Calculated price in USD'
                        },
                        pricePerGram: {
                            type: 'number',
                            description: 'Price per gram in USD'
                        },
                        images: {
                            type: 'object',
                            properties: {
                                yellow: { type: 'string', format: 'uri' },
                                rose: { type: 'string', format: 'uri' },
                                white: { type: 'string', format: 'uri' }
                            }
                        }
                    }
                },
                FilterInfo: {
                    type: 'object',
                    properties: {
                        applied: {
                            type: 'object',
                            properties: {
                                priceRange: {
                                    type: 'object',
                                    nullable: true,
                                    properties: {
                                        min: { type: 'number' },
                                        max: { type: 'number' }
                                    }
                                },
                                popularityRange: {
                                    type: 'object',
                                    nullable: true,
                                    properties: {
                                        min: { type: 'number' },
                                        max: { type: 'number' }
                                    }
                                }
                            }
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        message: {
                            type: 'string',
                            description: 'Error message'
                        },
                        error: {
                            type: 'string',
                            description: 'Error code'
                        }
                    }
                }
            }
        }
    },
    apis: [
        './src/controllers/*.js',
        './src/routes/*.js'
    ]
};

const specs = swaggerJSDoc(options);

module.exports = specs;
