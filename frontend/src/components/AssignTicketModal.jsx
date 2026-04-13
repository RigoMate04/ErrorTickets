import { useState, useEffect } from 'react';
import styles from './styles/AssTicModStyles.module.css';

function AssignTicketModal({ closeAssignTicketModal, ticket }) {

    const [employees, setEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);

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

    function handleCheckboxChange(employeeId) {

        setSelectedEmployees(prev => {

            if (prev.includes(employeeId)) {
                return prev.filter(id => id !== employeeId);
            }

            return [...prev, employeeId];
        });
    }

    async function assignEmployeeToTicket() {
        if (!ticket || !ticket.id) {
        console.error("Ticket is null:", ticket);
        alert("Hiba: nincs ticket kiválasztva");
        return;
    }

     if (selectedEmployees.length === 0) {
        alert("Válassz ki legalább egy munkatársat!");
        return;
     }

        if (selectedEmployees.length === 0) {
            alert("Válassz ki legalább egy munkatársat!");
            return;
        }

        try {

            const response = await fetch(`http://localhost:3001/assignTicket/${ticket.id}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    employeeIds: selectedEmployees
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(`Sikertelen hozzárendelés: ${data.message}`);
            } else {
                alert("Sikeres hozzárendelés");
            }

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className={styles.modalBackground}>
            <div className={styles.modalContainer}>

                <div className={styles.title}>
                    <h1>Hiba kiosztása</h1>
                </div>

                <div className={styles.body}>

                    {employees.length > 0 ? (
                        employees.map(employee => (
                            <div key={employee.id} className={styles.employee}>

                                <input
                                    type="checkbox"
                                    checked={selectedEmployees.includes(employee.id)}
                                    onChange={() => handleCheckboxChange(employee.id)}
                                />

                                <label>
                                    {employee.username}
                                </label>

                            </div>
                        ))
                    ) : (
                        <p>Nincs elérhető munkatárs.</p>
                    )}

                </div>

                <div className={styles.footer}>
                    <button
                        className={styles.closeBtn}
                        onClick={() => closeAssignTicketModal(false)}
                    >
                        Mégse
                    </button>

                    <button
                        className={styles.saveBtn}
                        onClick={assignEmployeeToTicket}
                    >
                        Kiosztás
                    </button>
                </div>

            </div>
        </div>
    );
}

export default AssignTicketModal;