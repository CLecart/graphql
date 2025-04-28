// Requêtes GraphQL centralisées pour l'application Zone01 Profile
// Chaque requête est typée et documentée pour faciliter la maintenance
// Utilisez ces exports dans vos hooks Apollo (useQuery, useMutation, etc.)

import { gql } from "@apollo/client";

// GET_USER_INFO : Récupère les infos de base de l'utilisateur connecté
export const GET_USER_INFO = gql`
  query GetUserInfo {
    user {
      id
      login
      attrs
    }
  }
`;

// GET_USER_XP : Statistiques d'XP par cursus et piscine
export const GET_USER_XP = gql`
  query GetXpStatsWithDetails {
    # Piscine Go - Aggregate
    piscineGoXpAggregate: transaction_aggregate(
      where: { type: { _eq: "xp" }, path: { _like: "%piscine-go%" } }
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }

    # Piscine Go - Detailed transactions
    piscineGoXpDetails: transaction(
      where: { type: { _eq: "xp" }, path: { _like: "%piscine-go%" } }
      order_by: { createdAt: asc }
    ) {
      amount
      createdAt
      path
    }

    # Piscine JS - Aggregate
    piscineJsXpAggregate: transaction_aggregate(
      where: { type: { _eq: "xp" }, path: { _like: "%piscine-js/%" } }
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }

    # Piscine JS - Detailed transactions
    piscineJsXpDetails: transaction(
      where: { type: { _eq: "xp" }, path: { _like: "%piscine-js/%" } }
      order_by: { createdAt: asc }
    ) {
      amount
      createdAt
      path
    }

    # Cursus - Aggregate
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

    # Cursus - Detailed transactions
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

// GET_USER_PROGRESS : Progression de l'utilisateur dans les projets
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

// GET_USER_RESULTS : Résultats des projets
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

// GET_USER_AUDITS : Liste des audits réalisés par l'utilisateur
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

// GET_USER_DETAILED_XP : Transactions XP détaillées hors piscine
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

// GET_USER_SKILLS : Transactions de compétences (hors XP/level)
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

// GET_BEST_FRIEND : Groupes de projets pour calculer les collaborateurs
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

// GET_ACTIVITY : Activité récente (progressions)
export const GET_ACTIVITY = gql`
  query GetActivity {
    user {
      progresses(order_by: { createdAt: desc }) {
        createdAt
      }
    }
  }
`;

// GET_AUDITS : Audits réalisés par l'utilisateur (détail)
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

// GET_PROJECTS : Transactions XP par projet
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
