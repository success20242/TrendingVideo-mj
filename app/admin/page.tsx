"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { UserTable } from "@/components/admin/user-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination" // Import pagination components

interface User {
  id: string
  email: string
  role: string
  subscriptionStatus: string
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchEmail, setSearchEmail] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterSubscription, setFilterSubscription] = useState("all")

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage, setUsersPerPage] = useState(10) // Default items per page
  const [totalUsers, setTotalUsers] = useState(0)

  const totalPages = Math.ceil(totalUsers / usersPerPage)

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (searchEmail) {
        params.append("email", searchEmail)
      }
      if (filterRole !== "all") {
        params.append("role", filterRole)
      }
      if (filterSubscription !== "all") {
        params.append("subscriptionStatus", filterSubscription)
      }
      // Add pagination parameters
      params.append("page", currentPage.toString())
      params.append("limit", usersPerPage.toString())

      const res = await fetch(`/api/admin/users?${params.toString()}`)
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to fetch users.")
      }
      const data = await res.json()
      setUsers(data.users)
      setTotalUsers(data.totalUsers) // Set total users from API response
    } catch (err: any) {
      console.error("Error fetching users:", err)
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "loading") return

    if (!session || session.user?.role !== "admin") {
      router.push("/") // Redirect non-admin users to home
      return
    }

    fetchUsers()
  }, [session, status, router, currentPage, usersPerPage]) // Re-fetch when page or limit changes

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Generate page numbers for pagination control
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5 // Number of page buttons to show (e.g., 1, 2, 3, ..., last)
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

    if (startPage > 1) {
      pageNumbers.push(1)
      if (startPage > 2) {
        pageNumbers.push("...")
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push("...")
      }
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  if (status === "loading" || (status === "authenticated" && session.user?.role !== "admin" && loading)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" /> Loading admin dashboard...
      </div>
    )
  }

  if (status === "unauthenticated" || session?.user?.role !== "admin") {
    return null // Should be redirected by router.push
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Admin Dashboard</CardTitle>
            <p className="text-gray-500 dark:text-gray-400">Manage users and their roles/subscriptions.</p>
          </CardHeader>
          <CardContent>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {/* Search and Filter UI */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search-email" className="sr-only">
                  Search by Email
                </Label>
                <Input
                  id="search-email"
                  placeholder="Search by email..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setCurrentPage(1) // Reset to first page on new search/filter
                      fetchUsers()
                    }
                  }}
                />
              </div>
              <div>
                <Label htmlFor="filter-role" className="sr-only">
                  Filter by Role
                </Label>
                <Select
                  value={filterRole}
                  onValueChange={(value) => {
                    setFilterRole(value)
                    setCurrentPage(1) // Reset to first page on new search/filter
                  }}
                >
                  <SelectTrigger id="filter-role">
                    <SelectValue placeholder="Filter by Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="filter-subscription" className="sr-only">
                  Filter by Subscription
                </Label>
                <Select
                  value={filterSubscription}
                  onValueChange={(value) => {
                    setFilterSubscription(value)
                    setCurrentPage(1) // Reset to first page on new search/filter
                  }}
                >
                  <SelectTrigger id="filter-subscription">
                    <SelectValue placeholder="Filter by Subscription" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subscriptions</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-3">
                <Button onClick={fetchUsers} disabled={loading} className="w-full">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Apply Filters"}
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading users...
              </div>
            ) : (
              <>
                <UserTable users={users} onUserUpdated={fetchUsers} onUserDeleted={fetchUsers} />

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <Pagination className="mt-6">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={() => handlePageChange(currentPage - 1)}
                          aria-disabled={currentPage === 1}
                          tabIndex={currentPage === 1 ? -1 : undefined}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                        />
                      </PaginationItem>
                      {getPageNumbers().map((pageNumber, index) => (
                        <PaginationItem key={index}>
                          {pageNumber === "..." ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              href="#"
                              isActive={pageNumber === currentPage}
                              onClick={() => handlePageChange(pageNumber as number)}
                            >
                              {pageNumber}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={() => handlePageChange(currentPage + 1)}
                          aria-disabled={currentPage === totalPages}
                          tabIndex={currentPage === totalPages ? -1 : undefined}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
