"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import { PlusCircle, Search, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { getAllStudents, getStudentGroups, getStudentFeeInfo, getAllGroups } from "@/lib/data-service";
import { Student, Group, Fee } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

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
      
      // 2. Create user account for the student
      const { error: userError } = await supabase
        .from('users')
        .insert([{
          username: firstName.toLowerCase(),
          pin: pin,
          role: 'student',
          student_id: studentData.id
        }]);
      
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
      setIsExemptFromFees(false);
      setSelectedGroupIds([]);
      setIsDialogOpen(false);
      
      // Reload student list
      const allStudents = await getAllStudents();
      setStudents(allStudents);
      setFilteredStudents(allStudents);
      
    } catch (error: any) {
      console.error("Error registering student:", error);
      toast({
        title: "Registration failed",
        description: error.message || "There was an error registering the student.",
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
                      {student.first_name} {student.last_name}
                    </TableCell>
                    <TableCell>{student.phone || "+1(000) 000-0000"}</TableCell>
                    <TableCell className="max-w-md truncate">
                      {formatGroupsString(studentGroups[student.id] || [])}
                    </TableCell>
                    <TableCell>
                      <Badge variant={studentFees[student.id] ? "default" : "outline"} className={studentFees[student.id] ? "bg-red-500" : ""}>
                        {formatFeePaidUntil(studentFees[student.id])}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" className="text-blue-500">
                          <Pencil size={18} />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <Trash2 size={18} />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-green-500">
                          <PlusCircle size={18} />
                        </Button>
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