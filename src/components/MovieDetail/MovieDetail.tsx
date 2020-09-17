import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
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

import { IData, IVideo, ICast, IUser } from "../../service/types";

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
  const [likeButtonColor, setLikeButtonColor] = useState<string>("grey");
  const [dislikeButtonColor, setDislikeButtonColor] = useState<string>("grey");

  useEffect(() => {
    if (user && user.likedMovies.includes(movieID))
      setLikeButtonColor("lightblue");
    else setLikeButtonColor("grey");
    if (user && user.dislikedMovies.includes(movieID))
      setDislikeButtonColor("lightblue");
    else setDislikeButtonColor("grey");
  }, [user, movieID]);

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
      <div className="d-flex">
        <img
          width="50"
          height="100%"
          className="pr-3"
          alt="Comment"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAADcCAMAAADutHs3AAAABlBMVEX////m5ua54GxLAAACl0lEQVR4nO3cy1LDMBBE0fD/P01RFBUIjjQvdXukvltZ9tlAYlvK46NhDzYgktCohEYlNCqhUQmNSmhUQqMSGpXQqIRGJTSqavTjouJL1KKvwEvkZScbiovdNWcyiCvdFacxk6vY+ZO4yDXs7Cnc5Ap27gQhcp6dmh42J9WJ2Qlykh2fmzRn1OGpaXNCHZxZQE6wY/OKzFF1aFqZOaiOzCo0x9SBSaXmkNo/p9gcUbunlJsDau+MBWa/+gT0ErNb7Tt+kdmrdh2+zOxUe45eaPapd0cvNbvUm6MXmz3qvdHLzQ711miA2a7eGQ0xm9VC3wsNMlvVQt8KDTMb1UILnUQDzTa10EILLbTQQgsttNBCCy200DR0yxtboYXeDt3yqanQMHTLdy5Cw9At39j2RLdchdAT3XJlTU90y9ViPdEtV0D2RLdc1dtz/fQytQ9xxJ6AnuiW+1wWqN2CU/ZuFasD1z9nP2KhOnT1k/bY1rCjlz5s33haHb/wcb+FkFGnrqrf94C5eX+IjP8eWXKGzf1ERH6MV5GjbPpXU8z36VpyiH2He8TVN7YryH72XR6L9XwAueZR71qyi32nF0U93yP2fM1cuQoBRbayb7cuzwS6m9minh+CNhvU0yPw5rl6dgDDPFVPxjnmmXo8zDJP1MNRnnmsHg0yzUP1YIxrHqnfD7HNA/VeaLb4Ky+a7f3uADRb+5MHzbY+s6PZ0t9tjWY7/2ZDs5WvbYtmG/83R7OFV22JZvuuG6PZuncJjWqEZtvetxmaLRu1FZrtGrcRmq2atQ2abZq3CZotsiQ0qlc022NrAzRbY01oVO3RbIs9oVE90WyJJ6FRtUazHb6ERtUYzVZ4ExpVWzTb4E9oVEKjEloppVR9n/12QizsFE7aAAAAAElFTkSuQmCC"
        />
        <p
          key={index}
          style={{
            color: "black",
            border: "2px solid black",
            padding: "10px",
            borderRadius: "20px",
            wordWrap: "break-word",
            width: "auto",
            boxSizing: "border-box",
          }}
        >
          {comment}
        </p>
      </div>
    );
  });

  const likeMovieHandler = async (id: string) => {
    let localUser = localStorage.getItem("user");
    if (localUser) localUser = JSON.parse(localUser);
    if (localUser) {
      const newUser = await likeMovie((user as IUser)._id, movieID);
      setUser(newUser);
    }
  };

  const dislikeMovieHandler = async (id: string) => {
    let localUser = localStorage.getItem("user");
    if (localUser) localUser = JSON.parse(localUser);
    if (localUser) {
      const newUser = await dislikeMovie((user as IUser)._id, movieID);
      setUser(newUser);
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
        </div>
      </div>
    );
  });

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
              style={{ fontSize: "10vw", color: "#f4c10f", cursor: "pointer" }}
              className="fas fa-play"
              onClick={() => {
                if (video) setIsOpen(true);
              }}
            ></i>
          </div>
          <div
            style={{ textAlign: "center", fontSize: "3vw" }}
            className="carousel-caption"
          >
            {detail?.title}
          </div>
        </div>
      </div>

      <div className="row mt-3 ">
        <div className="col">
          <p style={{ color: "#5a606b", fontWeight: "bolder" }}>GENRE</p>
          {user ? (
            <>
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
            </>
          ) : null}
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

      {user ? (
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
      ) : null}

      <div className="row">
        <div className="card mb-3" style={{ width: "100%" }}>
          <div className="card-body">
            {comments?.length ? (
              commentList
            ) : (
              <p style={{ textAlign: "center", width: "100%", color: "black" }}>
                No comments yet...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
