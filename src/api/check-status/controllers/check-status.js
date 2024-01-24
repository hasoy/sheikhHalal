"use strict";

/**
 * A set of functions called "actions" for `check-status`
 */

module.exports = {
  exampleAction: async (ctx) => {
    try {
      const { data } = ctx.request.body;
      const splitData = await import(
        "../../../../helper-functions/ingredientPatterns.js"
      ).then((module) => module.splitAllIngredientsToArray(data));
      const status = await import(
        "../../../../helper-functions/ingredientPatterns.js"
      ).then((module) => {
        const patterns = [];
        for (const ingredient of splitData) {
          patterns.push(module.checkIngredientStatus(ingredient));
        }
        return patterns;
      });
      ctx.body = status;
    } catch (err) {
      ctx.body = err;
    }
  },
};
