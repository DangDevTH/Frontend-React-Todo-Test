import { gql, useQuery } from "@apollo/client";

const getMeDocument = gql`
    query Me {
    me @rest(type: "Me", path: "/users/me") {
      user_id
      username
      email
    }
  }
`;

const useGetMe = () => {
    return useQuery(getMeDocument);
};
  
export { useGetMe };

