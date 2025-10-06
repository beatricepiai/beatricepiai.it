import { prefetchLayoutData } from "@/lib/navigationUtils";
import { convertDatasourceLabelsToDictionary } from "@/lib/storyblokUtils";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ClientWrapper from "@/components/ClientWrapper";
import styles from "./index.module.scss";
import classNames from "classnames/bind";

const cn = classNames.bind(styles);

export default async function Layout({
  params,
  children,
}: {
  params: { locale: string };
  children: React.ReactNode;
}) {
  const { headerStory, footerStory, i18nLabels } = await prefetchLayoutData(params.locale);
  let labelsDictionary = convertDatasourceLabelsToDictionary(i18nLabels);

  if (!headerStory.story) console.log("Error: Header story does not exist.");
  if (!footerStory.story) console.log("Error: Footer story does not exist.");

  return (
    <main className={styles.main}>
      <div className={cn("wrapper")}>
        {headerStory.story && (
          <Header />
        )}
        <div className={cn("container")}>
          <ClientWrapper labels={labelsDictionary}>
            {children}
          </ClientWrapper>
        </div>
        {footerStory.story && (
          <Footer />
        )}
      </div>
    </main>
  );
}
