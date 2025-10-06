"use client";

// styles
import styles from "./index.module.scss";
import classNames from "classnames/bind";
const cn = classNames.bind(styles);

export default function Head() {
  return (
    <p className={cn('head')}>Head</p>
  );
}
