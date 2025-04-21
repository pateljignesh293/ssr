import { useEffect } from "react";
import { FacebookLogin } from "react-facebook-login-lite";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import Button from "../../components/Basic/Button";
import Modal from "../../components/Modal";
import { useInjectReducer } from "../../hooks/useInjectReducer";
import { useInjectSaga } from "../../hooks/useInjectSaga";
import { FB_APP_ID, GOOGLE_CLIENT_ID } from "../App/constants";
import * as mapDispatchToProps from "./actions";
import PasswordInput from "./components/PasswordInput";
import UsernameInput from "./components/UsernameInput";
import reducer from "./reducer";
import saga from "./saga";
import {
  makeSelectEmailError,
  makeSelectErrors,
  makeSelectHelperObj,
  makeSelectLoading,
  makeSelectLoadingObj,
  makeSelectPasswordError,
  makeSelectTwoFactor,
} from "./selectors";

const LoginUserPage = (props) => {
  const {
    loginRequest,
    loginWithFbRequest,
    loginWithGoogleRequest,
    errors,
    twoFactor,
    loadingObj: { sendingCode },
    helperObj: { showEmailTwoFactor, showGoogleTwoFactor },
  } = props;

  useInjectReducer({ key: "loginUserPage", reducer });
  useInjectSaga({ key: "loginUserPage", saga });

  const handleClose = () => {
    props.setValue({
      name: "helperObj",
      key: "showEmailTwoFactor",
      value: false,
    });
    props.setValue({
      name: "helperObj",
      key: "showGoogleTwoFactor",
      value: false,
    });
  };

  useEffect(() => {
    handleClose();
    props.clearStore({ name: "errors" });
  }, []);

  const handleChange = (e, name) => {
    props.setValue({
      name: "twoFactor",
      key: "multi_fa",
      value: {
        ...twoFactor.multi_fa,
        [name]: {
          ...twoFactor.multi_fa[name],
          [e.target.name]: e.target.value,
        },
      },
    });
    props.setValue({
      name: "errors",
      key: "multi_fa",
      value: {
        ...errors.multi_fa,
        [name]: { ...errors.multi_fa[name], [e.target.name]: "" },
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginRequest();
  };

  const handleSubmitCode = (e) => {
    e.preventDefault();
    props.addTwoFactorRequest();
  };

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <Modal
        open={showEmailTwoFactor || showGoogleTwoFactor}
        handleClose={handleClose}
        handleUpdate={handleSubmitCode}
        buttonLabel2={
          sendingCode ? (
            <div className="flex text-center justify-center">
              <div className="loading_wrapper">
                <span className="font-bold mr-2 my-auto text-white">
                  Sending
                </span>
                <div className="dot-elastic" />
              </div>
            </div>
          ) : (
            "Continue"
          )
        }
        width="sm"
      >
        {showEmailTwoFactor && (
          <div className="border p-2 m-2">
            <label>Enter the code</label>
            <label className="text-xs">Check inbox for the code</label>
            <input
              id="code"
              name="code"
              value={twoFactor?.email?.code || ""}
              onChange={(e) => handleChange(e, "email")}
              onKeyPress={(e) => e.key === "Enter" && handleSubmitCode(e)}
            />
            <div className="error">{errors?.multi_fa?.email?.code}</div>
          </div>
        )}

        {showGoogleTwoFactor && (
          <div className="border p-2 m-2">
            <label>Enter the code</label>
            <label className="text-xs">
              Copy code from Google Authentication App
            </label>
            <input
              id="code"
              name="code"
              value={twoFactor?.google_authenticate?.code || ""}
              onChange={(e) => handleChange(e, "google_authenticate")}
              onKeyPress={(e) => e.key === "Enter" && handleSubmitCode(e)}
            />
            <div className="error">
              {errors?.multi_fa?.google_authenticate?.code}
            </div>
          </div>
        )}
      </Modal>

      <div className="py-40 h-full bg-gray-50">
        <div className="mx-auto max-w-md p-5 lg:p-10 bg-white shadow-2xl rounded-lg">
          <h1 className="font-bold text-2xl">LOGIN</h1>
          <form className="mt-4" onSubmit={handleSubmit}>
            <UsernameInput />
            <PasswordInput />
            <Button className="w-full my-4" showLoader>
              Login
            </Button>
          </form>
          <Link
            className="inline-block align-baseline text-xs text-blue-700 hover:text-blue-700-darker"
            to="/signup"
          >
            Don't Have an Account? Register
          </Link>
          <p className="text-muted text-center mt-4 mb-4 text-xs">
            OR LOGIN WITH
          </p>
          <div className="mt-5 mb-5 grid grid-cols-2">
            {/* Facebook Login */}
            <FacebookLogin
              appId={FB_APP_ID}
              onSuccess={(response) => loginWithFbRequest(response)}
              onFailure={(error) => console.error("Facebook login error", error)}
            >
              {({ handleLogin }) => (
                <button
                  onClick={handleLogin}
                  className="flex-1 text-white text-sm bg-blue-600 py-3 rounded shadow"
                >
                  Facebook
                </button>
              )}
            </FacebookLogin>

            {/* Google Login */}
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={(response) => loginWithGoogleRequest(response)}
                onError={() => console.error("Google login failed")}
              />
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  errors: makeSelectErrors(),
  emailErr: makeSelectEmailError(),
  passwordErr: makeSelectPasswordError(),
  twoFactor: makeSelectTwoFactor(),
  helperObj: makeSelectHelperObj(),
  loadingObj: makeSelectLoadingObj(),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginUserPage);
