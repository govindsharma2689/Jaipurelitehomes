import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';

const LoginModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [userType, setUserType] = useState('user');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Welcome to Jaipur Elite Homes
          </DialogTitle>
        </DialogHeader>

        {activeTab === 'login' && (
          <div className="space-y-4">
            <p className="text-gray-600 text-center">Sign into your account</p>
            <div className="space-y-3">
              <Input type="text" placeholder="Username" className="w-full" />
              <Input type="password" placeholder="Password" className="w-full" />
              <Button className="w-full bg-[#1e88e5] hover:bg-[#1565c0]">Login</Button>
            </div>
            <div className="flex justify-between text-sm">
              <button 
                onClick={() => setActiveTab('register')} 
                className="text-[#1e88e5] hover:underline"
              >
                Register here!
              </button>
              <button 
                onClick={() => setActiveTab('forgot')} 
                className="text-gray-500 hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </div>
        )}

        {activeTab === 'register' && (
          <div className="space-y-4">
            <p className="text-gray-600 text-center">Create an account</p>
            <div className="space-y-3">
              <Input type="text" placeholder="Username" className="w-full" />
              <Input type="email" placeholder="Email" className="w-full" />
              <Input type="password" placeholder="Password" className="w-full" />
              <div>
                <Label className="text-sm text-gray-600">Select User Type</Label>
                <Select value={userType} onValueChange={setUserType}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="agency">Agency</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="terms" 
                  checked={agreedToTerms}
                  onCheckedChange={setAgreedToTerms}
                />
                <Label htmlFor="terms" className="text-sm text-gray-600">
                  I agree with <a href="/terms" className="text-[#1e88e5]">terms & conditions</a>
                </Label>
              </div>
              <Button className="w-full bg-[#1e88e5] hover:bg-[#1565c0]">Register</Button>
            </div>
            <button 
              onClick={() => setActiveTab('login')} 
              className="text-[#1e88e5] hover:underline text-sm block mx-auto"
            >
              Back to login
            </button>
          </div>
        )}

        {activeTab === 'forgot' && (
          <div className="space-y-4">
            <p className="text-gray-600 text-center">Reset Password</p>
            <div className="space-y-3">
              <Input type="email" placeholder="Email" className="w-full" />
              <Button className="w-full bg-[#1e88e5] hover:bg-[#1565c0]">Reset Password</Button>
            </div>
            <button 
              onClick={() => setActiveTab('login')} 
              className="text-[#1e88e5] hover:underline text-sm block mx-auto"
            >
              Back to login
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
