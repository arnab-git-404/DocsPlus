"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import toast from 'react-hot-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar,
  Shield,
  Lock,
  Edit2,
  Save,
  X,
  Camera,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  joinDate: Date;
  avatar?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    joinDate: new Date(),
    avatar: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Fetch user profile
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/me');
      
      if (response.ok) {
        const data = await response.json();
        setProfile({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone || '',
          role: data.user.role,
          department: data.user.department || '',
          address: data.user.address || '',
          city: data.user.city || '',
          state: data.user.state || '',
          pincode: data.user.pincode || '',
          joinDate: data.user.joinDate,
          avatar: data.user.avatar || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {

    const toastId = toast.loading("Updating profile...");

    try {
      setLoading(true);
      setMessage(null);

      const response = await fetch('/api/employee/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          department: profile.department,
          address: profile.address,
          city: profile.city,
          state: profile.state,
          pincode: profile.pincode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
        fetchProfile();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
      }
          toast.success("Profile updated successfully!", { id: toastId });
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });

          toast.error("Failed to update profile!", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

//   const handleChangePassword = async () => {
//     try {
//       setLoading(true);
//       setMessage(null);

//       if (passwordData.newPassword !== passwordData.confirmPassword) {
//         setMessage({ type: 'error', text: 'Passwords do not match' });
//         setLoading(false);
//         return;
//       }

//       if (passwordData.newPassword.length < 6) {
//         setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
//         setLoading(false);
//         return;
//       }

//       const response = await fetch('/api/auth/change-password', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           currentPassword: passwordData.currentPassword,
//           newPassword: passwordData.newPassword,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage({ type: 'success', text: 'Password changed successfully!' });
//         setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
//       } else {
//         setMessage({ type: 'error', text: data.error || 'Failed to change password' });
//       }
//     } catch (error) {
//       setMessage({ type: 'error', text: 'An error occurred' });
//     } finally {
//       setLoading(false);
//     }
//   };

const handleRequestPasswordReset = async () => {
    const toastId = toast.loading("Sending password reset link...");

  try {
    setLoading(true);
    setMessage(null);

    const response = await fetch('/api/auth/password/request-reset-password', {
      method: 'POST',
    });

    const data = await response.json();

    if (response.ok) {
      setMessage({ 
        type: 'success', 
        text: 'Password reset link sent to your email. Please check your inbox.' 
      });
    } else {
      setMessage({ type: 'error', text: data.error || 'Failed to send reset link' });
    }
        toast.success(`Password reset link sent to your email. Please check your inbox OR Spam.`, { id: toastId });

  } catch (error) {
    setMessage({ type: 'error', text: 'An error occurred' });
        toast.error("Failed to send password reset link!", { id: toastId });

  } finally {
    setLoading(false);
  }
};

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 border-2 p-6 rounded-lg shadow-sm">
          <div className="relative group">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-white shadow-lg">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl sm:text-4xl">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold ">{profile.name}</h1>
            <p className="text-gray-400 mt-1">{profile.email}</p>
            <div className="flex flex-wrap items-center gap-3 mt-3 justify-center sm:justify-start">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                <Shield className="h-4 w-4" />
                {profile.role}
              </span>
              {profile.department && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  <Briefcase className="h-4 w-4" />
                  Department: {profile.department}
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <Calendar className="h-4 w-4" />
                Joining Date: {new Date(profile.joinDate).toLocaleDateString('en-IN')}
              </span>
            </div>
          </div>

          {!isEditing && (
            <Button 
              onClick={() => setIsEditing(true)} 
              className='hover:cursor-pointer'
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        {/* Message Alert */}
        {message && (
          <Alert className={message.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
            {message.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {/* Tabs Section */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
            <TabsTrigger value="personal" className="flex items-center gap-2 hover:cursor-pointer ">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Personal Info</span>
              <span className="sm:hidden">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2 hover:cursor-pointer">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
              <span className="sm:hidden">Security</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2 hidden lg:flex">
              <Shield className="h-4 w-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="disabled:bg-gray-50"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profile.email}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={profile.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="disabled:bg-gray-50"
                      placeholder="+91 1234567890"
                    />
                  </div>

                  {/* Department */}
                  <div className="space-y-2">
                    <Label htmlFor="department" className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                      Department
                    </Label>
                    <Input
                      id="department"
                      name="department"
                      value={profile.department}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="disabled:bg-gray-50"
                      placeholder="Sales"
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      Address
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={profile.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="disabled:bg-gray-50"
                      placeholder="Street Address"
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={profile.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="disabled:bg-gray-50"
                      placeholder="Darbhanga"
                    />
                  </div>

                  {/* State */}
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={profile.state}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="disabled:bg-gray-50"
                      placeholder="Bihar"
                    />
                  </div>

                  {/* Pincode */}
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={profile.pincode || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="disabled:bg-gray-50"
                      placeholder="846004"
                    />
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      name="role"
                      value={profile.role}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="flex-1 "
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        fetchProfile();
                      }}
                      disabled={loading}
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          {/* <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="Enter new password (min 6 characters)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                  />
                </div>

                <Button
                  onClick={handleChangePassword}
                  disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {loading ? 'Changing Password...' : 'Change Password'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent> */}

        
            {/* Security Tab */}
<TabsContent value="security">
  <Card>
    <CardHeader>
      <CardTitle>Password & Security</CardTitle>
      <CardDescription>
        Manage your account security settings
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="border rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Password</h3>
            <p className="text-sm text-gray-600 mb-4">
              Reset your password via a secure link sent to your email
            </p>
            <Button
              onClick={handleRequestPasswordReset}
              disabled={loading}
              variant="outline"
              className="w-full sm:w-auto hover:cursor-pointer"
            >
              <Lock className="h-4 w-4 mr-2" />
              {loading ? 'Sending Link...' : 'Send Reset Link'}
            </Button>
          </div>
          <div className="text-green-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-600 mb-4">
              Add an extra layer of security to your account
            </p>
            <Button variant="outline" disabled className="w-full sm:w-auto">
              <Shield className="h-4 w-4 mr-2" />
              Coming Soon
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</TabsContent>


          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Manage your account preferences and settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Preferences settings coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}