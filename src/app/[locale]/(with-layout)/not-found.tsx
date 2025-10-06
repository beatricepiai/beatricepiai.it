"use client";

// styles
import "@/app/styles/globals.scss";
import styles from "./index.module.scss";
import classNames from "classnames/bind";
const cn = classNames.bind(styles);

const NotFoundPage = () => {

  return (
    <section className={cn("wrapper404")} data-palette={"white"}>
      <div className={cn("scrollable")}>
        <span className={cn("scroll1")}>404 404 404 404&nbsp;</span>
        <span className={cn("scroll2")}>404 404 404 404&nbsp;</span>
      </div>
      <div className={cn("container")}>
        <div className={cn("title")}>404 Error</div>
        <div className={cn("text")}>You are lost.</div>
        <a href="/" className="btn btn-secondary">Back to home</a>
      </div>
    </section>
  );
};

export default NotFoundPage;
