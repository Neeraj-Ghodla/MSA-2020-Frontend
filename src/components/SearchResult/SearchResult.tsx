import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { fetchSearchResult } from "../../service";

import "./SearchResult.css";
import { IResult } from "../../service/types";

interface ISearchResultProps {
  match: any;
}

export default function SearchResult({ match }: ISearchResultProps) {
  const query = match.params.query;
  const [results, setResults] = useState<Array<IResult> | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    setResults([]);
    setCurrentPage(1);
    setTotalPages(1);
  }, [query]);

  useEffect(() => {
    const fetchAPI = async () => {
      const data = await fetchSearchResult(query, currentPage);
      setTotalPages(data && data[0].totalPages ? data[0]["totalPages"] : 1);
      setResults((prev) => {
        if (prev && data) return [...prev, ...data];
        else if (prev && !data) return [...prev];
        else if (!prev && data) return [...data];
        else return undefined;
      });
    };
    fetchAPI();
  }, [query, currentPage]);

  const searchResultsList = results?.map(
    ({ poster, title, id, rating }, index) => {
      return (
        <div className="col-md-3 col-6" key={index}>
          <div>
            <div className="card">
              <Link to={`/movie/${id}`}>
                <img src={poster} alt={title} className="img-fluid" />
              </Link>
            </div>
            <div className="my-3">
              <p style={{ fontWeight: "bolder" }}>{title}</p>
              <p>Rated: {rating}</p>
            </div>
          </div>
        </div>
      );
    }
  );

  return (
    <div className="container">
      <div className="row mt-3">{searchResultsList}</div>
      {currentPage < totalPages ? (
        <div className="row mt-3 pb-3 justify-content-center">
          <button
            className="btn btn-primary"
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Load More
          </button>
        </div>
      ) : null}
    </div>
  );
}
