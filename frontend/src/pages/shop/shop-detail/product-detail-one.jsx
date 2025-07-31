import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Tagline from "../../../components/tagline";
import Navbar from "../../../components/navbar";
import ProductDetail from "../../../components/product-detail";
import ProductAboutTab from "../../../components/product-about-tab";
import ArrivalItem from "../../../components/arrival-item";
import Footer from "../../../components/footer";
import ScrollToTop from "../../../components/scroll-to-top";
import Lightbox from 'react-18-image-lightbox';
import 'react-18-image-lightbox/style.css';
import { productsAPI } from "../../../services/api";

export default function ProductDetailOne() {
	const { id } = useParams();
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [photoIndex, setActiveIndex] = useState(0);
	const [isOpen, setOpen] = useState(false);
	const [images, setImages] = useState([]);

	useEffect(() => {
		async function fetchProduct() {
			try {
				setLoading(true);
				const response = await productsAPI.getProduct(id);
				const data = response.data;

				if (data) {
					setProduct(data);
					// Set images for lightbox - use product image if available
					const productImages = data.image ? [data.image] : [];
					setImages(productImages);
				}
			} catch (error) {
				console.error('Error fetching product:', error);
			} finally {
				setLoading(false);
			}
		}
		if (id) {
			fetchProduct();
		}
	}, [id]);

	const handleCLick = (index) => {
		setActiveIndex(index)
		setOpen(true);
	}

	// Extract available sizes/colors from product.attributes
	const sizeOptions = product?.attributes?.find(attr => attr.attribute_name.toLowerCase() === 'size')?.attribute_values || [];
	const colorOptions = product?.attributes?.find(attr => attr.attribute_name.toLowerCase() === 'color')?.attribute_values || [];

	if (loading) {
		return (
			<>
				<Tagline />
				<Navbar navClass="defaultscroll is-sticky tagline-height" />
				<section className="relative table w-full py-20 lg:py-24 md:pt-28 bg-gray-50 dark:bg-slate-800">
					<div className="container relative">
						<div className="flex items-center justify-center py-20">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
						</div>
					</div>
				</section>
			</>
		);
	}

	if (!product) {
		return (
			<>
				<Tagline />
				<Navbar navClass="defaultscroll is-sticky tagline-height" />
				<section className="relative table w-full py-20 lg:py-24 md:pt-28 bg-gray-50 dark:bg-slate-800">
					<div className="container relative">
						<div className="text-center py-20">
							<h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">Product Not Found</h3>
							<p className="text-gray-500 dark:text-gray-400">The product you're looking for doesn't exist.</p>
							<Link to="/products" className="mt-4 inline-block px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
								Back to Products
							</Link>
						</div>
					</div>
				</section>
			</>
		);
	}

	return (
		<>
			<Tagline />
			<Navbar navClass="defaultscroll is-sticky tagline-height" />
			<section className="relative table w-full py-20 lg:py-24 md:pt-28 bg-gray-50 dark:bg-slate-800">
				<div className="container relative">
					<div className="grid grid-cols-1 mt-14">
						<h3 className="text-3xl leading-normal font-semibold">{product.name}</h3>
					</div>

					<div className="relative mt-3">
						<ul className="tracking-[0.5px] mb-0 inline-block">
							<li className="inline-block uppercase text-[13px] font-bold duration-500 ease-in-out hover:text-orange-500"><Link to="/">Zyqora</Link></li>
							<li className="inline-block text-base text-slate-950 dark:text-white mx-0.5 ltr:rotate-0 rtl:rotate-180"><i className="mdi mdi-chevron-right"></i></li>
							<li className="inline-block uppercase text-[13px] font-bold duration-500 ease-in-out hover:text-orange-500"><Link to="/products">Products</Link></li>
							<li className="inline-block text-base text-slate-950 dark:text-white mx-0.5 ltr:rotate-0 rtl:rotate-180"><i className="mdi mdi-chevron-right"></i></li>
							<li className="inline-block uppercase text-[13px] font-bold text-orange-500" aria-current="page">{product.name}</li>
						</ul>
					</div>
				</div>
			</section>

			<section className="relative md:py-24 py-16">
				<div className="container relative">
					<div className="grid lg:grid-cols-12 md:grid-cols-2 grid-cols-1 gap-6">
						<div className="lg:col-span-5">
							<div className="grid md:grid-cols-12 gap-3">
								<div className="md:col-span-12">
									<Link to="#" onClick={() => handleCLick(0)} className="lightbox duration-500 group-hover:scale-105" title="">
										<img src={product.image} className="shadow dark:shadow-gray-700" alt={product.name} />
									</Link>
								</div>
								{/* Additional product images can be added here if available */}
							</div>
						</div>

						<div className="lg:col-span-7">
							<ProductDetail product={product} />
						</div>
					</div>

					<ProductAboutTab product={product} />
				</div>

				<ArrivalItem />
			</section>
			<Footer />
			{isOpen && images.length > 0 && (
				<Lightbox
					mainSrc={images[photoIndex]}
					nextSrc={images.length > 1 ? images[(photoIndex + 1) % images.length] : undefined}
					prevSrc={images.length > 1 ? images[(photoIndex + images.length - 1) % images.length] : undefined}
					onCloseRequest={() => setOpen(false)}
					onMovePrevRequest={() =>
						setActiveIndex((photoIndex + images.length - 1) % images.length,
						)
					}
					onMoveNextRequest={() =>
						setActiveIndex((photoIndex + 1) % images.length,
						)
					}
				/>
			)}
			<ScrollToTop />
		</>
	)
}