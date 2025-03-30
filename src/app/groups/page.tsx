"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { getAllGroups, createGroup, updateGroup, deleteGroup, resetAllData } from "@/lib/data-service";
import { Group } from "@/lib/types";

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [newGroupName, setNewGroupName] = useState("");
  const [editGroupId, setEditGroupId] = useState<string | null>(null);
  const [editGroupName, setEditGroupName] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isResetInProgress, setIsResetInProgress] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const allGroups = await getAllGroups();
      setGroups(allGroups);
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGroup = async () => {
    if (!newGroupName.trim()) return;
    
    try {
      const newGroup = await createGroup(newGroupName.trim());
      if (newGroup) {
        setGroups([...groups, newGroup]);
        setNewGroupName("");
      }
    } catch (error) {
      console.error("Error adding group:", error);
    }
  };

  const handleEditGroup = async () => {
    if (!editGroupId || !editGroupName.trim()) return;
    
    try {
      const updatedGroup = await updateGroup(editGroupId, { name: editGroupName.trim() });
      if (updatedGroup) {
        setGroups(groups.map(group => 
          group.id === editGroupId ? updatedGroup : group
        ));
        setEditGroupId(null);
        setEditGroupName("");
      }
    } catch (error) {
      console.error("Error updating group:", error);
    }
  };

  const handleDeleteGroup = async () => {
    if (!groupToDelete) return;
    
    try {
      const success = await deleteGroup(groupToDelete.id);
      if (success) {
        setGroups(groups.filter(group => group.id !== groupToDelete.id));
        setGroupToDelete(null);
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  const openEditDialog = (group: Group) => {
    setEditGroupId(group.id);
    setEditGroupName(group.name);
  };

  const openDeleteDialog = (group: Group) => {
    setGroupToDelete(group);
    setIsDeleteDialogOpen(true);
  };

  const handleResetData = async () => {
    setIsResetInProgress(true);
    try {
      const success = await resetAllData();
      if (success) {
        // Refetch groups after reset
        await fetchGroups();
      }
    } catch (error) {
      console.error("Error resetting data:", error);
    } finally {
      setIsResetInProgress(false);
      setIsResetDialogOpen(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add New Group */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Group</CardTitle>
            <CardDescription>
              Create a new group for your students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="groupName" className="text-sm font-medium">
                  Group Name
                </label>
                <Input 
                  id="groupName"
                  placeholder="Enter group name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleAddGroup} 
                className="w-full"
                disabled={!newGroupName.trim()}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Group
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Existing Groups */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Existing Groups</CardTitle>
              <CardDescription>
                Manage your current groups
              </CardDescription>
            </div>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => setIsResetDialogOpen(true)}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Reset All Data
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading groups...</div>
            ) : groups.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No groups found. Add a new group to get started.
              </div>
            ) : (
              <div className="space-y-2">
                {groups.map((group) => (
                  <div key={group.id} className="p-2 rounded-md bg-secondary/30">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{group.name}</span>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-500"
                          onClick={() => openEditDialog(group)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() => openDeleteDialog(group)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Group Dialog */}
      <Dialog open={!!editGroupId} onOpenChange={(open) => !open && setEditGroupId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
            <DialogDescription>
              Update the group name below.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={editGroupName}
              onChange={(e) => setEditGroupName(e.target.value)}
              placeholder="Group name"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleEditGroup} disabled={!editGroupName.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the group "{groupToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteGroup}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Data Confirmation Dialog */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset All Data</DialogTitle>
            <DialogDescription>
              This will delete all students, groups, and other data from the system. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              All data including students, groups, practice records, and messages will be permanently deleted.
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleResetData}
              disabled={isResetInProgress}
            >
              {isResetInProgress ? "Resetting..." : "Reset All Data"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 