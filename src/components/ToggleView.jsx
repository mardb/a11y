const React = require("react");

class ToggleView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  //function

  render() {
    return (
      <div>
        <label className="row" style={{ alignItems: "center" }}>
          <input type="checkbox" />
          <span>Show Landmarks</span>
        </label>
      </div>
    );
  }
}

module.exports = ToggleView;
