import { gql, useLazyQuery } from "@apollo/client";

const logoutDocument = gql`
    query Logout {
    logout @rest(type: "Logout", path: "/auth/logout", method: "GET") {
      message
      statusCode
    }
  }
`;

const useLogout = () => {
    return useLazyQuery(logoutDocument, {
      fetchPolicy: "network-only" 
    });
};
  
export { useLogout };

