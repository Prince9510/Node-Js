
export default function Footer() {
  return (
    <footer className="bg-gray-800 w-full text-white py-6 mt-8">
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Employee Management System</h3>
          <p className="text-sm">© 2025 All rights reserved.</p>
        </div>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
          <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
          <a href="#" className="text-gray-400 hover:text-white">Contact Us</a>
        </div>
      </div>
    </div>
  </footer>
  )
}
