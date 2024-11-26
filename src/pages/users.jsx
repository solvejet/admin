import React, { useState, useMemo, useEffect } from "react";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useBulkDeleteUsersMutation,
  useUpdateUserStatusMutation,
  useBulkUpdateUserStatusMutation,
  useGetUserSchemaQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
} from "../lib/services/usersApi";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { UserForm } from "../components/users/user-form";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { RightSidebar } from "../components/ui/right-sidebar";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Download,
  Trash2,
  Settings2,
  ChevronDown,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Ban,
  FileDown,
  RefreshCw,
  Settings,
  Users,
} from "lucide-react";
import { cn } from "../lib/utils";
import { SchemaManagement } from "../components/users/schema-management";
import { useToast } from "../components/ui/use-toast";
import { AdminAssignmentDialog } from "../components/users/admin-assignment";

// Status configuration for badges and icons
const statusConfig = {
  active: {
    label: "Active",
    badge: "success",
    icon: CheckCircle2,
    color: "text-green-500",
  },
  inactive: {
    label: "Inactive",
    badge: "warning",
    icon: Ban,
    color: "text-yellow-500",
  },
  blocked: {
    label: "Blocked",
    badge: "destructive",
    icon: Ban,
    color: "text-red-500",
  },
};

export function UsersPage() {
  // State
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("-createdAt");
  const [filters, setFilters] = useState({});
  const [isUserSidebarOpen, setIsUserSidebarOpen] = useState(false);
  const [isSchemaSidebarOpen, setIsSchemaSidebarOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserForAdmin, setSelectedUserForAdmin] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("csv");

  const { toast } = useToast();

  // Queries and Mutations
  const {
    data: usersData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetUsersQuery({
    page,
    limit,
    search: searchDebounced,
    sort,
    ...filters,
  });

  const { data: schemaData, isLoading: isLoadingSchema } =
    useGetUserSchemaQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [bulkDeleteUsers, { isLoading: isBulkDeleting }] =
    useBulkDeleteUsersMutation();
  const [updateUserStatus, { isLoading: isStatusUpdating }] =
    useUpdateUserStatusMutation();
  const [bulkUpdateStatus, { isLoading: isBulkStatusUpdating }] =
    useBulkUpdateUserStatusMutation();

  // Search debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounced(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Column definitions
  const columns = useMemo(() => {
    if (!schemaData?.fields) return [];

    // Start with standard fields from schema
    let cols = Object.entries(schemaData.fields)
      .filter(
        ([fieldName]) => !["password", "__v", "metadata"].includes(fieldName)
      )
      .map(([fieldName, fieldSchema]) => ({
        key: fieldName,
        label:
          fieldSchema.label ||
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1),
        type:
          fieldName === "assignedAdmin"
            ? "admin"
            : fieldSchema.type.toLowerCase(),
        sortable: fieldSchema.sortable !== false,
        filterable: fieldSchema.filterable !== false,
      }));

    // Define the preferred order of columns
    const columnOrder = [
      "name",
      "number",
      "status",
      "assignedAdmin",
      "createdAt",
      "updatedAt",
    ];

    // Sort columns according to the order
    cols.sort((a, b) => {
      const indexA = columnOrder.indexOf(a.key);
      const indexB = columnOrder.indexOf(b.key);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    return cols;
  }, [schemaData]);

  // Handlers
  const handleSelectAll = (checked) => {
    setSelectedUsers(checked ? usersData?.users.map((user) => user._id) : []);
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleDeleteUsers = async () => {
    try {
      if (selectedUsers.length === 1) {
        await deleteUser(selectedUsers[0]).unwrap();
      } else {
        await bulkDeleteUsers(selectedUsers).unwrap();
      }
      setSelectedUsers([]);
      setDeleteConfirmOpen(false);
      toast({
        title: "Success",
        description: `Successfully deleted ${selectedUsers.length} user${
          selectedUsers.length === 1 ? "" : "s"
        }`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.data?.message || "Failed to delete users",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async (userId, status) => {
    try {
      if (userId) {
        await updateUserStatus({ id: userId, status }).unwrap();
        toast({
          title: "Success",
          description: "User status updated successfully",
        });
      } else {
        await bulkUpdateStatus({ ids: selectedUsers, status }).unwrap();
        toast({
          title: "Success",
          description: `Updated status for ${selectedUsers.length} users`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.data?.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(
        `${
          process.env.VITE_API_URL
        }/user/export?format=${exportFormat}&fields=${columns
          .map((col) => col.key)
          .join(",")}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users-export-${new Date().toISOString()}.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Export completed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export users",
        variant: "destructive",
      });
    }
  };

  const renderCell = (user, column) => {
    const value = user[column.key];

    // Handle null or undefined values
    if (value === null || value === undefined) {
      return "-";
    }

    switch (column.type.toLowerCase()) {
      case "boolean":
        return value ? "Yes" : "No";

      case "date":
        return value ? new Date(value).toLocaleDateString() : "-";

      case "status": {
        const status = statusConfig[value] || {};
        const StatusIcon = status.icon;
        return (
          <Badge variant={status.badge || "secondary"}>
            <span className="flex items-center gap-1">
              {StatusIcon && <StatusIcon className="h-3 w-3" />}
              {status.label || value}
            </span>
          </Badge>
        );
      }

      case "admin": // Special case for assignedAdmin field
        if (!value) return "-";
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium">{value.username}</span>
            <span className="text-xs text-muted-foreground">
              ({value.email})
            </span>
          </div>
        );

      case "array":
        return Array.isArray(value) ? value.join(", ") : "-";

      case "object":
        if (value === null) return "-";
        try {
          return JSON.stringify(value);
        } catch (e) {
          return "-";
        }

      default:
        return String(value);
    }
  };

  // Handle error state
  if (error) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
          <h3 className="mt-4 text-lg font-semibold">Error loading users</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {error.data?.message || "Something went wrong. Please try again."}
          </p>
          <Button onClick={refetch} variant="outline" className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <h1 className="text-lg font-semibold">Users</h1>
          <div className="ml-auto flex items-center space-x-2">
            <Button
              onClick={() => setIsSchemaSidebarOpen(true)}
              variant="outline"
              size="sm"
            >
              <Settings className="h-4 w-4 mr-2" />
              Manage Schema
            </Button>
            <Button
              onClick={() => {
                setSelectedUser(null);
                setIsUserSidebarOpen(true);
              }}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4 gap-4">
          {/* Search */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full bg-muted/50"
              />
            </div>
          </div>

          {/* Sort */}
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {columns
                .filter((col) => col.sortable)
                .map((col) => (
                  <React.Fragment key={col.key}>
                    <SelectItem value={col.key}>{col.label} (Asc)</SelectItem>
                    <SelectItem value={`-${col.key}`}>
                      {col.label} (Desc)
                    </SelectItem>
                  </React.Fragment>
                ))}
            </SelectContent>
          </Select>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <>
              <div className="h-4 w-px bg-border" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FileDown className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport("csv")}>
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("xlsx")}>
                    Export as Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("json")}>
                    Export as JSON
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Status
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleStatusUpdate(null, "active")}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Set Active
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusUpdate(null, "inactive")}
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Set Inactive
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleStatusUpdate(null, "blocked")}
                    className="text-destructive"
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Block
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeleteConfirmOpen(true)}
                disabled={isDeleting || isBulkDeleting}
              >
                {isDeleting || isBulkDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete ({selectedUsers.length})
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {isLoading || isLoadingSchema ? (
          <div className="flex h-[450px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <tr className="border-b">
                <th className="h-10 whitespace-nowrap px-2 text-left align-middle">
                  <Checkbox
                    checked={
                      selectedUsers.length > 0 &&
                      selectedUsers.length === usersData?.users.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="h-10 px-2 text-left font-medium text-muted-foreground"
                  >
                    {column.label}
                  </th>
                ))}
                <th className="h-10 w-[40px]" />
              </tr>
            </thead>
            <tbody>
              {usersData?.users.map((user) => (
                <tr
                  key={user._id}
                  className={cn(
                    "group border-b hover:bg-muted/50",
                    selectedUsers.includes(user._id) && "bg-muted"
                  )}
                >
                  <td className="h-12 px-2">
                    <Checkbox
                      checked={selectedUsers.includes(user._id)}
                      onCheckedChange={() => handleSelectUser(user._id)}
                    />
                  </td>
                  {columns.map((column) => (
                    <td key={column.key} className="h-12 px-2 align-middle">
                      {renderCell(user, column)}
                    </td>
                  ))}
                  <td className="h-12 w-[40px] px-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user);
                            setIsUserSidebarOpen(true);
                          }}
                        >
                          <Settings2 className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setSelectedUserForAdmin(user)}
                        >
                          <Users className="mr-2 h-4 w-4" />
                          Assign Admin
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(user._id, "active")}
                          disabled={user.status === "active"}
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Set Active
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusUpdate(user._id, "inactive")
                          }
                          disabled={user.status === "inactive"}
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          Set Inactive
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusUpdate(user._id, "blocked")
                          }
                          disabled={user.status === "blocked"}
                          className="text-destructive"
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          Block
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUsers([user._id]);
                            setDeleteConfirmOpen(true);
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {usersData?.pagination && (
        <div className="border-t">
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center space-x-6">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                {usersData.users.length > 0 ? (page - 1) * limit + 1 : 0} to{" "}
                {Math.min(page * limit, usersData.pagination.total)} of{" "}
                {usersData.pagination.total} results
              </p>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">Rows per page</p>
                <Select
                  value={limit.toString()}
                  onValueChange={(value) => {
                    setLimit(Number(value));
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={limit} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={pageSize.toString()}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1 || isLoading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={
                  page >= Math.ceil(usersData.pagination.total / limit) ||
                  isLoading
                }
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Users</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUsers.length}{" "}
              {selectedUsers.length === 1 ? "user" : "users"}? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              disabled={isDeleting || isBulkDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUsers}
              disabled={isDeleting || isBulkDeleting}
            >
              {isDeleting || isBulkDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Form Sidebar */}
      {isUserSidebarOpen && (
        <RightSidebar
          open={isUserSidebarOpen}
          onClose={() => {
            setIsUserSidebarOpen(false);
            setSelectedUser(null);
          }}
          title={selectedUser ? "Edit User" : "Add User"}
        >
          <UserForm
            user={selectedUser}
            schema={schemaData?.fields}
            onClose={() => {
              setIsUserSidebarOpen(false);
              setSelectedUser(null);
            }}
          />
        </RightSidebar>
      )}

      {/* Schema Management Sidebar */}
      <RightSidebar
        open={isSchemaSidebarOpen}
        onClose={() => setIsSchemaSidebarOpen(false)}
        title="Manage Schema"
        size="lg"
      >
        <SchemaManagement onClose={() => setIsSchemaSidebarOpen(false)} />
      </RightSidebar>

      {/* Admin Assignment Dialog */}
      <AdminAssignmentDialog
        open={!!selectedUserForAdmin}
        onClose={() => setSelectedUserForAdmin(null)}
        user={selectedUserForAdmin}
        onSuccess={() => {
          refetch();
          setSelectedUserForAdmin(null);
        }}
      />
    </div>
  );
}
