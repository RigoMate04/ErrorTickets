import React from "react";


export default function register () {
    async function registerUser(event) {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const role_id = document.getElementById("role_id").value;

        try {

        
            const response = await fetch("http://localhost:3001/registerUser", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    "username" : username,
                    "email" : email,
                    "password" : password,
                    "role_id": Number(role_id)
                })
            });

            const data = await response.json();

            if(!response.ok) {
                alert(`Nem sikerült a felhasználó regisztrálása: ${data.message}`)
            } else {
                alert("Sikeres regisztrálás");
                setTimeout(() => {window.location.reload();}, 0);
            }
        } catch (err) {
            console.log(err);
            alert("Valami hiba történt regisztrálás közben");
        }
    }

    return (
    <form className="container" onSubmit={registerUser}>
                 <div className="mb-3">
                      <label for="username" className="form-label">Felhasználónév</label>
                      <input type="text" className="form-control" id="username" required/>        
                </div>
                 <div className="mb-3">
                    <label for="email" className="form-label">E-mail cím</label>
                        <input type="email" className="form-control" id="email" required/>
                </div>
                <div className="mb-3">
                    <label for="password" className="form-label">Jelszó</label>
                        <input type="password" className="form-control" id="password" required/>
                </div>
                  <div className="mb-3">
                   <select className="form-select" aria-label="Default select example"
                   id="role_id" required>
                        <option selected>Jogkör kiválasztása</option>
                        <option value="1">Administrtátor</option>
                        <option value="2">Manager</option>
                        <option value="3">Személyzet</option>
                        <option value="4">Dolgozó</option>
                </select>
                </div>                    
                <button type="submit" className="btn btn-primary">Új felhasználó regisztrálása </button>
    </form>
    )
}