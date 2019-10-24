const React = require("react");
const ToggleView = require("./ToggleView");
const styles = require("./LandmarkField.css");
const {root, Artboard, selection} = require('scenegraph');
const roles =  require('../json/roles.json')
const landmarkTypes = require('../json/landmarkTypes.json')
const SortableTreeWithoutDndContext = require('react-sortable-tree')
// const landmarkIcons = require('../json/landmarkIcons.json')
const imgData = require('../../images/icons assets/trash_icon@2x.png');


const LandmarkField = props => {
  const { i, role, total } = props;
  console.log('field', role.index);
  return (
    <div className="landmark-field line-break">
      <div className="title-wrapper">
      <div className=" landmark-field-text">
        {role.name}
       
      </div>
      <img className="trash-icon" src={imgData} onClick={props.onDelete} />
      </div>
      <label className="row">
        <select value={i}>
          <option value=""> Select Role</option>
          {roles.map((role, j) => {
            return (
              <option key={j} value="artboard-1">
                {role.name}
              </option>
            );
          })}
        </select>
        <select value={i} onChange={(e)=> props.onChange(e, role)}>
          {Array(total).fill(0).map((item, j)=> {
            return (<option key={j} value={j}>{j + 1}</option>);
          })}
        </select>
      </label>
      <label className="row">
        <div className="landmark-field-text">ARIA Label</div>
      </label>
      <label className="row">
        <input
          type="text"
          placeholder="Enter ARIA attribute or leave blank to ignore"
        />
      </label>

      {/* {item.children.map((child, i) => {
        return (
          <div className="roleFields">
             <label className="row">{child.text}</label> 
            <label className="row">
              <input
                type="text"
                placeholder="Enter ARIA attribute or leave blank to ignore"
              />
            </label>
          </div>
        );
      })} */}
    </div>
  );
};
module.exports = LandmarkField;