const React = require('react');

class OnboardingDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,     
    };
    
    this.dialog = React.createRef();
    this.handleCancel = this.handleCancel.bind(this)
  } 

componentDidMount(){
  if(this.dialog && this.dialog.current ){
    document.body.appendChild(this.dialog.current).showModal();
  }

}

handleCancel(){
  this.dialog.current.close('Dialog closed')
}

  render(){
    return(<dialog ref={this.dialog} className="">
      <button onClick={this.handleCancel}>Cancel Onboarding</button>
    </dialog>)

  }
}
module.exports = OnboardingDialog;