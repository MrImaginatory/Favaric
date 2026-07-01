import { useState, useMemo, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useTheme } from "@/components/theme-provider"
import { RichTextEditor } from "@/components/ui/rich-text-editor"

import { apiClient } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { GpGrid } from "@gp-grid/react"
import "@gp-grid/react/dist/styles.css"

export interface FormField {
  name: string
  label: string
  type?: "text" | "number" | "textarea" | "boolean" | "file" | "richtext" | "color" | "status_checkbox" | "select"
  required?: boolean
  multiple?: boolean
  maxLength?: number
  options?: { label: string; value: string | number }[]
}

export type MasterCRUDProps = {
  title: string
  queryKey: string
  endpoints: {
    get: string
    add: string
    update: string
    delete: string
    search?: string
  }
  fields: FormField[]
  gridColumns: any[]
  idField?: string
}

export function MasterCRUDTemplate({
  title,
  queryKey,
  endpoints,
  fields,
  gridColumns,
  idField = "id",
}: MasterCRUDProps) {
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const { theme } = useTheme()
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  // Dynamically generate Zod schema based on fields
  const formSchema = useMemo(() => {
    const schemaObj: any = {}
    fields.forEach((field) => {
      let validator: any;
      if (field.type === "number") {
        validator = z.coerce.number();
      } else if (field.type === "boolean") {
        validator = z.boolean().default(false);
      } else if (field.type === "status_checkbox") {
        validator = z.enum(["active", "inactive"]).default("inactive");
      } else if (field.type === "file") {
        validator = z.any(); // Handled as FileList
      } else {
        validator = z.string();
      }

      if (field.required !== false) {
        if (field.type !== "number" && field.type !== "boolean" && field.type !== "file") {
          validator = validator.min(1, { message: `${field.label} is required` })
        }
      } else {
        validator = validator.optional()
      }
      schemaObj[field.name] = validator
    })
    return z.object(schemaObj)
  }, [fields])

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  })

  // Search State & Debounce
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 500)
    return () => clearTimeout(handler)
  }, [searchQuery])

  // Fetch Data
  const { data, isLoading } = useQuery({
    queryKey: [queryKey, debouncedSearch],
    queryFn: async () => {
      let url = endpoints.get
      if (debouncedSearch) {
        url = endpoints.search ? `${endpoints.search}?q=${debouncedSearch}` : `${endpoints.get}?q=${debouncedSearch}`
      }
      const res = await apiClient.get(url)
      const payload = res.data?.data || res.data;
      return payload?.records || payload || []
    },
  })

  // Process data for the grid (Sequential Numbering instead of UUID)
  const gridData = useMemo(() => {
    if (!Array.isArray(data)) return []
    return data
      .filter((item: any) => !item.deletedAt)
      .map((item, index) => ({
        ...item,
        seqId: index + 1,
      }))
  }, [data])

  // Mutations
  const addMutation = useMutation({
    mutationFn: (newData: any) => apiClient.post(endpoints.add, newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      toast.success(`${title} added successfully`)
      handleCloseDialog()
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || `Failed to add ${title}`)
    },
  })

  const updateMutation = useMutation({
    mutationFn: (vars: { id: string; data: any }) => {
      const url = endpoints.update.replace("{id}", vars.id)
      return apiClient.patch(url, vars.data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      toast.success(`${title} updated successfully`)
      handleCloseDialog()
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || `Failed to update ${title}`)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      const url = endpoints.delete.replace("{id}", id)
      return apiClient.delete(url)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      toast.success(`${title} deleted successfully`)
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || `Failed to delete ${title}`)
    },
  })

  // Action Handlers
  const handleOpenDialog = (item: any = null) => {
    setEditingItem(item)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setTimeout(() => {
      setEditingItem(null)
      reset({})
    }, 200) // wait for dialog animation
  }

  // Ensure form resets properly when dialog opens or editing item changes
  // Ensure form resets properly when dialog opens or editing item changes
  useEffect(() => {
    if (isDialogOpen) {
      if (editingItem) {
        reset(editingItem)
      } else {
        reset({})
      }
    }
  }, [isDialogOpen, editingItem, reset])

  const onSubmit = (formData: any) => {
    let payload = formData;
    const hasFiles = fields.some(f => f.type === "file");

    if (hasFiles) {
      payload = new FormData();
      for (const key in formData) {
        const val = formData[key];
        if (val === undefined) continue;

        // Check if field is meant to be a file
        const fieldDef = fields.find(f => f.name === key);
        if (fieldDef?.type === "file") {
          if (val === null) {
            // Signal to backend that the file should be removed
            payload.append(`remove_${key}`, 'true');
            continue;
          }
          if (val instanceof FileList || (val && typeof val === 'object' && 'length' in val)) {
            if (val.length > 0) {
              for (let i = 0; i < val.length; i++) {
                payload.append(key, val[i]);
              }
            }
          } else if (val instanceof File) {
            payload.append(key, val);
          }
        } else {
          // For non-file fields, append as string
          if (val !== null) {
            payload.append(key, typeof val === 'object' ? JSON.stringify(val) : String(val));
          }
        }
      }
    }

    if (editingItem) {
      updateMutation.mutate({ id: editingItem[idField], data: payload })
    } else {
      addMutation.mutate(payload)
    }
  }

  const handleDelete = (id: string) => {
    setItemToDelete(id)
  }

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete)
      setItemToDelete(null)
    }
  }

  // Grid Columns Definition
  const baseColumns = [
    { field: "seqId", headerName: "#", width: 70, cellDataType: "number" },
    ...gridColumns.map((col: any) => ({ ...col, cellDataType: col.cellDataType || "text" })),
    { 
      field: "createdAt", 
      headerName: "Created At", 
      width: 170,
      cellRenderer: (params: any) => params.value ? new Date(params.value).toLocaleString() : "N/A"
    },
    { 
      field: "updatedAt", 
      headerName: "Updated At", 
      width: 170,
      cellRenderer: (params: any) => params.value ? new Date(params.value).toLocaleString() : "N/A"
    },
    { 
      field: "uploader.userName", 
      headerName: "Created By", 
      width: 150,
      cellRenderer: (params: any) => params.rowData?.uploader?.userName || "N/A"
    },
    { 
      field: "modifier.userName", 
      headerName: "Updated By", 
      width: 150,
      cellRenderer: (params: any) => params.rowData?.modifier?.userName || "N/A"
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      cellDataType: "object",
      cellRenderer: (params: any) => (
        <div className="flex gap-2 p-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-500 hover:text-blue-700"
            onClick={() => handleOpenDialog(params.rowData)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-red-700"
            onClick={() => handleDelete(params.rowData[idField])}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6 p-1">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <div className="flex items-center gap-4">
          <Input 
            placeholder={`Search ${title}...`} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add {title}
          </Button>
        </div>
      </div>

      <div className="h-[600px] w-full rounded-md border shadow-sm flex flex-col overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col space-y-3 p-6 h-full">
            <Skeleton className="h-12 w-full rounded-xl" />
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-[80%]" />
            </div>
          </div>
        ) : gridData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4 p-8 text-center text-muted-foreground bg-accent/20">
            <img src="/RemoteCabin.svg" alt="No data found" className="h-48 w-auto opacity-90" />
            <h3 className="text-xl font-semibold text-foreground">No data Found</h3>
            <p className="text-sm">We couldn't find any data. Get started by adding a new {title.toLowerCase()}.</p>
          </div>
        ) : (
          <div className="h-full w-full">
            <GpGrid
              rowData={gridData}
              columns={baseColumns}
              rowHeight={55}
              darkMode={isDark}
            />
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto overflow-x-hidden" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? `Edit ${title}` : `Add New ${title}`}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
            {fields.map((field) => (
              <div key={field.name} className={`flex ${field.type === "boolean" || field.type === "status_checkbox" ? "flex-row-reverse items-center justify-end gap-3" : "flex-col gap-1.5"}`}>
                <Label htmlFor={field.name} className={field.type === "boolean" || field.type === "status_checkbox" ? "flex-1" : ""}>
                  {field.label} {field.required !== false && field.type !== "boolean" && field.type !== "status_checkbox" && <span className="text-destructive">*</span>}
                </Label>
                {field.type === "boolean" ? (
                  <input
                    id={field.name}
                    type="checkbox"
                    {...register(field.name)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                ) : field.type === "status_checkbox" ? (
                  <Controller
                    name={field.name}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={field.name}
                          checked={value === "active"}
                          onChange={(e) => onChange(e.target.checked ? "active" : "inactive")}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm font-medium">
                          {value === "active" ? "Active" : "Inactive"}
                        </span>
                      </div>
                    )}
                  />
                ) : field.type === "richtext" ? (
                  <Controller
                    name={field.name}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <RichTextEditor
                        value={(value as string) || ""}
                        onChange={onChange}
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                        maxLength={field.maxLength}
                      />
                    )}
                  />
                ) : field.type === "file" ? (
                  <Controller
                    name={field.name}
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      let previewUrl = null;
                      if (typeof value === 'string' && value) {
                        if (value.startsWith('http')) {
                          previewUrl = value;
                        } else {
                          const hasPath = value.includes('/');
                          const pathValue = hasPath ? value : `uploads/${queryKey}/${value}`;
                          const leadingSlash = pathValue.startsWith('/') ? '' : '/';
                          previewUrl = `${import.meta.env.VITE_API_BASE_URL}${leadingSlash}${pathValue}`;
                        }
                      } else if (value instanceof FileList && value.length > 0) {
                        previewUrl = URL.createObjectURL(value[0]);
                      } else if (value instanceof File) {
                        previewUrl = URL.createObjectURL(value);
                      }

                      return (
                        <div className="flex flex-col gap-3">
                          {previewUrl && (
                            <div className="relative w-32 h-32 border rounded-md overflow-hidden bg-muted/50 flex items-center justify-center group">
                              <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                              <button
                                type="button"
                                onClick={() => onChange(null)}
                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-destructive/90"
                                title="Remove Image"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                              </button>
                            </div>
                          )}
                          <Input
                            key={previewUrl ? "has-file" : "no-file"}
                            id={field.name}
                            type="file"
                            multiple={field.multiple}
                            onChange={(e) => onChange(e.target.files)}
                            className={
                              "cursor-pointer file:cursor-pointer file:border file:border-border file:rounded-md file:bg-muted/50 file:px-3 file:py-1 file:mr-4 file:text-xs file:font-medium file:text-foreground hover:file:bg-muted text-muted-foreground h-9 pt-1.5 px-1.5 " +
                              (errors[field.name] ? "border-destructive" : "")
                            }
                          />
                        </div>
                      )
                    }}
                  />

                ) : field.type === "color" ? (
                  <Controller
                    name={field.name}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <div className="flex gap-2 items-center">
                        <Input
                          id={field.name}
                          type="text"
                          value={(value as string) || ""}
                          onChange={onChange}
                          className={errors[field.name] ? "border-destructive flex-1" : "flex-1"}
                          placeholder="#000000"
                        />
                        <input
                          type="color"
                          value={(value as string) || "#000000"}
                          onChange={onChange}
                          className="h-10 w-12 p-1 rounded-md border bg-background cursor-pointer"
                        />
                      </div>
                    )}
                  />
                ) : field.type === "select" ? (
                  <Controller
                    name={field.name}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Select onValueChange={onChange} value={(value as string) || ""}>
                        <SelectTrigger className={`w-full ${errors[field.name] ? "border-destructive" : ""}`}>
                          <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent position="popper" sideOffset={4}>
                          {field.options?.map((option) => (
                            <SelectItem key={option.value} value={String(option.value)}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                ) : (
                  <Input
                    id={field.name}
                    type={field.type || "text"}
                    {...register(field.name)}
                    className={errors[field.name] ? "border-destructive" : ""}
                  />
                )}
                {errors[field.name] && (
                  <span className="text-xs text-destructive">
                    {errors[field.name]?.message as string}
                  </span>
                )}
              </div>
            ))}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={addMutation.isPending || updateMutation.isPending}>
                {editingItem ? "Save Changes" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {title.toLowerCase()}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setItemToDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
