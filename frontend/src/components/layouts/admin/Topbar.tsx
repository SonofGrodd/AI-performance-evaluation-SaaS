import styles from './Topbar.module.css';
import { FiBell } from 'react-icons/fi';

const Topbar = () => {
  return (
    <header className={styles.topbar}>
      <div className={styles.left}></div>

      <div className={styles.right}>
        <button className={styles.iconButton}>
          <FiBell size={18} />
          <span className={styles.badge}>3</span>
        </button>

        <div className={styles.avatarWrapper}>
          <img
            src="/img/avatar-placeholder.jpg"
            alt="User"
            className={styles.avatar}
          />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
