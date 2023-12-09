import type { Schema, Attribute } from '@strapi/strapi';

export interface IngredientStatusIngredientStatus extends Schema.Component {
  collectionName: 'components_ingredient_status_ingredient_statuses';
  info: {
    displayName: 'ingredientStatus';
    icon: 'restaurant';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    explanation: Attribute.Text;
    schoolOfThought: Attribute.JSON;
    consensus: Attribute.Boolean;
    regex: Attribute.String & Attribute.Private;
    istihala: Attribute.Boolean;
    istihlaak: Attribute.Boolean;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'ingredient-status.ingredient-status': IngredientStatusIngredientStatus;
    }
  }
}
