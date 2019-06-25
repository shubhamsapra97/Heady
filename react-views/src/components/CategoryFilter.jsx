import React, {Component} from 'react';

class CategoryFilter extends Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            categories: [],
            selectedFilterId: "-1"
        };
    }
    
    setCategoriesFilter = (categories) => {
        
        this.setState({
            categories,
            selectedFilterId: "-1"
        });
        
    }
    
    setSelectedFilter = (category = "-1") => {
        
        this.setState({
            selectedFilterId: category
        });
        
    } 
    
    onCategoryFilterChange = (e) => {
        this.props.showLoader();
        this.setState({
            selectedFilterId: e.target.value
        },() => {
            this.props.setParentCategory(this.state.selectedFilterId);
        })
    }
    
    render() {
        return (
            
            <div>
              <select name="categories" value={this.state.selectedFilterId} onChange = {this.onCategoryFilterChange}>
                <option value="-1" disabled>Select Category</option>
                {
                    this.state.categories.length > 0 ? 
                    
                    this.state.categories.map((val, index) => {
                        return <option value={val.cName} name={index} key={ index }>{val.cName}</option>;
                    })
                      
                    :
                    
                    ''
                }
              </select>
            </div>
            
        );
    }
    
}

export default CategoryFilter;