"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  Users,
  FileText,
  Map,
  BarChart3,
  MessageSquare,
  Send,
  Download,
  FileDown,
  Presentation,
  Table,
  Plus,
  Clock,
  User,
  CheckCircle2,
  Eye,
  Edit3,
  MoreHorizontal,
  ArrowUpRight,
} from "lucide-react";

// -- Mock collaboration data --

interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  online: boolean;
  color: string;
}

interface SharedProduct {
  id: string;
  title: string;
  type: "advisory" | "sitrep" | "map" | "analysis";
  status: "draft" | "review" | "published";
  publishedBy: string;
  date: string;
  comments: number;
  version: string;
}

interface Comment {
  id: string;
  author: string;
  initials: string;
  color: string;
  role: string;
  text: string;
  time: string;
  productId: string;
}

const teamMembers: TeamMember[] = [
  { id: "tm-1", name: "James Moyo", role: "Regional Analyst", initials: "JM", online: true, color: "from-blue-400 to-violet-500" },
  { id: "tm-2", name: "Ana Silva", role: "SHOC Duty Officer", initials: "AS", online: true, color: "from-emerald-400 to-teal-500" },
  { id: "tm-3", name: "David Banda", role: "DRR Analyst", initials: "DB", online: true, color: "from-amber-400 to-orange-500" },
  { id: "tm-4", name: "Sarah Kimani", role: "GIS Specialist", initials: "SK", online: false, color: "from-pink-400 to-rose-500" },
  { id: "tm-5", name: "Pierre Rakoto", role: "Early Warning Officer", initials: "PR", online: true, color: "from-cyan-400 to-blue-500" },
  { id: "tm-6", name: "Fatima Nkosi", role: "Humanitarian Coordinator", initials: "FN", online: false, color: "from-violet-400 to-purple-500" },
];

const sharedProducts: SharedProduct[] = [
  { id: "sp-1", title: "SADC Regional Cyclone Advisory #3 - Batsirai II", type: "advisory", status: "published", publishedBy: "Ana Silva", date: "2026-02-10 08:30", comments: 7, version: "v3.0" },
  { id: "sp-2", title: "Mozambique Situation Report #5 - Cyclone Response", type: "sitrep", status: "review", publishedBy: "James Moyo", date: "2026-02-10 14:00", comments: 4, version: "v5.1" },
  { id: "sp-3", title: "Zambezi Basin Flood Extent Map - Feb 10", type: "map", status: "published", publishedBy: "Sarah Kimani", date: "2026-02-10 06:00", comments: 2, version: "v2.0" },
  { id: "sp-4", title: "Multi-Country Impact Analysis - Cyclone + Flood", type: "analysis", status: "draft", publishedBy: "David Banda", date: "2026-02-10 11:45", comments: 1, version: "v0.3" },
  { id: "sp-5", title: "Southern Madagascar Drought Watch Bulletin", type: "advisory", status: "review", publishedBy: "Pierre Rakoto", date: "2026-02-09 16:00", comments: 3, version: "v1.2" },
  { id: "sp-6", title: "Regional Risk Map - SADC Overview Feb 2026", type: "map", status: "published", publishedBy: "Sarah Kimani", date: "2026-02-08 09:00", comments: 5, version: "v1.0" },
];

const mockComments: Comment[] = [
  { id: "c-1", author: "Ana Silva", initials: "AS", color: "from-emerald-400 to-teal-500", role: "SHOC Duty Officer", text: "Updated wind speed projections from RSMC La Reunion. Category has been upgraded to 3. Please revise affected population estimates in Section 4.", time: "14 min ago", productId: "sp-2" },
  { id: "c-2", author: "David Banda", initials: "DB", color: "from-amber-400 to-orange-500", role: "DRR Analyst", text: "Revised estimates complete. Sofala province alone now at 890K affected. Adding district-level breakdown table.", time: "8 min ago", productId: "sp-2" },
  { id: "c-3", author: "Pierre Rakoto", initials: "PR", color: "from-cyan-400 to-blue-500", role: "Early Warning Officer", text: "Madagascar BNGRC has confirmed pre-positioning in Analanjirofo. Recommend we include this in partner response section.", time: "3 min ago", productId: "sp-2" },
  { id: "c-4", author: "James Moyo", initials: "JM", color: "from-blue-400 to-violet-500", role: "Regional Analyst", text: "Good catch Pierre. Adding now. Ana - can we also get the latest trigger status for the IFRC DREF activation?", time: "Just now", productId: "sp-2" },
];

const productTypeConfig: Record<string, { icon: typeof FileText; color: string; bg: string; label: string }> = {
  advisory: { icon: FileText, color: "text-amber-400", bg: "bg-amber-500/15", label: "Advisory" },
  sitrep: { icon: BarChart3, color: "text-blue-400", bg: "bg-blue-500/15", label: "SitRep" },
  map: { icon: Map, color: "text-emerald-400", bg: "bg-emerald-500/15", label: "Map" },
  analysis: { icon: BarChart3, color: "text-violet-400", bg: "bg-violet-500/15", label: "Analysis" },
};

