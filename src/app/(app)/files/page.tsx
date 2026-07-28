"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { File, FileImage, FileSpreadsheet, FileText, Search, Upload } from "lucide-react";
import { listFiles } from "@/lib/mock-api/files";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TYPE_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  pdf: FileText,
  image: FileImage,
  doc: FileText,
  sheet: FileSpreadsheet,
  other: File,
};

const TYPE_COLOR: Record<string, string> = {
  pdf: "text-destructive bg-destructive/10",
  image: "text-primary bg-primary/10",
  doc: "text-chart-2 bg-chart-2/10",
  sheet: "text-success bg-success/10",
  other: "text-muted-foreground bg-muted",
};

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FilesPage() {
  const companyId = useWorkspaceStore((s) => s.companyId);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["files", companyId, search, type],
    queryFn: () => listFiles(companyId, { search, filters: { type: type === "all" ? undefined : type } }),
  });

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Files"
        description="Documents, spreadsheets, and assets shared across your company."
        actions={
          <Button size="sm" className="gap-1.5">
            <Upload className="size-4" />
            Upload
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <InputGroup className="max-w-xs">
          <InputGroupAddon>
            <Search className="size-4" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
        <Select value={type} onValueChange={(v) => setType(String(v))}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="doc">Document</SelectItem>
            <SelectItem value="sheet">Spreadsheet</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)
          : data?.map((file) => {
              const Icon = TYPE_ICON[file.type] ?? File;
              return (
                <Card key={file.id} className="transition-shadow hover:shadow-md">
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-start justify-between">
                      <div className={`flex size-9 items-center justify-center rounded-lg ${TYPE_COLOR[file.type]}`}>
                        <Icon className="size-4.5" />
                      </div>
                    </div>
                    <div>
                      <p className="truncate text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                    </div>
                    <div className="flex items-center justify-between border-t pt-2.5">
                      <div className="flex items-center gap-1.5">
                        <Avatar size="sm">
                          <AvatarImage src={file.ownerAvatar} alt={file.ownerName} />
                          <AvatarFallback>{file.ownerName.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{file.ownerName.split(" ")[0]}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(file.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>
    </div>
  );
}
