'use strict';

/**
 * product-verification service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::product-verification.product-verification');
