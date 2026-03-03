import styles from './styles/page.module.scss';

export default function SettingsPage() {
  return (
    <section
      className={styles.tabPage}
      aria-label='Settings'
    >
      <h1 className={styles.tabTitle}>Settings</h1>
      <p className={styles.tabSubtitle}>Preferenze app, account e notifiche.</p>

      <div className={styles.settingsStack}>
        <article className={styles.settingsCard}>
          <p className={styles.settingsSectionTitle}>Profilo</p>

          <button
            type='button'
            className={styles.settingsRow}
            aria-label='Modifica profilo'
          >
            <span className={styles.settingsRowLeft}>
              <span className={styles.settingsRowLabel}>Modifica profilo</span>
              <span className={styles.settingsRowValue}>Nome, bio e foto</span>
            </span>
            <span className={styles.settingsRowAction}>Apri</span>
          </button>

          <button
            type='button'
            className={styles.settingsRow}
            aria-label='Obiettivi fitness'
          >
            <span className={styles.settingsRowLeft}>
              <span className={styles.settingsRowLabel}>Obiettivi fitness</span>
              <span className={styles.settingsRowValue}>
                Forza, cardio, mobilità
              </span>
            </span>
            <span className={styles.settingsRowAction}>Apri</span>
          </button>
        </article>

        <article className={styles.settingsCard}>
          <p className={styles.settingsSectionTitle}>Notifiche</p>

          <div className={styles.settingsRow}>
            <span className={styles.settingsRowLeft}>
              <span className={styles.settingsRowLabel}>
                Promemoria allenamento
              </span>
              <span className={styles.settingsRowValue}>
                Ogni giorno alle 18:00
              </span>
            </span>
            <span className={styles.settingsPill}>Attivo</span>
          </div>

          <div className={styles.settingsRow}>
            <span className={styles.settingsRowLeft}>
              <span className={styles.settingsRowLabel}>
                Aggiornamenti community
              </span>
              <span className={styles.settingsRowValue}>
                Nuovi post e commenti
              </span>
            </span>
            <span className={`${styles.settingsPill} ${styles.isMuted}`}>
              Off
            </span>
          </div>
        </article>

        <article className={styles.settingsCard}>
          <p className={styles.settingsSectionTitle}>Privacy e dati</p>

          <button
            type='button'
            className={styles.settingsRow}
            aria-label='Visibilità profilo'
          >
            <span className={styles.settingsRowLeft}>
              <span className={styles.settingsRowLabel}>
                Visibilità profilo
              </span>
              <span className={styles.settingsRowValue}>Solo follower</span>
            </span>
            <span className={styles.settingsRowAction}>Apri</span>
          </button>

          <button
            type='button'
            className={styles.settingsRow}
            aria-label='Esporta dati'
          >
            <span className={styles.settingsRowLeft}>
              <span className={styles.settingsRowLabel}>Esporta dati</span>
              <span className={styles.settingsRowValue}>
                CSV e storico sessioni
              </span>
            </span>
            <span className={styles.settingsRowAction}>Apri</span>
          </button>
        </article>

        <article className={styles.settingsCard}>
          <p className={styles.settingsSectionTitle}>Supporto</p>

          <button
            type='button'
            className={styles.settingsRow}
            aria-label='Centro assistenza'
          >
            <span className={styles.settingsRowLeft}>
              <span className={styles.settingsRowLabel}>Centro assistenza</span>
              <span className={styles.settingsRowValue}>FAQ e contatti</span>
            </span>
            <span className={styles.settingsRowAction}>Apri</span>
          </button>

          <button
            type='button'
            className={`${styles.settingsRow} ${styles.isDanger}`}
            aria-label='Esci account'
          >
            <span className={styles.settingsRowLeft}>
              <span className={styles.settingsRowLabel}>Esci account</span>
              <span className={styles.settingsRowValue}>
                Disconnetti da questo dispositivo
              </span>
            </span>
            <span className={styles.settingsRowAction}>Esci</span>
          </button>
        </article>
      </div>
    </section>
  );
}
