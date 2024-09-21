// apiUtils.js
export const fetchGraphQLData = async (query) => {
  const response = await fetch("http://localhost:8080/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(query),
  });

  return response.json();
};
