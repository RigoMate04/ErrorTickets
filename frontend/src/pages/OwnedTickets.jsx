import {useState, useEffect} from 'react';

import NoTickets from '../components/NoTicketsComp';


export default function OwnedTickets() {
    const [tickets, setTickets] = useState([]);
    const token = localStorage.getItem("token");
    const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);

    useEffect(() => {
        async function fetchTickets() {
            try {
                const response = await fetch("http://localhost:3001/ownedTickets", {
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
                alert("Hiba történt a hibajegyeid lekérése közben.");
            }
        }

        fetchTickets();
    }, [token]);

    return (
            <div className="container">
            <div className="text-center">
                {tickets.length > 0 ? tickets.map(ticket => {
                  return (
                    <div className="card" key={ticket.id}>
                    <div className="card-header">{ticket.urgentid}</div>
                        <div className="card-body">
                            <h3 className="card-title">{ticket.title}</h3>
                            <h6 className="card-title">{ticket.place}</h6>
                            <p className="card-text">{ticket.description}</p>
                            <h6 className="card-title">{ticket.userid}</h6>
                            <button className="btn btn-success me-2" onClick={() =>{setIsAssignModalOpen(true)}}>Késznek jelölés</button>
                        </div>
                        <div className="card-footer text-body-secondary">{ticket.formatted_created_at}</div>
                    </div>
                )
                }): (<NoTickets />)}
                </div>        
               
            </div>
    );

}