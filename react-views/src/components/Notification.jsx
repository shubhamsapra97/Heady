import React, {Component} from 'react';

class Notification extends Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            message: null
        };
    }
    
    showNotification = (message) => {
        
        if (message && message.length > 0) {
            
            this.setState({
                message
            });
            
        }
        
    }
    
    render() {
        return (
            
            <div className="notficationDiv">
            
               Activity Status : {this.state.message}
                
            </div>
            
        );
    }
    
}

export default Notification;