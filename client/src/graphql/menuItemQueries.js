import { gql } from '@apollo/client';

export const GET_ALL_MENU_ITEMS = gql`
  query GetAllMenuItems {
    getMenuItemsList {
      id
      name
      price
      category
      stockStatus
      imageItem
    }
  }
`;
