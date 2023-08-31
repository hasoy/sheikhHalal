'use strict';

/**
 * dislike service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::dislike.dislike');
