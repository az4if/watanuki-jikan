import { useNavigate, useSearchParams } from "react-router-dom";
import { useApi } from "../services/useApi";
import Loader from "../components/Loader";
import PageNotFound from "./PageNotFound";
import { Helmet } from "react-helmet";
import Heading from "../components/Heading";
import Image from "../components/Image";
import Pagination from "../components/Pagination";
import Footer from "../components/Footer";
import { genres as genreList } from "../utils/genres";
import Genres from "../components/Genres";

const Genre = () => {
  const [searchParams] = useSearchParams();

  const genre = searchParams.get("genre");
  const page = searchParams.get("page") || 1;

  const currentGenre = genreList.find((g) => g.mal_id === Number(genre));

  const navigate = useNavigate();

  const onChangePage = (page) => {
    navigate(`/genre?genre=${genre}&page=${page}`);
  };

  const endpoint = `/anime?genres=${genre}&page=${page}`;

  const { data, isLoading, isError } = useApi(endpoint);

  if (isLoading) {
    return <Loader className="h-[100dvh]" />;
  }

  if (isError || !data) {
    return <PageNotFound />;
  }

  return (
    <div className="list-page pt-14">
      <Helmet>
        <title>Anime By {currentGenre.name}</title>
        <meta property="og:title" content="search - watanuki" />
      </Helmet>

      <Heading>Anime By {currentGenre.name}</Heading>

      <Genres className={"px-2 py-1 bg-lightbg m-1 text-sm text-black"} />
      <div className="flex flex-wrap justify-around items-center">
        {data?.data.map((item, index) => (
          <div key={item.mal_id + index} className="flw-item">
            <Image data={item} />
          </div>
        ))}
      </div>

      <Pagination
        currentPage={data?.pagination?.current_page}
        totalPages={data?.pagination?.last_visible_page}
        onChange={onChangePage}
      />

      <Footer />
    </div>
  );
};

export default Genre;
