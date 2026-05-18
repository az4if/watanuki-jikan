import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { MdGridView, MdViewList } from "react-icons/md";

import Loader from "../components/Loader";
import Player from "../components/Player";
import EpisodeCard from "../components/EpisodeCard";
import PageNotFound from "./PageNotFound";
import Pagination from "../components/Pagination";

import { useApi } from "../services/useApi";

const Watch = () => {
  const { id } = useParams();

  const [searchParams, setSearchParams] = useSearchParams();

  const [layout, setLayout] = useState("list");
  const [page, setPage] = useState(1);

  const ep = Number(searchParams.get("ep"));

  const { data, isLoading, isError } = useApi(
    `/anime/${id}/episodes?page=${page}`,
  );

  const episodes = data?.data || [];
  const pagination = data?.pagination;

  const currentEp = useMemo(() => {
    if (episodes.length > 1) {
      return episodes.find((episode) => episode.mal_id === ep);
    } else {
      return {
        filler: false,
        mal_id: 1,
      };
    }
  }, [episodes, ep]);

  useEffect(() => {
    if (!ep && episodes.length > 0) {
      updateEpisode(episodes[0].mal_id);
    }
  }, [episodes]);

  const updateEpisode = (episodeId) => {
    setSearchParams({ ep: episodeId.toString() });
  };

  const currentIndex = episodes.findIndex(
    (episode) => episode.mal_id === currentEp?.mal_id,
  );

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < episodes.length - 1;

  const changeEpisode = (direction) => {
    if (direction === "next" && hasNext) {
      updateEpisode(episodes[currentIndex + 1].mal_id);
    }

    if (direction === "prev" && hasPrev) {
      updateEpisode(episodes[currentIndex - 1].mal_id);
    }
  };

  if (isError) return <PageNotFound />;

  if (isLoading) {
    return <Loader className="h-screen" />;
  }

  const legendItems = [
    { label: "Absolute Cinema", color: "rgb(29, 161, 242)" },
    { label: "Awesome", color: "rgb(40, 180, 99)" },
    { label: "Good", color: "rgb(244, 208, 63)" },
    { label: "Mid", color: "rgb(243, 156, 18)" },
    { label: "Bad", color: "rgb(231, 76, 60)" },
    { label: "Filler", color: "#7C5C99" },
  ];

  return (
    <div className="min-h-screen bg-backGround text-white">
      <Helmet>
        <title>Watch Anime - Watanuki</title>
      </Helmet>

      <div className="max-w-7xl pt-16 mx-auto  py-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex px-4 items-center gap-2 text-sm text-gray-400">
          <Link to="/home" className="hover:text-primary">
            Home
          </Link>

          <span>/</span>

          <Link to={`/anime/${id}`} className="hover:text-primary capitalize">
            {id}
          </Link>
          <span>/</span>

          <span className="text-primary">Episode {currentEp?.mal_id}</span>
        </div>

        {/* Player */}
        {currentEp && (
          <Player
            id={id}
            currentEp={currentEp}
            changeEpisode={changeEpisode}
            hasNextEp={hasNext}
            hasPrevEp={hasPrev}
          />
        )}

        {/* Toolbar */}
        <div className="flex mx-2 items-center justify-between">
          {pagination.last_visible_page > 1 && (
            <Pagination
              currentPage={page}
              totalPages={pagination.last_visible_page}
              onChange={(page) => setPage(page)}
            />
          )}
          <div className="flex bg-lightbg rounded-lg overflow-hidden">
            <button
              onClick={() => setLayout("list")}
              className={`p-2 ${
                layout === "list" ? "bg-primary text-black" : "text-white"
              }`}
            >
              <MdViewList size={20} />
            </button>

            <button
              onClick={() => setLayout("grid")}
              className={`p-2 ${
                layout === "grid" ? "bg-primary text-black" : "text-white"
              }`}
            >
              <MdGridView size={20} />
            </button>
          </div>
        </div>

        {/* Episodes */}

        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-lightbg p-4">
          {legendItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 rounded-lg bg-black/20 px-3 py-2"
            >
              <div
                className="size-4 rounded-full border border-white/10"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium text-white/80">
                {item.label}
              </span>
            </div>
          ))}
          <p className="text-primary">Out Of 5</p>
        </div>
        {episodes.length > 1 && (
          <div
            className={`grid gap-3 ${
              layout === "list"
                ? "grid-cols-1"
                : "grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10"
            }`}
          >
            {episodes.map((episode) => (
              <EpisodeCard
                key={episode.mal_id}
                animeId={id}
                episode={episode}
                currentEp={currentEp}
                layout={layout}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watch;
