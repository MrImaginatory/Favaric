import { MasterCRUDTemplate, type FormField } from "@/components/master/MasterCRUDTemplate"

export default function Fabric() {
  const fields: FormField[] = [
    { name: "fabricName", label: "Fabric Name", type: "text", required: true },
    { name: "fabricDescription", label: "Description", type: "richtext",
      maxLength: 255, required: false },
  ]

  const columns = [
    { field: "fabricName", headerName: "Name", width: 200 },
    { 
      field: "fabricDescription", 
      headerName: "Description", 
      width: 400,
      cellRenderer: (params: any) => {
        if (!params.value) return "";
        // Strip HTML tags and &nbsp; for clean grid display
        const plainText = params.value.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').trim();
        return <span className="truncate block" title={plainText}>{plainText}</span>;
      }
    },
  ]

  const endpoints = {
    get: "/product/fabrics/getAllFabrics",
    add: "/product/fabrics/addFabric",
    update: "/product/fabrics/updateFabric/{id}",
    delete: "/product/fabrics/deleteFabric/{id}",
  }

  return (
    <MasterCRUDTemplate
      title="Fabric"
      queryKey="fabrics"
      endpoints={endpoints}
      fields={fields}
      gridColumns={columns}
      idField="fabricId"
    />
  )
}

