import React, { Component } from "react";

//TODO: implement label
//[Include use of <label> inside <form> [improved UX] · Issue #11 · the-road-to-learn-react/hackernews-client](https://github.com/the-road-to-learn-react/hackernews-client/issues/11)
class Search extends Component {
  componentDidMount() {
    if (this.input) {
      this.input.focus();
    }
  }
  render() {
    const { value, onChange, onSubmit, children } = this.props;
    return (
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={value}
          onChange={onChange}
          ref={el => (this.input = el)}
        />
        <button type="submit">{children}</button>
      </form>
    );
  }
}

export default Search;
