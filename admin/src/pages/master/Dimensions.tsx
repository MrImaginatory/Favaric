import { MasterCRUDTemplate, type FormField } from "@/components/master/MasterCRUDTemplate"

export default function Dimensions() {
  const fields: FormField[] = [
    { name: "dimensionName", label: "Dimension Name", type: "text", required: true },
    { name: "dimensionDescription", label: "Description", type: "richtext", required: false },
    { name: "dimensionLength", label: "Length (cm)", type: "number", required: true },
    { name: "dimensionBreadth", label: "Breadth (cm)", type: "number", required: true },
    { name: "dimensionHeight", label: "Height (cm)", type: "number", required: true },
  ]

  const columns = [
    { field: "dimensionName", headerName: "Name", width: 200 },
    { field: "dimensionDescription", headerName: "Description", width: 400 },
    { field: "dimensionLength", headerName: "Length (cm)", width: 200 },
    { field: "dimensionBreadth", headerName: "Breadth (cm)", width: 200 },
    { field: "dimensionHeight", headerName: "Height (cm)", width: 200 },
  ]

  const endpoints = {
    get: "/product/dimensions/getAllDimensions",
    add: "/product/dimensions/addDimension",
    update: "/product/dimensions/updateDimension/{id}",
    delete: "/product/dimensions/deleteDimension/{id}",
  }

  return (
    <MasterCRUDTemplate
      title="Dimensions"
      queryKey="dimensions"
      endpoints={endpoints}
      fields={fields}
      gridColumns={columns}
      idField="dimensionId"
    />
  )
}

