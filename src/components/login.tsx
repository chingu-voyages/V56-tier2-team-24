export default function Login() {
  return (
    <>
      <div className="w-full bg-[#ECECEC] flex flex-row justify-between outline">
        <div className="h-full py-40"></div>
        <div className="w-1/2 bg-white py-40 flex flex-col justify-center items-center p-30 gap-10">
          <h1 className="w-full">Log In</h1>
          <form className="w-full" action="">
            <div className="flex flex-col">
              <label htmlFor="email">Email Address</label>
              <input
                type="text"
                placeholder=""
                className="bg-gray-100 rounded-[12px] h-10"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password">Password</label>
              <input
                type="text"
                placeholder=""
                className="bg-gray-100 rounded-[12px] h-10"
              />
            </div>
            <div className="flex flex-row justify-between">
              <p>Remember Me</p>
              <p>Forgot Password?</p>
            </div>
            <button className="bg-[#555555] text-white rounded-[12px] py-[13px] w-full">
              Login
            </button>
          </form>
          <div className="flex w-full flex-row gap-3">
            <button className="bg-[#555555] text-white rounded-[12px] py-[13px] w-full">
              Login with Google
            </button>
            <button className="bg-[#555555] text-white rounded-[12px] py-[13px] w-full">
              Login with Apple
            </button>
          </div>
          <hr className="border-[#DDE1E6] w-full mb-10" />
          <p>No account yet? Sign Up</p>
        </div>
      </div>
    </>
  );
}
