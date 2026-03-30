// import React, { useEffect, useState } from 'react';
// import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import api from './services/api';
// import MainLayout from './layouts/MainLayout';
// import Login from "./components/auth/Login";
// import ForgotPassword from "./components/auth/Forgotpassword";
// import DashboardLayout from "./components/DashboardLayout/DashboardLayout";
// import HomePage from './pages/Home';

// // Dashboard pages
// import AdminDashboard from "./pages/Admin/AdminDashboard";
// import OwnerDashboard from "./pages/Owner/OwnerDashboard";
// import ManagerDashboard from "./pages/Manager/ManagerDashboard";
// import SalesDashboard from "./pages/Salesperson/SalesDashboard";
// import ScannerDashboard from './pages/QR Scanner/ScannerDashboard';
// import CustomerDashboard from './pages/Customer/CustomerDashboard';

// // Protected Route Component
// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   allowedRoles?: string[];
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
//   const location = useLocation();

//   // Get user from storage
//   const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
//   const user = userStr ? JSON.parse(userStr) : null;

//   console.log('ProtectedRoute - Path:', location.pathname, 'User:', user?.role);

//   // If no user, redirect to login
//   if (!user) {
//     console.log('No user found, redirecting to login');
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // Check role if specified
//   if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
//     console.log(`Role ${user.role} not allowed, redirecting to home`);
//     return <Navigate to="/" replace />;
//   }

//   return <>{children}</>;
// };

// function App() {
//   const location = useLocation();
//   const [serverStatus, setServerStatus] = useState<'checking' | 'connected' | 'error'>('checking');

//   console.log('Current path:', location.pathname);

//   useEffect(() => {
//     checkServer();
//   }, []);




//   const checkServer = async () => {
//     try {
//       // Try to connect to backend health endpoint
//       const response = await api.get('/health');
//       console.log('Server response:', response.data);
//       setServerStatus('connected');
//     } catch (error) {
//       console.error('Server connection error:', error);
//       setServerStatus('error');
//     }
//   };

//   const retryConnection = () => {
//     setServerStatus('checking');
//     checkServer();
//   };


//   // Show server check screen while checking
//   if (serverStatus === 'checking') {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-primary/10 to-theater/10 flex items-center justify-center">
//         <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
//           <h1 className="text-4xl font-bold text-theater mb-6 text-center">
//             🎭 TheaterHUB
//           </h1>
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto"></div>
//             <p className="mt-4 text-gray-600">Connecting to server...</p>
//             <p className="text-sm text-gray-400 mt-2">Please wait</p>
//           </div>
//         </div>
//       </div>
//     );
//   }


//   // Show error screen if server not connected
//   if (serverStatus === 'error') {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
//         <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
//           <h1 className="text-4xl font-bold text-theater mb-6 text-center">
//             🎭 TheaterHUB
//           </h1>
//           <div className="bg-red-50 p-6 rounded-xl text-center">
//             <span className="text-5xl mb-4 block">❌</span>
//             <h2 className="text-xl font-semibold text-red-800 mb-2">
//               Cannot Connect to Server
//             </h2>
//             <p className="text-red-700 mb-4">
//               Make sure backend is running on port 5000
//             </p>
//             <button
//               onClick={retryConnection}
//               className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
//             >
//               Retry Connection
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }



//   // Server is connected - show the actual app with routes
//   return (
//     <Routes>
//       {/* Public routes with MainLayout (Header + Footer) */}
//       <Route path="/" element={<MainLayout />}>
//         <Route index element={<HomePage />} />
//       </Route>

//       {/* Auth routes - no MainLayout */}
//       <Route path="/login" element={<Login />} />
//       <Route path="/forgot-password" element={<ForgotPassword />} />

//       {/* Admin Routes */}
//       <Route
//         path="/admin"
//         element={
//           <ProtectedRoute allowedRoles={['admin']}>
//             <DashboardLayout />
//           </ProtectedRoute>
//         }
//       >
//         <Route index element={<AdminDashboard />} />
//         <Route path="dashboard" element={<AdminDashboard />} />
//       </Route>

//       {/* Theater Owner Routes */}
//       <Route
//         path="/owner"
//         element={
//           <ProtectedRoute allowedRoles={['theater_owner', 'admin']}>
//             <DashboardLayout />
//           </ProtectedRoute>
//         }
//       >
//         <Route index element={<OwnerDashboard />} />
//         <Route path="dashboard" element={<OwnerDashboard />} />
//       </Route>

//       {/* Theater Manager Routes */}
//       <Route
//         path="/manager"
//         element={
//           <ProtectedRoute allowedRoles={['manager', 'theater_owner', 'admin']}>
//             <DashboardLayout />
//           </ProtectedRoute>
//         }
//       >
//         <Route index element={<ManagerDashboard />} />
//         <Route path="dashboard" element={<ManagerDashboard />} />
//       </Route>

//       {/* Salesperson Routes */}
//       <Route
//         path="/sales"
//         element={
//           <ProtectedRoute allowedRoles={['salesperson', 'manager', 'theater_owner', 'admin']}>
//             <DashboardLayout />
//           </ProtectedRoute>
//         }
//       >
//         <Route index element={<SalesDashboard />} />
//         <Route path="dashboard" element={<SalesDashboard />} />
//       </Route>

