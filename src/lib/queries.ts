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
      objectId
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

// Nouvelles requêtes avancées
export const GET_USER_AUDITS = gql`
  query GetUserAudits {
    audit(order_by: {createdAt: desc}) {
      id
      grade
      createdAt
      updatedAt
      auditorId
      groupId
    }
  }
`;

export const GET_USER_DETAILED_XP = gql`
  query GetUserDetailedXp {
    transaction(
      where: {type: {_eq: "xp"}}
      order_by: {amount: desc}
    ) {
      id
      amount
      path
      createdAt
      objectId
      object {
        name
        type
      }
    }
  }
`;

export const GET_USER_SKILLS = gql`
  query GetUserSkills {
    progress(
      where: {object: {type: {_in: ["exercise", "project"]}}}
      order_by: {updatedAt: desc}
    ) {
      id
      grade
      path
      object {
        name
        type
        attrs
      }
    }
  }
`;