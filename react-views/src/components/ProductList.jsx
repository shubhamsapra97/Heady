import React, {Component} from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaTrashAlt } from 'react-icons/fa';

class ProductList extends Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            products: []
        };
    }
    
    setCategoryProducts = (products) => {
        this.setState({
            products
        });        
    }
    
    onEditProduct = (e) => {
        
        let productId = e.currentTarget.getAttribute('name');
        this.props.editProductForm(productId);
        
    }
    
    render() {
        return (
            
            <div style={{marginTop: '30px',display: 'flex'}}>
                <div className="productListDiv">
                {
                    this.state.products.length > 0 ? 
                    
                    
                        this.state.products.map((val, index) => {
                            return <div className="productDiv" key={index} >
                                <div className="productDiv__left" name={index}>
                                    <div className="productName">{val.pName}</div>
                                    <div className="productprice">{val.price}</div>
                                </div>
                                
                                <div className="productDiv__right">
                                    <p className="editButton" onClick={this.onEditProduct} name={val.encrypthash}><FaEdit /></p>
                                </div>
                            </div>
                        })
                      
                    :
                    
                    'No Products Available'
                }
                </div>
                
            
            </div>
            
        );
    }
    
}

export default ProductList;