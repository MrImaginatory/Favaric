import { MasterCRUDTemplate, type FormField } from "@/components/master/MasterCRUDTemplate"

export default function Occassion() {
  const fields: FormField[] = [
    { name: "occasionName", label: "Occasion Name", type: "text", required: true },
    { name: "occasionDescription", label: "Description", type: "richtext", required: false },
  ]

  const columns = [
    { field: "occasionName", headerName: "Name", width: 200 },
    { field: "occasionDescription", headerName: "Description", width: 400 },
  ]

  const endpoints = {
    get: "/product/occasions/getAllOccasions",
    add: "/product/occasions/addOccasion",
    update: "/product/occasions/updateOccasion/{id}",
    delete: "/product/occasions/deleteOccasion/{id}",
  }

  return (
    <MasterCRUDTemplate
      title="Occasion"
      queryKey="occasions"
      endpoints={endpoints}
      fields={fields}
      gridColumns={columns}
      idField="occasionId"
    />
  )
}

