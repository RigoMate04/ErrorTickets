import { useState, useEffect } from "react";

import styles from"./styles/UserRegistry.module.css";


export default function UserRegistry() {
    const [users, setUsers] = useState(null); 
    const token = localStorage.getItem("token");   

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch("http://localhost:3001/getusers"); 
 
                const data = await response.json();

                if (!response.ok) {
                    alert('Sikertelen lekérdezés: ${data.message}');
                } else {
                
                  setUsers(data.users);
                }
            } catch (err) {
                console.log(err);
                alert("Hiba történt a felhasználók lekérdezése közben.");
            }
        }
        fetchUsers();
    }, []);
    
    async function deleteUser(id) {
        try{    
            const response = await fetch(`http://localhost:3001/users/${id}` , {   
                method: "DELETE",
         headers: {  
                    "Authorization": `Bearer ${token}`
                }     
        });

         const data = await response.json();

            if (!response.ok) {
                alert(`Sikertelen törlés: ${data.message}`);
            } else {
                alert("Sikeres törlés");      
                setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
            }

    }catch(err){
            console.log(err);
            alert("Hiba történt a felhasználó törlése közben.");
        }
    }
  
  

   return (
    <table className={styles.registry_table}>
      <tbody>
        <tr> 
          <th>Felhasználónév</th>
          <th>Email</th>
          <th>Szerepkör</th>
          <th></th>
        </tr>
        {users ? (users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role_name}</td>
              <td><button type="button" className="btn btn-danger" onClick={() => deleteUser(user.id)}>Törlés</button></td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4">Betöltés...</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}


