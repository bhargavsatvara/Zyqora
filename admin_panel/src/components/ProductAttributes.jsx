import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, ChevronDown, Check } from 'lucide-react';

const predefinedAttributes = [
  'Size', 'Color', 'Material', 'Style', 'Pattern', 'Fit', 'Length', 'Width', 'Height',
  'Weight', 'Brand', 'Season', 'Occasion', 'Gender', 'Age Group', 'Style Type',
  'Neckline', 'Sleeve Type', 'Waist Type', 'Leg Type', 'Heel Height', 'Sole Type'
];

export default function ProductAttributes({ attributes, onAttributesChange }) {
  const [availableAttributes, setAvailableAttributes] = useState([]);
  const [attributeSearch, setAttributeSearch] = useState('');
  const [showAttributeDropdown, setShowAttributeDropdown] = useState(false);
  const [selectedAttributeIndex, setSelectedAttributeIndex] = useState(null);
  const [valueSearch, setValueSearch] = useState('');
  const [showValueDropdown, setShowValueDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Filter out already selected attributes
    const usedAttributes = attributes.map(attr => attr.attribute_name);
    const available = predefinedAttributes.filter(attr => !usedAttributes.includes(attr));
    setAvailableAttributes(available);
  }, [attributes]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAttributeDropdown(false);
        setShowValueDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addAttribute = (attributeName) => {
    const newAttribute = {
      attribute_name: attributeName,
      attribute_values: []
    };
    onAttributesChange([...attributes, newAttribute]);
    setAttributeSearch('');
    setShowAttributeDropdown(false);
  };

  const removeAttribute = (index) => {
    const newAttributes = attributes.filter((_, i) => i !== index);
    onAttributesChange(newAttributes);
  };

  const updateAttributeValues = (index, values) => {
    const newAttributes = [...attributes];
    newAttributes[index].attribute_values = values;
    onAttributesChange(newAttributes);
  };

  const addValueToAttribute = (attributeIndex, value) => {
    const newAttributes = [...attributes];
    if (!newAttributes[attributeIndex].attribute_values.includes(value)) {
      newAttributes[attributeIndex].attribute_values.push(value);
      onAttributesChange(newAttributes);
    }
    setValueSearch('');
    setShowValueDropdown(false);
  };

  const removeValueFromAttribute = (attributeIndex, valueIndex) => {
    const newAttributes = [...attributes];
    newAttributes[attributeIndex].attribute_values.splice(valueIndex, 1);
    onAttributesChange(newAttributes);
  };

  const filteredAttributes = availableAttributes.filter(attr =>
    attr.toLowerCase().includes(attributeSearch.toLowerCase())
  );

  const getSuggestedValues = (attributeName) => {
    const suggestions = {
      'Size': ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
      'Color': ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Gray', 'Pink', 'Purple', 'Orange', 'Brown'],
      'Material': ['Cotton', 'Polyester', 'Wool', 'Silk', 'Linen', 'Denim', 'Leather', 'Synthetic', 'Blend'],
      'Style': ['Casual', 'Formal', 'Sporty', 'Vintage', 'Modern', 'Classic', 'Trendy', 'Bohemian'],
      'Pattern': ['Solid', 'Striped', 'Polka Dot', 'Floral', 'Geometric', 'Abstract', 'Plaid', 'Animal Print'],
      'Fit': ['Loose', 'Regular', 'Slim', 'Oversized', 'Tapered', 'Relaxed', 'Skinny'],
      'Length': ['Short', 'Medium', 'Long', 'Extra Long'],
      'Gender': ['Men', 'Women', 'Unisex', 'Boys', 'Girls'],
      'Age Group': ['Infant', 'Toddler', 'Kids', 'Teen', 'Adult', 'Senior'],
      'Season': ['Spring', 'Summer', 'Fall', 'Winter', 'All Season'],
      'Occasion': ['Casual', 'Formal', 'Business', 'Party', 'Wedding', 'Sport', 'Beach', 'Outdoor']
    };
    return suggestions[attributeName] || [];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Product Attributes</h3>
        <button
          type="button"
          onClick={() => setShowAttributeDropdown(true)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Attribute
        </button>
      </div>

      {/* Attribute Dropdown */}
      {showAttributeDropdown && (
        <div ref={dropdownRef} className="relative">
          <div className="absolute top-0 left-0 right-0 z-10 bg-white border border-slate-200 rounded-lg shadow-lg">
            <div className="p-3 border-b border-slate-200">
              <input
                type="text"
                placeholder="Search attributes..."
                value={attributeSearch}
                onChange={(e) => setAttributeSearch(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filteredAttributes.length > 0 ? (
                filteredAttributes.map((attribute) => (
                  <button
                    key={attribute}
                    onClick={() => addAttribute(attribute)}
                    className="w-full px-4 py-3 text-left hover:bg-slate-50 border-b border-slate-100 last:border-b-0"
                  >
                    {attribute}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-slate-500">
                  No attributes found
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Attributes List */}
      <div className="space-y-4">
        {attributes.map((attribute, attributeIndex) => (
          <div key={attributeIndex} className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-slate-900">{attribute.attribute_name}</h4>
              <button
                type="button"
                onClick={() => removeAttribute(attributeIndex)}
                className="text-red-600 hover:text-red-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Values Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Values:</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAttributeIndex(attributeIndex);
                    setShowValueDropdown(true);
                  }}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Value
                </button>
              </div>

              {/* Value Dropdown */}
              {showValueDropdown && selectedAttributeIndex === attributeIndex && (
                <div ref={dropdownRef} className="relative">
                  <div className="absolute top-0 left-0 right-0 z-10 bg-white border border-slate-200 rounded-lg shadow-lg">
                    <div className="p-3 border-b border-slate-200">
                      <input
                        type="text"
                        placeholder="Search or type values..."
                        value={valueSearch}
                        onChange={(e) => setValueSearch(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {/* Custom value input */}
                      {valueSearch && (
                        <button
                          onClick={() => addValueToAttribute(attributeIndex, valueSearch)}
                          className="w-full px-4 py-3 text-left hover:bg-slate-50 border-b border-slate-100"
                        >
                          Add "{valueSearch}"
                        </button>
                      )}
                      
                      {/* Suggested values */}
                      {getSuggestedValues(attribute.attribute_name)
                        .filter(value => 
                          value.toLowerCase().includes(valueSearch.toLowerCase()) &&
                          !attribute.attribute_values.includes(value)
                        )
                        .map((value) => (
                          <button
                            key={value}
                            onClick={() => addValueToAttribute(attributeIndex, value)}
                            className="w-full px-4 py-3 text-left hover:bg-slate-50 border-b border-slate-100 last:border-b-0"
                          >
                            {value}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Selected Values */}
              <div className="flex flex-wrap gap-2">
                {attribute.attribute_values.map((value, valueIndex) => (
                  <span
                    key={valueIndex}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {value}
                    <button
                      type="button"
                      onClick={() => removeValueFromAttribute(attributeIndex, valueIndex)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {attribute.attribute_values.length === 0 && (
                  <span className="text-sm text-slate-500">No values added yet</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {attributes.length === 0 && (
        <div className="text-center py-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
          <p className="text-slate-500">No attributes added yet</p>
          <p className="text-sm text-slate-400 mt-1">Add attributes to help customers find your product</p>
        </div>
      )}
    </div>
  );
} 