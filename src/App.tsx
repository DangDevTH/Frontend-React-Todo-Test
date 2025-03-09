import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApolloProvider, useReactiveVar } from "@apollo/client";
import client from "./constants/apollo-client";
import { authenticatedVar } from "./constants/all-makevar";
import Guard from "./components/Auth/Guard";
import Home from "./components/Home/Home";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Unauthorized from "./components/Errors/Unauthorized";
import ErrorNotFound from "./components/Errors/ErrorNotFound";
import MyTask from "./components/Tasks/MyTasks/MyTask";
import Tasks from "./components/Tasks/Tasks";
import Search from "./components/Search/Search";


const App = () => {
  const isAuthenticated = useReactiveVar(authenticatedVar);

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Guard>
          <Routes>
            {isAuthenticated ? (
              <>
              <Route path="/" element={<Home />} />
              <Route path="/mytask" element={<MyTask />} />
              <Route path="/tasks/:id" element={<Tasks />} />
              <Route path="/tasks/search" element={<Search />} />
              <Route path="*" element={<ErrorNotFound />} />
              </>
              
            ) : (
              <>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Unauthorized />} />
              </>
            )}
          </Routes>
        </Guard>
      </BrowserRouter>
    </ApolloProvider>
  );
};

export default App;
