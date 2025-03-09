import {
  Button,
  Dropdown,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
} from "flowbite-react";
import { DarkThemeToggle } from "flowbite-react";
import { authenticatedVar, isLoadingVar } from "../../constants/all-makevar";
import { useReactiveVar } from "@apollo/client";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import { useEffect, useState } from "react";

interface UserProp {
  user?: {
    user_id: number;
    username: string;
    email: string;
  };
}

const Header = ({ user }: UserProp) => {
  const authenticated = useReactiveVar(authenticatedVar);
  const isLoading = useReactiveVar(isLoadingVar);
  const [logout] = useLogout();
  const [search, setSearch] = useState<string>("");
  const [searchParams] = useSearchParams();
  const title = searchParams.get("title");
  const navigate = useNavigate();

  useEffect(() => {
    if (title) {
      setSearch(title);
    }
  }, [title]);

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/tasks/search/?title=${search}`);
  };

  return (
    <Navbar fluid rounded className="shadow-md">
      <NavbarBrand className="mr-3 p-3">
        <div className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Todo
        </div>
      </NavbarBrand>
      <Link
        className="text-md self-center whitespace-nowrap font-semibold dark:text-white"
        to="/"
      >
        หน้าหลัก
      </Link>
      <NavbarCollapse>
        <form onSubmit={handleSearch} className="mx-auto max-w-xl">
          <div className="relative flex items-center">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="search-dropdown"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
              placeholder="ค้นหา..."
              required
            />
            <button
              disabled={!search.trim()}
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 transform rounded-lg bg-blue-600 p-3 text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
            >
              <svg
                className="h-6 w-6"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">ค้นหา</span>
            </button>
          </div>
        </form>
      </NavbarCollapse>
      {isLoading ? (
        <div className="flex items-center space-x-4">
          <div>loading...</div>
        </div>
      ) : authenticated ? (
        <div className="flex items-center space-x-4">
          <Dropdown
            label={`${user?.username.slice(0, 7)}...`}
            dismissOnClick={false}
          >
            <DropdownItem>
              <Link to="/mytask">งานของฉัน</Link>
            </DropdownItem>
            <DropdownItem type="button" onClick={handleLogout}>
              ออกจากระบบ
            </DropdownItem>
          </Dropdown>
          <DarkThemeToggle />
          <NavbarToggle />
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button>Login</Button>
          </Link>
          <Link to="/register">
            <Button>Register</Button>
          </Link>
          <DarkThemeToggle />
          <NavbarToggle />
        </div>
      )}
    </Navbar>
  );
};

export default Header;
