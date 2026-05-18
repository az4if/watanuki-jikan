import { Link, useParams } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import { useApi } from "../services/useApi";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";
import { FaArrowCircleRight } from "react-icons/fa";
import Image from "../components/Image";
import Heading from "../components/Heading";
import { genres } from "../utils/genres";

const AnimeInfo = () => {
  const { id } = useParams();

  const { data, isError } = useApi(`/anime/${id}`);
  const { data: recommendations, isError: recommendationsError } = useApi(
    `/anime/${id}/recommendations`,
  );

  if (isError) {
    return <PageNotFound />;
  }

  const colors = [
    "#d0e6a5",
    "#ffbade",
    "#fc887b",
    "#ccabda",
    "#abccd8",
    "#d8b2ab",
    "#86e3ce",
  ];

  const getGenreId = (name) => {
    const genre = genres.find((genre) => genre.name === name);
    return genre.mal_id;
  };
  return (
    <main>
      <Helmet>
        <title>anime</title>
        <meta property="og:title" content="detail - watanuki" />
      </Helmet>
      {data && (
        <div className="AnimeInfo relative pt-14 mx-auto text-white banner min-h-[700px] w-full bg-[#333332] md:pt-20">
          <div className="backdrop-img bg-backGround w-full h-full absolute top-0 left-0 overflow-hidden opacity-[.2]">
            <img
              src={data.data.images.webp.large_image_url}
              alt={data?.data.title}
              className="object-cover object-center h-full w-full"
              loading="lazy"
            />
          </div>
          <div className="opacity-overlay"></div>
          <div className="grid md:grid-cols-3 gap-8 content max-w-[1200px] w-full mx-auto flex-col items-start md:flex-row mb-2 relative px-2">
            {/* Poster */}
            <div className="col-span-1">
              <img
                src={data.data.images.webp.large_image_url}
                alt={data.data.title}
                className="rounded-2xl shadow-lg w-full object-cover"
              />
            </div>

            {/* Main Info */}
            <div className="col-span-2 space-y-4">
              <h1 className="text-4xl font-bold">{data.data.title}</h1>

              <p className="text-gray-400">{data.data.title_japanese}</p>

              <ul className="flex flex-wrap">
                {data.data.genres.map((g, index) => (
                  <Link
                    key={g.mal_id}
                    to={`/genre?genre=${getGenreId(g.name)}`}
                    style={{ background: colors[index % colors.length] }}
                    className="px-3 py-1 text-sm text-black"
                  >
                    <li>{g.name}</li>
                  </Link>
                ))}
              </ul>

              <button className="bg-primary px-4 py-1 text-lg rounded-xl text-black ">
                <Link
                  to={`/watch/${data.data.mal_id}?ep=1`}
                  className="flex justify-center items-center gap-2"
                >
                  <span>Watch Now</span>
                  <FaArrowCircleRight />
                </Link>
              </button>

              <div className="grid grid-cols-2 gap-4 pt-4 text-sm">
                <p>
                  <span className="text-gray-400">Score:</span>{" "}
                  {data.data.score}
                </p>
                <p>
                  <span className="text-gray-400">Rank:</span> #{data.data.rank}
                </p>
                <p>
                  <span className="text-gray-400">Status:</span>{" "}
                  {data.data.status}
                </p>
                <p>
                  <span className="text-gray-400">Episodes:</span>{" "}
                  {data.data.episodes ?? "?"}
                </p>
                <p>
                  <span className="text-gray-400">Duration:</span>{" "}
                  {data.data.duration}
                </p>
                <p>
                  <span className="text-gray-400">Aired:</span>{" "}
                  {data.data.aired.string}
                </p>
              </div>

              {/* Studios */}
              <div className="pt-4">
                <p className="text-gray-400 mb-1">Studio</p>
                <p>{data.data.studios.map((s) => s.name).join(", ")}</p>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                {data.data.synopsis}
              </p>
            </div>
          </div>
        </div>
      )}
      {recommendations && !recommendationsError && (
        <>
          <div className="flex mx-2 justify-between items-center mt-5">
            <Heading>Recommendations</Heading>
            <h2>TOTAL {recommendations?.data.length} RESULT</h2>
          </div>

          <div className="wrapper flex justify-around flex-wrap h-full w-full">
            {recommendations?.data.map((item) => (
              <div key={item.mal_id} className="flw-item">
                <Image data={item.entry} key={item.entry.mal_id} />
              </div>
            ))}
          </div>
        </>
      )}
      <Footer />
    </main>
  );
};

export default AnimeInfo;
