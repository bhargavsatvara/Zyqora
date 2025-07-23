import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { commentsData } from "../data/data";

import { FiUser, FiMail, FiMessageCircle } from '../assets/icons/vander'

export default function ProductAboutTab({ product }){
    let[activeTab, setActiveTab] = useState(1)
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (product && product._id) {
            setLoading(true);
            fetch(`https://zyqora.onrender.com/api/reviews/${product._id}`)
                .then(res => res.json())
                .then(data => {
                    setReviews(Array.isArray(data) ? data : []);
                })
                .finally(() => setLoading(false));
        }
    }, [product]);

	// Extract attributes from product
	const getAttributeValues = (attributeName) => {
		if (!product?.attributes || !Array.isArray(product.attributes)) {
			return [];
		}

		const attribute = product.attributes.find(attr =>
			attr.attribute_name && attr.attribute_name.toLowerCase().includes(attributeName.toLowerCase())
		);

		return attribute ? attribute.attribute_values || [] : [];
	};

	const colors = getAttributeValues('color');
	const materials = getAttributeValues('material');
	const sizes = getAttributeValues('size');

	return (
		<div className="grid md:grid-cols-12 grid-cols-1 mt-6 gap-6">
			<div className="lg:col-span-3 md:col-span-5">
				<div className="sticky top-20">
					<ul className="flex-column p-6 bg-white dark:bg-slate-900 shadow dark:shadow-gray-800 rounded-md" id="myTab" data-tabs-toggle="#myTabContent" role="tablist">
						<li className="ms-0">
							<button className={`px-4 py-2 text-start text-base font-semibold rounded-md w-full hover:text-orange-500 duration-500 ${activeTab === 1 ? 'text-white bg-orange-500 hover:text-white' : ''}`} onClick={() => setActiveTab(1)}>Description</button>
						</li>
						<li className="ms-0">
							<button className={`px-4 py-2 text-start text-base font-semibold rounded-md w-full hover:text-orange-500 duration-500 ${activeTab === 2 ? 'text-white bg-orange-500 hover:text-white' : ''}`} onClick={() => setActiveTab(2)}>Additional Information</button>
						</li>
						<li className="ms-0">
							<button className={`px-4 py-2 text-start text-base font-semibold rounded-md w-full hover:text-orange-500 duration-500 ${activeTab === 3 ? 'text-white bg-orange-500 hover:text-white' : ''}`} onClick={() => setActiveTab(3)}>Review</button>
						</li>
					</ul>
				</div>
			</div>

			<div className="lg:col-span-9 md:col-span-7">
				<div id="myTabContent" className="p-6 bg-white dark:bg-slate-900 shadow dark:shadow-gray-800 rounded-md">
					{activeTab === 1 && (
						<div>
							<p className="text-slate-400">
								{product?.description || "No description available for this product."}
							</p>
						</div>
					)}
					{activeTab === 2 && (
						<div>
							<table className="w-full text-start">
								<tbody>
									{colors.length > 0 && (
										<tr className="bg-white dark:bg-slate-900">
											<td className="font-semibold py-4" style={{ width: '100px' }}>Color</td>
											<td className="text-slate-400 py-4">{colors.join(', ')}</td>
										</tr>
									)}

									{materials.length > 0 && (
										<tr className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-gray-700">
											<td className="font-semibold py-4">Material</td>
											<td className="text-slate-400 py-4">{materials.join(', ')}</td>
										</tr>
									)}

									{sizes.length > 0 && (
										<tr className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-gray-700">
											<td className="font-semibold py-4">Size</td>
											<td className="text-slate-400 py-4">{sizes.join(', ')}</td>
										</tr>
									)}

									{product.brand_id?.name && (
										<tr className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-gray-700">
											<td className="font-semibold py-4">Brand</td>
											<td className="text-slate-400 py-4">{product.brand_id.name}</td>
										</tr>
									)}

									{product.size_chart_id && (
										<tr className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-gray-700">
											<td className="font-semibold py-4">Size Chart</td>
											<td className="text-slate-400 py-4">
												{product.size_chart_id.title && (
													<div className="font-semibold mb-2">{product.size_chart_id.title}</div>
												)}
												{product.size_chart_id.image && (
													<div className="mb-2">
														<img
															src={product.size_chart_id.image.startsWith('/uploads')
																? `https://zyqora.onrender.com${product.size_chart_id.image}`
																: product.size_chart_id.image}
															alt={product.size_chart_id.title}
															className="w-full max-w-xs rounded shadow"
														/>
													</div>
												)}
												{product.size_chart_id.description && (
													<div
														className="overflow-x-auto"
														dangerouslySetInnerHTML={{ __html: product.size_chart_id.description }}
													/>
												)}
											</td>
										</tr>
									)}

									{colors.length === 0 && materials.length === 0 && sizes.length === 0 && (
										<tr className="bg-white dark:bg-slate-900">
											<td className="font-semibold pb-4" style={{ width: '100px' }}>Information</td>
											<td className="text-slate-400 pb-4">No additional information available for this product.</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					)}
					{activeTab === 3 && (
						<div className="mt-4">
							{loading ? (
								<div>Loading reviews...</div>
							) : reviews.length === 0 ? (
								<div className="text-slate-400">No reviews yet.</div>
							) : (
								<div className="space-y-4">
									{reviews.map((review, idx) => (
										<div key={idx} className="border-b border-gray-100 dark:border-gray-700 pb-2">
											<div className="font-semibold">{review.user_id?.name || 'User'}</div>
											<div className="text-amber-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
											<div className="text-slate-500 text-sm mt-1">{review.comment}</div>
										</div>
									))}
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}