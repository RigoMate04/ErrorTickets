import React from "react";
import { useNavigate } from "react-router-dom";

import styles from"./styles/Login.module.css";

export default function Login()  {
    const navigate = useNavigate();
   async function loginUser(event) {
        event.preventDefault();

        try {

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;


            const response = await fetch("http://localhost:3001/login", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    "username" : username,
                    "password" : password
                })
            });

            const data = await response.json();

            if(!response.ok) {
                alert(`Nem sikerült a bejelentkezés: ${data.message}`)
            } else {
                localStorage.setItem("token", data.token);         
                setTimeout(() => {window.location.reload();}, 0);   
                navigate("/Home");          
            }
        } catch (err) {
            console.log(err);
            alert("Valami hiba történt bejelentkezés közben");
        }
    }

    return (
      <div className={styles.loginPage}>
      <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={loginUser}>
        <h1>Bejelentkezés</h1>

        <div className={styles.inputBox}>
          <input
            type="text"
            id="username"
            placeholder="Felhasználónév"
            required
          />
          <i className="bx bxs-user"></i>
        </div>

        <div className={styles.inputBox}>
          <input type="password" id="password" placeholder="Jelszó" required />
          <i className="bx bxs-lock-alt"></i>
        </div>

        <button type="submit" className={styles.btn} id="mySubmit" >
          Bejelentkezés
        </button>
      </form>
    </div>
    </div>
    )
}

