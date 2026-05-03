import React from "react";
import * as Components from "../../../../components/LoginStyles";
import "./styles.css";
import { tokens } from "../../../../theme/theme";
import { useTheme } from "@mui/material";
import { useRef, useState, useEffect, useContext } from "react";
import AuthContext from "../../../../context/AuthContext";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from '@mui/material/IconButton';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// Regular expressions for validation
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DRN_REGEX = /^0260\d{12}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

/**
 * @module Login_PC
 */

/**
 * LoginDesktop component handles both sign-in and sign-up functionalities.
 * It integrates with AuthContext for authentication and displays different forms based on user interaction.
 */
function LoginDesktop() {
  const theme = useTheme();
  const [errMsg, setErrMsg] = useState(""); // Error message state for displaying validation errors
  const [signIn, toggle] = React.useState(true); // State to toggle between sign-in and sign-up forms
  const { apiCallLogin, apiCallRegister, ApiErrMsg } = useContext(AuthContext); // Authentication context for API calls and error messages
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [errors, setErrors] = useState({}); // State to hold validation errors

  // Refs for input fields
  const errRef = useRef();
  const nameRef = useRef();
  const surnameRef = useRef();
  const emailRef = useRef();
  const DRNRef = useRef();

  // States for form inputs and their validation
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

  // Effect to validate form inputs on change
  useEffect(() => {
    setValidName(USER_REGEX.test(name));
    setValidSurname(USER_REGEX.test(surname));
    setValidEmail(EMAIL_REGEX.test(email));
    setValidDRN(DRN_REGEX.test(DRN));
  }, [name, surname, email, DRN]);

  /**
   * Handles form submission for user registration.
   * Validates input fields and calls API for registration if inputs are valid.
   * Displays error messages if any validation fails.
   * @param {Event} e - Form submit event
   */
  const handleSubmitRegister = async (e) => {
    e.preventDefault();

    // Validate inputs
    const v1 = USER_REGEX.test(name);
    const v2 = USER_REGEX.test(surname);
    const v3 = EMAIL_REGEX.test(email);
    const v4 = DRN_REGEX.test(DRN);
    const v5 = PWD_REGEX.test(pwd);

    const newErrors = {};

    if (!v1) newErrors.name = "Invalid Name.";
    if (!v2) newErrors.surname = "Invalid Surname.";
    if (!v3) newErrors.email = "Invalid Email.";
    if (!v4) newErrors.DRN = "Invalid DRN.";
    if (!v5) newErrors.pwd = "Invalid Password.";
    if (pwd !== matchPwd) newErrors.match = "Passwords do not match.";

    // Set errors and display error message if validation fails
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrMsg(Object.values(newErrors).join(" "));
      return;
    }

    setErrMsg(null);
    setErrors({});

    // Call API for registration
    await apiCallRegister({
      FirstName: name,
      LastName: surname,
      Email: email,
      DRN: DRN,
      Password: pwd,
    });

    // Display API error message if registration fails
    if (ApiErrMsg !== null) {
      setErrMsg(ApiErrMsg);
    }
  };

  // Effect to clear error message on email or password change
  useEffect(() => {
    setErrMsg("");
  }, [email, pwd]);

  /**
   * Handles form submission for user login.
   * Calls API for login and displays error message if login fails.
   * @param {Event} e - Form submit event
   */
  const handleSubmitLogin = async (e) => {
    e.preventDefault();

    setErrMsg(null);
    await apiCallLogin({ Email: email, Password: pwd });

    // Display API error message if login fails
    if (ApiErrMsg !== null) {
      setErrMsg(ApiErrMsg);
    }
  };

  /**
   * Toggles password visibility.
   */
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Prevents default behavior for mouse down event on password field.
   * @param {Event} event - Mouse down event
   */
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Components.Container>
      {/* Sign Up Form */}
      <Components.SignUpContainer signingIn={signIn}>
        <Components.Form>
          {/* Error Message */}
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <Components.Title>Create Account</Components.Title>
          {/* Name Input */}
          <Components.Input
            type="text"
            placeholder="Name"
            id="name"
            ref={nameRef}
            autoComplete="off"
            onChange={(e) => setname(e.target.value)}
            value={name}
            required
            aria-invalid={validName ? "false" : "true"}
          />
          {/* Surname Input */}
          <Components.Input
            type="text"
            placeholder="Surname"
            id="surname"
            ref={surnameRef}
            autoComplete="off"
            onChange={(e) => setsurname(e.target.value)}
            value={surname}
            required
            aria-invalid={validSurname ? "false" : "true"}
          />
          {/* Email Input */}
          <Components.Input
            type="email"
            placeholder="Email"
            id="email"
            ref={emailRef}
            autoComplete="off"
            onChange={(e) => setemail(e.target.value)}
            value={email}
            required
            aria-invalid={validEmail ? "false" : "true"}
          />
          {/* DRN Input */}
          <Components.Input
            placeholder="Meter DRN"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            id="DRN"
            ref={DRNRef}
            autoComplete="off"
            onChange={(e) => setDRN(e.target.value)}
            value={DRN}
            required
            aria-invalid={validDRN ? "false" : "true"}
          />
          {/* Password Input */}
          <Components.Input
            type="password"
            placeholder="Password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
            aria-invalid={validPwd ? "false" : "true"}
          />
          {/* Confirm Password Input */}
          <Components.Input
            type="password"
            placeholder="Confirm Password"
            id="confirm_pwd"
            onChange={(e) => setMatchPwd(e.target.value)}
            value={matchPwd}
            required
            aria-invalid={validMatch ? "false" : "true"}
          />
          {/* Sign Up Button */}
          <Components.Button onClick={handleSubmitRegister}>
            Sign Up
          </Components.Button>
        </Components.Form>
      </Components.SignUpContainer>
      {/* Sign In Form */}
      <Components.SignInContainer signingIn={signIn}>
        <Components.Form>
          {/* Error Message */}
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <Components.Title>Sign in</Components.Title>
          {/* Email Input */}
          <Components.Input
            type="email"
            placeholder="Email"
            autoComplete="off"
            onChange={(e) => setemail(e.target.value)}
            value={email}
            required
          />
          {/* Password Input */}
          <Components.InputContainer>
            <Components.InputPassword
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
            />
            {/* Toggle Password Visibility */}
            <InputAdornment position="end" style={{ position: "absolute", right: 10 }}>
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          </Components.InputContainer>
          {/* Sign In Button */}
          <Components.Button onClick={handleSubmitLogin}>
            Sign In
          </Components.Button>
        </Components.Form>
      </Components.SignInContainer>
      {/* Overlay for switching between sign-in and sign-up */}
      <Components.OverlayContainer signingIn={signIn}>
        <Components.Overlay signingIn={signIn}>
          <Components.LeftOverlayPanel signingIn={signIn}>
            <Components.Title>Welcome Back!</Components.Title>
            <Components.Paragraph>
              To keep connected with us please login with your personal info
            </Components.Paragraph>
            <Components.GhostButton onClick={() => toggle(true)}>
              Sign In
            </Components.GhostButton>
          </Components.LeftOverlayPanel>
          <Components.RightOverlayPanel signingIn={signIn}>
            <Components.Title>Hello, Friend!</Components.Title>
            <Components.Paragraph>
              Enter your personal details and start your journey with us
            </Components.Paragraph>
            <Components.GhostButton onClick={() => toggle(false)}>
              Sign Up
            </Components.GhostButton>
          </Components.RightOverlayPanel>
        </Components.Overlay>
      </Components.OverlayContainer>
    </Components.Container>
  );
}

export default LoginDesktop;
