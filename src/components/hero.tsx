export default function Hero() {
  return (
    <>
      <div className="w-full h-screen bg-[#ECECEC] flex flex-row justify-between px-40 gap-4">
        <div className="w-1/2 h-full flex flex-col justify-center">
          <div id="hero-text" className="flex flex-col justify-center">
            <h1 className="text-[70px] font-[1000] mb-20">
              Track Surgery Patient Status in Real-Time
            </h1>
            <div className="text-xl/9 mb-10">
              <p className="font-bold">Stay informed. Stay reassured.</p>
              <p>
                Surgical procedures can be stressful for loved ones waiting
                nearby. Lumo helps reduce that anxiety by showing real-time
                patient progress from check-in to recovery, on an
                easy-to-understand display.
              </p>
            </div>
          </div>
          <div className="flex flex-row gap-4 text-2xl">
            <button className="bg-[#555555] text-white rounded-[12px] py-[16px] px-[19px] flex flex-row gap-6">
              Authorization login
              <img
                src="./public/static/images/arrow.png"
                alt=""
                className="p-2"
              />
            </button>
            <button className="border outline-[1.5px] border-[#555555] text-[#555555] rounded-[12px] py-2 px-4">
              Guest access
            </button>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <img src="./public/static/images/desktop.png" alt="" />
        </div>
      </div>
    </>
  );
}
