import { gql, useMutation } from "@apollo/client";

const loginDocument = gql`
  mutation Login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) 
      @rest(type: "LoginResponse", path: "/auth/login", method: "POST") {
      statusCode
      message
    }
  }
`;

export const useLogin = () => {
  const [login, { data, loading, error }] = useMutation(loginDocument);

  return { login, data, loading, error };
};
