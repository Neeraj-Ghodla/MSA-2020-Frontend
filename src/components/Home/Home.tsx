import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import ReactStars from "react-rating-stars-component";
import { Carousel } from "react-bootstrap";
import Slider from "react-slick";

import {
  fetchMovies,
  fetchGenre,
  fetchMovieByGenre,
  fetchPersons,
  fetchTopRatedMovie,
} from "../../service";

import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Home.css";

import {
  IData,
  IVideo,
  ICast,
  IPerson,
  IGenre,
  IResult,
  IUser,
  IMovie,
} from "../../service/types";

export default function Home() {
  const [nowPlaying, setNowPlaying] = useState<Array<IData> | undefined>(
    undefined
  );
  const [genres, setGenres] = useState<Array<IGenre> | undefined>(undefined);
  const [movieByGenre, setMovieByGenre] = useState<Array<IData> | undefined>(
    undefined
  );
  const [persons, setPersons] = useState<Array<IPerson> | undefined>(undefined);
  const [topRated, setTopRated] = useState<Array<IData> | undefined>(undefined);

  useEffect(() => {
    const fetchAPI = async () => {
      Promise.all([
        setNowPlaying(await fetchMovies()),
        setGenres(await fetchGenre()),
        setMovieByGenre(await fetchMovieByGenre("")),
        setPersons(await fetchPersons()),
        setTopRated(await fetchTopRatedMovie()),
      ]);
    };
    fetchAPI();
  }, []);

  const handleGenreClick = async (genre_id: string) => {
    setMovieByGenre(await fetchMovieByGenre(genre_id));
  };

  const movies = nowPlaying?.map((item: IData, index: number) => {
    return (
      <Carousel.Item key={index}>
        <Link to={`/movie/${item.id}`}>
          <img
            src={item.backPoster}
            alt={item.title}
            className="d-block w-100"
          />
        </Link>
        <Carousel.Caption>
          <h1>{item.title}</h1>
        </Carousel.Caption>
      </Carousel.Item>
    );
  });

  const genreList = genres?.map((item: IGenre, index: number) => {
    return (
      <li className="list-inline-item" key={index}>
        <button
          type="button"
          className="btn btn-outline-info"
          onClick={() => {
            handleGenreClick(item.id);
          }}
        >
          {item.name}
        </button>
      </li>
    );
  });

  const movieList = movieByGenre?.map((item: IData, index: number) => {
    return (
      <div className="px-3" key={index}>
        <Link to={`/movie/${item.id}`}>
          <img src={item.poster} alt={item.title} className="img-fluid" />
        </Link>
        <div className="mt-3">
          <p style={{ fontWeight: "bolder" }}>{item.title}</p>
          <p>Rated: {item.rating}</p>
          {/* <ReactStars
            count={item.rating}
            size={20}
            color1={"#f4c10f"}
          ></ReactStars> */}
        </div>
      </div>
    );
  });

  const trendingPersons = persons?.map((person: IPerson, index: number) => {
    return (
      <div className="px-3 text-center" key={index}>
        <img
          className="img-fluid rounded-circle mx-auto d-block"
          src={person.profileImg}
          alt={person.name}
        />
        <p className="font-weight-bold text-center">{person.name}</p>
        <p
          style={{ color: "#5q606b" }}
          className="font-weight-light text-center"
        >
          Trending for {person.known}
        </p>
      </div>
    );
  });

  const topRatedList = topRated?.map((item: IData, index: number) => {
    return (
      <div className="px-3" key={index}>
        <div className="card">
          <Link to={`/movie/${item.id}`}>
            <img className="img-fluid" src={item.poster} alt={item.title} />
          </Link>
        </div>
        <div className="mt-3">
          <p style={{ fontWeight: "bolder" }}>{item.title}</p>
          <p>Rated: {item.rating}</p>
          {/* <ReactStars
            count={item.rating}
            size={20}
            color1={"#f4c10f"}
          ></ReactStars> */}
        </div>
      </div>
    );
  });

  const settings = {
    infinite: true,
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

  return (
    <div className="container">
      <div className="row mt-2">
        <div className="col">
          <Carousel interval={1000}>{movies}</Carousel>
        </div>
      </div>

      <div className="row mt-3 genre-list">
        <div className="col">
          <ul className="list-inline">{genreList}</ul>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col">
          <p style={{ color: "#5a606b" }} className="font-weight-bold">
            DISCOVER
          </p>
        </div>
      </div>

      <Slider {...settings}>{movieList}</Slider>

      <div className="row mt-3">
        <div className="col">
          <p style={{ color: "#5a606b" }} className="font-weight-bold">
            TRENDING PERSON THIS WEEK
          </p>
        </div>
      </div>

      {/* <div className="row mt-3">{trendingPersons}</div> */}
      <Slider {...settings}>{trendingPersons}</Slider>

      <div className="row mt-3">
        <div className="col">
          <p style={{ color: "#5a606b" }} className="font-weight-bold">
            TOP RATED MOVIES
          </p>
        </div>
      </div>

      {/* <div className="row mt-3">{topRatedList}</div> */}
      <Slider {...settings}>{topRatedList}</Slider>

      <hr style={{ borderTop: "1px solid #5a606b" }} className="mt-5" />

      <div className="row mt-3">
        <div className="col-md-8 col-sm-6">
          <h3>ABOUT ME</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, quos
            labore. Aut, consectetur. Quo iste, nesciunt libero nostrum
            explicabo officia ad, vero, ipsum veniam pariatur voluptatem rerum!
            Quia, quae praesentium?
          </p>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Impedit,
            fuga ad error praesentium asperiores quo tempore vero quisquam
            pariatur! Necessitatibus unde dolor aut autem consectetur distinctio
            eius error facere obcaecati?
          </p>
          <ul className="lsit-inline">
            <li className="list-inline-item">
              <a style={{ color: "#f4c10" }} href="/">
                <i className="fab fa-facebook"> </i>
              </a>
            </li>
            <li className="list-inline-item">
              <a style={{ color: "#f4c10" }} href="/">
                <i className="fab fa-google"> </i>
              </a>
            </li>
            <li className="list-inline-item">
              <a style={{ color: "#f4c10" }} href="/">
                <i className="fab fa-youtube"> </i>
              </a>
            </li>
            <li className="list-inline-item">
              <a style={{ color: "#f4c10" }} href="/">
                <i className="fab fa-instagram"> </i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
