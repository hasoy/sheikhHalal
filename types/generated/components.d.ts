import type { Schema, Attribute } from '@strapi/strapi';

export interface IngredientStatusIngredientStatus extends Schema.Component {
  collectionName: 'components_ingredient_status_ingredient_statuses';
  info: {
    displayName: 'ingredientStatus';
    icon: 'restaurant';
  };
  attributes: {
    title: Attribute.String;
    explanation: Attribute.Text;
    schoolOfThought: Attribute.JSON;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'ingredient-status.ingredient-status': IngredientStatusIngredientStatus;
    }
  }
}
