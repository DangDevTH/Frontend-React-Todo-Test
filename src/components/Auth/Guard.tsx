import { useEffect } from "react"
import Header from "../Header/Header"
import { useGetMe } from "../../hooks/useGetMe";
import { authenticatedVar, isLoadingVar, userIdVar } from "../../constants/all-makevar";
import excludedRoutes from "../../constants/excluded-routes";


type GuardProps = {
    children: React.ReactNode;
};

const Guard = ({children}: GuardProps) => {
  const { data: userData, loading } = useGetMe();


  useEffect(() => {
    if (!loading) {
      isLoadingVar(loading);
    }
  }, [loading]);

  useEffect(() => {
    if (userData?.me) {
      authenticatedVar(true);
      userIdVar(userData.me.user_id);
    } else {
      authenticatedVar(false);
      userIdVar(null);
    }
  }, [userData]);

  useEffect(() => {
    if (userData && excludedRoutes.includes(window.location.pathname)) {
      window.location.href = "/";
    }
  }, [userData, window.location.pathname]); 
  if (loading) {
    return <div>กำลังโหลด...</div>;
  }

  return (
    <div>
      <Header user={userData?.me}/>
      <div className="p-2">
          { userData ? userData && children: children }
      </div>
    </div>
  )
}

export default Guard
