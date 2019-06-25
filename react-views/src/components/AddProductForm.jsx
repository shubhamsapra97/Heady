import React, {Component} from 'react';
import $ from "jquery";

class AddProductForm extends Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            pName: "",
            price: "",
            submitButtonValue: 'Submit'
        };
        this.editProductId = "";
    }
    
    getEditProductDetails = (id) => {
        
        return new Promise((resolve,reject) => {

            $.ajax({
                url: '/getEditProductDetails?_id='+id,
                method: 'GET',
                success: (result) => {
                    if (result && result.length > 0 && result[0]['status'] && result[0]['status'].length > 0) {
                        if (result[0]['status'] == '200') {
                            let data = result[0]['data'];
                            resolve(data);
                        }
                        this.props.showNotification(result[0]['message']);
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    this.props.showNotification(errorThrown);
                    reject('Error in AJAX');
                }  
            });

        });
        
    }
    
    fillProductForm = (id) => {
        
        if(id) {
            this.editProductId = id;
            this.getEditProductDetails(id).then((data) => {
                
                this.setState({
                    pName: data.pName,
                    price: data.price,
                    submitButtonValue: 'Edit'
                });
                
            });
        }
        
    }
    
    onProductNameChange = (e) => {
        this.setState({
            pName: e.target.value
        })
    }
    
    onProductPriceChange = (e) => {
        if (isNaN(e.target.value)) {
            this.setState({
                price: ""
            });
        } else {
            this.setState({
                price: e.target.value
            }); 
        }
    }
    
    onAddProductSubmit = (e) => {
        e.preventDefault();
        
        if(this.state.pName && this.state.price) {

            this.props.saveProduct({
                url: '/addProduct',
                method: 'POST',
                data: this.state,
                from: 'Product'
            }).then((resp) => {

                if (resp) {
                    this.props.refreshProducts();
                    this.setState({
                        pName: "",
                        price: ""
                    },() => {
                        console.log('product added successfully');
                    });
                }
            }).catch((err) => {
                console.log(err);
            });
            
        } else {
            
            this.props.showNotification('Fill the Product Details');
            
        }
    }
    
    onEditProductSubmit = (e) => {
        e.preventDefault();
        
        if(this.state.pName && this.state.price) {
           
            this.props.showLoader();

            let editData = {
                pName: this.state.pName,
                price: this.state.price,
                _id: this.editProductId
            }

            let data = {
                url: '/editProducts/',
                method: 'PUT',
                data: editData
            }

            this.props.editProduct(data,false).then((resp) => {
                this.props.showLoader();
                if (resp) {
                    this.props.refreshProducts();
                    this.setState({
                        pName: "",
                        price: "",
                        submitButtonValue: 'Submit'
                    })

                }
            }).catch((err) => {
                console.log(err);
            });
            
        } else {
            
            this.props.showNotification('Fill the Product Details');
            
        }
    }

    render() {
        return (
            
            <form onSubmit={this.state.submitButtonValue == "Edit" ? this.onEditProductSubmit : this.onAddProductSubmit}
                className="productForm"    
            >
                <div className="formContent">
                    
                    <div className="formContent__left">
                        <span>Product Name:</span><br />
                        <span>Price:</span>
                    </div>
                    <div className="formContent__right">
                        <input className="formContent__input" type="text" onChange={this.onProductNameChange} className="product_name_input" value={this.state.pName} /><br />
                        <input type="text" onChange={this.onProductPriceChange} className="product_price_input" value={this.state.price} />
                    </div>
                                        
                </div>
                <div className="submitButtonDiv">
                    <input className="formContent__submit" type="submit" value={this.state.submitButtonValue} />
                </div>
            </form>
            
        );
    }
    
}

export default AddProductForm;