import React, {Component} from 'react';
import $ from "jquery";
import AddProductForm from './AddProductForm.jsx';
import AddCategoryForm from './AddCategoryForm.jsx';
import CategoryFilter from './CategoryFilter.jsx';
import ChildCategoryList from './ChildCategoryList.jsx';
import ProductList from './ProductList.jsx';
import Notification from './Notification.jsx';

class Display extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            level: 0,
            parentCategory: "",
            showLoader: false            
        }
        this.activeChildCategory = "";
    }
    
    componentDidMount() {
        
        this.toggleLoader();
        this.refreshCategories();
        
    }
    
    toggleLoader = () => {
        
        this.setState((prevState) => {
           
            return {
                showLoader: !prevState.showLoader
            }
            
        });
        
    }
    
    showNotification = (message) => {
        
        this.refs.Notification.showNotification(message);
        
    }
    
    changeConfig = (childCategory) => {
        
        this.setState({
            level: childCategory.name
        },() => {
           this.toggleLoader();
           this.refreshCategories();
           this.activeChildCategory = childCategory;
           this.setState({
               parentCategory: childCategory.value
           },() => {
               this.toggleLoader();
               this.refreshCategories("ChildCategoriesList");
               this.refreshProducts();
           })
        });
        
    }
    
    refreshCategories = (from = 'display',level = this.state.level , parent = this.state.parentCategory) => {
        
        let url = "";
        
        if (from == 'display') {
            url = "/getCategory?level="+level+"&parent="+parent;
        } else {
            url = "/getCategoryChild?level="+level+"&parent="+parent;
        }
        
        this.fireHttpRequest({
            url,
            method: 'GET',
            from
        }).then((resp) => {
            this.toggleLoader();
            if (from == 'display') {
                if (this.activeChildCategory) {
                    this.refs.CategoryFilter.setSelectedFilter(this.activeChildCategory.value);
                    this.activeChildCategory = "";
                }
            } else {
                
            }
            
        }).catch((err) => {
            this.toggleLoader();
            console.log(err);
        });
        
    }
    
    refreshProducts = (level = this.state.level , parent = this.state.parentCategory, from = "Products") => {
        
        let url = "/getProducts?level="+level+"&parent="+parent;
        this.toggleLoader();
        
        this.fireHttpRequest({
            url,
            method: 'GET',
            from
        }).then((resp) => {
            this.toggleLoader();
        }).catch((err) => {
            this.toggleLoader();
            console.log(err);
        });
        
    }
    
    addProductCategory = (product) => {
        
        if (product && Object.keys(product).length > 0) {
            if (!this.state.parentCategory) {
                this.refs.Notification.showNotification('Select category first');
                return Promise.reject('select category first');
            } else {
                product.data.category = {
                    parent: this.state.parentCategory,
                    level: this.state.level
                }
                return this.fireHttpRequest(product,false);   
            }
        }
        
    }
    
    setParentCategory = (parentCategory) => {
        this.setState({
            parentCategory
        },() => {
            this.refreshCategories("ChildCategoriesList");
            this.refreshProducts();
        });
    }
    
    editProductForm = (productId) => {
        this.refs.AddProductForm.fillProductForm(productId);
    }
    
    fireHttpRequest = (HttpData = {},setParent = "true") => {
    
        if(Object.keys(HttpData).length > 0) {
            
            if (this.state.parentCategory && HttpData.method != 'GET' && setParent) {
                HttpData.data.parent = this.state.parentCategory;
                HttpData.data.level = parseInt(this.state.level) + 1;
            }
            return new Promise((resolve,reject) => {
                $.ajax({
                    url: HttpData.url,
                    method: HttpData.method,
                    data: HttpData.data,
                    success: (result) => {
                        if (result && result.length > 0 && result[0]['status'] && result[0]['status'].length > 0) {
                            if (result[0]['status'] == '200' || result[0]['status'] == '201') {
                                let data = result[0]['data'];
                                    if (HttpData.from == "ChildCategoriesList") {
                                        this.refs.ChildCategory.setChildCategories(data);                                        
                                    } else if (HttpData.from == "Products") {
                                        this.refs.ProductList.setCategoryProducts(data);
                                    } else if(HttpData.from == "display"){
                                        this.refs.CategoryFilter.setCategoriesFilter(data);
                                    }
                                resolve(true);
                            }

                        }
                        this.refs.Notification.showNotification(result[0]['message']);
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) { 
                        this.refs.Notification.showNotification(errorThrown);
                        reject('Error in AJAX');
                    }  
                });
            });
        }
    }
    
    render() {
        return (
            <div>
                
                {   
                    this.state.showLoader ? 
                        <div className="loaderDiv">

                            <img className="loader" src="./loader.gif" />

                        </div>

                        :

                        ''
                }
                
                <Notification ref='Notification' />
                
                <div className="formDiv">

                    <AddCategoryForm saveCategory={this.fireHttpRequest} refreshCategories={this.refreshCategories}
                        isParentCategorySet={this.state.parentCategory} showLoader={this.toggleLoader} showNotification={this.showNotification}
                    />
                    <AddProductForm ref="AddProductForm" saveProduct={this.addProductCategory} refreshProducts={this.refreshProducts}   editProduct={this.fireHttpRequest} showLoader={this.toggleLoader} showNotification={this.showNotification}
                    />

                </div>
                
                <div className="categoryFilterDiv">
                    <CategoryFilter ref='CategoryFilter' setParentCategory={this.setParentCategory} showLoader={this.toggleLoader}
                    />
                </div>
                
                <span className="heading_text">Child Categories:</span> 
                <ChildCategoryList ref='ChildCategory' parent={this.state.parentCategory} getChildCategories={this.refreshCategories}  changeConfig={this.changeConfig} showLoader={this.toggleLoader}  />
                
                <span className="heading_text">Products :</span> 
                <ProductList ref='ProductList' editProductForm={this.editProductForm}  />
                
            </div>
            
        );
    }
    
}

export default Display;