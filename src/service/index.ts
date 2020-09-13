import axios from "axios";

const apiKey = "d7cdfa6e3da4b62c9664b90b283d7ea2";
const URL = "https://api.themoviedb.org/3";
const posterURL = "https://image.tmdb.org/t/p/original/";
const nowPlayingURL = `${URL}/movie/now_playing`;
const topRatedURL = `${URL}/movie/top_rated`;
const movieURL = `${URL}/movie`;
const moviesURL = `${URL}/discover/movie`;
const genreURL = `${URL}/genre/movie/list`;
const personURL = `${URL}/trending/person/week`;
const imageMissing =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAADcCAMAAADutHs3AAAABlBMVEX////m5ua54GxLAAACl0lEQVR4nO3cy1LDMBBE0fD/P01RFBUIjjQvdXukvltZ9tlAYlvK46NhDzYgktCohEYlNCqhUQmNSmhUQqMSGpXQqIRGJTSqavTjouJL1KKvwEvkZScbiovdNWcyiCvdFacxk6vY+ZO4yDXs7Cnc5Ap27gQhcp6dmh42J9WJ2Qlykh2fmzRn1OGpaXNCHZxZQE6wY/OKzFF1aFqZOaiOzCo0x9SBSaXmkNo/p9gcUbunlJsDau+MBWa/+gT0ErNb7Tt+kdmrdh2+zOxUe45eaPapd0cvNbvUm6MXmz3qvdHLzQ711miA2a7eGQ0xm9VC3wsNMlvVQt8KDTMb1UILnUQDzTa10EILLbTQQgsttNBCCy200DR0yxtboYXeDt3yqanQMHTLdy5Cw9At39j2RLdchdAT3XJlTU90y9ViPdEtV0D2RLdc1dtz/fQytQ9xxJ6AnuiW+1wWqN2CU/ZuFasD1z9nP2KhOnT1k/bY1rCjlz5s33haHb/wcb+FkFGnrqrf94C5eX+IjP8eWXKGzf1ERH6MV5GjbPpXU8z36VpyiH2He8TVN7YryH72XR6L9XwAueZR71qyi32nF0U93yP2fM1cuQoBRbayb7cuzwS6m9minh+CNhvU0yPw5rl6dgDDPFVPxjnmmXo8zDJP1MNRnnmsHg0yzUP1YIxrHqnfD7HNA/VeaLb4Ky+a7f3uADRb+5MHzbY+s6PZ0t9tjWY7/2ZDs5WvbYtmG/83R7OFV22JZvuuG6PZuncJjWqEZtvetxmaLRu1FZrtGrcRmq2atQ2abZq3CZotsiQ0qlc022NrAzRbY01oVO3RbIs9oVE90WyJJ6FRtUazHb6ERtUYzVZ4ExpVWzTb4E9oVEKjEloppVR9n/12QizsFE7aAAAAAElFTkSuQmCC";

interface IData {
  id: Number;
  backdrop_path: String;
  backposter_path?: String;
  popularity: String;
  title: String;
  poster_path: String;
  overview: String;
  vote_average: Number;
}

interface IGenre {
  id: String;
  name: String;
}

interface IPerson {
  id: Number;
  popularity: String;
  name: String;
  profile_path: String;
  known_for_department: String;
}

interface IVideo {
  type: String;
}

interface ICast {
  cast_id: Number;
  character: String;
  name: String;
  profile_path: String;
}

interface IResult {
  id: Number;
  poster_path: String;
  backdrop_path: String;
  title: String;
  vote_average: String;
  release_date: String;
  popularity: String;
  total_pages: Number;
  page: Number;
}

interface IUser {
  _id: Number;
  email: String;
  password: String;
  likedMovies: Array<String>;
  dislikedMovies: Array<String>;
}

interface IMovie {
  _id: Number;
  movieID: String;
  comments: Array<String>;
  date: Date;
}

export const fetchMovies = async () => {
  try {
    const { data } = await axios.get(nowPlayingURL, {
      params: {
        api_key: apiKey,
        language: "en_US",
        page: 1,
      },
    });

    return data["results"].map((res: IData) => ({
      id: res["id"],
      backPoster: posterURL + res["backdrop_path"],
      popularity: res["popularity"],
      title: res["title"],
      poster: posterURL + res["poster_path"],
      overview: res["overview"],
      rating: res["vote_average"],
    }));
  } catch (error) {}
};

export const fetchGenre = async () => {
  try {
    const { data } = await axios.get(genreURL, {
      params: {
        api_key: apiKey,
        language: "en_US",
        page: 1,
      },
    });

    return data["genres"].map((genre: IGenre) => ({
      id: genre["id"],
      name: genre["name"],
    }));
  } catch (error) {}
};

export const fetchMovieByGenre = async (genre_id: String) => {
  try {
    const { data } = await axios.get(moviesURL, {
      params: {
        api_key: apiKey,
        language: "en_US",
        page: 1,
        with_genres: genre_id,
      },
    });

    return data["results"].map((res: IData) => ({
      id: res["id"],
      backPoster: posterURL + res["backdrop_path"],
      popularity: res["popularity"],
      title: res["title"],
      poster: posterURL + res["poster_path"],
      overview: res["overview"],
      rating: res["vote_average"],
    }));
  } catch (error) {}
};

