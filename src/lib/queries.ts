import { gql } from '@apollo/client';

export const GET_USER_INFO = gql`
  query GetUserInfo {
    user {
      id
      login
      attrs
    }
  }
`;

export const GET_USER_XP = gql`
  query GetUserXp {
    transaction(where: {type: {_eq: "xp"}}, order_by: {createdAt: asc}) {
      id
      type
      amount
      createdAt
      path
    }
  }
`;

export const GET_USER_PROGRESS = gql`
  query GetUserProgress {
    progress {
      id
      grade
      createdAt
      updatedAt
      path
      object {
        id
        name
        type
      }
    }
  }
`;

export const GET_USER_RESULTS = gql`
  query GetUserResults {
    result {
      id
      grade
      createdAt
      path
      object {
        id
        name
        type
      }
    }
  }
`;