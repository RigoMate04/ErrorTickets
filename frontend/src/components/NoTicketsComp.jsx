import styles from './styles/NoTicketsCoStyles.module.css';


export default function NoTickets() {
  return (
    <div className={styles.componentBackground}>
      <div className={styles.emoji}>📭</div>
      <h3 className={styles.emptyState}>Nincs hibajegy</h3>
      <p className={styles.textMuted}>Nincsen hibajegyed a mai napra.</p>
    </div>
  );
}