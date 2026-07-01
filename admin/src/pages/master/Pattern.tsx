import { MasterCRUDTemplate, type FormField } from "@/components/master/MasterCRUDTemplate"

export default function Pattern() {
  const fields: FormField[] = [
    { name: "patternName", label: "Pattern Name", type: "text", required: true },
    { name: "patternDescription", label: "Description", type: "richtext",
      maxLength: 255, required: false },
  ]

  const columns = [
    { field: "patternName", headerName: "Name", width: 200 },
    { field: "patternDescription", headerName: "Description", width: 400 },
  ]

  const endpoints = {
    get: "/product/patterns/getAllPatterns",
    add: "/product/patterns/addPattern",
    update: "/product/patterns/updatePattern/{id}",
    delete: "/product/patterns/deletePattern/{id}",
  }

  return (
    <MasterCRUDTemplate
      title="Pattern"
      queryKey="patterns"
      endpoints={endpoints}
      fields={fields}
      gridColumns={columns}
      idField="patternId"
    />
  )
}

