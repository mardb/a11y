const React = require("react");
const styles = require("./App.css");
const CreateLandmarkForm = require("./components/CreateLandmarkForm");
const { editDocument } = require("application");

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selection: null
    };

    this.documentStateChanged = this.documentStateChanged.bind(this);
    
  }

  documentStateChanged(selection) {
    this.setState({ selection : selection.items });

    // editDocument({ editLabel : 'Add Icon'}, (selection, docRoot)=> {
    //   const node = [...selection.items].pop();
    //   console.log('node:', node.localBounds);
    // });
  }

  render() {
    const { selection } = this.state;
    // const {
    //   color: { r, g, b, a }
    // } = this.state;

    return (
      <panel className={styles.panel}>
        <CreateLandmarkForm selection={selection} />
      </panel>
    );
  }
}

module.exports = App;
