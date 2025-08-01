import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
import { reviewsAPI, cartAPI } from "../services/api";

export default function ProductDetail({ product }) {
    const { showSuccess, showError } = useToast();
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const navigate = useNavigate();
    const { fetchCart } = useCart();
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);

    // Extract attributes from product
    const getAttributeValues = (attributeName) => {
        if (!product.attributes || !Array.isArray(product.attributes)) {
            console.log(`No attributes found for ${attributeName}`);
            return [];
        }

        console.log(`Looking for ${attributeName} in attributes:`, product.attributes);
        
        const attribute = product.attributes.find(attr =>
            attr.attribute_name && attr.attribute_name.toLowerCase().includes(attributeName.toLowerCase())
        );

        if (attribute) {
            console.log(`Found ${attributeName} attribute:`, attribute);
            return attribute.attribute_values || [];
        } else {
            console.log(`No ${attributeName} attribute found`);
            return [];
        }
    };

    // Map color names to hex codes
    const getColorHex = (colorName) => {
        const colorMap = {
            // Basic colors
            'red': '#FF0000',
            'blue': '#0000FF',
            'green': '#008000',
            'yellow': '#FFFF00',
            'orange': '#FFA500',
            'purple': '#800080',
            'pink': '#FFC0CB',
            'brown': '#A52A2A',
            'gray': '#808080',
            'grey': '#808080',
            'black': '#000000',
            'white': '#FFFFFF',
            'navy': '#000080',
            'maroon': '#800000',
            'olive': '#808000',
            'lime': '#00FF00',
            'aqua': '#00FFFF',
            'teal': '#008080',
            'silver': '#C0C0C0',
            'gold': '#FFD700',
            'indigo': '#4B0082',
            'violet': '#EE82EE',
            'coral': '#FF7F50',
            'salmon': '#FA8072',
            'turquoise': '#40E0D0',
            'lavender': '#E6E6FA',
            'beige': '#F5F5DC',
            'ivory': '#FFFFF0',
            'khaki': '#F0E68C',
            'tan': '#D2B48C',
            'cream': '#FFFDD0',
            'mint': '#98FF98',
            'rose': '#FFE4E1',
            'peach': '#FFDAB9',
            'plum': '#DDA0DD',
            'sienna': '#A0522D',
            'chocolate': '#D2691E',
            'peru': '#CD853F',
            'sandy': '#F4A460',
            'wheat': '#F5DEB3',
            'bisque': '#FFE4C4',
            'linen': '#FAF0E6',
            'seashell': '#FFF5EE',
            'snow': '#FFFAFA',
            'misty': '#FFE4E1',
            'azure': '#F0FFFF',
            'alice': '#F0F8FF',
            'ghost': '#F8F8FF',
            'honeydew': '#F0FFF0',
            'mintcream': '#F5FFFA',
            'oldlace': '#FDF5E6',
            'papaya': '#FFEFD5',
            'blanched': '#FFEBCD',
            'cornsilk': '#FFF8DC',
            'floral': '#FFFAF0',
            'gainsboro': '#DCDCDC',
            'lightgray': '#D3D3D3',
            'lightgrey': '#D3D3D3',
            'lightblue': '#ADD8E6',
            'lightcoral': '#F08080',
            'lightcyan': '#E0FFFF',
            'lightgoldenrod': '#FAFAD2',
            'lightgreen': '#90EE90',
            'lightpink': '#FFB6C1',
            'lightsalmon': '#FFA07A',
            'lightseagreen': '#20B2AA',
            'lightskyblue': '#87CEFA',
            'lightslate': '#778899',
            'lightsteel': '#B0C4DE',
            'lightyellow': '#FFFFE0',
            'limegreen': '#32CD32',
            'mediumaqua': '#66CDAA',
            'mediumorchid': '#BA55D3',
            'mediumpurple': '#9370DB',
            'mediumseagreen': '#3CB371',
            'mediumslate': '#7B68EE',
            'mediumspring': '#00FA9A',
            'mediumturquoise': '#48D1CC',
            'mediumviolet': '#C71585',
            'midnight': '#191970',
            'mintcream': '#F5FFFA',
            'mistyrose': '#FFE4E1',
            'moccasin': '#FFE4B5',
            'navajowhite': '#FFDEAD',
            'oldlace': '#FDF5E6',
            
            // iPhone colors
            'sierra blue': '#5E9CD3',
            'silver': '#C0C0C0',
            'gold': '#FFD700',
            'graphite': '#41424C',
            
            // Samsung colors
            'phantom black': '#000000',
            'phantom silver': '#C0C0C0',
            'phantom violet': '#8B5A9C',
            
            // Light blue variations
            'light blue': '#ADD8E6',
            'olivedrab': '#6B8E23',
            'orangered': '#FF4500',
            'orchid': '#DA70D6',
            'palegoldenrod': '#EEE8AA',
            'palegreen': '#98FB98',
            'paleturquoise': '#AFEEEE',
            'paleviolet': '#DB7093',
            'papayawhip': '#FFEFD5',
            'peachpuff': '#FFDAB9',
            'peru': '#CD853F',
            'pink': '#FFC0CB',
            'plum': '#DDA0DD',
            'powderblue': '#B0E0E6',
            'rosybrown': '#BC8F8F',
            'royalblue': '#4169E1',
            'saddlebrown': '#8B4513',
            'salmon': '#FA8072',
            'sandybrown': '#F4A460',
            'seagreen': '#2E8B57',
            'seashell': '#FFF5EE',
            'sienna': '#A0522D',
            'skyblue': '#87CEEB',
            'slateblue': '#6A5ACD',
            'slategray': '#708090',
            'slategrey': '#708090',
            'snow': '#FFFAFA',
            'springgreen': '#00FF7F',
            'steelblue': '#4682B4',
            'tan': '#D2B48C',
            'thistle': '#D8BFD8',
            'tomato': '#FF6347',
            'turquoise': '#40E0D0',
            'violet': '#EE82EE',
            'wheat': '#F5DEB3',
            'whitesmoke': '#F5F5F5',
            'yellowgreen': '#9ACD32'
        };

        const normalizedColor = colorName.toLowerCase().trim();
        return colorMap[normalizedColor] || '#CCCCCC'; // Default gray if color not found
    };

    const sizes = getAttributeValues('size');
    const colors = getAttributeValues('color');
    const materials = getAttributeValues('material');
    
    console.log('Extracted colors:', colors);
    console.log('Extracted sizes:', sizes);
    console.log('Extracted materials:', materials);

    useEffect(() => {
        if (product && product._id) {
            reviewsAPI.getProductReviews(product._id)
                .then(res => {
                    const data = res.data;
                    if (Array.isArray(data)) {
                        setReviews(data);
                        if (data.length > 0) {
                            const avg = data.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / data.length;
                            setAvgRating(avg);
                        } else {
                            setAvgRating(0);
                        }
                    } else {
                        setReviews([]);
                        setAvgRating(0);
                    }
                })
                .catch(error => {
                    console.error('Error fetching reviews:', error);
                    setReviews([]);
                    setAvgRating(0);
                });
        }
    }, [product]);

    const handleSizeSelect = (size) => {
        setSelectedSize(size);
    };

    const handleColorSelect = (color) => {
        setSelectedColor(color);
    };

    const handleQuantityChange = (increment) => {
        const newQuantity = quantity + increment;
        if (newQuantity >= 1 && newQuantity <= (product.stock_qty || 999)) {
            setQuantity(newQuantity);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price || 0);
    };

    const handleAddToCart = async () => {
        // Validate selections
        if (sizes.length > 0 && !selectedSize) {
            showError('Please select a size');
            return;
        }

        if (colors.length > 0 && !selectedColor) {
            showError('Please select a color');
            return;
        }

        if (quantity <= 0) {
            showError('Please select a valid quantity');
            return;
        }

        // Check stock availability
        if (product.stock_qty !== undefined && quantity > product.stock_qty) {
            showError(`Only ${product.stock_qty} items available in stock`);
            return;
        }

        try {
            setIsAddingToCart(true);

            const cartItem = {
                product_id: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity,
                size: selectedSize,
                color: selectedColor,
                stock_qty: product.stock_qty,
                sku: product.sku
            };

            // Add to cart API call
            const response = await cartAPI.addToCartAlt(cartItem);
            console.log('Backend response:', response.data);

            if (response.status === 200 || response.status === 201) {
                // Reset selections
                setSelectedSize('');
                setSelectedColor('');
                setQuantity(1);
                await fetchCart(); // Update cart context after adding
                showSuccess('Product added to cart!');
                // Set flag in sessionStorage to show success message in cart
                sessionStorage.setItem('addedToCart', 'true');
                // Redirect to shop cart page immediately
                navigate('/shop-cart');
            } else {
                showError(response.data?.message || 'Failed to add product to cart');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            showError('Error adding product to cart. Please try again.');
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleShopNow = async () => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        // Validate selections
        if (sizes.length > 0 && !selectedSize) {
            showError('Please select a size');
            return;
        }

        if (colors.length > 0 && !selectedColor) {
            showError('Please select a color');
            return;
        }

        if (quantity <= 0) {
            showError('Please select a valid quantity');
            return;
        }

        // Check stock availability
        if (product.stock_qty !== undefined && quantity > product.stock_qty) {
            showError(`Only ${product.stock_qty} items available in stock`);
            return;
        }

        try {
            setIsAddingToCart(true);

            const cartItem = {
                product_id: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity,
                size: selectedSize,
                color: selectedColor,
                stock_qty: product.stock_qty,
                sku: product.sku
            };

            // Add to cart API call
            const response = await cartAPI.addToCartAlt(cartItem);
            console.log('Backend response:', response.data);

            if (response.status === 200 || response.status === 201) {
                // Reset selections
                setSelectedSize('');
                setSelectedColor('');
                setQuantity(1);
                await fetchCart(); // Update cart context after adding
                showSuccess('Product added to cart! Redirecting to checkout...');
                // Navigate to checkout page
                navigate("/shop-checkout");
            } else {
                showError(response.data?.message || 'Failed to add product to cart');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            showError('Error adding product to cart. Please try again.');
        } finally {
            setIsAddingToCart(false);
        }
    };

    if (!product) {
        return (
            <div className="sticky top-20">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="sticky top-20" role="region" aria-label="Product Detail">
            <h5 className="mb-4 text-2xl font-bold">{product.name}</h5>
            {product.stock_qty !== undefined && (
                <div className="mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${product.stock_qty === 0
                        ? 'bg-red-100 text-red-800'
                        : product.stock_qty <= 10
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${product.stock_qty === 0
                            ? 'bg-red-500'
                            : product.stock_qty <= 10
                                ? 'bg-orange-500'
                                : 'bg-green-500'
                            }`}></span>
                        {product.stock_qty === 0
                            ? 'Out of Stock'
                            : product.stock_qty <= 10
                                ? `Low Stock (${product.stock_qty} left)`
                                : `${product.stock_qty} in Stock`
                        }
                    </span>
                </div>
            )}
            <div className="flex items-center mb-4">
                <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map(n => (
                        <i key={n} className={`mdi mdi-star${avgRating >= n ? '' : '-outline'} text-orange-500`}></i>
                    ))}
                </div>
                <span className="text-slate-400 ms-2">{avgRating ? avgRating.toFixed(1) : '0.0'} ({reviews.length})</span>
            </div>
            <h4 className="text-3xl font-bold text-orange-500 mb-4">{formatPrice(product.price)}</h4>
            <p className="text-slate-400 mb-6">{product.description || 'No description available.'}</p>

            <div className="mt-4">
                <h5 className="text-lg font-semibold">Overview :</h5>
                <p className="text-slate-400 mt-2">
                    {product.description || "No description available for this product."}
                </p>

                <ul className="list-none text-slate-400 mt-4">
                    <li className="mb-1 flex ms-0"><i className="mdi mdi-check-circle-outline text-orange-500 text-xl me-2"></i> High Quality Material</li>
                    <li className="mb-1 flex ms-0"><i className="mdi mdi-check-circle-outline text-orange-500 text-xl me-2"></i> Comfortable Fit</li>
                    <li className="mb-1 flex ms-0"><i className="mdi mdi-check-circle-outline text-orange-500 text-xl me-2"></i> Durable Construction</li>
                </ul>
                {product.brand_id?.name && (
                    <div className="mt-4 text-gray-700">
                        <span className="font-semibold">Brand:</span> {product.brand_id.name}
                    </div>
                )}
            </div>

            <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 mt-4">
                {sizes.length > 0 && (
                    <div className="flex items-center">
                        <h5 className="text-lg font-semibold me-2">Size:</h5>
                        <div className="space-x-1">
                            {sizes.map((size, index) => (
                                <Link
                                    key={index}
                                    to=""
                                    className={`size-9 inline-flex items-center justify-center tracking-wide align-middle text-base text-center rounded-md transition-all duration-200 ${selectedSize === size
                                        ? 'bg-orange-500 text-white shadow-lg scale-105'
                                        : 'bg-orange-500/5 hover:bg-orange-500 text-orange-500 hover:text-white hover:scale-105'
                                        }`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleSizeSelect(size);
                                    }}
                                >
                                    {size}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex items-center">
                    <h5 className="text-lg font-semibold me-2">Quantity:</h5>
                    <div className="qty-icons ms-3 space-x-0.5">
                        <button onClick={() => handleQuantityChange(-1)} className="size-9 inline-flex items-center justify-center tracking-wide align-middle text-base text-center rounded-md bg-orange-500/5 hover:bg-orange-500 text-orange-500 hover:text-white minus">-</button>
                        <input min="0" name="quantity" value={quantity} onChange={() => { }} type="number" className="h-9 inline-flex items-center justify-center tracking-wide align-middle text-base text-center rounded-md bg-orange-500/5 hover:bg-orange-500 text-orange-500 hover:text-white pointer-events-none w-16 ps-4 quantity" />
                        <button onClick={() => handleQuantityChange(1)} className="size-9 inline-flex items-center justify-center tracking-wide align-middle text-base text-center rounded-md bg-orange-500/5 hover:bg-orange-500 text-orange-500 hover:text-white plus">+</button>
                    </div>
                </div>

                {colors.length > 0 && (
                    <div className="flex items-center">
                        <h5 className="text-lg font-semibold me-2">Colors:</h5>
                        <div className="space-x-2">
                            {colors.map((color, index) => (
                                <Link
                                    key={index}
                                    to=""
                                    className={`size-6 rounded-full ring-2 ring-gray-200 dark:ring-slate-800 inline-flex align-middle cursor-pointer transition-all duration-200 hover:scale-110 ${selectedColor === color ? 'ring-orange-500 ring-4 shadow-lg scale-110' : ''
                                        }`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleColorSelect(color);
                                    }}
                                    title={color}
                                    style={{ backgroundColor: getColorHex(color) }}
                                ></Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Selected Options Display */}
                {(selectedSize || selectedColor) && (
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <h6 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Selected Options:</h6>
                        <div className="space-y-1">
                            {selectedSize && (
                                <div className="flex items-center text-sm">
                                    <span className="text-gray-600 dark:text-gray-400 mr-2">Size:</span>
                                    <span className="font-medium text-orange-500">{selectedSize}</span>
                                </div>
                            )}
                            {selectedColor && (
                                <div className="flex items-center text-sm">
                                    <span className="text-gray-600 dark:text-gray-400 mr-2">Color:</span>
                                    <div className="flex items-center">
                                        <div
                                            className="size-4 rounded-full mr-2"
                                            style={{ backgroundColor: getColorHex(selectedColor) }}
                                        ></div>
                                        <span className="font-medium text-orange-500">{selectedColor}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}



                <div className="flex gap-3 mt-6">
                    <button
                        onClick={handleShopNow}
                        disabled={isAddingToCart || (product.stock_qty !== undefined && product.stock_qty === 0)}
                        className={`py-3 px-6 inline-block font-semibold tracking-wide align-middle text-base text-center rounded-md transition-colors ${isAddingToCart || (product.stock_qty !== undefined && product.stock_qty === 0)
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-orange-500 text-white hover:bg-orange-600'
                            }`}
                    >
                        {isAddingToCart ? 'Processing...' : 'Shop Now'}
                    </button>
                    <button
                        onClick={handleAddToCart}
                        disabled={isAddingToCart || (product.stock_qty !== undefined && product.stock_qty === 0)}
                        className={`py-3 px-6 inline-block font-semibold tracking-wide align-middle text-base text-center rounded-md transition-colors ${isAddingToCart || (product.stock_qty !== undefined && product.stock_qty === 0)
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-orange-500/5 hover:bg-orange-500 text-orange-500 hover:text-white'
                            }`}
                    >
                        {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    )
}