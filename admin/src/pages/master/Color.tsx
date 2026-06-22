import { MasterCRUDTemplate, type FormField } from "@/components/master/MasterCRUDTemplate"

export default function Color() {
  const fields: FormField[] = [
    { name: "colorName", label: "Color Name", type: "text", required: true },
    { name: "colorCode", label: "Color Code", type: "color", required: true },
  ]

  const columns = [
    { field: "colorName", headerName: "Name", width: 200 },
    { 
      field: "colorCode", 
      headerName: "Color Code", 
      width: 200,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-2 h-full">
          <div 
            className="h-6 w-6 rounded border shadow-sm" 
            style={{ backgroundColor: params.value || "#ffffff" }}
          />
          <span className="font-mono text-sm uppercase">{params.value}</span>
        </div>
      )
    },
  ]

  const endpoints = {
    get: "/product/colors/getColors",
    add: "/product/colors/addColor",
    update: "/product/colors/updateColor/{id}",
    delete: "/product/colors/deleteColor/{id}",
  }

  return (
    <MasterCRUDTemplate
      title="Color"
      queryKey="colors"
      endpoints={endpoints}
      fields={fields}
      gridColumns={columns}
      idField="colorId"
    />
  )
}

