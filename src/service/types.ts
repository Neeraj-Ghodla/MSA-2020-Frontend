export interface IResponse {
  data: Array<IData> | undefined;
}

export interface IDetail {
  data: IData | undefined;
}

export interface IData {
  id: number;
  backdrop_path: string;
  poster?: string;
  backposter_path?: string;
  backPoster?: string;
  popularity: string;
  title: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  rating?: number;
  genres?: Array<IGenre>;
  revenue?: number;
  budget?: number;
  runtime?: number;
  release_date?: string;
}

export interface IGenre {
  id: string;
  name: string;
}

export interface IPerson {
  id: number;
  popularity: string;
  name: string;
  profile_path: string;
  profileImg?: string;
  known_for_department: string;
  known?: string;
}

export interface IVideo {
  type: string;
  key: string;
}

export interface ICast {
  cast_id: number;
  character: string;
  name: string;
  profile_path: string;
  img?: string;
}

export interface IResult {
  id: number;
  poster_path: string;
  backdrop_path: string;
  title: string;
  vote_average: string;
  release_date: string;
  popularity: string;
  total_pages: number;
  page: number;
  totalPages?: number;
  poster?: string;
  rating?: string;
}

export interface IUser {
  _id: string;
  email: string;
  password: string;
  likedMovies: Array<string>;
  dislikedMovies: Array<string>;
}

export interface IMovie {
  _id: number;
  movieID: string;
  comments: Array<string>;
  date: Date;
}
