import { gql, useMutation } from "@apollo/client";

const registerDocument = gql`
  mutation Register($username: String!, $email: String!, $password: String!, $passwordConfirm: String!) {
    register(input: { username: $username, email: $email, password: $password, password_confirm: $passwordConfirm}) 
      @rest(type: "RegisterResponse", path: "/users", method: "POST") {
      statusCode
      message
    }
  }
`;

export const useRegister = () => {
  const [register, { data, loading, error }] = useMutation(registerDocument);

  return { register, data, loading, error };
};
