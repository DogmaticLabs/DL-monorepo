import Image from 'next/image'
import Link from 'next/link'
import './globals.css'
export default function Page() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white'>
      {/* Hero Section */}
      <section className='relative h-screen flex items-center justify-center overflow-hidden'>
        <div className='absolute inset-0 z-0 opacity-10'>
          <div className='absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,#888_0%,transparent_50%)]'></div>
        </div>
        <div className='container mx-auto px-4 z-10'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-12'>
            <div className='md:w-1/2 space-y-6'>
              <h1 className='text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-300 to-white'>
                DOGMATIC LABS
              </h1>
              <p className='text-xl md:text-2xl text-zinc-300'>
                Crafting digital experiences with precision engineering and innovative design
              </p>
              <div className='pt-4'>
                <Link
                  href='#contact'
                  className='px-8 py-3 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-md font-medium hover:from-zinc-600 hover:to-zinc-700 transition-all duration-300 inline-block border border-zinc-600'
                >
                  Get in Touch
                </Link>
              </div>
            </div>
            <div className='md:w-1/2 flex justify-center'>
              <div className='relative w-80 h-80 md:w-96 md:h-96 glow-effect'>
                <Image
                  src='/DL_minimalist_no_text.jpg'
                  alt='Dogmatic Labs'
                  fill
                  className='object-contain'
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        <div className='absolute bottom-10 left-0 right-0 flex justify-center animate-bounce'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='text-zinc-400'
          >
            <path d='M12 5v14M5 12l7 7 7-7' />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section id='about' className='py-20 relative'>
        <div className='absolute inset-0 z-0 opacity-5'>
          <div className='absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_center,#888_0%,transparent_70%)]'></div>
        </div>
        <div className='container mx-auto px-4 z-10 relative'>
          <h2 className='text-4xl font-bold mb-16 text-center'>
            <span className='bg-clip-text text-transparent bg-gradient-to-r from-zinc-300 to-white'>
              Who We Are
            </span>
          </h2>
          <div className='grid md:grid-cols-3 gap-10'>
            <div className='bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-zinc-800 hover:border-zinc-600 transition-all duration-300'>
              <div className='w-16 h-16 bg-gradient-to-br from-zinc-600 to-zinc-800 rounded-lg flex items-center justify-center mb-6'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' />
                </svg>
              </div>
              <h3 className='text-xl font-bold mb-3 text-zinc-200'>Innovative Solutions</h3>
              <p className='text-zinc-400'>
                We leverage cutting-edge technologies to create solutions that are not just
                functional but revolutionary.
              </p>
            </div>
            <div className='bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-zinc-800 hover:border-zinc-600 transition-all duration-300'>
              <div className='w-16 h-16 bg-gradient-to-br from-zinc-600 to-zinc-800 rounded-lg flex items-center justify-center mb-6'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <circle cx='12' cy='12' r='10' />
                  <path d='M12 16v-4M12 8h.01' />
                </svg>
              </div>
              <h3 className='text-xl font-bold mb-3 text-zinc-200'>User-Centric Design</h3>
              <p className='text-zinc-400'>
                We believe in creating experiences that resonate with users, focusing on intuitive
                interfaces and seamless interactions.
              </p>
            </div>
            <div className='bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-zinc-800 hover:border-zinc-600 transition-all duration-300'>
              <div className='w-16 h-16 bg-gradient-to-br from-zinc-600 to-zinc-800 rounded-lg flex items-center justify-center mb-6'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' />
                  <circle cx='9' cy='7' r='4' />
                  <path d='M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
                </svg>
              </div>
              <h3 className='text-xl font-bold mb-3 text-zinc-200'>Expert Team</h3>
              <p className='text-zinc-400'>
                Our diverse team of developers, designers, and strategists brings a wealth of
                experience across various industries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id='projects' className='py-20 bg-zinc-950 relative'>
        <div className='absolute inset-0 z-0 opacity-5'>
          <div className='absolute bottom-0 left-0 w-full h-1/2 bg-[radial-gradient(ellipse_at_bottom,#888_0%,transparent_70%)]'></div>
        </div>
        <div className='container mx-auto px-4 z-10 relative'>
          <h2 className='text-4xl font-bold mb-16 text-center'>
            <span className='bg-clip-text text-transparent bg-gradient-to-r from-zinc-300 to-white'>
              Our Projects
            </span>
          </h2>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {/* Project 1 */}
            <div className='group relative overflow-hidden rounded-xl'>
              <div className='aspect-video bg-zinc-800 relative overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-br from-zinc-500/20 to-zinc-700/20 group-hover:opacity-75 transition-opacity duration-300'></div>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='text-6xl text-zinc-400/30'>AI</div>
                </div>
              </div>
              <div className='p-6 bg-zinc-900 border-t border-zinc-800'>
                <h3 className='text-xl font-bold mb-2 text-zinc-200'>NeuraSense AI Platform</h3>
                <p className='text-zinc-400 mb-4'>
                  An advanced AI analytics platform that processes and visualizes complex data
                  patterns in real-time.
                </p>
                <div className='flex flex-wrap gap-2'>
                  <span className='px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300'>
                    React
                  </span>
                  <span className='px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300'>
                    Python
                  </span>
                  <span className='px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300'>
                    TensorFlow
                  </span>
                </div>
              </div>
            </div>

            {/* Project 2 */}
            <div className='group relative overflow-hidden rounded-xl'>
              <div className='aspect-video bg-zinc-800 relative overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-br from-zinc-500/20 to-zinc-700/20 group-hover:opacity-75 transition-opacity duration-300'></div>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='text-6xl text-zinc-400/30'>VR</div>
                </div>
              </div>
              <div className='p-6 bg-zinc-900 border-t border-zinc-800'>
                <h3 className='text-xl font-bold mb-2 text-zinc-200'>VirtualScape</h3>
                <p className='text-zinc-400 mb-4'>
                  A VR application that transforms architectural blueprints into immersive 3D
                  environments.
                </p>
                <div className='flex flex-wrap gap-2'>
                  <span className='px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300'>
                    Unity
                  </span>
                  <span className='px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300'>
                    C#
                  </span>
                  <span className='px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300'>
                    Blender
                  </span>
                </div>
              </div>
            </div>

            {/* Project 3 */}
            <div className='group relative overflow-hidden rounded-xl'>
              <div className='aspect-video bg-zinc-800 relative overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-br from-zinc-500/20 to-zinc-700/20 group-hover:opacity-75 transition-opacity duration-300'></div>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='text-6xl text-zinc-400/30'>IoT</div>
                </div>
              </div>
              <div className='p-6 bg-zinc-900 border-t border-zinc-800'>
                <h3 className='text-xl font-bold mb-2 text-zinc-200'>SmartHub Connect</h3>
                <p className='text-zinc-400 mb-4'>
                  An IoT ecosystem that integrates smart home devices with advanced automation
                  capabilities.
                </p>
                <div className='flex flex-wrap gap-2'>
                  <span className='px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300'>
                    Node.js
                  </span>
                  <span className='px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300'>
                    MQTT
                  </span>
                  <span className='px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300'>
                    React Native
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section id='values' className='py-20 relative'>
        <div className='absolute inset-0 z-0 opacity-5'>
          <div className='absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,#888_0%,transparent_50%)]'></div>
        </div>
        <div className='container mx-auto px-4 z-10 relative'>
          <h2 className='text-4xl font-bold mb-16 text-center'>
            <span className='bg-clip-text text-transparent bg-gradient-to-r from-zinc-300 to-white'>
              Our Values
            </span>
          </h2>
          <div className='grid md:grid-cols-2 gap-10'>
            <div className='bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-zinc-800 hover:border-zinc-600 transition-all duration-300'>
              <h3 className='text-xl font-bold mb-4 text-zinc-200 flex items-center'>
                <span className='w-8 h-8 bg-gradient-to-br from-zinc-600 to-zinc-800 rounded-full flex items-center justify-center mr-3 text-white'>
                  1
                </span>
                Innovation First
              </h3>
              <p className='text-zinc-400'>
                We constantly push the boundaries of what's possible, embracing new technologies and
                methodologies to deliver cutting-edge solutions.
              </p>
            </div>
            <div className='bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-zinc-800 hover:border-zinc-600 transition-all duration-300'>
              <h3 className='text-xl font-bold mb-4 text-zinc-200 flex items-center'>
                <span className='w-8 h-8 bg-gradient-to-br from-zinc-600 to-zinc-800 rounded-full flex items-center justify-center mr-3 text-white'>
                  2
                </span>
                Quality Obsessed
              </h3>
              <p className='text-zinc-400'>
                We believe in crafting solutions that not only meet but exceed expectations, with
                meticulous attention to detail at every stage.
              </p>
            </div>
            <div className='bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-zinc-800 hover:border-zinc-600 transition-all duration-300'>
              <h3 className='text-xl font-bold mb-4 text-zinc-200 flex items-center'>
                <span className='w-8 h-8 bg-gradient-to-br from-zinc-600 to-zinc-800 rounded-full flex items-center justify-center mr-3 text-white'>
                  3
                </span>
                Client Partnership
              </h3>
              <p className='text-zinc-400'>
                We view our clients as partners, working collaboratively to understand their vision
                and transform it into reality.
              </p>
            </div>
            <div className='bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-zinc-800 hover:border-zinc-600 transition-all duration-300'>
              <h3 className='text-xl font-bold mb-4 text-zinc-200 flex items-center'>
                <span className='w-8 h-8 bg-gradient-to-br from-zinc-600 to-zinc-800 rounded-full flex items-center justify-center mr-3 text-white'>
                  4
                </span>
                Ethical Development
              </h3>
              <p className='text-zinc-400'>
                We are committed to creating technology that positively impacts society, with a
                focus on sustainability and ethical considerations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id='contact' className='py-20 bg-zinc-950 relative'>
        <div className='absolute inset-0 z-0 opacity-5'>
          <div className='absolute bottom-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_center,#888_0%,transparent_70%)]'></div>
        </div>
        <div className='container mx-auto px-4 z-10 relative'>
          <h2 className='text-4xl font-bold mb-16 text-center'>
            <span className='bg-clip-text text-transparent bg-gradient-to-r from-zinc-300 to-white'>
              Get In Touch
            </span>
          </h2>
          <div className='max-w-3xl mx-auto bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-zinc-800'>
            <p className='text-center text-zinc-400 mb-8'>
              Ready to bring your vision to life? Contact us to discuss how Dogmatic Labs can help
              transform your ideas into reality.
            </p>
            <div className='grid md:grid-cols-2 gap-8'>
              <div className='space-y-6'>
                <div className='flex items-center'>
                  <div className='w-10 h-10 bg-gradient-to-br from-zinc-600 to-zinc-800 rounded-lg flex items-center justify-center mr-4'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='20'
                      height='20'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' />
                    </svg>
                  </div>
                  <div>
                    <p className='text-zinc-400'>Phone</p>
                    <p className='text-white font-medium'>+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className='flex items-center'>
                  <div className='w-10 h-10 bg-gradient-to-br from-zinc-600 to-zinc-800 rounded-lg flex items-center justify-center mr-4'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='20'
                      height='20'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' />
                      <polyline points='22,6 12,13 2,6' />
                    </svg>
                  </div>
                  <div>
                    <p className='text-zinc-400'>Email</p>
                    <p className='text-white font-medium'>contact@dogmaticlabs.com</p>
                  </div>
                </div>
                <div className='flex items-center'>
                  <div className='w-10 h-10 bg-gradient-to-br from-zinc-600 to-zinc-800 rounded-lg flex items-center justify-center mr-4'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='20'
                      height='20'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' />
                      <circle cx='12' cy='10' r='3' />
                    </svg>
                  </div>
                  <div>
                    <p className='text-zinc-400'>Location</p>
                    <p className='text-white font-medium'>San Francisco, CA</p>
                  </div>
                </div>
              </div>
              <div className='flex items-center justify-center'>
                <div className='w-32 h-32 md:w-48 md:h-48'>
                  <Image
                    src='/DL_minimalist_no_text.jpg'
                    alt='Dogmatic Labs'
                    width={200}
                    height={200}
                    className='object-contain'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='py-8 border-t border-zinc-800'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='mb-4 md:mb-0'>
              <Image
                src='/DL_minimalist_no_text.jpg'
                alt='Dogmatic Labs'
                width={60}
                height={60}
                className='object-contain'
              />
            </div>
            <div className='text-zinc-400 text-sm'>
              © {new Date().getFullYear()} Dogmatic Labs. All rights reserved.
            </div>
            <div className='flex space-x-4 mt-4 md:mt-0'>
              <a href='#' className='text-zinc-400 hover:text-white transition-colors'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' />
                </svg>
              </a>
              <a href='#' className='text-zinc-400 hover:text-white transition-colors'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z' />
                </svg>
              </a>
              <a href='#' className='text-zinc-400 hover:text-white transition-colors'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z' />
                  <rect x='2' y='9' width='4' height='12' />
                  <circle cx='4' cy='4' r='2' />
                </svg>
              </a>
              <a href='#' className='text-zinc-400 hover:text-white transition-colors'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22' />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom CSS for glow effects */}
      {/* <style jsx global>{`
        .glow-effect {
          position: relative;
        }
        .glow-effect::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 50%;
          box-shadow: 0 0 60px 30px rgba(150, 150, 150, 0.2);
          z-index: -1;
        }
      `}</style> */}
    </div>
  )
}
