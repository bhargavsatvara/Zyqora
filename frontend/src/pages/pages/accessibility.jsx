import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import ScrollToTop from "../../components/scroll-to-top";

export default function Accessibility() {
  return (
    <>
      <Navbar navClass="defaultscroll is-sticky" />
      
      <section className="relative table w-full py-20 lg:py-24 md:pt-28 bg-gray-50 dark:bg-slate-800">
        <div className="container relative">
          <div className="grid grid-cols-1 mt-14">
            <h3 className="text-3xl leading-normal font-semibold">Accessibility</h3>
          </div>

          <div className="relative mt-3">
            <ul className="tracking-[0.5px] mb-0 inline-block">
              <li className="inline-block uppercase text-[13px] font-bold duration-500 ease-in-out hover:text-orange-500">
                <Link to="/">Zyqora</Link>
              </li>
              <li className="inline-block text-base text-slate-950 dark:text-white mx-0.5 ltr:rotate-0 rtl:rotate-180">
                <i className="mdi mdi-chevron-right"></i>
              </li>
              <li className="inline-block uppercase text-[13px] font-bold text-orange-500" aria-current="page">
                Accessibility
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="relative md:py-24 py-16">
        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-slate-900 rounded-md shadow dark:shadow-gray-800 p-6">
                <h4 className="mb-6 text-2xl font-bold">Our Commitment to Accessibility</h4>
                
                <p className="text-slate-400 mb-6">
                  At Zyqora, we are committed to ensuring that our website is accessible to all users, 
                  including those with disabilities. We strive to provide an inclusive shopping experience 
                  that meets or exceeds the Web Content Accessibility Guidelines (WCAG) 2.1 AA standards.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-lg">
                    <h5 className="text-xl font-semibold mb-4 text-orange-500">Keyboard Navigation</h5>
                    <ul className="space-y-2 text-slate-400">
                      <li>• Use Tab to navigate through interactive elements</li>
                      <li>• Use Enter or Space to activate buttons and links</li>
                      <li>• Use Escape to close modals and dropdowns</li>
                      <li>• Arrow keys work for dropdown menus and sliders</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-lg">
                    <h5 className="text-xl font-semibold mb-4 text-orange-500">Screen Reader Support</h5>
                    <ul className="space-y-2 text-slate-400">
                      <li>• Proper heading structure (H1-H6)</li>
                      <li>• Alt text for all images</li>
                      <li>• ARIA labels for interactive elements</li>
                      <li>• Descriptive link text</li>
                    </ul>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-lg">
                    <h5 className="text-xl font-semibold mb-4 text-orange-500">Visual Accessibility</h5>
                    <ul className="space-y-2 text-slate-400">
                      <li>• High contrast color combinations</li>
                      <li>• Resizable text (up to 200%)</li>
                      <li>• Clear focus indicators</li>
                      <li>• Consistent visual hierarchy</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-lg">
                    <h5 className="text-xl font-semibold mb-4 text-orange-500">Forms & Input</h5>
                    <ul className="space-y-2 text-slate-400">
                      <li>• Proper form labels and descriptions</li>
                      <li>• Error messages with clear instructions</li>
                      <li>• Required field indicators</li>
                      <li>• Logical tab order</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-8">
                  <h5 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Accessibility Features</h5>
                  <div className="grid md:grid-cols-2 gap-4 text-slate-400">
                    <div>
                      <h6 className="font-semibold mb-2">Navigation & Structure</h6>
                      <ul className="space-y-1 text-sm">
                        <li>• Skip to main content links</li>
                        <li>• Breadcrumb navigation</li>
                        <li>• Consistent page layout</li>
                        <li>• Clear section headings</li>
                      </ul>
                    </div>
                    <div>
                      <h6 className="font-semibold mb-2">Content & Media</h6>
                      <ul className="space-y-1 text-sm">
                        <li>• Alternative text for images</li>
                        <li>• Captions for videos</li>
                        <li>• Transcripts for audio content</li>
                        <li>• Readable font sizes</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-8">
                  <h5 className="text-xl font-semibold mb-4 text-green-600 dark:text-green-400">Browser Compatibility</h5>
                  <p className="text-slate-400 mb-4">
                    Our website is tested and compatible with the following browsers and assistive technologies:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h6 className="font-semibold mb-2">Browsers</h6>
                      <ul className="space-y-1 text-sm text-slate-400">
                        <li>• Chrome (latest)</li>
                        <li>• Firefox (latest)</li>
                        <li>• Safari (latest)</li>
                        <li>• Edge (latest)</li>
                      </ul>
                    </div>
                    <div>
                      <h6 className="font-semibold mb-2">Assistive Technologies</h6>
                      <ul className="space-y-1 text-sm text-slate-400">
                        <li>• NVDA (Windows)</li>
                        <li>• JAWS (Windows)</li>
                        <li>• VoiceOver (macOS)</li>
                        <li>• TalkBack (Android)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
                  <h5 className="text-xl font-semibold mb-4 text-orange-600 dark:text-orange-400">Contact Us</h5>
                  <p className="text-slate-400 mb-4">
                    If you experience any accessibility issues or have suggestions for improvement, 
                    please contact our accessibility team:
                  </p>
                  <div className="space-y-2 text-slate-400">
                    <p><strong>Email:</strong> accessibility@zyqora.com</p>
                    <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                    <p><strong>Response Time:</strong> Within 48 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-900 rounded-md shadow dark:shadow-gray-800 p-6 sticky top-20">
                <h5 className="mb-4 text-xl font-semibold">Quick Accessibility Tips</h5>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <h6 className="font-semibold mb-2 text-orange-500">Zoom In</h6>
                    <p className="text-sm text-slate-400">
                      Use Ctrl/Cmd + to zoom in for better readability
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <h6 className="font-semibold mb-2 text-orange-500">High Contrast</h6>
                    <p className="text-sm text-slate-400">
                      Enable high contrast mode in your browser settings
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <h6 className="font-semibold mb-2 text-orange-500">Keyboard Shortcuts</h6>
                    <p className="text-sm text-slate-400">
                      Use keyboard navigation for faster browsing
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <h6 className="font-semibold mb-2 text-orange-500">Screen Reader</h6>
                    <p className="text-sm text-slate-400">
                      Enable screen reader for audio navigation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </>
  );
} 