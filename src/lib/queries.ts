import { gql } from "@apollo/client";

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
  query GetXpStatsWithDetails {
    piscineGoXpAggregate: transaction_aggregate(
      where: { type: { _eq: "xp" }, path: { _like: "%piscine-go%" } }
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }

    piscineGoXpDetails: transaction(
      where: { type: { _eq: "xp" }, path: { _like: "%piscine-go%" } }
      order_by: { createdAt: asc }
    ) {
      amount
      createdAt
      path
    }

    piscineJsXpAggregate: transaction_aggregate(
      where: { type: { _eq: "xp" }, path: { _like: "%piscine-js/%" } }
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }

    piscineJsXpDetails: transaction(
      where: { type: { _eq: "xp" }, path: { _like: "%piscine-js/%" } }
      order_by: { createdAt: asc }
    ) {
      amount
      createdAt
      path
    }

    cursusXpAggregate: transaction_aggregate(
      where: {
        type: { _eq: "xp" }
        _or: [
          {
            path: { _like: "%div-01%" }
            _not: { path: { _like: "%piscine%" } }
          }
          {
            path: { _like: "%div-01/piscine-js" }
            _not: { path: { _like: "%piscine-js/%" } }
          }
        ]
      }
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }

    cursusXpDetails: transaction(
      where: {
        type: { _eq: "xp" }
        _or: [
          {
            path: { _like: "%div-01%" }
            _not: { path: { _like: "%piscine%" } }
          }
          {
            path: { _like: "%div-01/piscine-js" }
            _not: { path: { _like: "%piscine-js/%" } }
          }
        ]
      }
      order_by: { createdAt: asc }
    ) {
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
      campus
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

export const GET_USER_AUDITS = gql`
  query GetUserAudits {
    audit(order_by: { createdAt: desc }) {
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
      where: { type: { _eq: "xp" }, path: { _niregex: "/(piscine-[^/]+/)" } }
      order_by: { createdAt: desc }
    ) {
      id
      type
      amount
      createdAt
      path
      objectId
    }
  }
`;

export const GET_USER_SKILLS = gql`
  query GetSkills {
    user {
      transactions(
        where: {
          _and: [
            { type: { _neq: "xp" } }
            { type: { _neq: "level" } }
            { type: { _neq: "up" } }
            { type: { _neq: "down" } }
          ]
        }
        order_by: { createdAt: asc }
      ) {
        type
        amount
      }
    }
  }
`;

export const GET_BEST_FRIEND = gql`
  query GetBestFriend {
    user {
      groups(where: { group: { object: { type: { _eq: "project" } } } }) {
        id
        createdAt
        group {
          object {
            type
          }
          captainId
          members {
            user {
              login
            }
          }
        }
      }
    }
  }
`;

export const GET_ACTIVITY = gql`
  query GetActivity {
    user {
      progresses(order_by: { createdAt: desc }) {
        createdAt
      }
    }
  }
`;

export const GET_AUDITS = gql`
  query GetAudits {
    user {
      audits_as_auditor: audits(order_by: { createdAt: desc }) {
        createdAt
        grade
        group {
          object {
            name
            type
          }
          members {
            user {
              id
              login
            }
          }
        }
      }
    }
  }
`;

export const GET_PROJECTS = gql`
  query GetProjects {
    user {
      transactions(
        where: { type: { _eq: "xp" } }
        order_by: { createdAt: desc }
      ) {
        type
        amount
        createdAt
        path
        object {
          name
          type
        }
      }
    }
  }
`;