export const fetchPersons = async () => {
  try {
    const { data } = await axios.get(personURL, {
      params: {
        api_key: apiKey,
      },
    });

    return data["results"].map((person: IPerson) => ({
      id: person["id"],
      popularity: person["popularity"],
      name: person["name"],
      profileImg: "https://image.tmdb.org/t/p/w200" + person["profile_path"],
      known: person["known_for_department"],
    }));
  } catch (error) {}
};

export const fetchTopRatedMovie = async (): Promise<IData | undefined> => {
  try {
    const { data } = await axios.get(topRatedURL, {
      params: {
        api_key: apiKey,
        language: "en_US",
        page: 1,
      },
    });

    return data["results"].map((res: IData) => ({
      id: res["id"],
      backPoster: posterURL + res["backdrop_path"],
      popularity: res["popularity"],
      title: res["title"],
      poster: posterURL + res["poster_path"],
      overview: res["overview"],
      rating: res["vote_average"],
    }));
  } catch (error) {
    return undefined;
  }
};

export const fetchMovieDetail = async (id: Number) => {
  try {
    const { data } = await axios.get(`${movieURL}/${id}`, {
      params: {
        api_key: apiKey,
        language: "en_US",
      },
    });
    return data;
  } catch (error) {}
};

export const fetchMovieVideos = async (id: Number) => {
  try {
    const { data } = await axios.get(`${movieURL}/${id}/videos`, {
      params: {
        api_key: apiKey,
      },
    });
    if (data["results"].length > 0)
      return data["results"].filter(
        (video: IVideo) => video.type === "Trailer"
      )[0];
    else return null;
  } catch (error) {}
};

export const fetchCast = async (id: Number) => {
  try {
    const { data } = await axios.get(`${movieURL}/${id}/credits`, {
      params: {
        api_key: apiKey,
      },
    });

    return data["cast"]
      .filter((cast: ICast) => "character" in cast)
      .map((cast: ICast) => ({
        id: cast["cast_id"],
        character: cast["character"],
        name: cast["name"],
        img: cast["profile_path"]
          ? "https://image.tmdb.org/t/p/w200" + cast["profile_path"]
          : imageMissing,
      }));
  } catch (error) {}
};

export const fetchSimilarMovies = async (id: Number) => {
  try {
    const { data } = await axios.get(`${movieURL}/${id}/similar`, {
      params: {
        api_key: apiKey,
        language: "en_US",
      },
    });

    return data["results"].map((movie: IData) => ({
      id: movie["id"],
      backPoster: movie["backdrop_path"],
      popularity: movie["popularity"],
      title: movie["title"],
      poster: posterURL + movie["poster_path"],
      overview: movie["overview"],
      rating: movie["vote_average"],
    }));
  } catch (error) {}
};

export const fetchSearchResult = async (query: String, page: Number) => {
  try {
    const { data } = await axios.get(`${URL}/search/movie`, {
      params: {
        api_key: apiKey,
        language: "en_US",
        page: page,
        query: query,
      },
    });

    return data["results"]
      .filter(
        (result: IResult) =>
          result["release_date"] &&
          result["poster_path"] &&
          result["backdrop_path"]
      )
      .map((result: IResult) => ({
        id: result["id"],
        poster: result["poster_path"]
          ? posterURL + result["poster_path"]
          : imageMissing,
        title: result["title"],
        rating: result["vote_average"],
        date: result["release_date"],
        popularity: result["popularity"],
        totalPages: data["total_pages"],
        page: data["page"],
      }));
  } catch (error) {}
};

export const register = async (
  email: String,
  password: String
): Promise<IUser> => {
  return await fetch("http://localhost:3000/users/register", {
    method: "POST",
    "Content-Type": "application/json",
    body: JSON.stringify({ email, password }),
  });
};

export const login = async (
  email: String,
  password: String
): Promise<IUser> => {
  return await fetch("http://localhost:3000/users/login", {
    method: "POST",
    "Content-Type": "application/json",
    body: JSON.stringify({ email, password }),
  });
};

export const likeMovie = async (
  movieID: String,
  userID: String
): Promise<IUser> => {
  return await fetch("http://localhost:3000/users/liked", {
    method: "POST",
    "Content-Type": "application/json",
    body: JSON.stringify({ movieID, userID }),
  });
};

export const dislikeMovie = async (
  movieID: String,
  userID: String
): Promise<IUser> => {
  return await fetch("http://localhost:3000/users/disliked", {
    method: "POST",
    "Content-Type": "application/json",
    body: JSON.stringify({ movieID, userID }),
  });
};

export const getComments = async (movieID: String): Promise<IMovie> => {
  return await fetch(`http://localhost:3000/movie?movieID=${movieID}`, {
    method: "GET",
    "Content-Type": "application/json",
  });
};

export const addComment = async (movieID: String): Promise<IMovie> => {
  return await fetch("http://localhost:3000/movie/add", {
    method: "POST",
    "Content-Type": "application/json",
    body: JSON.stringify({ movieID, comment }),
  });
};
