export default function Footer() {
  return (
    <div className="w-full bg-[#697077] text-white">
      <div
        id="footer-content"
        className="flex flex-col h-full justify-between items-center p-15 text-[14px]"
      >
        <div
          id="footer-information"
          className="w-full flex flex-row justify-between mb-14"
        >
          <div className="flex flex-row gap-8">
            <div className="flex flex-col gap-1">
              <p>Viral</p>
              <p className="font-bold">Product owner</p>
            </div>
            <div className="grid grid-flow-row grid-cols-4 gap-8">
              <div className="flex flex-col gap-1">
                <p>Mikala</p>
                <p className="font-bold">Scrum Master</p>
              </div>
              <div className="flex flex-col gap-1">
                <p>Vartika</p>
                <p className="font-bold">UX/UI Designer</p>
              </div>
              <div className="flex flex-col gap-1">
                <p>Henry</p>
                <p className="font-bold">Developer</p>
              </div>
              <div className="flex flex-col gap-1">
                <p>Claire</p>
                <p className="font-bold">Developer</p>
              </div>
              <div className="flex flex-col gap-1">
                <p>Omowumi</p>
                <p className="font-bold">Shadow SM</p>
              </div>
              <div className="flex flex-col gap-1">
                <p>Khushali</p>
                <p className="font-bold">UX/UI Designer</p>
              </div>
              <div className="flex flex-col gap-1">
                <p>Christine</p>
                <p className="font-bold">Developer</p>
              </div>
              <div className="flex flex-col gap-1">
                <p>Rel</p>
                <p className="font-bold">Developer</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <img src="./public/static/images/github 1.png" alt="github logo" />
            <p>Github repo</p>
          </div>
        </div>
        <hr className="border-white w-full mb-10" />
        <div id="footer-trademark">Lumo @ 2024. All rights reserved.</div>
      </div>
    </div>
  );
}
