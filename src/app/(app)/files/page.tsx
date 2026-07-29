"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { File, FileImage, FileSpreadsheet, FileText, Search, Trash2, Upload } from "lucide-react";
import { createFile, deleteFile, listFiles } from "@/lib/mock-api/files";
import { getCurrentUser } from "@/lib/mock-api/auth";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { EntityAvatar } from "@/components/shared/entity-avatar";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["files", companyId, search, type],
    queryFn: () => listFiles(companyId, { search, filters: { type: type === "all" ? undefined : type } }),
  });

  function invalidateFiles() {
    queryClient.invalidateQueries({ queryKey: ["files", companyId] });
  }

  const uploadMutation = useMutation({
    mutationFn: async (file: globalThis.File) => {
      const user = await getCurrentUser(companyId);
      return createFile(companyId, user.id, { name: file.name, size: file.size });
    },
    onSuccess: (file) => {
      invalidateFiles();
      toast.success(`${file.name} uploaded`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFile(id),
    onSuccess: () => {
      invalidateFiles();
      toast.success("File deleted");
    },
  });

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadMutation.mutate(file);
          e.target.value = "";
        }}
      />
      <PageHeader
        title="Files"
        description="Documents, spreadsheets, and assets shared across your company."
        actions={
          <Button
            size="sm"
            className="gap-1.5"
            disabled={uploadMutation.isPending}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="size-4" />
            {uploadMutation.isPending ? "Uploading..." : "Upload"}
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

      {isLoading || (data && data.length > 0) ? (
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
                        <AlertDialog>
                          <AlertDialogTrigger
                            render={<Button variant="ghost" size="icon-sm" className="text-muted-foreground" />}
                          >
                            <Trash2 className="size-3.5" />
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete {file.name}?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently remove the file from your workspace.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-white hover:bg-destructive/90"
                                onClick={() => deleteMutation.mutate(file.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                      <div>
                        <p className="truncate text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                      </div>
                      <div className="flex items-center justify-between border-t pt-2.5">
                        <div className="flex items-center gap-1.5">
                          <EntityAvatar name={file.ownerName} src={file.ownerAvatar} size="sm" />
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
      ) : (
        <Card>
          <EmptyState
            icon={File}
            title="No files match your search"
            description="Try a different keyword or file type, or upload something new."
          />
        </Card>
      )}
    </div>
  );
}