//       {/* Scanner Routes */}
//       <Route
//         path="/scanner"
//         element={
//           <ProtectedRoute allowedRoles={['scanner', 'manager', 'theater_owner', 'admin']}>
//             <DashboardLayout />
//           </ProtectedRoute>
//         }
//       >
//         <Route index element={<ScannerDashboard />} />
//         <Route path="dashboard" element={<ScannerDashboard />} />
//       </Route>

//       {/* Customer Routes */}
//       <Route
//         path="/customer"
//         element={
//           <ProtectedRoute allowedRoles={['customer']}>
//             <DashboardLayout />
//           </ProtectedRoute>
//         }
//       >
//         <Route index element={<CustomerDashboard />} />
//         <Route path="dashboard" element={<CustomerDashboard />} />
//         <Route path="wallet" element={<CustomerDashboard />} />
//         <Route path="my-tickets" element={<CustomerDashboard />} />
//         <Route path="settings" element={<CustomerDashboard />} />
//       </Route>

//       {/* Redirect any unknown routes to home */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }

// export default App;


import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/Forgotpassword";
import DashboardLayout from "./components/DashboardLayout/DashboardLayout";
import HomePage from './pages/Home';
import Blogs from "./pages/Blog"
import About from "./pages/About";
import Help from "./pages/Help";
import Contact from "./pages/Contact";
import TheaterRegistration from './pages/TheaterRegistration';
import TermsOfService from './pages/Legal/TermsOfService';
import PrivacyPolicy from './pages/Legal/PrivacyPolicy';
import CookiePolicy from './pages/Legal/CookiePolicy';
// Dashboard pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import OwnerDashboard from "./pages/Owner/OwnerDashboard";
import ManagerDashboard from "./pages/Manager/ManagerDashboard";
import SalesDashboard from "./pages/Salesperson/SalesDashboard";
import ScannerDashboard from './pages/QR Scanner/ScannerDashboard';
import CustomerDashboard from './pages/Customer/CustomerDashboard';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const location = useLocation();

  // Get user from storage
  const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  console.log('ProtectedRoute - Path:', location.pathname, 'User:', user?.role);

  // If no user, redirect to login
  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role if specified
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log(`Role ${user.role} not allowed for path ${location.pathname}, redirecting to home`);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Public Route Component - prevents logged-in users from accessing login page
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // If user is logged in, redirect to their dashboard
  if (user) {
    console.log('User already logged in, redirecting from login to dashboard');
    const dashboardPath = getDashboardPath(user.role);
    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
};

// Helper function to get dashboard path based on role
const getDashboardPath = (role: string): string => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'theater_owner':
      return '/owner/dashboard';
    case 'manager':
      return '/manager/dashboard';
    case 'salesperson':
      return '/sales/dashboard';
    case 'scanner':
      return '/scanner/dashboard';
    case 'customer':
      return '/customer/dashboard';
    default:
      return '/';
  }
};

function App() {
  const location = useLocation();

  console.log('Current path:', location.pathname);

  // Server is connected - show the actual app with routes
  return (
    <Routes>
      {/* Public routes - accessible to everyone */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="about" element={<About />} />
        <Route path="help" element={<Help />} />
        <Route path="contact" element={<Contact />} />
        <Route path="account" element={<TheaterRegistration />} />
        <Route path="terms" element={<TermsOfService />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="cookies" element={<CookiePolicy />} />





      </Route>

      {/* Auth routes - only accessible when NOT logged in */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>

      {/* Theater Owner Routes */}
      <Route
        path="/owner/*"
        element={
          <ProtectedRoute allowedRoles={['theater_owner', 'admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<OwnerDashboard />} />
        <Route path="dashboard" element={<OwnerDashboard />} />
      </Route>

      {/* Theater Manager Routes */}
      <Route
        path="/manager/*"
        element={
          <ProtectedRoute allowedRoles={['manager', 'theater_owner', 'admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ManagerDashboard />} />
        <Route path="dashboard" element={<ManagerDashboard />} />
      </Route>

      {/* Salesperson Routes */}
      <Route
        path="/sales/*"
        element={
          <ProtectedRoute allowedRoles={['salesperson', 'manager', 'theater_owner', 'admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<SalesDashboard />} />
        <Route path="dashboard" element={<SalesDashboard />} />
      </Route>

      {/* Scanner Routes */}
      <Route
        path="/scanner/*"
        element={
          <ProtectedRoute allowedRoles={['scanner', 'manager', 'theater_owner', 'admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ScannerDashboard />} />
        <Route path="dashboard" element={<ScannerDashboard />} />
      </Route>

      {/* Customer Routes */}
      <Route
        path="/customer/*"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CustomerDashboard />} />
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="wallet" element={<CustomerDashboard />} />
        <Route path="my-tickets" element={<CustomerDashboard />} />
        <Route path="settings" element={<CustomerDashboard />} />
      </Route>

      {/* Redirect any unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;