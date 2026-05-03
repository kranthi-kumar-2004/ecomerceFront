import{Outlet} from "react-router-dom";
import Header from "./Header";
function UserLayout(){
    return(
        <>
        <Header/>
        <Outlet/>
        </>
    );
}
export default UserLayout;