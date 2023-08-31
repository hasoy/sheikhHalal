'use strict';

/**
 * reported-ingredient service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::reported-ingredient.reported-ingredient');
