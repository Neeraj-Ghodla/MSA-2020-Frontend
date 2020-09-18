import React, { useState, useEffect } from "react";
import { Switch, Route, Link, useHistory, Redirect } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Toast from "react-bootstrap/Toast";
import {
  Form,
  FormControl,
  Button,
  Modal,
  Nav,
  NavDropdown,
} from "react-bootstrap";

import Home from "./components/Home/Home";
import MovieDetail from "./components/MovieDetail/MovieDetail";
import SearchResult from "./components/SearchResult/SearchResult";
import Dashboard from "./components/Dashboard/Dashboard";

import { IUser } from "./service/types";
import { login, register } from "./service/index";

import "./App.css";

export default function App() {
  const [show, setShow] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [showSignup, setShowSignup] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [currentTheme, setCurrentTheme] = useState("light");
  // const [isLoading, setIsLoading] = useState<boolean>(true);
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

  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);

  const handleCloseSignup = () => setShowSignup(false);
  const handleShowSignup = () => setShowSignup(true);

  const LoginModal = (
    <Modal show={showLogin} onHide={handleCloseLogin} centered size="lg">
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
              if (!(email && password)) {
                setMsg("Fill all the fields");
                setShow(true);
              } else {
                // setIsLoading(true);
                const user = await login(email, password);
                // setIsLoading(false);
                if (user) {
                  setUser(user);
                  localStorage.setItem("user", JSON.stringify(user));
                  handleCloseLogin();
                  setMsg("User logged in");
                  setShow(true);
                } else {
                  setMsg("Unauthorized");
                  setShow(true);
                }
              }
            }}
          >
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );

  const SignupModal = (
    <Modal show={showSignup} onHide={handleCloseSignup} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title style={{ color: "black" }}>SignUp</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formBasicUsername">
            <Form.Label style={{ color: "black" }}>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

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
              if (!(username && email && password)) {
                setMsg("You need fill all the fields");
                setShow(true);
              } else {
                const user = await register(email, username, password);
                if ("err" in user) {
                  setMsg(user.err);
                  setShow(true);
                } else {
                  handleCloseSignup();
                  setMsg("User registered successfull!");
                  setShow(true);
                }
              }
            }}
          >
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );

  const toast = (
    <Toast
      style={{
        position: "absolute",
        top: "20px",
        right: "40vw",
        fontSize: "20px",
        backgroundColor: "black",
        color: "white",
        zIndex: 100,
      }}
      onClose={() => setShow(false)}
      show={show}
      delay={3000}
      autohide
    >
      <Toast.Body>{msg}</Toast.Body>
    </Toast>
  );

  const navBar = (
    <Navbar bg="light" expand="md">
      <Navbar.Brand>
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

      <Navbar className="ml-auto pl-0 pr-0">
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
              <Nav.Link href="#" onClick={handleShowLogin}>
                Login
              </Nav.Link>
              <Nav.Link href="#" onClick={handleShowSignup}>
                Signup
              </Nav.Link>
            </>
          ) : (
            <NavDropdown title="User" id="basic-nav-dropdown">
              <NavDropdown.Item>
                <Link to={"/dashboard"} style={{ textDecoration: "none" }}>
                  Dashboard
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => {
                  setUser(undefined);
                  localStorage.removeItem("user");
                  history.push("/");
                }}
              >
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          )}
        </Nav>
      </Navbar>

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
            className="my-3"
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
          component={() =>
            user ? <Dashboard user={user} /> : <Redirect to={"/"} />
          }
          exact
        />
        <Route path="/">
          <Redirect to={"/"} />
        </Route>
      </Switch>
    </main>
  );

  const switchTheme = () => {
    const root = document.getElementById("root") as HTMLDivElement;
    const nav = document.getElementsByTagName("nav")[0];
    const btn = document.getElementById("submit") as HTMLButtonElement;
    const footer = document.getElementById("footer") as HTMLElement;
    if (root.classList.contains("dark-theme")) {
      setCurrentTheme("light");
      // remove light theme
      nav.classList.remove("navbar-dark");
      nav.classList.remove("bg-dark");
      btn.classList.remove("btn-outline-light");
      footer.style.backgroundColor = "white";
      footer.style.color = "black";
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
      footer.style.backgroundColor = "rgb(21,28,38)";
      footer.style.color = "white";

      // remove light theme
      nav.classList.add("navbar-dark");
      nav.classList.add("bg-dark");
      btn.classList.add("btn-outline-light");
    }
    // toggle dark theme
    root.classList.toggle("dark-theme");
  };

  return (
    <>
      {navBar}
      {toast}
      {LoginModal}
      {SignupModal}
      {/* {isLoading ? (
        <div
          className="d-flex justify-content-center w-100"
          style={{
            position: "fixed",
            top: "50vh",
            left: "0",
          }}
        >
          <div
            style={{ width: "100px", height: "100px" }}
            className="spinner-border ml-auto mr-auto"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : null} */}
      {Main}
    </>
  );
}
