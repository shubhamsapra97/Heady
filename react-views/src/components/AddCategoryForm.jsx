import React, {Component} from 'react';

class AddCategoryForm extends Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            cName: "",
            level: 0,
            childCategories: [],
            mainParent: "",
            parent: ""
        };
    }
    
    onCategoryNameChange = (e) => {
        let data = e.target.value;
        if (isNaN(data)) {
            
            this.setState({
                cName: data
            });
        } else {
            this.setState({
                cName: ""
            }); 
        }
    }
    
    onAddCategorySubmit = (e) => {
        e.preventDefault();
        
        if (this.state.cName) {
            
            this.props.saveCategory({
                url: '/addCategory',
                method: 'POST',
                data: this.state,
                from: 'Category'
            }).then((res) => {

                if (res) {
                    if (!this.props.isParentCategorySet) {
                        this.props.showLoader();
                        this.props.refreshCategories();   
                    } else {
                        this.props.showLoader();
                        this.props.refreshCategories('ChildCategoriesList');
                    }

                    this.setState({
                        cName: ""
                    });
                }
            });
        
        } else {
            
            this.props.showNotification('Category Name required');
            
        }
    }
    
    render() {
        return (
            
            <form onSubmit={this.onAddCategorySubmit} className="categoryForm">
                
                <div className="formContent1">
                    Category Name: <input type="text" onChange={this.onCategoryNameChange} className="product_name_input" value={this.state.cName} /><br />
                    <input className="formContent__submit" type="submit" name="submit" />
                </div>
                            
            </form>
            
        );
    }
    
}

export default AddCategoryForm;