const statusVariantMap: Record<string, "draft" | "review" | "published"> = {
  draft: "draft",
  review: "review",
  published: "published",
};

export default function CollaborationPage() {
  const [selectedProduct, setSelectedProduct] = useState<string>("sp-2");
  const [commentText, setCommentText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const onlineCount = teamMembers.filter((m) => m.online).length;

  const filteredProducts =
    statusFilter === "all"
      ? sharedProducts
      : sharedProducts.filter((p) => p.status === statusFilter);

  const selectedComments = mockComments.filter(
    (c) => c.productId === selectedProduct
  );

  const currentProduct = sharedProducts.find((p) => p.id === selectedProduct);

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <main className="flex-1 lg:pl-64">
        <div className="p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-100">
                Collaboration Workspace
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Shared products, team coordination, and publishing workflow
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm" icon={<Plus className="h-4 w-4" />}>
                New Product
              </Button>
              <Button variant="primary" size="sm" icon={<ArrowUpRight className="h-4 w-4" />}>
                Publish Product
              </Button>
            </div>
          </div>

          {/* Team Members Online */}
          <Card className="mb-6" padding="md">
            <CardHeader>
              <CardTitle icon={<Users className="h-4 w-4" />}>
                Team Members
              </CardTitle>
              <Badge variant="info" dot pulse>
                {onlineCount} online
              </Badge>
            </CardHeader>
            <div className="flex flex-wrap gap-3">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2.5 rounded-lg border border-slate-700/50 bg-slate-900/50 px-3 py-2 transition-colors hover:border-slate-600/50"
                >
                  <div className="relative">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${member.color}`}
                    >
                      <span className="text-xs font-bold text-white">
                        {member.initials}
                      </span>
                    </div>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-900 ${
                        member.online ? "bg-emerald-400" : "bg-slate-500"
                      }`}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-200">
                      {member.name}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {member.role}
                    </span>
                  </div>
                  <Badge
                    variant={
                      member.role.includes("SHOC")
                        ? "critical"
                        : member.role.includes("DRR")
                        ? "warning"
                        : member.role.includes("GIS")
                        ? "success"
                        : member.role.includes("Early Warning")
                        ? "info"
                        : member.role.includes("Humanitarian")
                        ? "high"
                        : "default"
                    }
                    className="text-[9px] px-1.5 py-0"
                  >
                    {member.role}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
            {/* Left: Products List */}
            <div className="xl:col-span-3">
              <Card padding="none">
                <div className="border-b border-slate-700/50 p-5">
                  <div className="flex items-center justify-between">
                    <CardTitle icon={<FileText className="h-4 w-4" />}>
                      Shared Products
                    </CardTitle>
                    <div className="flex items-center gap-1.5">
                      {["all", "draft", "review", "published"].map((f) => (
                        <button
                          key={f}
                          onClick={() => setStatusFilter(f)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                            statusFilter === f
                              ? "bg-blue-500/15 text-blue-400"
                              : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                          }`}
                        >
                          {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-slate-700/30">
                  {filteredProducts.map((product) => {
                    const typeConf = productTypeConfig[product.type];
                    const TypeIcon = typeConf.icon;
                    const isSelected = product.id === selectedProduct;

                    return (
                      <button
                        key={product.id}
                        onClick={() => setSelectedProduct(product.id)}
                        className={`flex w-full items-start gap-4 px-5 py-4 text-left transition-colors ${
                          isSelected
                            ? "bg-blue-500/5 border-l-2 border-l-blue-500"
                            : "border-l-2 border-l-transparent hover:bg-slate-800/50"
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${typeConf.bg}`}
                        >
                          <TypeIcon className={`h-4 w-4 ${typeConf.color}`} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <h4 className="truncate text-sm font-medium text-slate-200">
                              {product.title}
                            </h4>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={statusVariantMap[product.status]} dot>
                              {product.status.charAt(0).toUpperCase() +
                                product.status.slice(1)}
                            </Badge>
                            <span className="text-[10px] font-medium text-slate-600">
                              {product.version}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              <User className="mr-0.5 inline h-3 w-3" />
                              {product.publishedBy}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              <Clock className="mr-0.5 inline h-3 w-3" />
                              {product.date}
                            </span>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <div className="flex items-center gap-1 text-slate-500">
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span className="text-xs">{product.comments}</span>
                          </div>
                          <MoreHorizontal className="h-4 w-4 text-slate-600" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Right: Comments Thread + Export */}
            <div className="flex flex-col gap-6 xl:col-span-2">
              {/* Comments / Annotation Thread */}
              <Card padding="none" className="flex flex-col">
                <div className="border-b border-slate-700/50 p-5">
                  <div className="flex items-center justify-between">
                    <CardTitle icon={<MessageSquare className="h-4 w-4" />}>
                      Discussion
                    </CardTitle>
                    {currentProduct && (
                      <Badge
                        variant={statusVariantMap[currentProduct.status]}
                        dot
                      >
                        {currentProduct.status.charAt(0).toUpperCase() +
                          currentProduct.status.slice(1)}
                      </Badge>
                    )}
                  </div>
                  {currentProduct && (
                    <p className="mt-1.5 text-xs text-slate-500 line-clamp-1">
                      {currentProduct.title}
                    </p>
                  )}
                </div>

                <div className="flex-1 space-y-0 divide-y divide-slate-700/20 overflow-y-auto max-h-[420px]">
                  {selectedComments.map((comment) => (
                    <div key={comment.id} className="px-5 py-4">
                      <div className="mb-2 flex items-center gap-2">
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${comment.color}`}
                        >
                          <span className="text-[10px] font-bold text-white">
                            {comment.initials}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-slate-200">
                            {comment.author}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {comment.role}
                          </span>
                        </div>
                        <span className="ml-auto text-[10px] text-slate-600">
                          {comment.time}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-400">
                        {comment.text}
                      </p>
                    </div>
                  ))}
                  {selectedComments.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <MessageSquare className="mb-2 h-8 w-8 text-slate-700" />
                      <p className="text-sm text-slate-500">
                        No comments on this product yet
                      </p>
                    </div>
                  )}
                </div>

                {/* Comment Input */}
                <div className="border-t border-slate-700/50 p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 rounded-lg border border-slate-700/50 bg-slate-900/60 px-3 py-2 text-xs text-slate-200 placeholder-slate-600 outline-none transition-colors focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                    />
                    <button
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-500"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </Card>

              {/* Publishing Workflow */}
              <Card padding="md">
                <CardHeader>
                  <CardTitle icon={<CheckCircle2 className="h-4 w-4" />}>
                    Publishing Workflow
                  </CardTitle>
                </CardHeader>
                {currentProduct && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {["draft", "review", "published"].map((step, i) => {
                        const isCurrentStep = currentProduct.status === step;
                        const isPast =
                          (step === "draft" && (currentProduct.status === "review" || currentProduct.status === "published")) ||
                          (step === "review" && currentProduct.status === "published");

                        return (
                          <div key={step} className="flex flex-1 items-center gap-2">
                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                                isPast
                                  ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
                                  : isCurrentStep
                                  ? "border-blue-500/50 bg-blue-500/15 text-blue-400 animate-pulse"
                                  : "border-slate-700 bg-slate-800 text-slate-600"
                              }`}
                            >
                              {isPast ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                i + 1
                              )}
                            </div>
                            <span
                              className={`text-xs font-medium capitalize ${
                                isPast
                                  ? "text-emerald-400"
                                  : isCurrentStep
                                  ? "text-blue-400"
                                  : "text-slate-600"
                              }`}
                            >
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex gap-2 pt-2">
                      {currentProduct.status === "draft" && (
                        <Button variant="primary" size="sm" icon={<Eye className="h-3.5 w-3.5" />} className="flex-1">
                          Submit for Review
                        </Button>
                      )}
                      {currentProduct.status === "review" && (
                        <>
                          <Button variant="secondary" size="sm" icon={<Edit3 className="h-3.5 w-3.5" />} className="flex-1">
                            Request Changes
                          </Button>
                          <Button variant="primary" size="sm" icon={<ArrowUpRight className="h-3.5 w-3.5" />} className="flex-1">
                            Approve & Publish
                          </Button>
                        </>
                      )}
                      {currentProduct.status === "published" && (
                        <Button variant="success" size="sm" icon={<CheckCircle2 className="h-3.5 w-3.5" />} className="flex-1" disabled>
                          Published
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </Card>

              {/* Export Options */}
              <Card padding="md">
                <CardHeader>
                  <CardTitle icon={<Download className="h-4 w-4" />}>
                    Export Options
                  </CardTitle>
                </CardHeader>
                <div className="grid grid-cols-3 gap-2">
                  <button className="flex flex-col items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-900/50 px-3 py-3 transition-colors hover:border-red-500/30 hover:bg-red-500/5">
                    <FileDown className="h-5 w-5 text-red-400" />
                    <span className="text-xs font-medium text-slate-300">PDF</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-900/50 px-3 py-3 transition-colors hover:border-orange-500/30 hover:bg-orange-500/5">
                    <Presentation className="h-5 w-5 text-orange-400" />
                    <span className="text-xs font-medium text-slate-300">PPTX</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-900/50 px-3 py-3 transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/5">
                    <Table className="h-5 w-5 text-emerald-400" />
                    <span className="text-xs font-medium text-slate-300">CSV</span>
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
