const React = require("react");
const ToggleView = require("./ToggleView");
const styles = require("./CreateLandmarkForm.css");
const { editDocument } = require("application");
const { root, Artboard, selection } = require("scenegraph");
const roles = require("../json/roles.json");
const SortableTreeWithoutDndContext = require("react-sortable-tree");
const landmarkTypes = require("../json/landmarkTypes.json");
const LandmarkField = require("./LandmarkField");
const LandmarkDropdown = require("./LandmarkDropdown");
const artboardImg = require('../../images/icons assets/artboard_icon@2x.png');
const allyLogo = require('../../images/icons assets/Ally-logo-blue@2x.png');
const helpIcon = require('../../images/icons assets/questionIcon@2x.png');
const focusIcon = require('../../images/icons assets/focus_icon@2x.png');
const OnboardingDialog = require('./OnboardingDialog')

const parentArtboard = ()=> {
  if (selection.items.length === 0) {
    return (null);
  
  } else {
    if (selection.items[0] instanceof Artboard) {
      return (selection.items[0]);
    }
  }

  let artboard = null;
  let node = selection.items[0];

  while (!artboard) {
    node = node.parent;

    if (node instanceof Artboard) {
      artboard = node;
    }
  }

  return (artboard);
};



const IconButtons = props => {
  return (
  <div className="landmark-icons">
  {landmarkTypes.map((landmarkType, i) => {
    return (
      <div key={i} className="landmark-icon" onClick={() => props.onClick(landmarkType)}>
        <div className="landmark-icon-bg">
          <img
            className="landmark-icon-image"
            alt=""
            src={landmarkType.image}
          />
        </div>
        <div className="landmark-icon-name">{landmarkType.name}</div>
      </div>
    );
  })}
</div>)
}
class CreateLandmarkForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      expanded: false,
      metaData: [],
      landmarks : [],
      onboarding: false
    
    };
    // this.createLandmarkForm = this.createLandmarkForm.bind(this);
    this.handleAriaChange = this.handleAriaChange.bind(this);
    this.handleDeleteLandmark = this.handleDeleteLandmark.bind(this);
    this.handleDeleteRole = this.handleDeleteRole.bind(this);
    this.handleIconClick = this.handleIconClick.bind(this);
    this.handleEditLandmark = this.handleEditLandmark.bind(this);
    this.handleLandmarksBack = this.handleLandmarksBack.bind(this);
    this.handleOnboarding = this.handleOnboarding.bind(this);
    this.handleRoleTabChange = this.handleRoleTabChange.bind(this);
    this.handleLandmarkTabChange = this.handleLandmarkTabChange.bind(this);
  }



  componentDidUpdate(prevProps, prevState) {
    // console.log('componentDidUpdate()', prevProps.selection, this.props.selection);
    if (prevProps.selection !== this.props.selection) {
      if (!(selection.items[0] instanceof Artboard)) {
        const ab = parentArtboard();
        if (ab) {
          // editDocument({ editLabel : 'Add Icon'}, (selection, docRoot)=> {
          //   const node = [...selection.items].pop();
          //   console.log('node:', node.localBounds);
          // });

          this.setState({ landmarks : this.state.landmarks.map((landmark)=> {
            return ((landmark.artboard.guid === ab.guid) ? { ...landmark, 
              roles : landmark.roles.some(item => (item.guid === selection.items[0].guid)) ? landmark.roles : [ ...landmark.roles, {
                node: selection.items[0],
                guid: selection.items[0].guid,
                name: selection.items[0].name,
                index: landmark.roles.length + 1,
                aria: ""
              }]
            } : landmark);
          })});
        }
      }
    }
  }

  handleAriaChange(event, index) {
    console.log(index, this.state.metaData);
    let { metaData } = this.state;
    const landmark = { ...metaData[index], aria: event.target.value };
    metaData.splice(index, 1, landmark);
    this.setState({ metaData });
  }

  handleIconClick(landmark) {
    this.setState({
      expanded : true,
      landmarks: [
        ...this.state.landmarks, {
          id: this.state.landmarks.length + 1,
          artboard: selection.items[0],
          aria: "",
          type: {
            id: landmark.id,
            name: landmark.name
          },
          landmarkIcon: landmark.image,
          visible: true,
          roles: []
        }
      ]
    });
  }

  handleLandmarksBack() {
    this.setState({ expanded : false });
  }

  handleEditLandmark(landmark) {
    editDocument({ editLabel : 'Change Selection'}, (selection, docRoot)=> {
      selection.items = [landmark.artboard];
    });

    this.setState({ expanded : true });
  }

  handleDeleteLandmark(landmark) {
    console.log('handleDeleteLandmark()', landmark);

    let ind = -1;
    this.state.landmarks.forEach((lm, i)=> {
      if (lm.artboard.guid === landmark.artboard.guid) {
        ind = i;
      }
    });

    let { landmarks } = this.state;
    if (ind > -1) {
      landmarks.splice(ind, 1);
    }

    this.setState({ landmarks });
  }

  handleDeleteRole(landmark, role) {
    this.setState({ landmarks : this.state.landmarks.map((item)=> {

      let ind = -1;
      item.roles.forEach((r, i)=> {
        if (r.guid === role.guid) {
          ind = i;
        }
      });

      if (ind > -1) {
        item.roles.splice(ind, 1);
      }

      return ((item.artboard.guid === landmark.artboard.guid) ? { ...item, 
        roles : item.roles
      } : item);
    })});
  }

  

  handleRoleTabChange(landmark, role, e) {
    console.log('handleRoleTabChange()', e.target.value, landmark, role);
    let { landmarks } = this.state;

    let ind = -1;
    landmark.roles.forEach((r, i)=> {
      if (r.guid === role.guid) {
        ind = i;
      }
    });

    if (ind > -1) {
      landmark.roles.splice(ind, 1);
      landmark.roles.splice(e.target.value, 0, role);

      landmark.roles = landmark.roles.map((item, i)=> {
        return ({
          ...item,
          index : i
        });
      });

      this.setState({ landmarks : this.state.landmarks.map((item, i)=> {
        return ((item.artboard.guid === landmark.artboard.guid) ? landmark : item);
      })});
    }
  }

  handleLandmarkTabChange(landmark, e ){
    //console.log('handleLandmarkTabChange()', e.target.value, landmark);
    let { landmarks } = this.state;

    const newIdx = Number(e.target.value);
    const temp = Array.from(landmarks, i => i);
    const idx = temp.findIndex(candidate => candidate.artboard.guid === landmark.artboard.guid);
    const filtered = [... landmarks.slice(0, idx), ... landmarks.slice(idx+1)];
    const newLandmarks = [... filtered.slice(0, newIdx), landmarks[idx], ...filtered.slice(newIdx)];
    this.setState({ landmarks : newLandmarks });

    // let ind = -1;
    // this.state.landmarks.forEach((l, i)=> {
    //   if (l.guid === landmark.guid) {
    //     ind = i;
    //   }
    // });
    
    // if (ind > -1) {
    //   landmarks.splice(ind, 1);
    //   landmarks.splice(e.target.value, 0, landmark);

    //   this.setState({ landmarks : this.state.landmarks.map((item, i)=> {
    //     return ((item.artboard.guid === landmark.artboard.guid) ? landmark : item);
    //   })});
    // }
  }
  

  handleOnboarding() {
    this.setState({onboarding: true})
  }

  render() {

    const { metaData, landmarks, expanded, onboarding } = this.state;
    // console.log('render()', this.state.landmarks);

    const ab = (selection.items[0] instanceof Artboard) ? selection.items[0] : parentArtboard();
    const landmark = (ab) ? landmarks.find(item => (item.artboard.guid === ab.guid)) : null;
    

    return (
      <div>
        {(onboarding) && (<OnboardingDialog/>)}
    
        <div className="logo-image">
          <img src={allyLogo} className="ally-logo"  />
          <div className="onboard-menu">
            How do I use this plugin <img onClick={this.handleOnboarding} src={helpIcon} className="help-icon"/>
          </div>
        </div>
        {(expanded) 
          ? (<div className="landmarks-back" onClick={this.handleLandmarksBack}>&lt; Back to Landmarks</div>)
          : (<IconButtons onClick={this.handleIconClick}/>)
        }
        
        {(expanded && landmark) 
          ? (<div>
              <LandmarkDropdown
                ind={0}
                total={landmarks.length}
                expanded={expanded}
                landmark={landmark}
                landmarkTypes={landmarkTypes}      
                onAddButton={this.handleAddButton}
                onAriaChange={this.handleAriaChange}
                onDeleteLandmark={this.handleDeleteLandmark}
                onDeleteRole={this.handleDeleteRole}
                onEdit={this.handleEditLandmark}
                onRoleTabChange={(e, role)=> this.handleRoleTabChange(landmark, role, e)}
               
              />
          </div>)
          : (<div>
              {landmarks.map((lm, i)=> {
                return (<LandmarkDropdown
                  key={i}
                  ind={i}
                  total={landmarks.length}
                  expanded={expanded}
                  landmark={lm}
                  landmarkTypes={landmarkTypes}          
                  onAddButton={this.handleAddButton}
                  onAriaChange={this.handleAriaChange}
                  onDeleteLandmark={this.handleDeleteLandmark}
                  onDeleteRole={this.handleDeleteRole}
                  onEdit={this.handleEditLandmark}
                  onLandmarkTabChange= {(e) => this.handleLandmarkTabChange( lm,e ) }
                />);
              })}
              
          </div>)
        }
        
        {/* {landmark && (
          <LandmarkDropdown
            expanded={expanded}
            landmark={landmark}
            landmarkTypes={landmarkTypes}          
            onAddButton={this.handleAddButton}
            onAriaChange={this.handleAriaChange}
            onDeleteRole={this.handleDeleteRole}
            onEdit={this.handleEditLandmark}
          />
        )} */}

          {(!expanded) && (<button
            disabled={(landmarks.length === 0)}
            // onClick={() => props.onAddButton(landmark.guid)}
            className="create-button"
            uxp-variant="cta"
          >
            Create Spec Report 
          </button>)}
      </div>
    );
  }
}
module.exports = CreateLandmarkForm;
