import {useState, useEffect} from 'react';
import styles from './styles/AssTicModStyles.module.css';

function AssignTicketModal({closeAssignTicketModal, ticket}){
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
        async function fetchEmployees() {
            try {
                const response = await fetch("http://localhost:3001/listStaff");
                const data = await response.json();

                if (!response.ok) {
                    alert(`Sikertelen lekérdezés: ${data.message}`);
                } else {
                    setEmployees(data.employees);
                }
            } catch (err) {
                console.log(err);
            }
        }

        fetchEmployees();
    }, []);

    async function assignEmployeeToTicket(){
        try {
              const selected = document.querySelector('input[type="checkbox"]:checked');

                if (!selected) {
                    alert("Válassz ki egy munkatársat!");
                    return;
                }

            const response = await fetch(`http://localhost:3001/assignTicket/${ticket.id}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "selected": Number(selected.value)
                })
            });
            
            
            const data = await response.json();

            if(!response.ok){
                alert(`Sikertelen hozzárendelés: ${data.message}`);
            } else {
                alert('Sikeres hozzárendelés');
            }
        } catch (err) {
            console.log(err);
        }
    }
    
    
    return(
        <div className={styles.modalBackground}>
            <div className={styles.modalContainer}>
                    <div className={styles.title}>
                        <h1>Hiba kiosztása</h1>
                    </div>
                        <div className={styles.body}>
                            {employees.length > 0 ? employees.map(employee =>{
                                return (
                                    <div key={employee.id} className={styles.employee}>
                                        <input className="form-check-input" type="checkbox" value={employee.id} id={`check${employee.id}`}/>
                                        <label className="form-check-label" htmlFor={`check${employee.id}`}> {employee.username} </label>
                                    </div>
                                );
                            }) : (<p>Nincs elérhető munkatárs.</p> )}
                        </div>
                    <div className={styles.footer}>
                        <button className={styles.closeBtn} onClick={() => closeAssignTicketModal(false)}>Mégse</button>
                        <button className={styles.saveBtn} onClick={assignEmployeeToTicket}>Kiosztás</button>
                    </div>
            </div>
        </div>

           
    )
}

export default AssignTicketModal;