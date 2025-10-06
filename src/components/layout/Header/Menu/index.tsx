import styles from "./index.module.scss";
import classNames from "classnames/bind";
const cn = classNames.bind(styles);

const Menu = () => {
  return (
    <p className={cn('menu')}>Menu</p>
  );
};

export default Menu;
