import React, { useRef, useState, useEffect, useContext } from "react";
import { Container, Paper, Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import AuthContext from "../../../context/AuthContext";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DRN_REGEX = /^0260\d{10}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

/**
 * @module Login_Mobile
 */

/**
 * MobileLoginRegisterForm component renders a form for users to either sign in or sign up.
 * 
 * @component
 */
const MobileLoginRegisterForm = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const { apiCallLogin, ApiErrMsg, apiCallRegister } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const errRef = useRef();

  const [name, setname] = useState("");
  const [validName, setValidName] = useState(false);

  const [surname, setsurname] = useState("");
  const [validSurname, setValidSurname] = useState(false);

  const [email, setemail] = useState("");
  const [validEmail, setValidEmail] = useState(false);

  const [DRN, setDRN] = useState("");
  const [validDRN, setValidDRN] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);

  /**
   * Toggles between sign-in and sign-up forms.
   */
  const handleToggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  /**
   * Validates form fields using regex patterns on component mount and on dependency change.
   */
  useEffect(() => {
    setValidName(USER_REGEX.test(name));
    setValidSurname(USER_REGEX.test(surname));
    setValidEmail(EMAIL_REGEX.test(email));
    setValidDRN(DRN_REGEX.test(DRN));
  }, [name, surname, email, DRN]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [name, surname, email, DRN, pwd, matchPwd]);

  /**
   * Toggles the visibility of the password field.
   */
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Prevents default behavior on mouse down event for password visibility toggle button.
   * 
   * @param {Event} event - The mouse down event
   */
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  /**
   * Handles form submission for both sign-in and sign-up forms.
   * Validates the form fields and makes API calls for sign-in or sign-up.
   * 
   * @param {Event} e - The form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignIn) {
      setErrMsg(null);
      await apiCallLogin({ Email: email, Password: pwd });
      if (ApiErrMsg !== null) {
        setErrMsg(ApiErrMsg);
      }
    } else {
      setErrMsg(null);
      await apiCallRegister({ name, surname, email, DRN, pwd });
      if (ApiErrMsg !== null) {
        setErrMsg(ApiErrMsg);
      }
    }

    console.log("Form submitted!");
  };

  return (
    <Container
      disableGutters
      sx={{
        background: "linear-gradient(to right, #021B79, #0575E6)",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Paper
        elevation={3}
        style={{
          padding: "2rem",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          color: "#ffffff",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h5" align="center">
          {isSignIn ? "Sign In" : "Sign Up"}
        </Typography>
        <p
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <form onSubmit={handleSubmit}>
          {isSignIn ? (
            <>
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                variant="outlined"
                required
                onChange={(e) => setemail(e.target.value)}
                value={email}
              />
              <TextField
                label="Password"
                fullWidth
                margin="normal"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                required
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <a href="/forgot-password">Forgot Password?</a>
            </>
          ) : (
            <>
              <TextField
                label="Name"
                fullWidth
                margin="normal"
                variant="outlined"
                required
                onChange={(e) => setname(e.target.value)}
                value={name}
                aria-invalid={validName ? "false" : "true"}
                aria-describedby="uidnote"
              />
              <TextField
                label="Surname"
                fullWidth
                margin="normal"
                variant="outlined"
                required
                onChange={(e) => setsurname(e.target.value)}
                value={surname}
                aria-invalid={validSurname ? "false" : "true"}
                aria-describedby="uidnote"
              />
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                variant="outlined"
                required
                onChange={(e) => setemail(e.target.value)}
                value={email}
                aria-invalid={validEmail ? "false" : "true"}
                aria-describedby="uidnote"
              />
              <TextField
                label="MeterDRN"
                fullWidth
                margin="normal"
                variant="outlined"
                type="number"
                required
                onChange={(e) => setDRN(e.target.value)}
                value={DRN}
                aria-invalid={validDRN ? "false" : "true"}
                aria-describedby="uidnote"
              />
              <TextField
                label="Password"
                fullWidth
                margin="normal"
                variant="outlined"
                type="password"
                required
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                aria-invalid={validPwd ? "false" : "true"}
                aria-describedby="pwdnote"
              />
              <TextField
                label="Confirm Password"
                fullWidth
                margin="normal"
                variant="outlined"
                type="password"
                required
                onChange={(e) => setMatchPwd(e.target.value)}
                value={matchPwd}
                aria-invalid={validMatch ? "false" : "true"}
                aria-describedby="confirmnote"
              />
            </>
          )}
          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: "#ff416c" }}
            fullWidth
          >
            {isSignIn ? "Sign In" : "Sign Up"}
          </Button>
        </form>
        <Button onClick={handleToggleForm} color="secondary" fullWidth>
          {isSignIn ? "Create an account" : "Already have an account? Sign in"}
        </Button>
      </Paper>
    </Container>
  );
};

export default MobileLoginRegisterForm;
