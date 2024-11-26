import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { Loader2 } from "lucide-react";
import {
  useGetAdminListQuery,
  useAssignUserToAdminMutation,
  useUnassignUserMutation,
} from "../../lib/services/usersApi";

const UNASSIGNED_VALUE = "unassigned";

export function AdminAssignmentDialog({ open, onClose, user, onSuccess }) {
  const { toast } = useToast();
  const [selectedAdmin, setSelectedAdmin] = React.useState(UNASSIGNED_VALUE);

  const { data: adminListResponse, isLoading: isLoadingAdmins } =
    useGetAdminListQuery();
  const [assignAdmin, { isLoading: isAssigning }] =
    useAssignUserToAdminMutation();
  const [unassignUser, { isLoading: isUnassigning }] =
    useUnassignUserMutation();

  const adminList = adminListResponse?.admins || [];

  const handleAssignment = async () => {
    try {
      if (selectedAdmin === UNASSIGNED_VALUE) {
        await unassignUser({
          userId: user._id,
        }).unwrap();
        toast({
          title: "Success",
          description: "User unassigned successfully",
        });
      } else {
        await assignAdmin({
          userId: user._id,
          adminId: selectedAdmin,
        }).unwrap();
        toast({
          title: "Success",
          description: "User assigned successfully",
        });
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.data?.message || "Failed to update assignment",
        variant: "destructive",
      });
    }
  };

  React.useEffect(() => {
    if (open && user) {
      setSelectedAdmin(user.assignedAdmin || UNASSIGNED_VALUE);
    }
  }, [open, user]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Admin</DialogTitle>
          <DialogDescription>
            Assign or remove an admin for {user?.name || "this user"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Admin</label>
            {isLoadingAdmins ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <Select value={selectedAdmin} onValueChange={setSelectedAdmin}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an admin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={UNASSIGNED_VALUE}>
                      None (Remove Assignment)
                    </SelectItem>
                    {adminList.map((admin) => (
                      <SelectItem key={`admin-${admin._id}`} value={admin._id}>
                        {admin.name || admin.username}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isAssigning || isUnassigning}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssignment}
            disabled={isAssigning || isUnassigning}
          >
            {(isAssigning || isUnassigning) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {selectedAdmin !== UNASSIGNED_VALUE
              ? "Assign Admin"
              : "Remove Assignment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
