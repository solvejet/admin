// src/App.jsx
import { Routes, Route } from "react-router-dom"
import { LoginPage } from "./pages/login"
import { ProtectedRoute } from "./components/protected-route"
import Layout from "./components/layout"
import { UsersPage } from './pages/users'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Define nested routes */}
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="roles" element={<RolesPage />} />
        <Route path="groups" element={<GroupsPage />} />
      </Route>
    </Routes>
  );
}

// Placeholder components for other routes
function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground mt-2">Welcome to Pixe Admin Dashboard</p>
    </div>
  )
}

function RolesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Roles</h1>
      <p className="text-muted-foreground mt-2">Manage user roles</p>
    </div>
  )
}

function GroupsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Groups</h1>
      <p className="text-muted-foreground mt-2">Manage user groups</p>
    </div>
  )
}

export default App