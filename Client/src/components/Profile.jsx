
import logo from '../Images/Krity_logo.png';
import cover from '../Images/KRITI group.png'

function Profile() {
    return (
        <section className="py-10 my-auto dark:bg-gray-900">
            <div className="lg:w-[80%] md:w-[90%] w-[96%] mx-auto flex gap-4">
                <div
                    className="lg:w-[88%] sm:w-[88%] w-full mx-auto shadow-2xl p-4 rounded-xl h-fit self-center dark:bg-gray-800/40">

                    <div className="">
                        <h1
                            className="lg:text-3xl md:text-2xl text-xl font-serif font-extrabold mb-2 dark:text-white">
                            Profile
                        </h1>
                        <h2 className="text-grey text-sm mb-4 dark:text-gray-400">Create Profile</h2>
                        <form>
                            {/* <!-- Cover Image --> */}
                            <div className="w-full rounded-sm relative">
                                {/* Cover Image */}
                                <img
                                    src={cover}
                                    alt="Cover"
                                    className="w-full h-48 object-cover rounded-sm"
                                />

                                {/* Profile Image */}
                                <div className="mx-auto relative flex justify-center items-center w-[141px] h-[141px] bg-blue-300/10 rounded-full -mt-20">
                                    <img
                                        src={logo}
                                        alt="Logo"
                                        className="w-[141px] h-[141px] py-5 object-cover rounded-full"
                                    />

                                    {/* Upload Profile Button */}
                                    <div className="absolute top-3 right-3 bg-white/90 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer">
                                        <input type="file" name="profile" id="upload_profile" hidden required />
                                        <label htmlFor="upload_profile" className="cursor-pointer">
                                            <svg
                                                className="w-4 h-4 text-blue-700"
                                                fill="none"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M6.827 6.175A2.31 2.31 0 0 1 5.186 
            7.23c-.38.054-.757.112-1.134.175C2.999 
            7.58 2.25 8.507 2.25 9.574V18a2.25 
            2.25 0 0 0 2.25 2.25h15A2.25 
            2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 
            47.865 0 0 0-1.134-.175 2.31 
            2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 
            2.192 0 0 0-1.736-1.039 48.774 
            48.774 0 0 0-5.232 0 2.192 
            2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M16.5 12.75a4.5 4.5 0 1 1-9 
            0 4.5 4.5 0 0 1 9 0ZM18.75 
            10.5h.008v.008h-.008V10.5Z"
                                                />
                                            </svg>
                                        </label>
                                    </div>
                                </div>

                                {/* Upload Cover Button */}
                                <div className="absolute bottom-0 right-0 bg-white flex items-center gap-1 rounded-tl-md px-2 font-semibold">
                                    <input type="file" name="cover" id="upload_cover" hidden required />
                                    <label
                                        htmlFor="upload_cover"
                                        className="inline-flex items-center gap-1 cursor-pointer"
                                    >
                                        Cover
                                        <svg
                                            className="w-6 h-5 text-blue-700"
                                            fill="none"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                            aria-hidden="true"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6.827 6.175A2.31 2.31 0 0 1 
          5.186 7.23c-.38.054-.757.112-1.134.175C2.999 
          7.58 2.25 8.507 2.25 9.574V18a2.25 
          2.25 0 0 0 2.25 2.25h15A2.25 
          2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 
          47.865 0 0 0-1.134-.175 2.31 
          2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 
          2.192 0 0 0-1.736-1.039 48.774 
          48.774 0 0 0-5.232 0 2.192 
          2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M16.5 12.75a4.5 4.5 0 1 1-9 
          0 4.5 4.5 0 0 1 9 0ZM18.75 
          10.5h.008v.008h-.008V10.5Z"
                                            />
                                        </svg>
                                    </label>
                                </div>
                            </div>
                            <h2 className="text-center mt-1 font-semibold dark:text-gray-300">Upload Profile and Cover Image
                            </h2>
                            <div className="flex flex-col lg:flex-row gap-2 justify-center w-full">
                                <div className="w-full  mb-4 mt-6">
                                    <label for="" className="mb-2 dark:text-gray-300">First Name</label>
                                    <input type="text"
                                        className="mt-2 p-4 w-full border-2 rounded-lg dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
                                        placeholder="First Name" />
                                </div>
                                <div className="w-full  mb-4 lg:mt-6">
                                    <label for="" className=" dark:text-gray-300">Last Name</label>
                                    <input type="text"
                                        className="mt-2 p-4 w-full border-2 rounded-lg dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
                                        placeholder="Last Name" />
                                </div>
                            </div>

                            <div className="flex flex-col lg:flex-row  gap-2 justify-center w-full">
                                <div className="w-full">
                                    <h3 className="dark:text-gray-300 mb-2">Location</h3>
                                    <input type="text"
                                        className="text-grey p-4 w-full border-2 rounded-lg dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800" />
                                </div>
                                <div className="w-full">
                                    <h3 className="dark:text-gray-300 mb-2">Date Of Birth</h3>
                                    <input type="date"
                                        className="text-grey p-4 w-full border-2 rounded-lg dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800" />
                                </div>
                            </div>
                            <div className="w-full rounded-lg bg-blue-500 mt-4 text-white text-lg font-semibold">
                                <button type="submit" className="w-full p-4">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Profile