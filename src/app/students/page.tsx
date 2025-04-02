"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { PlusCircle, Search, Trash2, Eye, EyeOff, AlertTriangle, MinusCircle, Phone, User, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { getAllStudents, getStudentGroups, getStudentFeeInfo, getAllGroups, deleteStudent, updateFeePaidUntil, createStudentFeeRecord, updateStudentProfile, updateUsername, updateStudentGroups } from "@/lib/data-service";
import { Student, Group, Fee } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [studentGroups, setStudentGroups] = useState<Record<string, Group[]>>({});
  const [studentFees, setStudentFees] = useState<Record<string, Fee | null>>({});
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // New student form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [isExemptFromFees, setIsExemptFromFees] = useState(false);
  const [availableGroups, setAvailableGroups] = useState<Group[]>([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingFee, setIsUpdatingFee] = useState<Record<string, boolean>>({});
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentUsername, setStudentUsername] = useState("");
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [editingPhone, setEditingPhone] = useState("");
  const [savingPhone, setSavingPhone] = useState(false);
  const [editingFirstName, setEditingFirstName] = useState("");
  const [editingLastName, setEditingLastName] = useState("");
  const [editingUsername, setEditingUsername] = useState("");
  const [savingUserInfo, setSavingUserInfo] = useState(false);
  const [editModalGroups, setEditModalGroups] = useState<string[]>([]);
  const [savingGroups, setSavingGroups] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const allStudents = await getAllStudents();
        setStudents(allStudents);
        setFilteredStudents(allStudents);
        
        // Fetch groups for each student
        const groupsData: Record<string, Group[]> = {};
        const feesData: Record<string, Fee | null> = {};
        
        for (const student of allStudents) {
          const groups = await getStudentGroups(student.id);
          groupsData[student.id] = groups;
          
          const feeInfo = await getStudentFeeInfo(student.id);
          feesData[student.id] = feeInfo;
        }
        
        setStudentGroups(groupsData);
        setStudentFees(feesData);
      } catch (error) {
        console.error("Error fetching students data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Fetch all available groups when the dialog opens
  useEffect(() => {
    if (isDialogOpen) {
      const fetchGroups = async () => {
        try {
          const groups = await getAllGroups();
          setAvailableGroups(groups);
        } catch (error) {
          console.error("Error fetching groups:", error);
        }
      };
      fetchGroups();
    }
  }, [isDialogOpen]);

  // Also load available groups when profile modal opens
  useEffect(() => {
    if (profileModalOpen) {
      const fetchGroups = async () => {
        try {
          const groups = await getAllGroups();
          setAvailableGroups(groups);
        } catch (error) {
          console.error("Error fetching groups:", error);
        }
      };
      fetchGroups();
    }
  }, [profileModalOpen]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = students.filter(
        (student) =>
          `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.phone?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchQuery, students]);

  const formatGroupsString = (groups: Group[]) => {
    if (!groups || groups.length === 0) return "No groups";
    return groups.map(group => group.name).join(", ");
  };

  const getFeeStatusColor = (fee: Fee | null) => {
    if (!fee) return "";
    
    const today = new Date();
    const paidUntil = new Date(fee.paid_until);
    
    // Get current month and year
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const paidMonth = paidUntil.getMonth();
    const paidYear = paidUntil.getFullYear();
    
    // Create dates using only year and month for comparison
    const currentYearMonth = new Date(currentYear, currentMonth);
    const paidYearMonth = new Date(paidYear, paidMonth);
    
    // Current month (yellow)
    if (paidMonth === currentMonth && paidYear === currentYear) {
      return "bg-yellow-500 hover:bg-yellow-600";
    }
    
    // Past due (red)
    if (paidYearMonth < currentYearMonth) {
      return "bg-red-500 hover:bg-red-600";
    }
    
    // Future months (green)
    return "bg-green-500 hover:bg-green-600";
  };

  const formatFeePaidUntil = (fee: Fee | null) => {
    if (!fee) return "—";
    
    const date = new Date(fee.paid_until);
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    
    return `${month} ${year}`;
  };

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    // Strip all non-numeric characters and remove the +1 prefix if exists
    const numericValue = value.replace(/\D/g, '');
    
    // Return empty string if no input
    if (!numericValue) return '';
    
    // Format the number based on length
    if (numericValue.length <= 3) {
      return `+1(${numericValue}`;
    } else if (numericValue.length <= 6) {
      return `+1(${numericValue.slice(0, 3)}) ${numericValue.slice(3)}`;
    } else {
      return `+1(${numericValue.slice(0, 3)}) ${numericValue.slice(3, 6)}-${numericValue.slice(6, 10)}`;
    }
  };

  // Handle phone input change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any +1 prefix before formatting to prevent duplicates
    const valueWithoutPrefix = e.target.value.replace(/^\+1/, '');
    const formattedValue = formatPhoneNumber(valueWithoutPrefix);
    setContactNumber(formattedValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !contactNumber || !pin) {
      toast({
        title: "Missing required fields",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // 1. Insert the student record
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .insert([{
          first_name: firstName,
          last_name: lastName,
          phone: contactNumber,
          enrollment_date: new Date().toISOString(),
          status: 'active'
        }])
        .select()
        .single();
      
      if (studentError) throw studentError;
      
      // First try using just the first name as username
      let { error: userError } = await supabase
        .from('users')
        .insert([{
          username: firstName.toLowerCase(),
          pin: pin,
          role: 'student',
          student_id: studentData.id
        }]);
      
      // If there's an error and it's about duplicate username, use firstName + phone digits
      if (userError && userError.code === '23505') { // Unique constraint violation
        // Extract last 4 digits from phone number for unique username
        const phoneDigits = contactNumber.replace(/\D/g, '');
        const last4Digits = phoneDigits.slice(-4);
        const uniqueUsername = `${firstName.toLowerCase()}_${last4Digits}`;
        
        // Try with the unique username
        const { error: retryError } = await supabase
          .from('users')
          .insert([{
            username: uniqueUsername,
            pin: pin,
            role: 'student',
            student_id: studentData.id
          }]);
          
        // Update userError to the latest error (or null if successful)
        userError = retryError;
      }
      
      if (userError) throw userError;
      
      // 3. Add student to the selected groups
      if (selectedGroupIds.length > 0) {
        const groupInserts = selectedGroupIds.map(groupId => ({
          student_id: studentData.id,
          group_id: groupId,
          joined_at: new Date().toISOString()
        }));
        
        const { error: groupError } = await supabase
          .from('student_groups')
          .insert(groupInserts);
          
        if (groupError) throw groupError;
      }
      
      // 4. Handle fee exempt status if needed
      if (isExemptFromFees) {
        const { error: feeError } = await supabase
          .from('fee_exemptions')
          .insert([{
            student_id: studentData.id,
            is_exempt: true,
            reason: 'Admin exemption'
          }]);
          
        if (feeError) throw feeError;
      } else {
        // Create fee record
        const success = await createStudentFeeRecord(studentData.id);
        
        if (!success) {
          throw new Error("Failed to create fee record");
        }
      }
      
      // Success! Refresh the student list
      toast({
        title: "Student registered",
        description: `${firstName} ${lastName} has been successfully registered.`
      });
      
      // Reset form
      setFirstName("");
      setLastName("");
      setContactNumber("");
      setPin("");
      setShowPin(false);
      setIsExemptFromFees(false);
      setSelectedGroupIds([]);
      setIsDialogOpen(false);
      
      // Refresh students data
      const allStudents = await getAllStudents();
      setStudents(allStudents);
      setFilteredStudents(allStudents);
      
      // Fetch groups for new student
      const groups = await getStudentGroups(studentData.id);
      setStudentGroups(prev => ({
        ...prev,
        [studentData.id]: groups
      }));
      
      // Fetch fee info for new student
      const feeInfo = await getStudentFeeInfo(studentData.id);
      setStudentFees(prev => ({
        ...prev,
        [studentData.id]: feeInfo
      }));
    } catch (error: Error | unknown) {
      console.error("Error registering student:", error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "There was an error registering the student.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleGroup = (groupId: string) => {
    setSelectedGroupIds(current => 
      current.includes(groupId)
        ? current.filter(id => id !== groupId)
        : [...current, groupId]
    );
  };

  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;
    
    try {
      setIsDeleting(true);
      
      const success = await deleteStudent(studentToDelete.id);
      
      if (success) {
        toast({
          title: "Student deleted",
          description: `${studentToDelete.first_name} ${studentToDelete.last_name} has been successfully deleted.`,
        });
        
        // Update the student list
        setStudents(students.filter(s => s.id !== studentToDelete.id));
        setFilteredStudents(filteredStudents.filter(s => s.id !== studentToDelete.id));
      } else {
        throw new Error("Failed to delete student");
      }
    } catch (error: Error | unknown) {
      console.error("Error deleting student:", error);
      toast({
        title: "Deletion failed",
        description: error instanceof Error ? error.message : "There was an error deleting the student.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
    }
  };

  const handleFeePeriodUpdate = async (feeId: string, studentId: string, months: number) => {
    if (!feeId) return;
    
    try {
      setIsUpdatingFee(prev => ({ ...prev, [studentId]: true }));
      
      const success = await updateFeePaidUntil(feeId, months);
      
      if (success) {
        // Refresh the fee data for this student
        const updatedFeeInfo = await getStudentFeeInfo(studentId);
        setStudentFees(prev => ({
          ...prev,
          [studentId]: updatedFeeInfo
        }));
        
        toast({
          title: "Fee status updated",
          description: `Fee period has been ${months > 0 ? "increased" : "decreased"} by ${Math.abs(months)} month${Math.abs(months) !== 1 ? 's' : ''}.`,
        });
      } else {
        toast({
          title: "Error updating fee status",
          description: "There was a problem updating the fee payment period.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating fee period:", error);
      toast({
        title: "Error updating fee status",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingFee(prev => ({ ...prev, [studentId]: false }));
    }
  };

  const handleOpenProfile = async (student: Student) => {
    setSelectedStudent(student);
    setEditingFirstName(student.first_name);
    setEditingLastName(student.last_name);
    setEditingPhone(student.phone || "");
    
    // Get groups for the modal
    const groups = await getStudentGroups(student.id);
    setEditModalGroups(groups.map(g => g.id));
    
    // Get student username
    try {
      const { data, error } = await supabase
        .from('users')
        .select('username')
        .eq('student_id', student.id)
        .single();
        
      if (!error && data) {
        setStudentUsername(data.username);
        setEditingUsername(data.username);
      } else {
        setStudentUsername("");
        setEditingUsername("");
      }
      
      setProfileModalOpen(true);
    } catch (error) {
      console.error("Error fetching student username:", error);
      setStudentUsername("");
      setEditingUsername("");
      setProfileModalOpen(true);
    }
  };
  
  const handleUpdatePhone = async () => {
    if (!selectedStudent) return;
    
    try {
      setSavingPhone(true);
      const success = await updateStudentProfile(selectedStudent.id, { phone: editingPhone });
      
      if (success) {
        // Update the local state
        setStudents(students.map(s => 
          s.id === selectedStudent.id ? { ...s, phone: editingPhone } : s
        ));
        setFilteredStudents(filteredStudents.map(s => 
          s.id === selectedStudent.id ? { ...s, phone: editingPhone } : s
        ));
        setSelectedStudent(prev => prev ? { ...prev, phone: editingPhone } : null);
        
        toast({
          title: "Success",
          description: "Phone number updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update phone number",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating phone:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setSavingPhone(false);
    }
  };

  const handleUpdateUserInfo = async () => {
    if (!selectedStudent) return;
    
    try {
      setSavingUserInfo(true);
      
      // Update name if changed
      if (editingFirstName !== selectedStudent.first_name || editingLastName !== selectedStudent.last_name) {
        const nameUpdateSuccess = await updateStudentProfile(selectedStudent.id, { 
          first_name: editingFirstName,
          last_name: editingLastName 
        });
        
        if (nameUpdateSuccess) {
          // Update local state
          setStudents(students.map(s => 
            s.id === selectedStudent.id 
              ? { ...s, first_name: editingFirstName, last_name: editingLastName } 
              : s
          ));
          setFilteredStudents(filteredStudents.map(s => 
            s.id === selectedStudent.id 
              ? { ...s, first_name: editingFirstName, last_name: editingLastName } 
              : s
          ));
          setSelectedStudent(prev => prev ? { ...prev, first_name: editingFirstName, last_name: editingLastName } : null);
        } else {
          toast({
            title: "Error",
            description: "Failed to update name",
            variant: "destructive",
          });
          return;
        }
      }
      
      // Update username if changed
      if (editingUsername !== studentUsername) {
        const usernameUpdateSuccess = await updateUsername(selectedStudent.id, editingUsername);
        
        if (usernameUpdateSuccess) {
          setStudentUsername(editingUsername);
          toast({
            title: "Success",
            description: "Username updated successfully",
          });
        } else {
          toast({
            title: "Error",
            description: "This username is already taken or invalid",
            variant: "destructive",
          });
          return;
        }
      }
      
      toast({
        title: "Success",
        description: "Student information updated successfully",
      });
    } catch (error) {
      console.error("Error updating student info:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setSavingUserInfo(false);
    }
  };
  
  const handleUpdateGroups = async () => {
    if (!selectedStudent) return;
    
    try {
      setSavingGroups(true);
      const success = await updateStudentGroups(selectedStudent.id, editModalGroups);
      
      if (success) {
        // Get updated groups
        const updatedGroups = await getStudentGroups(selectedStudent.id);
        
        // Update local state
        setStudentGroups(prev => ({
          ...prev,
          [selectedStudent.id]: updatedGroups
        }));
        
        toast({
          title: "Success",
          description: "Group memberships updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update group memberships",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating groups:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setSavingGroups(false);
    }
  };
  
  const handleToggleModalGroup = (groupId: string) => {
    setEditModalGroups(current => 
      current.includes(groupId)
        ? current.filter(id => id !== groupId)
        : [...current, groupId]
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle size={18} />
              Register Student
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Register Student</DialogTitle>
              <DialogDescription>
                Enter the details of the new student below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input 
                  id="contactNumber" 
                  placeholder="+1(###) ###-####"
                  value={contactNumber}
                  onChange={handlePhoneChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="groups">Groups</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between"
                    >
                      {selectedGroupIds.length === 0 
                        ? "Select groups" 
                        : `${selectedGroupIds.length} group${selectedGroupIds.length > 1 ? 's' : ''} selected`}
                      <PlusCircle size={16} className="ml-2" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <div className="p-4 max-h-[300px] overflow-y-auto">
                      {availableGroups.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No groups available</p>
                      ) : (
                        <div className="space-y-2">
                          {availableGroups.map((group) => (
                            <div key={group.id} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`group-${group.id}`} 
                                checked={selectedGroupIds.includes(group.id)}
                                onCheckedChange={() => handleToggleGroup(group.id)}
                              />
                              <Label htmlFor={`group-${group.id}`} className="flex-1 cursor-pointer">
                                {group.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pin">PIN (1-9 digits)</Label>
                <div className="relative">
                  <Input 
                    id="pin" 
                    type={showPin ? "text" : "password"} 
                    placeholder="Enter PIN for login"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    maxLength={9}
                    required
                  />
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPin(!showPin)}
                  >
                    {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="fee-exempt" 
                  checked={isExemptFromFees}
                  onCheckedChange={setIsExemptFromFees}
                />
                <Label htmlFor="fee-exempt">Mark this student as exempt from fees</Label>
              </div>
              
              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registering..." : "Register Student"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <div className="relative w-[300px]">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or contact"
            className="pl-8"
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Student Profile Modal */}
      <Dialog open={profileModalOpen} onOpenChange={setProfileModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Student Profile</DialogTitle>
            <DialogDescription>
              View and manage student information
            </DialogDescription>
          </DialogHeader>
          
          {selectedStudent && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div>
                  <Avatar className="h-32 w-32">
                    {(selectedStudent as Student & { profile_image_url?: string }).profile_image_url ? (
                      <AvatarImage src={(selectedStudent as Student & { profile_image_url?: string }).profile_image_url} alt={`${selectedStudent.first_name} ${selectedStudent.last_name}`} />
                    ) : (
                      <AvatarFallback className="text-4xl">
                        <UserCircle2 className="h-16 w-16" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Label htmlFor="username">Username</Label>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        id="username"
                        placeholder="Enter username"
                        value={editingUsername}
                        onChange={(e) => setEditingUsername(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                
                  <div>
                    <h3 className="font-medium flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" /> Full Name
                    </h3>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Input
                        placeholder="First name"
                        value={editingFirstName}
                        onChange={(e) => setEditingFirstName(e.target.value)}
                      />
                      <Input
                        placeholder="Last name"
                        value={editingLastName}
                        onChange={(e) => setEditingLastName(e.target.value)}
                      />
                    </div>
                    <div className="mt-2">
                      <Button 
                        onClick={handleUpdateUserInfo}
                        disabled={savingUserInfo}
                        size="sm"
                      >
                        {savingUserInfo ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="phone">Phone Number</Label>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        id="phone"
                        placeholder="Enter phone number"
                        value={editingPhone}
                        onChange={(e) => setEditingPhone(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleUpdatePhone}
                        disabled={savingPhone}
                        size="sm"
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium flex items-center gap-2 mb-4 text-muted-foreground">
                  <UsersRound className="h-4 w-4" /> Groups
                </h3>
                
                <div className="mb-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-between"
                      >
                        Manage Groups
                        <PlusCircle size={16} className="ml-2" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="start">
                      <div className="p-4 max-h-[300px] overflow-y-auto">
                        {availableGroups.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No groups available</p>
                        ) : (
                          <div className="space-y-2">
                            {availableGroups.map((group) => (
                              <div key={group.id} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`modal-group-${group.id}`} 
                                  checked={editModalGroups.includes(group.id)}
                                  onCheckedChange={() => handleToggleModalGroup(group.id)}
                                />
                                <Label htmlFor={`modal-group-${group.id}`} className="flex-1 cursor-pointer">
                                  {group.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="border-t p-3 flex justify-end">
                        <Button 
                          onClick={handleUpdateGroups}
                          disabled={savingGroups}
                          size="sm"
                        >
                          {savingGroups ? "Saving..." : "Save Groups"}
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {studentGroups[selectedStudent.id] && studentGroups[selectedStudent.id].length > 0 ? (
                    studentGroups[selectedStudent.id].map((group) => (
                      <Badge key={group.id} variant="secondary" className="text-sm py-1">
                        {group.name}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No groups assigned</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="text-center py-8">Loading students data...</div>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NAME</TableHead>
                <TableHead>CONTACT</TableHead>
                <TableHead className="max-w-md">GROUPS</TableHead>
                <TableHead>FEES PAID TILL</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    {students.length === 0
                      ? "No students registered yet. Click 'Register Student' to add one."
                      : "No students match your search query."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      <button 
                        onClick={() => handleOpenProfile(student)}
                        className="hover:underline hover:text-primary cursor-pointer text-left"
                      >
                        {student.first_name} {student.last_name}
                      </button>
                    </TableCell>
                    <TableCell>{student.phone || "+1(000) 000-0000"}</TableCell>
                    <TableCell className="max-w-md truncate">
                      {formatGroupsString(studentGroups[student.id] || [])}
                    </TableCell>
                    <TableCell>
                      {studentFees[student.id] && (
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleFeePeriodUpdate(studentFees[student.id]!.id, student.id, -1)}
                            disabled={isUpdatingFee[student.id]}
                          >
                            <MinusCircle size={14} />
                          </Button>
                          <Badge 
                            variant="default" 
                            className={studentFees[student.id] ? getFeeStatusColor(studentFees[student.id]) : ""}
                          >
                            {formatFeePaidUntil(studentFees[student.id])}
                          </Badge>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleFeePeriodUpdate(studentFees[student.id]!.id, student.id, 1)}
                            disabled={isUpdatingFee[student.id]}
                          >
                            <PlusCircle size={14} />
                          </Button>
                        </div>
                      )}
                      {!studentFees[student.id] && (
                        <Badge>—</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <AlertDialog open={deleteDialogOpen && studentToDelete?.id === student.id} onOpenChange={(open: boolean) => {
                          setDeleteDialogOpen(open);
                          if (!open) setStudentToDelete(null);
                        }}>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-500"
                              onClick={() => {
                                setStudentToDelete(student);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 size={18} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                Delete Student
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {student.first_name} {student.last_name}? This action cannot be undone and will remove all associated data including groups, fees, and attendance records.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                  e.preventDefault();
                                  handleDeleteStudent();
                                }}
                                className="bg-red-500 hover:bg-red-600"
                                disabled={isDeleting}
                              >
                                {isDeleting ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
} 