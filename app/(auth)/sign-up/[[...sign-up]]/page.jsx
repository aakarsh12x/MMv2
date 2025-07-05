import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* MoneyMap Logo - Fixed positioning */}
      <div className="absolute top-8 left-8 z-20 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="text-gray-900 font-bold text-2xl">MoneyMap</span>
        </div>
      </div>
      
      <div className="flex items-center justify-center min-h-screen">
        <SignUp fallbackRedirectUrl="/dashboard" />
      </div>
    </div>
  );
}
