import { MasterCRUDTemplate, type FormField } from "@/components/master/MasterCRUDTemplate"

export default function Size() {
  const fields: FormField[] = [
    { name: "sizeName", label: "Size Name", type: "text", required: true },
    { name: "sizeValue", label: "Size Value (Code)", type: "text", required: true },
  ]

  const columns = [
    { field: "sizeName", headerName: "Name", width: 200 },
    { field: "sizeValue", headerName: "Value", width: 200 },
  ]

  const endpoints = {
    get: "/product/sizes/getAllSizes",
    add: "/product/sizes/addSize",
    update: "/product/sizes/updateSize/{id}",
    delete: "/product/sizes/deleteSize/{id}",
  }

  return (
    <MasterCRUDTemplate
      title="Size"
      queryKey="sizes"
      endpoints={endpoints}
      fields={fields}
      gridColumns={columns}
      idField="sizeId"
    />
  )
}

