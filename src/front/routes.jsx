// Import necessary components and functions from react-router-dom.

import {
      createBrowserRouter,
      createRoutesFromElements,
      Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { LoadRegister } from "./pages/LoadRegister";
import { LoadsBoard } from "./pages/LoadsBoard";
import { Register } from "./pages/Register";
import Principal from "./pages/Principal";
import Login from "./pages/Login";
import PasswordReset from "./pages/PaswordReset";
import FormPasswordReset from "./pages/FormPasswordReset";
import UserProfilesApp from "./pages/UserProfilesApp";
import UserProfileViewer from "./pages/UserProfileViewer";
import { BrokerLoadsBoard } from "./pages/BrokerLoadsBoard";
import EditNewUser from "./pages/EditNewUser";

export const router = createBrowserRouter(
      createRoutesFromElements(
            // CreateRoutesFromElements function allows you to build route elements declaratively.
            // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
            // Root, on the contrary, create a sister Route, if you have doubts, try it!
            // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
            // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

            // Root Route: All navigation will start from here.
            <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
                  <Route path="/" element={<Principal />} />
                  <Route path="/load_register" element={<LoadRegister />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/loadsboard" element={<LoadsBoard />} />
                  <Route path="/register/:role" element={<Register />} />
                  <Route path="/passwordReset" element={<PasswordReset />} />
                  <Route path="/formPasswordReset/:userId/:emailEncrypt" element={<FormPasswordReset />} />
                  <Route path="/profile/:role" element={<UserProfilesApp />} />
                  <Route path="/users/:userId" element={<UserProfileViewer />} />

                  <Route path="/myloads" element={<BrokerLoadsBoard />} />
                  <Route path="/myprofile/:userId" element={<EditNewUser />} />
            </Route>
      )
);