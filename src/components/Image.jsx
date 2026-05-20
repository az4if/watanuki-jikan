/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import AudioInfo from "./AudioInfo";

const Image = ({ data }) => {
  return (
    <div>
      <Link to={`/anime/${data.mal_id}`}>
        <div className="film-poster md:hover:opacity-[.7] transition-all rounded-sm w-full h-full pb-[140%] mb-2 relative overflow-hidden bg-[#545454] block">
          <LazyLoadImage
            className="absolute h-full w-full inset-0 object-cover object-center"
            wrapperClassName="h-full w-full absolute"
            effect="blur"
            src={data.images.webp.image_url}
            alt={data.title_english}
          />
        </div>
      </Link>
      <Link to={`/anime/${data.mal_id}`}>
        <div
          title={data.title_english ?? data.title}
          className="title line-clamp-2 text-xs md:text-base hover:text-primary"
        >
          <h1>{data.title_english ? data.title_english : data.title}</h1>
        </div>
      </Link>
      {data.type && <AudioInfo data={data} />}
    </div>
  );
};

export default Image;
