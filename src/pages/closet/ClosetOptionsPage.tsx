import { FaArrowLeft } from "react-icons/fa6";
import { FaShieldAlt } from "react-icons/fa";
import { CgMusic } from "react-icons/cg";
import { GrTarget } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import styles from "./styles/closet-options-page.module.css";

const closets = [
  {
    id: 1,
    name: "Gastadores",
    icon: FaShieldAlt,
    count: 4,
    total: "Q450.00",
  },
  {
    id: 2,
    name: "Batonistas",
    icon: GrTarget,
    count: 3,
    total: "Q350.00",
  },
  { id: 6, name: "Banda", icon: CgMusic, count: 0, total: "Q0.00" },
];

export const ClosetOptionsPage = () => {
  const navigate = useNavigate();
  return (
    <main className={styles.page}>
      <header>
        <p className={styles.eyebrow}>Catálogo</p>
        <h1 className={styles.title}>Configuración de Clósets</h1>
        <p className={styles.subtitle}>
          Selecciona una escuadra para administrar los implementos que conforman
          su clóset.
        </p>
      </header>

      <section className={styles.grid}>
        {closets.map(({ id, name, icon: Icon, count, total }) => (
          <article key={id} className={styles.card}>
            <div className={styles.iconBox}>
              <Icon className={styles.icon} strokeWidth={1.25} />
            </div>
            <h2 className={styles.cardTitle}>{name}</h2>
            <p className={styles.cardText}>Configuración de implementos</p>
            <div className={styles.stats}>
              <span>{count} implementos</span>
              <span className={styles.statsValue}>{total}</span>
            </div>
            <button
              type="button"
              onClick={() => navigate(`/closetBuilder/${id}`)}
              className={`${styles.button} ${styles.buttonOutline} ${styles.buttonFull}`}
            >
              Configurar clóset
            </button>
          </article>
        ))}
      </section>

      <button
        type="button"
        onClick={() => navigate(-1)}
        className={`${styles.button} ${styles.buttonGhost}`}
      >
        <FaArrowLeft className={styles.buttonIcon} />
        Volver a implementos
      </button>
    </main>
  );
};
