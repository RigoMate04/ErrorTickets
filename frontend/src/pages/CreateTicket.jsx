import React, { useEffect } from "react";

export default function CreateTicket() {
    async function createTicket(event) {
        event.preventDefault();

        const token = localStorage.getItem("token");
        const title = document.getElementById("title").value;
        const place = document.getElementById("place").value;
        const description = document.getElementById("description").value;
        const urgent_id = document.getElementById("urgent_id").value;

        try {
 

            const response = await fetch("http://localhost:3001/createTicket/:id", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    "title" : title,
                    "place" : place,
                    "description" : description,
                    "urgent_id": Number(urgent_id)
                })
            });

            const data = await response.json();

            if(!response.ok) {
                alert(`Nem sikerült a hibajegy létrehozása: ${data.message}`)
            } else {
                alert("A hibajegyet sikeresen létrehoztuk!");
                setTimeout(() => {window.location.reload();}, 0); 
            }
 
        } catch (err){
                console.error("Hiba történt a hibajegy létrehozása során:", err);
            }
            
    }

    return (
         <form className="container" onSubmit={createTicket}>
                 <div className="mb-3">
                      <label for="title" className="form-label">Rövid leírás</label>
                      <input type="text" className="form-control" id="title" required/>        
                </div>
                 <div className="mb-3">
                    <label for="place" className="form-label">Helyszín</label>
                        <input type="text" className="form-control" id="place" required/>
                </div>
                <div className="mb-3">
                    <label for="description" className="form-label">Részletes leírás</label>
                        <textarea className="form-control" id="description" rows="3" required></textarea>
                </div>
                  <div className="mb-3">
                   <select className="form-select" aria-label="Default select example"
                   id="urgent_id" required>
                        <option selected>Fontosság kiválasztása</option>
                        <option value="1">Nem sürgős</option>
                        <option value="2">Sűrgős</option>
                        <option value="3">Kritikus</option>
                        <option value="10">Nem tudom</option>
                </select>
                </div>                    
                <button type="submit" className="btn btn-primary" >Új hibajegy létrehozása </button>
    </form>
    )
    
}
