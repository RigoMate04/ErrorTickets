import React from "react";
import { Link, useNavigate } from "react-router-dom";


export default function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const logout = () => {
        localStorage.removeItem("token");
        setTimeout(() => {window.location.reload();}, 0);
        navigate("/Login");
    };

    if (!token) {}
    else {
          return (
                    <nav className="navbar navbar-expand-lg bg-body-tertiary">
                        <div className="container-fluid">
                            <a className="navbar-brand" href="/Home">Főoldal</a>
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                    <li className="nav-item">
                                        <Link to="/UserRegistry" className="nav-link">Nyilvántartás</Link>
                                    </li>
                                     <li className="nav-item">
                                        <Link to="/RegisterUser" className="nav-link">Új felhasználó hozzáadása</Link>
                                    </li>  
                                    <li className="nav-item">
                                        <Link to="/CreateTicket" className="nav-link">Új hibajegy létrehozása</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/ManDimTickets" className="nav-link">Hibajegyek</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/OwnedTickets" className="nav-link">Saját hibajegyeim</Link>
                                    </li>
                                    <button type="submit" className="btn btn-outline-danger" onClick={logout}>
                                               Kijelentkezés
                                    </button>              
                                </ul>
                                </div>
                            </div>
                        </nav>
                );
    }
}
