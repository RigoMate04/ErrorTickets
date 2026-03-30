import react from 'react';
import styles from './styles/ModTicModStyles.module.css';

function ModifyTicketModal({closeModifyTicketModal, ticket}){
    async function modifyTicket(event) {
        event.preventDefault();

        const title = document.getElementById("title").value;
        const place = document.getElementById("place").value;
        const description = document.getElementById("description").value;
        const urgent_id = document.getElementById("urgentid").value;


        try {

            const response = await fetch(`http://localhost:3001/modifyTicket/${ticket?.id}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    "title" : title,
                    "place" : place,
                    "description" : description,
                    "urgent_id": Number(urgent_id),
                })
            });

            const data = await response.json();

            if(!response.ok) {
                alert(`Nem sikerült a hibajegy módosítása: ${data.message}`)
            } else {
                setTimeout(() => {window.location.reload();}, 0); 
            }

        } catch (err){
            console.error("Hiba történt a hibajegy módosítása során:", err);
        }

    }


    return(
  <div className={styles.modalBackground}>
    <div className={styles.modalContainer}>

      <div className={styles.title}>
        <h1>Hibajegy módosítása</h1>
      </div>

      <div className={styles.body}>

        <div className={styles.formGroup}>
          <label>Cím</label>
          <input
            id="title"
            defaultValue={ticket?.title}
            placeholder="Hibajegy címe"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Hely</label>
          <input
            id="place"
            defaultValue={ticket?.place}
            placeholder="Helyszín"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Prioritás</label>
          <select
            id="urgentid"
            defaultValue={ticket?.urgentid}
          >
            <option value="1">Nem sürgős</option>
            <option value="2">Sürgős</option>
            <option value="3">Kritikus</option>
            <option value="10">Nem tudom</option>
          </select>
        </div>

        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label>Leírás</label>
          <textarea
            id="description"
            defaultValue={ticket?.description}
            placeholder="Hiba részletes leírása..."
          />
        </div>

      </div>

      <div className={styles.footer}>
        <button className={styles.closeBtn} onClick={() => closeModifyTicketModal(false)}>Mégse</button>

        <button className={styles.saveBtn} onClick={modifyTicket}>Mentés</button>
      </div>

    </div>
  </div>
)
}

export default ModifyTicketModal;