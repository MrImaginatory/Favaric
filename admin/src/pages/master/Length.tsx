import { MasterCRUDTemplate, type FormField } from "@/components/master/MasterCRUDTemplate"

export default function Length() {
  const fields: FormField[] = [
    { name: "lengthName", label: "Length Name", type: "text", required: true },
    { name: "lengthValue", label: "Value (cm)", type: "number", required: true },
  ]

  const columns = [
    { field: "lengthName", headerName: "Name", width: 200 },
    { field: "lengthValue", headerName: "Value (cm)", width: 200 },
  ]

  const endpoints = {
    get: "/product/lengths/getAllLengths",
    add: "/product/lengths/addLength",
    update: "/product/lengths/updateLength/{id}",
    delete: "/product/lengths/deleteLength/{id}",
  }

  return (
    <MasterCRUDTemplate
      title="Length"
      queryKey="lengths"
      endpoints={endpoints}
      fields={fields}
      gridColumns={columns}
      idField="lengthId"
    />
  )
}

