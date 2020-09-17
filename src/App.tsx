import React, { useState, useEffect } from "react";
import { Switch, Route, Link, useHistory } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import {
  Form,
  FormControl,
  Button,
  Modal,
  Dropdown,
  Nav,
  NavDropdown,
} from "react-bootstrap";

import Home from "./components/Home/Home";
import MovieDetail from "./components/MovieDetail/MovieDetail";
import SearchResult from "./components/SearchResult/SearchResult";
import Dashboard from "./components/Dashboard/Dashboard";

import { IUser } from "./service/types";
import { login } from "./service/index";

import "./App.css";

export default function App() {
  const [show, setShow] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [currentTheme, setCurrentTheme] = useState("light");
  const history = useHistory();

  useEffect(
    () =>
      localStorage.getItem("user")
        ? setUser(JSON.parse(localStorage.getItem("user") as string))
        : undefined,
    []
  );

  useEffect(
    () =>
      user ? localStorage.setItem("user", JSON.stringify(user)) : undefined,
    [user]
  );

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const LoginModal = (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title style={{ color: "black" }}>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label style={{ color: "black" }}>Email address</Form.Label>
            <Form.Control
              type="text"
              name="email"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label style={{ color: "black" }}>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button
            variant="primary"
            onClick={async () => {
              const user = await login(email, password);
              setUser(user);
              localStorage.setItem("user", JSON.stringify(user));
              handleClose();
              history.push("/dashboard");
            }}
          >
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );

  let navBar = (
    <Navbar bg="light" variant="light">
      <Navbar.Brand className="d-flex col-md-2">
        <Link to={"/"}>
          <img
            alt="TMDB"
            src={
              "https://pbs.twimg.com/profile_images/1243623122089041920/gVZIvphd_400x400.jpg"
            }
            width="50"
            height="50"
            className="d-inline-block align-top"
          />
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Form inline>
          <FormControl
            id="searchbar"
            style={{ width: "80%" }}
            type="text"
            placeholder="Search"
            className="mr-3"
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
          <Button
            variant="outline-dark"
            id="submit"
            type="sumbit"
            onClick={(e) => {
              e.preventDefault();
              if (query) history.push(`/search/${query}`);
            }}
          >
            Search
          </Button>
        </Form>
        <Nav className="mr-auto">
          <Nav.Link href="#">
            <Button onClick={handleShow}>Login</Button>
          </Nav.Link>
          <Nav.Link href="#">
            <Button>SignUp</Button>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
      {/* <Form inline className="col-md-8 d-flex justify-content-center">
          <FormControl
            id="searchbar"
            style={{ width: "80%" }}
            type="text"
            placeholder="Search"
            className="mr-3"
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
          <Button
            variant="outline-dark"
            id="submit"
            type="sumbit"
            onClick={(e) => {
              e.preventDefault();
              if (query) history.push(`/search/${query}`);
            }}
          >
            Search
          </Button>
          <Button onClick={() => switchTheme()}>Switch Theme</Button>
        </Form>
        <div className="col-md-2 d-flex justify-content-around">
          {user ? (
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Dropdown Button
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="/dashboard">Dashboard</Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setUser(undefined);
                    localStorage.setItem("user", "");
                  }}
                >
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <>
              <Button onClick={handleShow}>Login</Button>
              <Button>SignUp</Button>{" "}
            </>
          )}
        </div> */}
    </Navbar>
  );

  navBar = (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#">
        <Link to={"/"}>
          <img
            alt="TMDB"
            src={
              "https://pbs.twimg.com/profile_images/1243623122089041920/gVZIvphd_400x400.jpg"
            }
            width="50"
            height="50"
            className="d-inline-block align-top"
          />
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle
        className="dropdown-menu-right"
        aria-controls="basic-navbar-nav"
      />
      <Navbar.Collapse id="basic-navbar-nav">
        <Form className="ml-auto" inline>
          <FormControl
            id="searchbar"
            type="text"
            placeholder="Search"
            className="mr-sm-2"
            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
              setQuery(
                (document.getElementById("searchbar") as HTMLInputElement).value
              );
              if (query && e.key === "Enter") history.push(`/search/${query}`);
            }}
          />
          <Button
            variant="outline-dark"
            id="submit"
            type="sumbit"
            className="my-sm-3"
            onClick={(e) => {
              e.preventDefault();
              setQuery(
                (document.getElementById("searchbar") as HTMLInputElement).value
              );
              if (query) history.push(`/search/${query}`);
            }}
          >
            Search
          </Button>
        </Form>
        <Nav>
          {currentTheme === "light" ? (
            <i
              onClick={() => switchTheme()}
              style={{ fontSize: "2rem", cursor: "pointer" }}
              className="fas fa-moon px-3"
            ></i>
          ) : (
            <i
              onClick={() => switchTheme()}
              style={{ fontSize: "2rem", cursor: "pointer" }}
              className="fas fa-sun px-3"
            ></i>
          )}
          {!user ? (
            <>
              <Nav.Link href="#" onClick={handleShow}>
                Login
              </Nav.Link>
              <Nav.Link href="#">Signup</Nav.Link>
            </>
          ) : (
            <NavDropdown title="User" id="basic-nav-dropdown">
              <NavDropdown.Item href="/dashboard">Dashboard</NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => {
                  setUser(undefined);
                  // localStorage.setItem("user", "");
                  localStorage.removeItem("user");
                }}
              >
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );

  const Main = (
    <main>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route
          path="/movie/:id"
          component={() => <MovieDetail user={user} setUser={setUser} />}
          exact
        />
        <Route path="/search/:query" component={SearchResult} exact />
        <Route
          path="/dashboard"
          component={() => <Dashboard user={user} />}
          exact
        />
      </Switch>
    </main>
  );

  const switchTheme = () => {
    const root = document.getElementById("root") as HTMLDivElement;
    const nav = document.getElementsByTagName("nav")[0];
    const btn = document.getElementById("submit") as HTMLButtonElement;
    if (root.classList.contains("dark-theme")) {
      setCurrentTheme("light");
      // remove light theme
      nav.classList.remove("navbar-dark");
      nav.classList.remove("bg-dark");
      btn.classList.remove("btn-outline-light");
      // add dark theme
      nav.classList.add("navbar-light");
      nav.classList.add("bg-light");
      btn.classList.add("btn-outline-dark");
    } else {
      setCurrentTheme("dark");
      // remove dark theme
      nav.classList.remove("navbar-light");
      nav.classList.remove("bg-light");
      btn.classList.remove("btn-outline-dark");

      // remove light theme
      nav.classList.add("navbar-dark");
      nav.classList.add("bg-dark");
      btn.classList.add("btn-outline-light");
    }
    // toggle dark theme
    root.classList.toggle("dark-theme");
  };

  return (
    <div>
      {navBar}
      {LoginModal}
      {Main}
    </div>
  );
}
