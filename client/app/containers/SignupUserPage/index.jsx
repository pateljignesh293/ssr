import PropTypes from "prop-types";
import { FacebookLogin } from "react-facebook-login-lite";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import Button from "../../components/Basic/Button";
import { useInjectReducer } from "../../hooks/useInjectReducer";
import { useInjectSaga } from "../../hooks/useInjectSaga";
import { FB_APP_ID, GOOGLE_CLIENT_ID } from "../App/constants";
import * as mapDispatchToProps from "./actions";
import EmailInput from "./components/EmailInput";
import NameInput from "./components/NameInput";
import PasswordInput from "./components/PasswordInput";
import reducer from "./reducer";
import saga from "./saga";
import { makeSelectLoading } from "./selectors";

const SignupUserPage = ({
  signupRequest,
  signupWithFbRequest,
  signupWithGoogleRequest,
  loading,
}) => {
  useInjectReducer({ key: "signupUserPage", reducer });
  useInjectSaga({ key: "signupUserPage", saga });

  const handleSubmit = (e) => {
    e.preventDefault();
    signupRequest();
  };

  return (
    <>
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <div className="py-40 h-full bg-gray-50">
        <div className="mx-auto max-w-md p-5 lg:p-10 bg-white shadow-2xl rounded-lg">
          <h1 className="font-bold text-2xl">SIGN UP</h1>
          <form className="mt-4" onSubmit={handleSubmit}>
            <NameInput />
            <EmailInput />
            <PasswordInput />
            <Button className="w-full my-4" showLoader>
              Sign Up
            </Button>
            <Link
              className="inline-block align-baseline text-xs text-blue-700 hover:text-blue-700-darker"
              to="/login"
            >
              Already Have Account? Login
            </Link>

            <p className="text-muted text-center mt-10 mb-4 text-xs">
              OR REGISTER WITH
            </p>

            <div className="mt-5 mb-5 grid grid-cols-2 gap-4">
              {/* Facebook Login */}
              <FacebookLogin
                appId={FB_APP_ID}
                onSuccess={(response) => signupWithFbRequest(response)}
                onFailure={(error) => console.error("Facebook login error", error)}
              >
                {({ handleLogin }) => (
                  <button
                    onClick={handleLogin}
                    className="text-white text-sm bg-blue-600 py-3 rounded shadow w-full"
                  >
                    Facebook
                  </button>
                )}
              </FacebookLogin>

              {/* Google Login */}
              <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <GoogleLogin
                  onSuccess={(response) => signupWithGoogleRequest(response)}
                  onError={() => console.error("Google login failed")}
                />
              </GoogleOAuthProvider>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

SignupUserPage.propTypes = {
  signupRequest: PropTypes.func.isRequired,
  signupWithFbRequest: PropTypes.func.isRequired,
  signupWithGoogleRequest: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignupUserPage);