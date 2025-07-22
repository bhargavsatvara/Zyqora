import React, { useState, useEffect } from "react";
import {FiSearch, FiChevronDown, FiChevronUp} from '../assets/icons/vander'

export default function Filter({ onFilterChange, filters }){
    const [colors, setColors] = useState([]);
    const [brands, setBrands] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedDepartments, setSelectedDepartments] = useState([]);

    // Section visibility states
    const [expandedSections, setExpandedSections] = useState({
        department: true,
        category: true,
        size: false,
        color: true
    });

    // View more states
    const [showMoreCategories, setShowMoreCategories] = useState(false);
    const [showMoreBrands, setShowMoreBrands] = useState(false);
    const [showMoreSizes, setShowMoreSizes] = useState(false);
    const [showMoreColors, setShowMoreColors] = useState(false);
    const [showMoreDepartments, setShowMoreDepartments] = useState(false);

    useEffect(() => {
        fetchFilterData();
    }, []);

    // Update selected states when filters change from URL
    useEffect(() => {
        if (filters.category_id && filters.category_id !== selectedCategories[0]) {
            setSelectedCategories([filters.category_id]);
        }
        if (filters.brand_id && filters.brand_id !== selectedBrands[0]) {
            setSelectedBrands([filters.brand_id]);
        }
        if (filters.color_id && filters.color_id !== selectedColors[0]) {
            setSelectedColors([filters.color_id]);
        }
        if (filters.size_id && filters.size_id !== selectedSizes[0]) {
            setSelectedSizes([filters.size_id]);
        }
        if (filters.department_id && filters.department_id !== selectedDepartments[0]) {
            setSelectedDepartments([filters.department_id]);
            // Fetch categories for the selected department
            fetchCategoriesForDepartment(filters.department_id);
        }
    }, [filters.category_id, filters.brand_id, filters.color_id, filters.size_id, filters.department_id]);

    // Fetch available sizes based on current filters
    const fetchAvailableSizes = async () => {
        try {
            // Build query parameters based on current filters
            const params = new URLSearchParams();
            if (filters.department_id) params.append('department_id', filters.department_id);
            if (filters.category_id) params.append('category_id', filters.category_id);
            if (filters.brand_id) params.append('brand_id', filters.brand_id);
            if (filters.color_id) params.append('color_id', filters.color_id);
            if (filters.min_price) params.append('min_price', filters.min_price);
            if (filters.max_price) params.append('max_price', filters.max_price);
            
            console.log('Fetching available sizes with params:', params.toString());
            const res = await fetch(`https://zyqora.onrender.com/api/products?${params.toString()}&limit=1000`);
            const data = await res.json();
            
            if (data.data && data.data.products) {
                // Extract unique sizes from products
                const sizeSet = new Set();
                data.data.products.forEach(product => {
                    if (product.attributes) {
                        const sizeAttribute = product.attributes.find(attr => 
                            attr.attribute_name && attr.attribute_name.toLowerCase().includes('size')
                        );
                        if (sizeAttribute && sizeAttribute.attribute_values) {
                            sizeAttribute.attribute_values.forEach(size => {
                                if (size && size.trim()) {
                                    sizeSet.add(size.trim());
                                }
                            });
                        }
                    }
                });
                
                const availableSizes = Array.from(sizeSet).map(sizeName => ({
                    _id: sizeName, // Use size name as ID for consistency
                    name: sizeName
                }));
                
                console.log('Available sizes found:', availableSizes);
                setSizes(availableSizes);
            }
        } catch (error) {
            console.error('Error fetching available sizes:', error);
        }
    };

    const fetchFilterData = async () => {
        setLoading(true);
        try {
            // Fetch colors, brands, categories, and departments in parallel
            const [colorsRes, brandsRes, categoriesRes, departmentsRes] = await Promise.all([
                fetch('https://zyqora.onrender.com/api/colors'),
                fetch('https://zyqora.onrender.com/api/brands'),
                fetch('https://zyqora.onrender.com/api/categories'),
                fetch('https://zyqora.onrender.com/api/departments')
            ]);

            const colorsData = await colorsRes.json();
            const brandsData = await brandsRes.json();
            const categoriesData = await categoriesRes.json();
            const departmentsData = await departmentsRes.json();

            setColors(colorsData.data?.colors || []);
            setBrands(brandsData.data?.brands || []);
            setCategories(categoriesData.data?.categories || []);
            setDepartments(departmentsData || []);
            
            // Fetch available sizes based on current filters
            await fetchAvailableSizes();
        } catch (error) {
            console.error('Error fetching filter data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories for a specific department
    const fetchCategoriesForDepartment = async (departmentId) => {
        try {
            console.log(`Fetching categories for department: ${departmentId}`);
            const res = await fetch(`https://zyqora.onrender.com/api/categories?department_id=${departmentId}`);
            const data = await res.json();
            
            let categoriesData = [];
            if (data.data && data.data.categories) {
                categoriesData = data.data.categories;
            } else if (data.categories) {
                categoriesData = data.categories;
            } else if (Array.isArray(data)) {
                categoriesData = data;
            }
            
            console.log(`Found ${categoriesData.length} categories for department ${departmentId}`);
            setCategories(categoriesData);
        } catch (error) {
            console.error(`Error fetching categories for department ${departmentId}:`, error);
        }
    };

    const handleSearchChange = (e) => {
        onFilterChange({ search: e.target.value });
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleDepartmentClick = (departmentId) => {
        const newSelectedDepartments = selectedDepartments.includes(departmentId)
            ? selectedDepartments.filter(id => id !== departmentId)
            : [departmentId]; // Only allow one department selection
        
        setSelectedDepartments(newSelectedDepartments);
        onFilterChange({ department_id: newSelectedDepartments.length > 0 ? newSelectedDepartments[0] : '' });
        
        // Clear category selection when department changes
        setSelectedCategories([]);
        onFilterChange({ category_id: '' });
        
        // Fetch categories for the selected department
        if (newSelectedDepartments.length > 0) {
            fetchCategoriesForDepartment(newSelectedDepartments[0]);
        } else {
            // If no department selected, show all categories
            fetchFilterData();
        }
        
        // Refresh available sizes after department change
        setTimeout(() => fetchAvailableSizes(), 100);
    };

    const handleCategoryClick = (categoryId) => {
        const newSelectedCategories = selectedCategories.includes(categoryId)
            ? selectedCategories.filter(id => id !== categoryId)
            : [...selectedCategories, categoryId];
        
        setSelectedCategories(newSelectedCategories);
        onFilterChange({ category_id: newSelectedCategories.length > 0 ? newSelectedCategories[0] : '' });
        
        // Refresh available sizes after category change
        setTimeout(() => fetchAvailableSizes(), 100);
    };

    const handleColorClick = (colorId) => {
        const newSelectedColors = selectedColors.includes(colorId)
            ? selectedColors.filter(id => id !== colorId)
            : [...selectedColors, colorId];
        
        setSelectedColors(newSelectedColors);
        onFilterChange({ color_id: newSelectedColors.length > 0 ? newSelectedColors[0] : '' });
        
        // Refresh available sizes after color change
        setTimeout(() => fetchAvailableSizes(), 100);
    };

    const handleBrandClick = (brandId) => {
        const newSelectedBrands = selectedBrands.includes(brandId)
            ? selectedBrands.filter(id => id !== brandId)
            : [...selectedBrands, brandId];
        
        setSelectedBrands(newSelectedBrands);
        onFilterChange({ brand_id: newSelectedBrands.length > 0 ? newSelectedBrands[0] : '' });
        
        // Refresh available sizes after brand change
        setTimeout(() => fetchAvailableSizes(), 100);
    };

    const handleSizeClick = (sizeId) => {
        const newSelectedSizes = selectedSizes.includes(sizeId)
            ? selectedSizes.filter(id => id !== sizeId)
            : [...selectedSizes, sizeId];
        
        setSelectedSizes(newSelectedSizes);
        onFilterChange({ size_id: newSelectedSizes.length > 0 ? newSelectedSizes[0] : '' });
    };

    const getColorStyle = (color) => {
        // Use hex_code if available, otherwise generate from name
        const hexCode = color.hex_code || generateHexFromName(color.name);
        return {
            backgroundColor: hexCode,
            border: selectedColors.includes(color._id) ? '3px solid #f97316' : '2px solid #e5e7eb'
        };
    };

    const generateHexFromName = (name) => {
        // Simple hash function to generate consistent colors from names
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = hash % 360;
        return `hsl(${hue}, 70%, 60%)`;
    };

    const clearAllFilters = () => {
        setSelectedColors([]);
        setSelectedBrands([]);
        setSelectedSizes([]);
        setSelectedCategories([]);
        setSelectedDepartments([]);
        onFilterChange({
            search: '',
            color_id: '',
            brand_id: '',
            size_id: '',
            category_id: '',
            department_id: '',
            min_price: '',
            max_price: ''
        });
        // Reset categories to show all categories and refresh available sizes
        fetchFilterData();
    };

    const renderSection = (title, section, items, selectedItems, handleClick, showMore, setShowMore, maxItems = 5, showSelection = true) => {
        const isExpanded = expandedSections[section];
        const hasMoreItems = items.length > maxItems;
        const displayItems = showMore ? items : items.slice(0, maxItems);

        return (
            <div className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <button
                    onClick={() => toggleSection(section)}
                    className="w-full flex justify-between items-center py-3 text-left font-medium text-gray-900 dark:text-white hover:text-orange-500 transition-colors"
                >
                    {title}
                    {isExpanded ? <FiChevronUp className="size-4" /> : <FiChevronDown className="size-4" />}
                </button>
                
                {isExpanded && (
                    <div className="pb-3">
                        <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            {displayItems.map((item, index) => (
                                <div key={item._id || index} className="flex items-center justify-between py-1">
                                    <button
                                        onClick={() => handleClick(item._id)}
                                        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors"
                                    >
                                        {showSelection && (
                                            <div className={`size-3 rounded-full border ${
                                                selectedItems.includes(item._id) 
                                                    ? 'bg-orange-500 border-orange-500' 
                                                    : 'border-gray-300'
                                            }`}></div>
                                        )}
                                        <span>{item.name}</span>
                                    </button>
                                    <i className="mdi mdi-plus text-xs text-gray-400"></i>
                                </div>
                            ))}
                        </div>
                        
                        {hasMoreItems && !showMore && (
                            <button
                                onClick={() => setShowMore(true)}
                                className="text-sm text-orange-500 hover:text-orange-600 font-medium mt-2"
                            >
                                + View More
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const renderColorSection = () => {
        const isExpanded = expandedSections.color;
        const displayColors = showMoreColors ? colors : colors.slice(0, 5);
        const hasMoreColors = colors.length > 5;

        return (
            <div className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <button
                    onClick={() => toggleSection('color')}
                    className="w-full flex justify-between items-center py-3 text-left font-medium text-gray-900 dark:text-white hover:text-orange-500 transition-colors"
                >
                    Color
                    {isExpanded ? <FiChevronUp className="size-4" /> : <FiChevronDown className="size-4" />}
                </button>
                
                {isExpanded && (
                    <div className="pb-3">
                        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            {displayColors.map((color, index) => (
                                <div key={color._id || index} className="flex items-center space-x-2 py-1">
                                    <button
                                        onClick={() => handleColorClick(color._id)}
                                        className="relative group"
                                        title={color.name}
                                    >
                                        <div 
                                            className="size-6 rounded-full ring-2 ring-gray-200 dark:ring-slate-800 hover:ring-orange-500 transition-all duration-200 group-hover:scale-110"
                                            style={getColorStyle(color)}
                                        ></div>
                                        {selectedColors.includes(color._id) && (
                                            <div className="absolute -top-1 -right-1 size-2 bg-orange-500 rounded-full flex items-center justify-center">
                                                <div className="size-1 bg-white rounded-full"></div>
                                            </div>
                                        )}
                                    </button>
                                    <span className="text-sm text-gray-600 dark:text-gray-300">{color.name}</span>
                                </div>
                            ))}
                        </div>
                        
                        {hasMoreColors && !showMoreColors && (
                            <button
                                onClick={() => setShowMoreColors(true)}
                                className="text-sm text-orange-500 hover:text-orange-600 font-medium mt-2"
                            >
                                + View More
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="lg:col-span-3 md:col-span-4">
                <div className="rounded shadow dark:shadow-gray-800 p-4 sticky top-20">
                    <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded mb-4"></div>
                        <div className="h-10 bg-gray-200 rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return(
        <div className="lg:col-span-3 md:col-span-4">
            <div className="rounded shadow dark:shadow-gray-800 p-4 sticky top-20">
                <div className="flex justify-between items-center mb-4">
                <h5 className="text-xl font-medium">Filter</h5>
                    {(selectedColors.length > 0 || selectedBrands.length > 0 || selectedSizes.length > 0 || selectedCategories.length > 0 || selectedDepartments.length > 0) && (
                        <button 
                            onClick={clearAllFilters}
                            className="text-sm text-orange-500 hover:text-orange-600 font-medium"
                        >
                            Clear All
                        </button>
                    )}
                </div>

                <form className="mb-4">
                    <div>
                        <label htmlFor="searchname" className="font-medium">Search:</label>
                        <div className="relative mt-2">
                            <FiSearch className="absolute size-4 top-[9px] end-4 text-slate-900 dark:text-white"></FiSearch>
                            <input 
                                type="text" 
                                className="h-9 pe-10 rounded px-3 border border-gray-100 dark:border-gray-800 focus:ring-0 outline-none bg-white dark:bg-slate-900" 
                                name="s" 
                                id="searchItem" 
                                placeholder="Search products..."
                                value={filters.search || ''}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                </form>

                <div className="space-y-0">
                    {renderSection('Department', 'department', departments, selectedDepartments, handleDepartmentClick, showMoreDepartments, setShowMoreDepartments, 5, true)}
                    {renderSection('Category', 'category', categories, selectedCategories, handleCategoryClick, showMoreCategories, setShowMoreCategories, 5, true)}
                    {renderSection('Size', 'size', sizes, selectedSizes, handleSizeClick, showMoreSizes, setShowMoreSizes, 5, true)}
                    {renderColorSection()}
                    {renderSection('Brands', 'brands', brands, selectedBrands, handleBrandClick, showMoreBrands, setShowMoreBrands, 5, true)}
                </div>
            </div>
        </div>
    )
}