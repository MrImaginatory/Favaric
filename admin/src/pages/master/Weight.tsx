import { MasterCRUDTemplate, type FormField } from "@/components/master/MasterCRUDTemplate"

export default function Weight() {
  const fields: FormField[] = [
    { name: "weightName", label: "Weight Name", type: "text", required: true },
    { name: "weightValue", label: "Weight Value (Gms)", type: "number", required: true },
  ]

  const columns = [
    { field: "weightName", headerName: "Name", width: 200 },
    { field: "weightValue", headerName: "Value (Gms)", width: 200 },
  ]

  const endpoints = {
    get: "/product/weights/getAllWeights",
    add: "/product/weights/addWeight",
    update: "/product/weights/updateWeight/{id}",
    delete: "/product/weights/deleteWeight/{id}",
  }

  return (
    <MasterCRUDTemplate
      title="Weight"
      queryKey="weights"
      endpoints={endpoints}
      fields={fields}
      gridColumns={columns}
      idField="weightId"
    />
  )
}

