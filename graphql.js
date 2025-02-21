// graphql.js
const GRAPHQL_ENDPOINT = 'https://your-graphql-endpoint.com/graphql';

/**
 * Utility function to send GraphQL queries and mutations.
 * @param {string} query - The GraphQL query or mutation.
 * @param {object} variables - Variables for the query (optional).
 * @returns {Promise<object|null>} - The response data or null on failure.
 */
async function fetchGraphQL(query, variables = {}) {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });
    const result = await response.json();
    if (result.errors) {
      console.error('GraphQL Errors:', result.errors);
      return null;
    }
    return result.data;
  } catch (error) {
    console.error('Error fetching GraphQL data:', error);
    return null;
  }
}

async function fetchGameData() {
  const query = `
    query {
      gameData {
        levels {
          id
          levelNumber
          story
        }
      }
    }
  `;
  return await fetchGraphQL(query);
}

async function submitProgress(levelId, score, timeTaken) {
  const mutation = `
    mutation SubmitProgress($levelId: ID!, $score: Int!, $timeTaken: Int!) {
      submitProgress(levelId: $levelId, score: $score, timeTaken: $timeTaken) {
        success
        message
        leaderboard {
          player
          score
        }
      }
    }
  `;
  const variables = { levelId, score, timeTaken };
  return await fetchGraphQL(mutation, variables);
}

async function fetchHints(levelId) {
  const query = `
    query GetHints($levelId: ID!) {
      hints(levelId: $levelId) {
        id
        text
      }
    }
  `;
  const variables = { levelId };
  return await fetchGraphQL(query, variables);
}

async function fetchLeaderboard() {
  const query = `
    query {
      leaderboard {
        player
        score
        level
        timestamp
      }
    }
  `;
  return await fetchGraphQL(query);
}

async function submitFeedback(playerId, feedback) {
  const mutation = `
    mutation SubmitFeedback($playerId: ID!, $feedback: String!) {
      submitFeedback(playerId: $playerId, feedback: $feedback) {
        success
        message
      }
    }
  `;
  const variables = { playerId, feedback };
  return await fetchGraphQL(mutation, variables);
}

async function fetchUserProgress(playerId) {
  const query = `
    query GetUserProgress($playerId: ID!) {
      userProgress(playerId: $playerId) {
        currentLevel
        score
        timeTaken
        hintsUsed
      }
    }
  `;
  const variables = { playerId };
  return await fetchGraphQL(query, variables);
}

export {
  fetchGameData,
  submitProgress,
  fetchHints,
  fetchLeaderboard,
  submitFeedback,
  fetchUserProgress,
};


