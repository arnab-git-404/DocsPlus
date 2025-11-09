"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Search,
  FileText,
  MoreVertical,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Mail,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  FileEdit,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface OfferLetter {
  _id: string;
  offerNumber: string;
  candidateName: string;
  candidateEmail: string;
  position: string;
  department: string;
  salary: number;
  joiningDate: string;
  status: "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED";
  offerDate: string;
  expiryDate: string;
  createdAt: string;
}

export default function OfferLettersPage() {
  const router = useRouter();
  const [offerLetters, setOfferLetters] = useState<OfferLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [refreshing, setRefreshing] = useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchOfferLetters();
  }, [statusFilter, searchTerm]);

  const fetchOfferLetters = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`/api/offer-letter?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setOfferLetters(data.offerLetters);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to fetch offer letters",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to fetch offer letters" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offer letter?")) return;

    try {
      setActionLoading(id);
      const response = await fetch(`/api/offer-letter/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Offer letter deleted successfully",
        });
        fetchOfferLetters();
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to delete offer letter",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete offer letter" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendEmail = async (id: string) => {
    if (!confirm("Are you sure you want to send this offer letter?")) return;

    try {
      setActionLoading(id);
      const response = await fetch(`/api/offer-letter/${id}/email`, {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: data.message });
        fetchOfferLetters();
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to send offer letter",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to send offer letter" });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; icon: any }> = {
      DRAFT: { color: "bg-gray-100 text-gray-800", icon: FileEdit },
      SENT: { color: "bg-blue-100 text-blue-800", icon: Mail },
      ACCEPTED: { color: "bg-green-100 text-green-800", icon: CheckCircle2 },
      REJECTED: { color: "bg-red-100 text-red-800", icon: XCircle },
    };

    const variant = variants[status] || variants.DRAFT;
    const Icon = variant.icon;

    return (
      <Badge className={`${variant.color} flex items-center gap-1 w-fit`}>
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const stats = {
    total: offerLetters.length,
    draft: offerLetters.filter((o) => o.status === "DRAFT").length,
    sent: offerLetters.filter((o) => o.status === "SENT").length,
    accepted: offerLetters.filter((o) => o.status === "ACCEPTED").length,
    rejected: offerLetters.filter((o) => o.status === "REJECTED").length,
  };

    const handleRefresh = async () => {
    localStorage.clear();
    setRefreshing(true);
    await fetchOfferLetters();
    setRefreshing(false);
  }

  return (
    <div className="min-h-screen ">
      <div className=" mx-auto space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold  flex items-center gap-2">
              <FileText className="h-8 w-8 " />
              Offer Letters
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and send job offer letters
            </p>
          </div>


          <div className="flex gap-2" >
            <Button
            variant={"outline"}
            className="hover:cursor-pointer"
              onClick={handleRefresh}
            >

            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />              Refresh
            </Button>

            <Button
            className="hover:cursor-pointer"
              onClick={() => router.push("/dashboard/admin/offer-letters/new")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Offer Letter
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setStatusFilter("ALL")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setStatusFilter("DRAFT")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Draft</p>
                  <p className="text-2xl font-bold">{stats.draft}</p>
                </div>
                <FileEdit className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setStatusFilter("SENT")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Sent</p>
                  <p className="text-2xl font-bold">{stats.sent}</p>
                </div>
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setStatusFilter("ACCEPTED")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Accepted</p>
                  <p className="text-2xl font-bold">{stats.accepted}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          {/* Offer Letter Rejected Card */}
          {/* <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setStatusFilter("REJECTED")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Message Alert */}
        {message && (
          <Alert
            className={
              message.type === "success"
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }
          >
            {message.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription
              className={
                message.type === "success" ? "text-green-800" : "text-red-800"
              }
            >
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by candidate name, email, or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter: {statusFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter("ALL")}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("DRAFT")}>
                    Draft
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("SENT")}>
                    Sent
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("ACCEPTED")}>
                    Accepted
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("REJECTED")}>
                    Rejected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin " />
              </div>
            ) : offerLetters.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold  mb-2">
                  No offer letters found
                </h3>
                <p className="text-gray-600 mb-4">
                  Get started by creating your first offer letter
                </p>
                <Button
                className="hover:cursor-pointer"
                  onClick={() =>
                    router.push("/dashboard/admin/offer-letters/new")
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Offer Letter
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Offer ID</TableHead>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Salary</TableHead>
                      <TableHead>Joining Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {offerLetters.map((offer) => (
                      <TableRow key={offer._id} className="">
                        <TableCell className="font-mono text-sm">
                          {offer.offerNumber}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {offer.candidateName}
                            </div>
                            <div className="text-sm text-gray-600">
                              {offer.candidateEmail}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{offer.position}</TableCell>
                        <TableCell>{offer.department}</TableCell>
                        <TableCell>₹{offer.salary.toLocaleString()}</TableCell>
                        <TableCell>
                          {new Date(offer.joiningDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{getStatusBadge(offer.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:cursor-pointer"
                                disabled={actionLoading === offer._id}
                              >
                                {actionLoading === offer._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <MoreVertical className="h-4 w-4" />
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                              className="hover:cursor-pointer"
                                onClick={() =>
                                  router.push(
                                    `/dashboard/admin/offer-letters/view/${offer._id}`
                                  )
                                }
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:cursor-pointer"
                                onClick={() =>
                                  router.push(
                                    `/dashboard/admin/offer-letters/edit/${offer._id}`
                                  )
                                }
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:cursor-pointer"
                                onClick={() => handleSendEmail(offer._id)}
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:cursor-pointer"
                                onClick={() =>
                                  // window.open(
                                  //   `/api/offer-letter/${offer._id}/pdf`,
                                  //   "_blank"
                                  // )
                                  router.push(
                                    `/dashboard/admin/offer-letters/view/${offer._id}`
                                  )
                                }
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDelete(offer._id)}
                                className="text-red-600 focus:text-red-600 hover:cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
