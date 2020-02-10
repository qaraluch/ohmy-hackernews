import React from "react";

const Loading = props => <div {...props}>Loading...</div>;

const withLoading = Component => ({ isLoading, ...rest }) =>
  isLoading ? <Loading /> : <Component {...rest} />;

export default Loading;

export { withLoading };
