import { MasterCRUDTemplate, type FormField } from "@/components/master/MasterCRUDTemplate"

export default function Catalog() {
  const fields: FormField[] = [
    { name: "catalogName", label: "Catalog Name", type: "text", required: true },
    { name: "catalogDescription", label: "Description", type: "richtext",
      maxLength: 1000, required: true },
    { name: "catalogImage", label: "Primary Image", type: "file", required: true },
    { name: "catalogSubImages", label: "Sub Images", type: "file", required: false, multiple: true },
  ]

  const columns = [
    { field: "catalogName", headerName: "Name", width: 150 },
    { field: "catalogDescription", headerName: "Description", width: 250 },
    {
      field: "catalogImage",
      headerName: "Image",
      width: 200,
      cellRenderer: (params: any) => {
        if (!params.value) return <span className="text-muted-foreground italic">No Image</span>;
        
        const filename = params.value.split('/').pop();
        const imageUrl = params.value.startsWith('http') ? params.value : `${import.meta.env.VITE_API_BASE_URL}/uploads/catalogs/${filename}`;
        
        return (
          <div className="flex items-center h-full">
            <img src={imageUrl} alt="Catalog Image" className="h-10 w-10 object-contain rounded-md border" />
          </div>
        );
      }
    }
  ]

  const endpoints = {
    get: "/product/catalogs/getCatalogs",
    add: "/product/catalogs/addCatalog",
    update: "/product/catalogs/updateCatalog/{id}",
    delete: "/product/catalogs/deleteCatalog/{id}",
    search: "/product/catalogs/searchCatalog",
  }

  return (
    <MasterCRUDTemplate
      title="Catalog"
      queryKey="catalogs"
      endpoints={endpoints}
      fields={fields}
      gridColumns={columns}
      idField="catalogId"
    />
  )
}
