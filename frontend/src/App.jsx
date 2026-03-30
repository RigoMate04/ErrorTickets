import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";


import Navbar from "./components/Navbar.jsx";


import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import UserRegistry from "./pages/UserRegistry.jsx";
import RegisterUser from "./pages/RegisterUser.jsx";
import ManDimTickets from "./pages/ManDimTickets.jsx";
import CreateTicket from "./pages/CreateTicket.jsx";
import OwnedTickets from "./pages/OwnedTickets.jsx";



export default function App() {
    return (
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Navigate to="/Login" replace />} />
                    <Route path="/login" element={<Login/>}></Route>
                    <Route path="/home" element={<Home/>}></Route>                 
                    <Route path="/userregistry" element={<UserRegistry/>}></Route>
                    <Route path="/registeruser" element={<RegisterUser/>}></Route>
                    <Route path="/manDimTickets" element={<ManDimTickets/>}></Route>
                    <Route path="/createticket" element={<CreateTicket/>}></Route>
                    <Route path="/ownedtickets" element={<OwnedTickets/>}></Route>
                </Routes>
            </BrowserRouter>
    );
}