import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMovieDetail, likeMovie } from "../../service";
import Slider from "react-slick";

import { IData, IDetail, IUser } from "../../service/types";
import "./Dashboard.css";

interface IDashboardProps {
  user: IUser | undefined;
}

export default function Dashboard({ user }: IDashboardProps) {
  const [liked, setLiked] = useState<(IData | undefined)[]>([]);
  const [disliked, setDisliked] = useState<(IData | undefined)[]>([]);
  useEffect(() => {
    if (user) {
      const { username, likedMovies, dislikedMovies } = user;

      const fetchAPI = async () => {
        likedMovies.map(async (movieID) => {
          const d = await fetchMovieDetail(movieID);
          setLiked((prev) => [...prev, d]);
        });

        dislikedMovies.map(async (movieID) => {
          const d = await fetchMovieDetail(movieID);
          setDisliked((prev) => [...prev, d]);
        });
      };
      fetchAPI();
    }
  }, []);

  // if (user) const { likedMovies, dislikedMovies } = user;
  if (!user) return null;
  else {
    const { username } = user;
    const settings = {
      infinite: false,
      speed: 1000,
      slidesToShow: 4,
      slidesToScroll: 4,
      responsive: [
        {
          breakpoint: 992, // width to change options
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            initialSlide: 3,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2,
          },
        },
      ],
    };

    const likedMoviesList = liked.map((movie, index) => (
      <div className="px-3 text-center" key={index}>
        <div className="card">
          <Link to={`/movie/${movie?.id}`}>
            <img
              className="img-fluid"
              src={"https://image.tmdb.org/t/p/original/" + movie?.poster_path}
              alt={movie?.title}
            />
          </Link>
        </div>
      </div>
    ));

    const dislikedMoviesList = disliked.map((movie, index) => (
      <div className="px-3 text-center" key={index}>
        <div className="card">
          <Link to={`/movie/${movie?.id}`}>
            <img
              className="img-fluid"
              src={"https://image.tmdb.org/t/p/original/" + movie?.poster_path}
              alt={movie?.title}
            />
          </Link>
        </div>
      </div>
    ));

    return (
      <div className="container">
        <div
          className="row justify-content-center"
          style={{ flexDirection: "column" }}
        >
          <div className="col">
            <h1 style={{ textAlign: "center" }}>Hey {username}</h1>
          </div>
          <div className="col">
            <h1>Liked Movies</h1>
            {liked.length ? (
              <Slider {...settings}>{likedMoviesList}</Slider>
            ) : (
              <p style={{ textAlign: "center" }}>
                You haven't like any movies yet.
              </p>
            )}
          </div>
          <div className="col">
            <h1>Disliked Movies</h1>
            {disliked.length ? (
              <Slider {...settings}>{dislikedMoviesList}</Slider>
            ) : (
              <p style={{ textAlign: "center" }}>
                You haven't like any movies yet.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
}
