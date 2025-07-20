import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, FileText } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

export default function AddSizeChart() {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      showError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/size-charts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create size chart');
      }

      showSuccess('Size chart created successfully');
      navigate('/size-charts');
    } catch (error) {
      console.error('Error creating size chart:', error);
      showError(error.message || 'Error creating size chart');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/size-charts')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add Size Chart</h1>
            <p className="text-gray-600">Create a new size chart for products</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter size chart title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <div className="border border-gray-300 rounded-lg">
                  <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-300">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Rich Text Editor</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => {
                          const textarea = document.getElementById('description');
                          const start = textarea.selectionStart;
                          const end = textarea.selectionEnd;
                          const text = textarea.value;
                          const before = text.substring(0, start);
                          const selected = text.substring(start, end);
                          const after = text.substring(end);
                          
                          const newText = before + '<strong>' + selected + '</strong>' + after;
                          setFormData(prev => ({ ...prev, description: newText }));
                        }}
                        className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
                        title="Bold"
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const textarea = document.getElementById('description');
                          const start = textarea.selectionStart;
                          const end = textarea.selectionEnd;
                          const text = textarea.value;
                          const before = text.substring(0, start);
                          const selected = text.substring(start, end);
                          const after = text.substring(end);
                          
                          const newText = before + '<em>' + selected + '</em>' + after;
                          setFormData(prev => ({ ...prev, description: newText }));
                        }}
                        className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
                        title="Italic"
                      >
                        I
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const textarea = document.getElementById('description');
                          const start = textarea.selectionStart;
                          const end = textarea.selectionEnd;
                          const text = textarea.value;
                          const before = text.substring(0, start);
                          const selected = text.substring(start, end);
                          const after = text.substring(end);
                          
                          const newText = before + '<u>' + selected + '</u>' + after;
                          setFormData(prev => ({ ...prev, description: newText }));
                        }}
                        className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
                        title="Underline"
                      >
                        U
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const textarea = document.getElementById('description');
                          const start = textarea.selectionStart;
                          const end = textarea.selectionEnd;
                          const text = textarea.value;
                          const before = text.substring(0, start);
                          const selected = text.substring(start, end);
                          const after = text.substring(end);
                          
                          const newText = before + '<br>' + after;
                          setFormData(prev => ({ ...prev, description: newText }));
                        }}
                        className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
                        title="Line Break"
                      >
                        ↵
                      </button>
                      <div className="w-px h-4 bg-gray-300 mx-1"></div>
                      <button
                        type="button"
                        onClick={() => {
                          const textarea = document.getElementById('description');
                          const start = textarea.selectionStart;
                          const text = textarea.value;
                          const before = text.substring(0, start);
                          const after = text.substring(start);
                          
                          const tableHTML = `
<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%; margin: 10px 0;">
  <thead>
    <tr>
      <th style="background-color: #f3f4f6; padding: 8px; text-align: left; border: 1px solid #d1d5db;">Size</th>
      <th style="background-color: #f3f4f6; padding: 8px; text-align: left; border: 1px solid #d1d5db;">Chest (inches)</th>
      <th style="background-color: #f3f4f6; padding: 8px; text-align: left; border: 1px solid #d1d5db;">Waist (inches)</th>
      <th style="background-color: #f3f4f6; padding: 8px; text-align: left; border: 1px solid #d1d5db;">Hips (inches)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #d1d5db;">S</td>
      <td style="padding: 8px; border: 1px solid #d1d5db;">34-36</td>
      <td style="padding: 8px; border: 1px solid #d1d5db;">28-30</td>
      <td style="padding: 8px; border: 1px solid #d1d5db;">36-38</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #d1d5db;">M</td>
      <td style="padding: 8px; border: 1px solid #d1d5db;">38-40</td>
      <td style="padding: 8px; border: 1px solid #d1d5db;">32-34</td>
      <td style="padding: 8px; border: 1px solid #d1d5db;">38-40</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #d1d5db;">L</td>
      <td style="padding: 8px; border: 1px solid #d1d5db;">42-44</td>
      <td style="padding: 8px; border: 1px solid #d1d5db;">36-38</td>
      <td style="padding: 8px; border: 1px solid #d1d5db;">40-42</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #d1d5db;">XL</td>
      <td style="padding: 8px; border: 1px solid #d1d5db;">46-48</td>
      <td style="padding: 8px; border: 1px solid #d1d5db;">40-42</td>
      <td style="padding: 8px; border: 1px solid #d1d5db;">42-44</td>
    </tr>
  </tbody>
</table>`;
                          
                          const newText = before + tableHTML + after;
                          setFormData(prev => ({ ...prev, description: newText }));
                        }}
                        className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
                        title="Insert Size Chart Table"
                      >
                        📊
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const textarea = document.getElementById('description');
                          const start = textarea.selectionStart;
                          const text = textarea.value;
                          const before = text.substring(0, start);
                          const after = text.substring(start);
                          
                          const tableHTML = `
<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%; margin: 10px 0;">
  <thead>
    <tr>
      <th style="background-color: #f3f4f6; padding: 8px; text-align: left; border: 1px solid #d1d5db;">Size</th>
      <th style="background-color: #f3f4f6; padding: 8px; text-align: left; border: 1px solid #d1d5db;">Length (cm)</th>
      <th style="background-color: #f3f4f6; padding: 8px; text-align: left; border: 1px solid #d1d5db;">Width (cm)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #d1d5db;">S</td>
      <td style="padding: 8px; border: 1px solid #d1d5db;">65</td>
      <td style="padding: 8px; border: 1px solid #d1d5db;">45</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #d1d5db;">M</td>
      <td style="padding: 8px; border: 1px solid #d1d5db;">67</td>
      <td style="padding: 8px; border: 1px solid #d1d5db;">47</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #d1d5db;">L</td>
      <td style="padding: 8px; border: 1px solid #d1d5db;">69</td>
      <td style="padding: 8px; border: 1px solid #d1d5db;">49</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #d1d5db;">XL</td>
      <td style="padding: 8px; border: 1px solid #d1d5db;">71</td>
      <td style="padding: 8px; border: 1px solid #d1d5db;">51</td>
    </tr>
  </tbody>
</table>`;
                          
                          const newText = before + tableHTML + after;
                          setFormData(prev => ({ ...prev, description: newText }));
                        }}
                        className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
                        title="Insert Simple Table"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter size chart description with HTML formatting..."
                    className="w-full px-3 py-3 border-0 focus:ring-0 resize-none"
                    rows={15}
                    required
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  You can use HTML tags like &lt;strong&gt;, &lt;em&gt;, &lt;u&gt;, &lt;br&gt;, &lt;table&gt;, etc. to format your size chart.
                </p>
              </div>
            </div>
          </div>

          {/* Preview */}
          {formData.description && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: formData.description }}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/size-charts')}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Creating...' : 'Create Size Chart'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 