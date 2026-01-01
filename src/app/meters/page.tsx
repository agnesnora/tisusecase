import FilteredTable from "../components/FilteredTable";
import styles from "./page.module.scss";
const MetersListPage = () => {
  return (
    <div className={styles.container}>
      <FilteredTable />
    </div>
  );
};

export default MetersListPage;
