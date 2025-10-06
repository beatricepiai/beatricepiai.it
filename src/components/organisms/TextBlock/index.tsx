"use client";

// strobylok stuff
import { SbBlokData, ISbRichtext } from "@storyblok/js";
import { render } from "storyblok-rich-text-react-renderer";
import { GenericBlockProps } from "@/types/generic";
import styles from "./index.module.scss";
import classNames from "classnames/bind";
import Image from "next/image";
import { ISbAssetsParams } from "storyblok-js-client";
const cn = classNames.bind(styles);

interface SbImage {
  id: number;
  alt: string;
  name: string;
  focus: string;
  title: string;
  source: string;
  filename: string;
}

export interface TextBlockDataType extends SbBlokData {
  title: ISbRichtext;
  paragraph: ISbRichtext;
  image: SbImage
}

const TextBlock = ({
  blok,
  links = [],
  ...restProps
}: GenericBlockProps<TextBlockDataType>) => {
  const {
    title,
    paragraph,
    image
  } = blok;

  return (
    <section className={cn("textblock")}>
      <div className={cn({ container: true })}>
        <div className={cn("head")}>
          {title && (
            <div className={cn("h2")}>
              {render(title)}
            </div>
          )}
        </div>
        {image && (
          <Image height={300} width={300} src={image.filename} alt={image.alt} />
        )}
        <div className={cn("body")}>
          {paragraph && (
            <div className={cn("p")}>
              {render(paragraph)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TextBlock;
