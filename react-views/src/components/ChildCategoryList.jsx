import React, {Component} from 'react';

class ChildCategoryList extends Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            childCategories: []
        };
    }
    
    setChildCategories = (childCategories) => {
        
        this.setState({
            childCategories
        });
        
    }
    
    childCategoryClick = (e) => {
        this.props.changeConfig(e.target);
    }
    
    getChildCategories = () => {
        this.props.showLoader();
        return this.state.childCategories;
    }
    
    render() {
        return (
            
            <div className="childCategoryDiv">
                
                {
                    this.state.childCategories.length > 0 ? 
                    
                    this.state.childCategories.map((val, index) => {
                        return <button className="childCategory" value={val.cName} name={val.level} key={index} onClick={this.childCategoryClick}>{val.cName}</button>;
                    })
                      
                    :
                    
                    'No Child Categories'
                }
                
            
            </div>
            
        );
    }
    
}

export default ChildCategoryList;