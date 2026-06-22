import { MasterCRUDTemplate, type FormField } from "@/components/master/MasterCRUDTemplate"

export default function Brand() {
  const fields: FormField[] = [
    { name: "brandName", label: "Brand Name", type: "text", required: true },
    { name: "brandDescription", label: "Description", type: "richtext", required: false },
    { name: "brandLogo", label: "Logo", type: "file", required: false },
  ]

  const columns = [
    { field: "brandName", headerName: "Name", width: 150 },
    { field: "brandSlug", headerName: "Slug", width: 150 },
    { field: "brandDescription", headerName: "Description", width: 250 },
    {
      field: "brandLogo",
      headerName: "Logo",
      width: 200,
      cellRenderer: (params: any) => {
        if (!params.value) return <span className="text-muted-foreground italic">No Logo</span>;
        
        // Brand logic saves just the filename, not the full uploads path like Category does.
        // We ensure we only extract the filename and append the known upload path.
        const filename = params.value.split('/').pop();
        const imageUrl = params.value.startsWith('http') ? params.value : `${import.meta.env.VITE_API_BASE_URL}/uploads/brands/${filename}`;
        
        return (
          <div className="flex items-center h-full">
            <img src={imageUrl} alt="Brand Logo" className="h-10 w-10 object-contain rounded-md border" />
          </div>
        );
      }
    },
    { field: "metaTitle", headerName: "Meta Title", width: 180 },
    { field: "metaDescription", headerName: "Meta Description", width: 200 },
    { field: "metaKeywords", headerName: "Meta Keywords", width: 180 },
    { 
      field: "uploader.userName", 
      headerName: "Uploaded By", 
      width: 180,
      cellRenderer: (params: any) => params.data?.uploader?.userName || "System"
    },
    { 
      field: "modifier.userName", 
      headerName: "Last Modified By", 
      width: 180,
      cellRenderer: (params: any) => params.data?.modifier?.userName || "System"
    },
    { 
      field: "createdAt", 
      headerName: "Created At", 
      width: 180,
      cellRenderer: (params: any) => params.value ? new Date(params.value).toLocaleString() : ""
    },
    { 
      field: "updatedAt", 
      headerName: "Updated At", 
      width: 180,
      cellRenderer: (params: any) => params.value ? new Date(params.value).toLocaleString() : ""
    },
  ]

  const endpoints = {
    get: "/product/brands/getBrands",
    add: "/product/brands/addBrand",
    update: "/product/brands/updateBrand/{id}",
    delete: "/product/brands/deleteBrand/{id}",
    search: "/product/brands/searchBrand",
  }

  return (
    <MasterCRUDTemplate
      title="Brand"
      queryKey="brands"
      endpoints={endpoints}
      fields={fields}
      gridColumns={columns}
      idField="brandId"
    />
  )
}


