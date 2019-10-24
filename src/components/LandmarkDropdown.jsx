const React = require("react");
const ToggleView = require("./ToggleView");
const styles = require("./LandmarkDropdown.css");
const { root, Artboard, selection } = require("scenegraph");
const roles = require("../json/roles.json");
const SortableTreeWithoutDndContext = require("react-sortable-tree");
const LandmarkField = require("./LandmarkField");
const trashIcon = require("../../images/icons assets/trash_icon@2x.png");

const LandmarkDropdownCollapsed = props => {
  const { landmark, ind, total } = props;

  console.log('SORT', landmark.artboard.name, ind);

  return (
    <div className="landmark-dropdown-collapsed">
      <div>
        <img src={null} />
        {landmark.artboard.name}
      </div>
      <div className="landmark-dropdown-collapsed-card">
        <label className="row landmark-dropdown-collapsed-card-title">
          <img className="landmark-dropdown-icon" src={landmark.landmarkIcon} />
          {landmark.type.name}
          <img src={null} />
          <select key={landmark.artboard.guid + ind} value={ind} onChange={(e)=> props.onTabChange(e)}>
            {Array(total).fill(0).map((item, i) => {
              return <option 
              key={i} 
              value={i}>{i + 1}
              </option>;
            })}
          </select>
         
          {/* <button onClick={props.onDelete}>X</button> */}
        </label>
        {/* <label className="row">
          <input
            onChange={event => props.onAriaChange(event, landmark.id)}
            value={landmark.aria}
            type="text"
            placeholder="Enter ARIA label - optional"
          />
        </label> */}
        <div className="selected-div">
        <label className="row">Selected: {landmark.roles.length}</label>
        </div>
        
        <label className="row">
          <button uxp-variant="primary" onClick={props.onEdit}>
            Edit Landmark
          </button>
          <div className="title-wrapper">
            {/* <div className=" landmark-field-text">{role.name}</div> */}
            <img className="trash-icon" src={trashIcon} onClick={props.onDelete} />
          </div>
        </label>
        
      </div>
    </div>
  );
};

const LandmarkDropdownExpanded = props => {
  const { landmarkTypes, landmark } = props;
  return (
    <div className="landmark-dropdown-expanded">
      <div className="line-break">
        Landmark Type
        {/* <label className="row">{landmark.artboardName}</label> */}
      </div>
      <div className="line-break">
        <label className="row">
          <img className="landmark-dropdown-icon" src={landmark.landmarkIcon} />
          <select
            value={landmark.type.id}
            onChange={event => props.onLandmarkChange}
          >
            {landmarkTypes.map((landmark, i) => {
              return (
                <option key={i} value={landmark.id}>
                  {landmark.name}
                </option>
              );
            })}
          </select>
          {/* <span>{`${landmark.id + 1}.`} Landmark</span>{" "} */}
          {/* placeholder button */}
        </label>
      </div>
      {landmark.visible && (
        <div className="landmark-fields-wrapper">
          <div className="">
            {landmark.roles.map((role, i) => {
              return (
                <LandmarkField
                
                  key={i}
                  role={role}
                  i={i}
                  total={landmark.roles.length}
                  onChange={props.onTabChange}
                  onDelete={() => props.onDelete(role)}
                />
              );
            })}
          </div>
          {/* <button
            disabled={false}
            onClick={() => props.onAddButton(landmark.guid)}
            className="save-button"
            uxp-variant="cta"
          >
            Save
          </button> */}
        </div>
      )}
    </div>
  );
};

class LandmarkDropdown extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { expanded, landmark, landmarkTypes, ind, total } = this.props;

    return expanded ? (
      <LandmarkDropdownExpanded
        landmarkTypes={landmarkTypes}
        landmark={landmark}
        onTabChange={this.props.onRoleTabChange}
        onDelete={role => this.props.onDeleteRole(landmark, role)}
      />
    ) : (
      <LandmarkDropdownCollapsed
        ind={ind}
        total={total}
        landmark={landmark}
        onAriaChange={this.props.onAriaChange}
        onDelete={() => this.props.onDeleteLandmark(landmark)}
        onEdit={()=> this.props.onEdit(landmark)}
        onTabChange={this.props.onLandmarkTabChange}
      />
    );
  }
}

module.exports = LandmarkDropdown;
