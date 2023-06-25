import React from "react";
import {
    Button,
    createTheme,
    Tab,
    Tabs,
    TextField,
    ThemeProvider,
  } from "@material-ui/core";
  import Autocomplete from "@material-ui/lab/Autocomplete";
import "./Search.css";
import SearchIcon from "@material-ui/icons/Search";
import { useEffect, useState } from "react";
import axios from "axios";
import CustomPagination from "../../components/Pagination/CustomPagination";
import SingleContent from "../../components/SingleContent/SingleContent";

const Search = () => {
  const [type, setType] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [content, setContent] = useState([]);
  const [numOfPages, setNumOfPages] = useState();
  const [suggestions, setSuggestions] = useState([]);

  const darkTheme = createTheme({
    palette: {
      type: "dark",
      primary: {
        main: "#fff",
      },
    },
    typography: {
        fontFamily: "Arial", // Change font family
      },
  });

  const fetchSearch = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/search/${type ? "tv" : "movie"}?api_key=08a66e50d8ed06b85cdee09397ef4d8f&language=en-US&query=${searchText}&page=${page}&include_adult=false`
      );
      setContent(data.results);
      setNumOfPages(data.total_pages);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSuggestions = async (query) => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/search/multi?api_key=08a66e50d8ed06b85cdee09397ef4d8f&language=en-US&query=${query}&page=1&include_adult=false`
      );
      const suggestions = data.results.map((result) => ({
        title: result.title || result.name,
        id: result.id,
      }));
      setSuggestions(suggestions);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    window.scroll(0, 0);
    fetchSearch();
    // eslint-disable-next-line
  }, [type, page]);

  return (
    <div>
      <ThemeProvider theme={darkTheme}>
        <div className="search">
          <Autocomplete
            freeSolo
            options={suggestions}
            getOptionLabel={(option) => option.title}
            style={{ flex: 1 }}
            className="searchBox"
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search"
                variant="filled"
                onChange={(e) => {
                  setSearchText(e.target.value);
                  fetchSuggestions(e.target.value);
                }}
              />
            )}
          />
          <Button
            onClick={fetchSearch}
            variant="contained"
            style={{ marginLeft: 10, backgroundColor: "#00bcd4" }}
          >
            <SearchIcon fontSize="large" style={{ color: "#fff" }} />
          </Button>
        </div>
        <Tabs
          value={type}
          indicatorColor="primary"
          textColor="primary"
          onChange={(event, newValue) => {
            setType(newValue);
            setPage(1);
          }}
          style={{ paddingBottom: 5 }}
          aria-label="disabled tabs example"
        >
          <Tab style={{ width: "50%" }} label="Search Movies" />
          <Tab style={{ width: "50%" }} label="Search TV Series" />
        </Tabs>
      </ThemeProvider>
      <div className="trending">
        {content &&
          content.map((c) => (
            <SingleContent
              key={c.id}
              id={c.id}
              poster={c.poster_path}
              title={c.title || c.name}
              date={c.first_air_date || c.release_date}
              media_type={type ? "tv" : "movie"}
              vote_average={c.vote_average}
            />
          ))}
        {searchText && !content && (
          <h2>{type ? "No Series Found" : "No Movies Found"}</h2>
        )}
      </div>
      {numOfPages > 1 && (
        <CustomPagination setPage={setPage} numOfPages={numOfPages} />
      )}
    </div>
  );
};

export default Search;
