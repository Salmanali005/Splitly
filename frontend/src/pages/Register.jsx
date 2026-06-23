import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../Components/contexts/ThemeContext';
import ThemeToggle from '../Components/common/ThemeToggle';
import Button from '../Components/common/Button';
import Input from '../Components/common/Input';

const Register = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate('/login');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 ${isDark ? 'dark' : ''}`}>
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Hisaab</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Split expenses, simplify life</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Create Account</h2>
          <p className="text-gray-500 dark:text-gray-400 text-center mt-1 text-sm">Start splitting expenses with your friends</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              icon="👤"
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
              icon="📧"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              icon="🔒"
              helper="Must be at least 8 characters long"
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="••••••••"
              icon="✅"
            />

            <div className="flex items-start">
              <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500" required />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                I agree to the{' '}
                <Link to="#" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="#" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link>
              </span>
            </div>

            <Button type="submit" variant="primary" fullWidth loading={loading}>
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-gray-900 dark:text-white hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" fullWidth>
              <span className="mr-2">🔵</span> Google
            </Button>
            <Button variant="secondary" fullWidth>
              <span className="mr-2">⚫</span> GitHub
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;