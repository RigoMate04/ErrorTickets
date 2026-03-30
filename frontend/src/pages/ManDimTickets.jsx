import {useState, useEffect} from 'react';
import ModifyTicketModal from '../components/ModifyTicketModal';
import AssignTicketModal from '../components/AssignTicketModal';

export default function OwnedTickets() {
    const [tickets, setTickets] = useState([]);
    const token = localStorage.getItem("token");
    const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);

    useEffect(() => {
        async function fetchTickets() {
            try {
                const response = await fetch("http://localhost:3001/manDimTickets", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    alert(`Sikertelen lekérdezés: ${data.message}`);
                } else {
                    setTickets(data.tickets);
                }
            } catch (err) {
                console.log(err);
                alert("Hiba történt a hibajegyek lekérése közben.");
            }
        }

        fetchTickets();
    }, [token]);

   async function deleteTicket(id) {
        try{    
            const response = await fetch(`http://localhost:3001/deleteTicket/${id}` , {   
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
                setTickets(prevTickets => prevTickets.filter(ticket => ticket.id !== id));
            }

    }catch(err){
            console.log(err);
            alert("Hiba történt a hibajegytörlése közben.");
        }



        
    }

    return (
        <>
            <div className="container">
            <div className="card text-center">
                {tickets.length > 0 ? tickets.map(ticket => {
                  return (
                    <div className="card" key={ticket.id}>
                    <div className="card-header">{ticket.urgent}</div>
                        <div className="card-body">
                            <h3 className="card-title">{ticket.title}</h3>
                            <h6 className="card-title">{ticket.place}</h6>
                            <p className="card-text">{ticket.description}</p>
                            <h6 className="card-title">{ticket.userid}</h6>
                            <button className="btn btn-success me-2" onClick={() =>{setIsAssignModalOpen(true)}}>Kiosztás</button>
                            <button className="btn btn-primary me-2" onClick={() => { setSelectedTicket(ticket); setIsChangeModalOpen(true)}}>Módosítás</button>
                            <button className="btn btn-danger" onClick={() => deleteTicket(ticket.id)}>Törlés</button>
                        </div>
                        <div className="card-footer text-body-secondary">{ticket.formatted_created_at}</div>
                    </div>
                )
                }): (<p>Hibajegyek betöltése...</p>)}
                </div>        
               
            </div>

                
            {isChangeModalOpen && <ModifyTicketModal closeModifyTicketModal={setIsChangeModalOpen} ticket={selectedTicket} />}
            {isAssignModalOpen && <AssignTicketModal closeAssignTicketModal={setIsAssignModalOpen} ticket={selectedTicket} />}
        </>


    );

}