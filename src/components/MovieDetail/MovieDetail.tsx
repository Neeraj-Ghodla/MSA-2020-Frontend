import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
// import ReactStars from "react-rating-stars-component";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { AiFillLike, AiFillDislike } from "react-icons/ai";

import {
  fetchMovieDetail,
  fetchMovieVideos,
  fetchSimilarMovies,
  fetchCast,
  fetchComments,
  addComments,
  likeMovie,
  dislikeMovie,
} from "../../service";

import {
  IData,
  IVideo,
  ICast,
  IPerson,
  IGenre,
  IResult,
  IUser,
  IMovie,
  IDetail,
} from "../../service/types";

import "react-bootstrap-carousel/dist/react-bootstrap-carousel.css";
import "./MovieDetail.css";

interface IMovieDetailProps {
  user: IUser | undefined;
  setUser: Function;
}

interface IMovieModalProps {
  show: boolean;
  onHide: Function;
}

export default function MovieDetail({ user, setUser }: IMovieDetailProps) {
  const movieID = window.location.href.split("movie/")[1];

  const [detail, setDetail] = useState<IData | undefined>(undefined);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [video, setVideo] = useState<IVideo | undefined>(undefined);
  const [cast, setCast] = useState<Array<ICast> | undefined>(undefined);
  const [similarMovies, setSimilarMovies] = useState<Array<IData> | undefined>(
    undefined
  );
  const [comments, setComments] = useState<Array<string> | undefined>(
    undefined
  );
  const [likeButtonColor, setLikeButtonColor] = useState<string>("white");
  const [dislikeButtonColor, setDislikeButtonColor] = useState<string>("white");

  useEffect(() => {
    if (user && user.likedMovies.includes(movieID)) setLikeButtonColor("blue");
    else setLikeButtonColor("white");
    if (user && user.dislikedMovies.includes(movieID))
      setDislikeButtonColor("blue");
    else setDislikeButtonColor("white");
  }, []);

  useEffect(() => {
    const fetchAPI = async () => {
      Promise.all([
        setDetail(await fetchMovieDetail(movieID)),
        setVideo(await fetchMovieVideos(movieID)),
        setCast(await fetchCast(movieID)),
        setSimilarMovies(await fetchSimilarMovies(movieID)),
        setComments(await fetchComments(movieID)),
      ]);
    };
    fetchAPI();
  }, [movieID]);

  const addComment = async () => {
    const comment: string = (document.getElementById(
      "comment"
    ) as HTMLTextAreaElement).value;

    if (comment.trim()) {
      await addComments(comment, movieID);
      await setComments(await fetchComments(movieID));
    }
    (document.getElementById("comment") as HTMLTextAreaElement).value = "";
  };

  const commentList = comments?.map((comment, index) => {
    return (
      <p key={index} style={{ color: "black", border: "2px solid black" }}>
        {comment}
      </p>
    );
  });

  const likeMovieHandler = async (id: string) => {
    if (localStorage.getItem("user")) {
      const newUser = await likeMovie(movieID, user?._id as number);
      await setUser(newUser);
    }
  };

  const dislikeMovieHandler = async (id: string) => {
    if (localStorage.getItem("user")) {
      const newUser = dislikeMovie(user?._id as number, movieID);
      await setUser(newUser);
    }
  };

  const MoviePlayerModal = (props: IMovieModalProps) => {
    const youtubeURL = `https://youtube.com/embed/`;
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body style={{ backgroundColor: "#000000" }}>
          <div className="embed-container">
            <iframe
              title="youtube trailer"
              src={video ? youtubeURL + video.key : undefined}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  const genresList = detail?.genres?.map((genre, index) => {
    return (
      <li key={index} className="list-inline-item">
        <button type="button" className="btn btn-outline-info">
          {genre.name}
        </button>
      </li>
    );
  });

  const castList = cast?.map((cast, index) => {
    return (
      <div className="px-3 text-center" key={index}>
        <img
          src={cast.img}
          alt={cast.name}
          className="img-fluid rounded-circle mx-auto d-block"
        />
        <p className="font-weight-bold text-center">{cast.name}</p>
        <p
          style={{ color: "5a606b" }}
          className="font-weight-light text-center"
        >
          {cast.character}
        </p>
      </div>
    );
  });

  const similarMoviesList = similarMovies?.map((movie, index) => {
    return (
      <div className="px-3" key={index}>
        <div className="card">
          <Link to={`/movie/${movie.id}`}>
            <img className="img-fluid" src={movie.poster} alt={movie.title} />
          </Link>
        </div>
        <div className="mt-3">
          <p style={{ fontWeight: "bolder" }}>{movie.title}</p>
          <p>Rated: {movie.rating}</p>
          {/* <ReactStars
            count={movie.rating}
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
  };

  return (
    <div className="container">
      <div className="row mt-2">
        <MoviePlayerModal
          show={isOpen}
          onHide={() => {
            setIsOpen(false);
          }}
        ></MoviePlayerModal>
        <div style={{ width: "100%" }} className="col text-center">
          <img
            src={`https://image.tmdb.org/t/p/original/${detail?.backdrop_path}`}
            alt={detail?.title}
            className="img-fluid"
          />
          <div className="carousel-center">
            <i
              style={{ fontSize: 95, color: "#f4c10f", cursor: "pointer" }}
              className="far fa-play-circle"
              onClick={() => {
                if (video) setIsOpen(true);
              }}
            ></i>
          </div>
          <div
            style={{ textAlign: "center", fontSize: 35 }}
            className="carouse-caption"
          >
            {detail?.title}
          </div>
        </div>
      </div>

      <div className="row mt-3 ">
        <div className="col">
          <p style={{ color: "#5a606b", fontWeight: "bolder" }}>GENRE</p>
          <AiFillLike
            onClick={() => likeMovieHandler(movieID)}
            style={{
              fontSize: "50px",
              color: likeButtonColor,
            }}
          />
          <AiFillDislike
            onClick={() => dislikeMovieHandler(movieID)}
            style={{
              fontSize: "50px",
              color: dislikeButtonColor,
            }}
          />
        </div>
      </div>

      <div className="row mt-3">
        <div className="col">
          <ul className="list-inline">{genresList}</ul>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col">
          <div className="text-center">
            {/* <ReactStars
              count={detail?.vote_average}
              size={20}
              color="#f4c10f"
            ></ReactStars> */}
          </div>
          <div className="mt-3">
            <p style={{ color: "#5a606b", fontWeight: "bolder" }}>
              {detail?.overview}
            </p>
          </div>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-3">
          <p style={{ color: "#5a606b", fontWeight: "bolder" }}>RELEASE DATE</p>
          <p style={{ color: "#f4c10f" }}>{detail?.release_date}</p>
        </div>

        <div className="col-md-3">
          <p style={{ color: "#5a606b", fontWeight: "bolder" }}>RUNTIME</p>
          <p style={{ color: "#f4c10f" }}>{detail?.runtime}</p>
        </div>

        <div className="col-md-3">
          <p style={{ color: "#5a606b", fontWeight: "bolder" }}>BUDGET</p>
          <p style={{ color: "#f4c10f" }}>{detail?.budget}</p>
        </div>

        <div className="col-md-3">
          <p style={{ color: "#5a606b", fontWeight: "bolder" }}>REVENUE</p>
          <p style={{ color: "#f4c10f" }}>{detail?.revenue}</p>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col">
          <p style={{ color: "#5a606b", fontWeight: "bolder" }}>CAST</p>
        </div>
      </div>

      <Slider {...settings}>{castList}</Slider>

      <div className="row mt-3">
        <div className="col">
          <p style={{ color: "#5a606b", fontWeight: "bolder" }}>
            SIMILAR MOVIES
          </p>
        </div>
      </div>

      <Slider {...settings}>{similarMoviesList}</Slider>

      <div className="row mt-3">
        <div className="col">
          <p style={{ color: "#5a606b", fontWeight: "bolder" }}>COMMENTS</p>
        </div>
      </div>

      <div className="row justify-content-end">
        <textarea
          id="comment"
          style={{ width: "100%" }}
          placeholder="Add your comment"
        />
        <button className="btn btn-primary my-3" onClick={addComment}>
          Add Comment
        </button>
      </div>

      <div className="row">
        <div style={{ width: "100%" }} className="card">
          <div className="card-body">{commentList}</div>
        </div>
      </div>

      <hr style={{ borderTop: "1px solid #5a606b" }} className="mt-5" />
    </div>
  );
}
